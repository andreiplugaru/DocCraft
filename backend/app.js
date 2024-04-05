'use strict';

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');

const HOSTNAME = os.hostname();

const { Storage } = require('@google-cloud/storage');
const bucketName = "documents_database"
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

async function fetchFile(fileName) {
  const options = {
    destination: destFileName,
  };

  const bucket = storage.bucket(bucketName)
  await bucket.file(fileName).download(options);

  console.log(
    `gs://${bucketName}/${fileName} contents sent to frontend.`
  );
}


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

// app.get("/files", async (req, res) => {
//   const allFiles = await prisma.files.findMany()
//   res.status(200).json(allFiles);
// });

app.get('/files', async (req, res) => {
  try {
    const bucketName = 'documents_database';
    const [files] = await storage.bucket(bucketName).getFiles();

    const fileList = files.map(file => file.name);
    res.status(200).json(fileList);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Server error');
  }
});

app.get('/contents/:filename', async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).send('Filename is required.');
  }

  const file = storage.bucket(bucketName).file(filename);

    try {
      const exists = await file.exists();
      if (exists[0]) {
        const contents = await file.download();
        console.log(contents.toString('utf8'))
        res.status(200).send(contents);
      } else {
        res.status(404).send(`File ${filename} not found.`);
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
});

app.post('/save/:filename', express.json(), async (req, res) => {
  const { filename } = req.params;
  const { content } = req.body;
  if (!filename) {
    return res.status(400).send('Filename is required.');
  }

  try {
    await uploadFromMemory(bucketName, filename, content);
    res.status(200).send('File saved successfully.');
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).send('Error saving file.');
  }
});

const PORT = parseInt(process.env.PORT) || 8083;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}, ${HOSTNAME}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
