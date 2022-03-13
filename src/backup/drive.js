import axios from 'axios';
import {React,useState} from 'react';
import './drive.css';

const FILED = "user";

function Drive(props) {
    const [accessToken, setAccessToken] = useState(props.accessToken);
    console.log("Bearer " +props.accessToken);
    const getAboutDrive = (FILED) => {
        console.log("Bearer " +accessToken);
            axios.get('https://www.googleapis.com/drive/v3/about', {
                params: {fields: "user"},
                headers: {
                    Authorization: "Bearer " + accessToken,
                    Accept: "application/json"
            }}).then(response => {
                console.log(response);
            })
    }

    return (
        <div id="driveBtn" onClick={() => getAboutDrive()}>
            신규 고객사 등록
        </div>
    )
}

export default Drive;