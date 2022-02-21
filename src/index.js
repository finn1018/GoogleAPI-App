import {React,useState} from 'react';
import ReactDOM from 'react-dom';
import Login from './login.js';
import Drive from './drive.js';
import './index.css';

function App() {
  return (
    <>
    <div id="header"> 
      <h1 id="coraise">CORAISE</h1>
      <Login/>
    </div>
    <div id="btns">
      <Drive/>
    </div>
    </>
  )
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);