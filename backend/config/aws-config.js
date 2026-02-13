require("dotenv").config(); 
const { S3Client } = require("@aws-sdk/client-s3");

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;

if (!AWS_REGION) throw new Error("AWS_REGION is not defined in environment variables.");
if (!AWS_ACCESS_KEY_ID) throw new Error("AWS_ACCESS_KEY_ID is not defined in environment variables.");
if (!AWS_SECRET_ACCESS_KEY) throw new Error("AWS_SECRET_ACCESS_KEY is not defined in environment variables.");
if (!S3_BUCKET) throw new Error("S3_BUCKET is not defined in environment variables.");


const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = { s3, S3_BUCKET };
