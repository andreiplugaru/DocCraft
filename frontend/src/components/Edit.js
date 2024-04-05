import { GET_FILES_URL, GET_FILE_CONTENT, PRODUCTION, UPDATE_FILE_CONTENT } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';
import './Edit.css'
import axios from 'axios';

export default function Edit() {

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [editorValue, setEditorValue] = useState([]);
    const [editor] = useState( () => withReact(createEditor()))
    const editorRef = useRef(null)

    const SlateWithRef = React.forwardRef(({ children, ...props }, ref) => (
        <Slate {...props}>
            <div ref={ref}>{children}</div>
        </Slate>
    ));
    
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(GET_FILES_URL);
                console.log('Production: ', PRODUCTION);
                console.log('URL: ', GET_FILES_URL);
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
    
    function convertPlainTextToSlateValue(plainText) {
        const paragraphs = plainText.split('\n').map(text => ({
            type: 'paragraph',
            children: [{ text }],
        }));
    
        const slateValue = [
            {
                type: 'paragraph',
                children: paragraphs,
            },
        ];
    
        return slateValue;
    }

    const handleEditDocument = () => {
        const fetchContent = async (filename) => {
            try{
                const response = await axios(`${GET_FILE_CONTENT}/${filename}`);
                console.log('fisier \n  ')
                console.log(response.data)
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
                    console.log(stringContent)
                    setEditorValue([
                        {
                            type: 'paragraph',
                            children: [{ text: stringContent }],
                        },
                    ]);
                    // setEditorValue(convertPlainTextToSlateValue(stringContent))
                })
                .catch(error => {
                    console.error('Error fetching file content:', error);
                });
        }
    }
    const handleFileChange = event => {
        setSelectedFile(event.target.value);
    };
    const serializeToString = nodes => {
        return nodes.map(n => Node.string(n)).join('\n')
    }
    useEffect(() => {
        const handleSave = async (event) => {
          if (event.ctrlKey && event.key === 's') {
            event.preventDefault(); 
            console.log(selectedFile);
            const text = serializeToString(editorValue);
            console.log(text)
            try {
              await axios.post(`${UPDATE_FILE_CONTENT}/${selectedFile}`, {
                content: text
              });
              console.log('File saved successfully.');
            } catch (error) {
              console.error('Error saving file:', error);
            }
          }
        };
      
        document.addEventListener('keydown', handleSave);
      
        return () => {
          document.removeEventListener('keydown', handleSave);
        };
      }, [editorValue, selectedFile]);
      


    const editorStyles = {
    width: '40%', 
    minHeight: '300px', 
    backgroundColor: '#f4f4f4', 
    color: '#000000',
    padding: '10px',
    borderRadius: '5px', 
    overflowY: 'auto',
    textAlign: 'left'
    };
      return (
        <div align='center' className='selector'>
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
            <div style={editorValue.length > 0 ? editorStyles : {}}>
            {editorValue.length > 0 && (
                <SlateWithRef
                    editor={editor}
                    initialValue={editorValue}
                    value={editorValue}
                    onChange={newValue => setEditorValue(newValue)}
                    ref={editorRef}
                    >
                    <Editable />
              </SlateWithRef>

              
            )}
            </div>

        </div>
    );
};

