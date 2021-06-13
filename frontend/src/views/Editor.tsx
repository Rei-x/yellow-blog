import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const EditorView = () => {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const handleSubmit = async () => {
    const rawState = convertToRaw(editorState.getCurrentContent());
    const response = await fetch('http://localhost:41960/api/posts', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ title, body: rawState })
    });
    const parsedData = await response.json();
    if (parsedData?.success) alert('Wstawiłeś post!');
  };

  const handleChange = (newState: EditorState) => {
    setEditorState(newState);
    const contentState = newState.getCurrentContent();
    console.log(convertToRaw(contentState));
  };

  return (
    <Container className="d-flex flex-column align-content-center">
      <Form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} type="text" />
        </Form.Group>
      </Form>
      <Editor
        wrapperClassName="editor"
        editorState={editorState}
        onEditorStateChange={handleChange}
        toolbar={{
          options: ['inline', 'blockType', 'link', 'image'],
          inline: {
            options: ['bold', 'italic']
          },
          blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'Code']
          }
        }}
      />
      <Button variant="primary" size="lg" className="w-50 mt-3 mx-auto" onClick={handleSubmit}>Post</Button>
    </Container>
  );
};

export default EditorView;
