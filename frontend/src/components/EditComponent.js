import { UPDATE_FILE_CONTENT } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node, Transforms } from 'slate';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { parseCredentialsJWT } from '../utils';


export default function EditComponent({editorStringContent, filename}) {
    const [editor] = useState(() => withReact(createEditor()))
    const editorRef = useRef(null)

    // console.log(editorStringContent);

    let editorValue = editorStringContent ? stringToEditorValue(editorStringContent) : [];

    function stringToEditorValue(text) {
        const editor = withReact(createEditor());
        const { insertText } = editor;
        const value = [{ type: 'paragraph', children: [{ text: '' }] }];
        Transforms.insertNodes(editor, value); // Insert initial paragraph
    
        const lines = text.split('\n').filter(line => line.trim() !== '');
    
        lines.forEach((line, index) => {
            if (index !== 0) {
                insertText('\n'); // Insert line break
            }
            insertText(line);
        });
    
        return editor.children;
    }

    const SlateWithRef = React.forwardRef(({ children, ...props }, ref) => (
        <Slate {...props}>
            <div ref={ref}>{children}</div>
        </Slate>
    ));

    const serializeToString = nodes => {
        return nodes.map(n => Node.string(n)).join('\n')
    }

    useEffect(() => {
        const handleSave = async (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault(); 
                const text = serializeToString(editorValue);
                console.log('filename:', filename);
                try {
                    await axios.post(`${UPDATE_FILE_CONTENT}/${filename}`, {
                        content: text,
                    }, {withCredentials: true});
                } catch (error) {
                    console.error('Error saving file:', error);
                }
            }
        };
        
        document.addEventListener('keydown', handleSave);

        return () => document.removeEventListener('keydown', handleSave);
    }, [editorStringContent, filename]);

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
        <div style={editorValue.length > 0 ? editorStyles : {}}>
            {editorValue.length > 0 && (
                <SlateWithRef
                    editor={editor}
                    initialValue={editorValue}
                    value={editorValue}
                    onChange={newValue => editorValue = newValue}
                    ref={editorRef}
                    >
                    <Editable autoFocus="false"/>
                </SlateWithRef>
            )}
            </div>
    );
}
