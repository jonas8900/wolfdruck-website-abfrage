import dbConnect from "@/db/connect";
import Request from "@/db/models/Request";
import formidable from "formidable";
import fs from "fs";
import { S3 } from "aws-sdk";

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, maxFileSize: 10 * 1024 * 1024 }); 
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

async function uploadToS3(file) {
  const fileContent = fs.readFileSync(file.filepath);
  const fileName = `${Date.now()}_${file.originalFilename}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype,
  };

  await s3.upload(params).promise();
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: `Methode ${req.method} nicht erlaubt` });
    }

    await dbConnect();

    const { fields, files } = await parseForm(req);

    const parsedData = JSON.parse(fields.data);
    const uploadedImageUrls = [];

    if (files.images) {
      const imagesArray = Array.isArray(files.images) ? files.images : [files.images];
      for (const file of imagesArray) {
        const url = await uploadToS3(file);
        uploadedImageUrls.push(url);
      }
    }

    parsedData.images = uploadedImageUrls;

    const newRequest = new Request(parsedData);
    await newRequest.save();

    res.status(201).json({ message: "Anfrage erfolgreich erstellt", request: newRequest });
  } catch (err) {
    console.error("Fehler beim Speichern der Anfrage:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
}
