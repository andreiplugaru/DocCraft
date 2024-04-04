'use strict';

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');

const HOSTNAME = os.hostname();

const { Storage } = require('@google-cloud/storage');
const { PrismaClient } =  require('@prisma/client')
const verifyToken = require('./middleware/authMiddleware')
const prisma = new PrismaClient()

const storage = new Storage();

async function uploadFromMemory(bucketName, destFileName, contents) {
  await storage.bucket(bucketName).file(destFileName).save(contents);

  console.log(
    `${destFileName} with contents ${contents} uploaded to ${bucketName}.`
  );
}

const upload = multer({});

const app = express();

app.use(express.static('public'));

app.use(cors({
  origin: ['http://localhost:3000', 'https://frontend-dot-cloud-419006.lm.r.appspot.com'],
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.post('/upload', upload.single('file'),  (req, res) => {
  verifyToken(req, res, async (req, res) => {
  const bucketName = 'documents_database';
  const destFileName = req.file.originalname;
  const contents = req.file.buffer;
  await prisma.files.create({
    data:{
      file_name:req.file.originalname,
      file_size: req.file.size
    }
  });
  uploadFromMemory(bucketName, destFileName, contents).catch(console.error);
  console.log(req.file);
  res.status(200).json("ok");
})});

app.post('/login', (req, res) => {
  console.log(req.body);
});

app.get("/files", async (req, res) => {
  const allFiles = await prisma.files.findMany()
  res.status(200).json(allFiles);
});

const PORT = parseInt(process.env.PORT) || 8083;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}, ${HOSTNAME}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
