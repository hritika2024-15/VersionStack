const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");
const { ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".S3git");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    });
    const data = await s3.send(listCommand);
    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;
      const commitDir = path.join(commitsPath, path.dirname(key).split("/").pop());
      await fsp.mkdir(commitDir, { recursive: true });

      const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
      const fileContent = await s3.send(getCommand);

      const filePath = path.join(repoPath, key);
      await pipeline(fileContent.Body, fs.createWriteStream(filePath));

      console.log(`Pulled commit file: ${key}`);
    }

    console.log("All commits pulled from S3.");
  } catch (err) {
    console.error("Unable to pull commits:", err);
  }
}

module.exports = { pullRepo };
