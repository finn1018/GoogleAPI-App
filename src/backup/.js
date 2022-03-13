import React from 'react';
import ReactDOM from 'react-dom';
import useScript from './useScript';

const API_KEY = "AIzaSyCKLKeMJ-BhyWzVHW99v-3g-XINucrnHR4";
const CLIENT_ID = "699515209239-4plnhkeavbuagngqafdr8sml6lei41i5.apps.googleusercontent.com";

function DriveApp() {
    useScript("https://apis.google.com/js/api.js");
    const authenticate = () => {
        return gapi.auth2.getAuthIstance()
            .signIn({scope: "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.apps.readonly https://www.googleapis.com/auth/drive.activity.readonly"})
            .then(function() {console.log("Sign-in successful");},
                function(err) {console.error("Error signing In", err); });
    }

    const loadClient = () => {
        gapi.client.setApiKey(API_KEY);
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
            .then(function() {console.log("GAPI client oaded for API");},
                function(err) {console.error("Error loading GAPI client for API", err);});
    }

    const execute = () => {
        return gapi.client.drive.about.get({
            "fields": "user"
        })
            .then(function(response) {
                console.log("Response", response);
            },
            function(err) {console.error("Execute error", err);});
    }

    gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: CLIENT_ID});
    });

    return (
        <>
        cxzc
            <button onclick={authenticate().then(loadClient)}>authorize and load</button>
            <button onclick={execute()}>execute</button>
        </>
    )
}
ReactDOM.render(
    <DriveApp/>,
    document.getElementById('root')
);