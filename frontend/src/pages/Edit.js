import { GET_FILES_URL, GET_FILE_CONTENT } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { Cookies } from 'react-cookie';
import './Edit.css'
import axios from 'axios';
import EditComponent from '../components/EditComponent';
import { parseCredentialsJWT } from '../utils';

export default function Edit() {

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [editorStringContent, setEditorStringContent] = useState('');

    const authToken = new Cookies(document.cookie).get('authToken');
    const {pfpUrl, name} = parseCredentialsJWT(authToken);
    // console.log(authToken);
    
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(GET_FILES_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }
                const data = await response.json();
                setFiles(data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        
        fetchFiles();

    }, []);
    
    const handleEditDocument = () => {
        const fetchContent = async (filename) => {
            try{
                const response = await axios(`${GET_FILE_CONTENT}/${filename}`);
                return response
            }catch (error) {
                console.error('Error:', error);
            }
        };

        if (selectedFile !== '') {
            fetchContent(selectedFile)
                .then(response => {
                    const byteArray = response.data[0].data
                    const stringContent = String.fromCharCode.apply(null, byteArray);
                    console.log(stringContent);
                    setEditorStringContent(stringContent);
                })
                .catch(error => {
                    console.error('Error fetching file content:', error);
                });
        }
    }
    const handleFileChange = event => {
        setSelectedFile(event.target.value);
    }

      return (
        <div align='center' className='selector'>
            <div style={{position: 'absolute', top: 5, right: 5, display: 'flex', alignItems: 'center'}}>
                <img src={pfpUrl} style={{width: 40}} />
                <p style={{padding: '0 5px'}}>|</p>
                <div style={{textAlign: 'right' ,color: 'white'}}>{name}</div>
            </div>
            <h1>Choose a file to Edit</h1>
            <select onChange={handleFileChange} value={selectedFile}>
                <option value="">Select a file</option>
                {files.map(file => (
                    <option key={file} value={file}>
                        {file}
                    </option>
                ))}
            </select>
            <div>
                {selectedFile && (
                    <p>Selected File: {selectedFile}</p>
                )}
            </div>
            <div>
                <button onClick={handleEditDocument}>Edit Document</button>
            </div> 
            
            <EditComponent 
                editorStringContent={editorStringContent} 
                filename={selectedFile}
            />
        </div>
    );
};
