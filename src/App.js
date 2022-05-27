import React from 'react';
import './index.css'
import {Header} from './Components/Header.js'
import {Footer} from './Components/Footer.js'
import {Editor} from './Components/Editor.js'

function App() {
  
  return (
    <div>
        <Header/>
        <Editor
        language = "sql"
        displayName  = "Input"
        />
        <Footer/>
    </div>
  );
}

export default App;
