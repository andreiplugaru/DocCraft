// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const { Storage } = require('@google-cloud/storage');
'use strict';
const bucketName = "documents_database"
const storage = new Storage();

// [START gae_flex_quickstart]
const express = require('express');

const app = express();

async function downloadFile(fileName, destFileName) {
  const options = {
    destination: destFileName,
  };

  const bucket = storage.bucket(bucketName)
  // Downloads the file
  await bucket.file(fileName).download(options);

  console.log(
    `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
  );
}


app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/download', async (req, res) => {
  const { filename, destination } = req.query;

  if (!filename) {
    return res.status(400).send('Filename is required.');
  }

  const file = storage.bucket(bucketName).file(filename);

  try {
    const exists = await file.exists();
    if (exists[0]) {
      const destFileName = destination ? destination : `./${filename}`; 
      await downloadFile(filename, destFileName);
      res.status(200).send(`File ${filename} downloaded successfully to ${destFileName}.`);
    } else {
      res.status(404).send(`File ${filename} not found.`);
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
const PORT = parseInt(process.env.PORT) || 8083;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_quickstart]
  
module.exports = app;
