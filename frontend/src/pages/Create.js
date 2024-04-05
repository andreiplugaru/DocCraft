import { useState } from "react";
import { Cookies } from 'react-cookie';
import { parseCredentialsJWT } from '../utils';
import EditComponent from "../components/EditComponent";

export default function Create() {
    const [filename, setFilename] = useState('');
    const [editorStringContent, setEditorStringContent] = useState('');
    
    const authToken = new Cookies(document.cookie).get('authToken');
    const {pfpUrl, name} = parseCredentialsJWT(authToken);

    function handleFileChange(event) {
        setFilename(event.target.value);
    }

    function handleEditDocument() {
        if (filename !== '') {
            setEditorStringContent(' ');
        }
    }


    return (
        <div align='center' className='selector'>
            <div style={{position: 'absolute', top: 5, right: 5, display: 'flex', alignItems: 'center'}}>
                <img src={pfpUrl} style={{width: 40}} />
                <p style={{padding: '0 5px'}}>|</p>
                <div style={{textAlign: 'right' ,color: 'white'}}>{name}</div>
            </div>

            <h1>Enter filename to Create</h1>
            <input onChange={handleFileChange} />
            <div>
                <button onClick={handleEditDocument}>Edit Document</button>
            </div> 
            
            <EditComponent 
                editorStringContent={editorStringContent} 
                filename={filename}
            />
        </div>
    )
}
