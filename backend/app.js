'use strict';

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const os = require('os');

const HOSTNAME = os.hostname();

const { Storage } = require('@google-cloud/storage');

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

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.post('/upload', upload.single('file'), (req, res) => {
  const bucketName = 'documents_database';
  const destFileName = req.file.originalname;
  const contents = req.file.buffer;
  uploadFromMemory(bucketName, destFileName, contents).catch(console.error);
  console.log(req.file);
  res.status(200).json("ok");
});

const PORT = parseInt(process.env.PORT) || 8083;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}, ${HOSTNAME}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
