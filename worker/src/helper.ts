import { createClient } from "redis";
import aws from "aws-sdk";

let s3: aws.S3;

export const initRedis = async () => {
	let client = createClient({
		username: "default",
		password: process.env.REDIS_PASSWORD,
		socket: {
			host: process.env.REDIS_HOST,
			port: 15302,
		},
	});

	client.on("error", (err) => console.log(err));

	await client.connect();

	return client;
};

export const initAws = () => {
	if (s3 instanceof aws.S3) return s3;

	s3 = new aws.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		signatureVersion: "v4",
		region: "ap-south-1",
	});

	return s3;
};
