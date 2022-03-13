import {React,useState} from 'react';
import axios from 'axios';
import './drive.css';
const DISCOVERY_DOCS = ["https://www.googleapis.com/drive/v3/about"];

function Drive(accessToken) {
    const params = {
        fields: "user",
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`
    }
    /*****************************************/
    const handleClick = () => {
        console.log(process.env.API_KEY);
        axios.get(DISCOVERY_DOCS, {
            params: params,
            Authorization: accessToken
        }).then(response => {
            console.log(response);
        })
    }

    return (
        <div id="driveBtn" onClick={() => handleClick()}>
            신규 고객사 등록
        </div>
    )
}

export default Drive;