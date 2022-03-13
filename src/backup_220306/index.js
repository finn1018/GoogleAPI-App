import {React,useState} from 'react';
import ReactDOM from 'react-dom';
import OAuth from './OAuth.js';
import './index.css';

function App() {
  return (
    <>
      <h1 id="coraise">CORAISE</h1>
      <OAuth/>
    </>
  )
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);