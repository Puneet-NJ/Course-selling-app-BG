import AWS from "aws-sdk";
import { getSignedUrl } from "aws-cloudfront-sign";

let s3: AWS.S3;

const privatekey = process.env.CF_PRIVATE_KEY as string;

const cfSigningParams = {
	keypairId: process.env.CF_PUBLIC_KEY as string,
	privateKeyString: privatekey.replace(/\\n/g, "\n"),
};

const initilizeAws = () => {
	if (s3 instanceof AWS.S3) return s3;

	s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		signatureVersion: "v4",
		region: "ap-south-1",
	});
};

export const getPresignedUrl = (objectKey: string, contentType: string) => {
	initilizeAws();

	return s3.getSignedUrlPromise("putObject", {
		Bucket: "puneet-course-app",
		Key: objectKey,
		Expires: 240,
		ContentType: contentType,
	});
};

export const getPresignedUrlTemp = (objectKey: string, contentType: string) => {
	initilizeAws();

	return s3.getSignedUrlPromise("putObject", {
		Bucket: "puneet-course-app-temp",
		Key: objectKey,
		Expires: 240,
		ContentType: contentType,
	});
};

export const deleteS3 = async (toDeleteKey: string) => {
	try {
		initilizeAws();

		let isTruncated = true;
		let continuationToken = null;
		const prefix = `${toDeleteKey}/`; // Folder prefix for the courseId

		// Loop to handle pagination when there are many objects
		while (isTruncated) {
			const listParams = {
				Bucket: "puneet-course-app",
				Prefix: prefix, // e.g. 'courseId/' to delete all files and subfolders
				ContinuationToken: continuationToken, // For paginated results
			};

			const listedObjects: any = await s3.listObjectsV2(listParams).promise();

			// If objects are found, delete them
			if (listedObjects.Contents.length > 0) {
				const deleteParams = {
					Bucket: "puneet-course-app",
					Delete: {
						Objects: listedObjects.Contents.map((object: any) => ({
							Key: object.Key,
						})),
					},
				};

				// Delete the objects
				await s3.deleteObjects(deleteParams).promise();
				console.log(`Deleted objects in ${prefix}`);
			}

			// Check if the result is truncated (there are more objects to list)
			isTruncated = listedObjects.IsTruncated;
			continuationToken = listedObjects.NextContinuationToken;
		}

		console.log(`Successfully deleted all content in ${toDeleteKey}`);
	} catch (error) {
		console.error("Error deleting course content:", error);
	}
};

export const presignedUrlVideo = (objectKey: string) => {
	initilizeAws();

	const signedUrl = getSignedUrl(
		process.env.CDN_LINK + `/${objectKey}`,
		cfSigningParams
	);

	return signedUrl;
};
