import { FILE_UPLOAD_URL } from '../config';
import { PRODUCTION } from '../config';

import './Taskbar.css';

import React, { useState } from 'react';

export default function Taskbar() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const handleUpload = (event) => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
          
            console.log('Uploading file:', selectedFile.name);
            console.log('Production: ', PRODUCTION)
            console.log('URL: ', FILE_UPLOAD_URL)

            fetch(FILE_UPLOAD_URL, {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
          } else {
            alert('Please select a file');
          }
    }

    console.log(document.location.href);

    return (
        <div className="taskbar">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
