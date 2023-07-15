const express = require("express");
const router = express.Router();
const multer = require("multer");
const dotenv = require("dotenv");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

const upload = multer();

router.route("/upload").post(upload.single("file"), async (req, res) => {
  console.log("Called");
  console.log(req.file);

  const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      accessKeyId: process.env.S3_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: "image/jpeg",
  };

  try {
    const upload = new PutObjectCommand(params);
    const promise = await s3.send(upload);
    const url = await getSignedUrl(s3, upload);
    console.log("Uploaded!");
    const location = `https://${params.Bucket}.s3.amazonaws.com/${encodeURIComponent(params.Key)}`;
    console.log(location);
    res.send(JSON.stringify({ url: url }));
  } catch (error) {
    console.log(error);
    res.send(JSON.stringify({ message: "Error" }));
  }
});

module.exports = router;
