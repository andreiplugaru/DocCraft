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

            fetch('http://localhost:8083/upload', {
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

    return (
        <div className="taskbar">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
