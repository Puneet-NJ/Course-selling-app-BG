import axios from "axios";
import { initAws, initRedis } from "./helper";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

require("dotenv").config();

const main = async () => {
	const redisClient = await initRedis();
	const queueName = "course-app";

	while (true) {
		const poppedElement = await redisClient.brPop(queueName, 0);

		if (!poppedElement?.element) return;

		const obj = JSON.parse(poppedElement.element);
		const objectKey = obj.objectKey;

		const [courseId, folderId, contentId] = objectKey.split("/");

		const videoPath = path.join(__dirname, "..", "videos", contentId);
		const videoContentPath = path.join(videoPath, "video.mp4");

		// create a dir && get the video from temp s3
		const res = await getVideo(
			courseId,
			folderId,
			contentId,
			videoPath,
			videoContentPath
		);

		// transcode the video
		await transcodeVideo(videoPath, videoContentPath);

		// put the video in s3
		await getQualityFolders(videoPath, objectKey);

		// update the backend
		await updateBackend(contentId);

		// Delete the local objects
		await deleteObjects(videoPath)
			.then((res) => console.log(res))
			.catch((err) => console.log(err));

		await deleteFromTempS3(courseId);
	}
};

const getVideo = async (
	courseId: string,
	folderId: string,
	contentId: string,
	videoPath: string,
	videoContentPath: string
) => {
	try {
		fs.mkdirSync(videoPath);
		fs.writeFileSync(videoContentPath, "");

		const response = await axios({
			method: "GET",
			url: `${process.env.S3}/${courseId}/${folderId}/${contentId}`,
			responseType: "stream",
		});

		const writer = fs.createWriteStream(videoContentPath);

		return await new Promise((resolve, reject) => {
			response.data.pipe(writer);

			writer.on("finish", resolve);
			writer.on("error", reject);
		});
	} catch (err) {
		console.log(err);
	}
};

const transcodeVideo = async (videoPath: string, videoContentPath: string) => {
	try {
		const videosFolderPath = path.join(__dirname, "..", "videos");
		if (!fs.existsSync(videosFolderPath)) {
			fs.mkdirSync(videosFolderPath);
		}

		const quality360 = path.join(videoPath, "360p");
		const quality480 = path.join(videoPath, "480p");
		const quality720 = path.join(videoPath, "720p");
		const masterFile = path.join(videoPath, "master.m3u8");

		fs.mkdirSync(quality360);
		fs.mkdirSync(quality480);
		fs.mkdirSync(quality720);
		fs.writeFileSync(masterFile, "");

		const command = `
ffmpeg -i ${videoContentPath} \
  -c:v h264 -c:a aac -b:a 128k \
  -s 640x360 -b:v 800k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${quality360}/360p_%03d.ts" ${quality360}/index.m3u8 \
  -s 854x480 -b:v 1400k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${quality480}/480p_%03d.ts" ${quality480}/index.m3u8 \
  -s 1280x720 -b:v 2800k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${quality720}/720p_%03d.ts" ${quality720}/index.m3u8 \
  -master_pl_name "${masterFile}"`;

		const process = exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error("Error occurred:", error);
				return;
			}
			if (stderr) {
				console.error("Standard Error:", stderr);
				return;
			}
		});

		return await new Promise((resolve, reject) => {
			process.on("exit", (code, signal) => {
				if (code === 0) {
					// Generate master playlist with correct paths
					const masterContent = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
480p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p/index.m3u8`;

					fs.writeFileSync(masterFile, masterContent);
					resolve("");
				} else {
					reject();
				}
			});
		});
	} catch (err) {
		console.log(err);
	}
};

const getQualityFolders = (videoPath: string, objectKey: string) => {
	try {
		const folders = fs.readdirSync(videoPath);

		const promises: any[] = [];

		folders.forEach((folder) => {
			if (folder === "video.mp4") return;
			if (folder === "master.m3u8") {
				promises.push(
					putS3(path.join(videoPath, "master.m3u8"), objectKey, "master.m3u8")
				);
				return;
			}

			const chunks = fs.readdirSync(path.join(videoPath, folder));

			chunks.forEach((chunk) => {
				const eachChunk = path.join(videoPath, folder, chunk);

				promises.push(putS3(eachChunk, objectKey, chunk, folder));
			});
		});

		return Promise.all(promises)
			.then((res) => res)
			.catch((rej) => rej);
	} catch (err) {
		console.log(err);
	}
};

const putS3 = async (
	eachChunk: string,
	objectKey: string,
	chunk: string,
	folder?: string
) => {
	try {
		const s3 = initAws();
		const content = fs.readFileSync(eachChunk);

		let key: string;
		if (!folder) key = path.join(objectKey, chunk);
		else key = path.join(objectKey, folder, chunk);

		// Determine content type based on file extension
		let contentType = "application/octet-stream";
		if (chunk.endsWith(".m3u8")) {
			contentType = "application/vnd.apple.mpegurl";
		} else if (chunk.endsWith(".ts")) {
			contentType = "video/MP2T";
		}

		return await new Promise((resolve, reject) => {
			s3.upload(
				{
					Bucket: process.env.AWS_S3_BUCKET as string,
					Key: key,
					Body: content,
					ContentType: contentType,
					CacheControl: "max-age=31536000", // Optional: for better caching
				},
				async (err, data) => {
					if (err) {
						console.log(err);
						reject();
					} else {
						resolve("");
					}
				}
			);
		});
	} catch (err) {
		console.log(err);
	}
};

const updateBackend = async (contentId: string) => {
	try {
		const response = await axios({
			method: "PUT",
			url: `${process.env.BACKEND_URL}/course/contentUploaded/${contentId}`,
		});
	} catch (err) {
		console.log(err);
	}
};

const deleteObjects = async (videoPath: string) => {
	await new Promise((resolve, reject) => {
		try {
			fs.rmSync(videoPath, { recursive: true });

			resolve("");
		} catch (err) {
			console.log(err);

			reject();
		}
	});
};

const deleteFromTempS3 = async (courseId: string) => {
	try {
		const s3 = initAws();

		// List all objects with the folder prefix
		const listObjects = await s3
			.listObjectsV2({
				Bucket: process.env.AWS_S3_BUCKET_TEMP as string,
				Prefix: courseId + "/", // Include the folder prefix
			})
			.promise();

		// Check if there are objects to delete
		if (listObjects.Contents && listObjects.Contents.length > 0) {
			// Extract the keys of the objects
			const deleteParams = {
				Bucket: process.env.AWS_S3_BUCKET_TEMP as string,
				Delete: {
					Objects: listObjects.Contents.map((object) => ({
						Key: object.Key!,
					})),
				},
			};

			// Delete all objects
			await s3.deleteObjects(deleteParams).promise();
			console.log(`Deleted all objects under ${courseId}`);
		} else {
			console.log(`No objects found under ${courseId}`);
		}
	} catch (err) {
		console.error("Error while deleting folder and its contents:", err);
	}
};

main();
