import AWS from "aws-sdk";

let s3: AWS.S3;

const initilizeAws = () => {
	if (s3 instanceof AWS.S3) return s3;

	s3 = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		signatureVersion: "v4",
		region: "ap-south-1",
	});

	return s3;
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

export const deleteImageFromS3 = (prevImageKey: string) => {
	initilizeAws();

	s3.deleteObject(
		{ Bucket: "puneet-course-app", Key: prevImageKey },
		function (err, data) {
			if (err) {
				console.log(err);
				return;
			}
		}
	);
};
