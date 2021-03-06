import {React,useState} from 'react';
import axios from 'axios';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { DragDrop } from '@uppy/react'

import './login.css';
import './drive.css';

const CLIENT_ID = "699515209239-4plnhkeavbuagngqafdr8sml6lei41i5.apps.googleusercontent.com";

export function Login() {
    /*login State*/
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [userInfo, setUserInfo] = useState({name:"",email:""});
    let [accessToken, setAccessToken] = useState(null);
    /*******/
    /*Login Handlers*/
    /*Success Handler*/
    const responseGoogleSuccess = (response) => {
        let userInfo = {
            name: response.profileObj.name,
            email: response.profileObj.email,
        }
        setAccessToken(response.accessToken);
        setUserInfo(userInfo);
        setIsLoggedIn(true);
    }
    /*****************/

    /*Error Handler*/
    const responseGoogleError = (response) => {
        console.log(response+" error");
    }
    /***************/

    /*Logout Session and Update State*/
    const logout = (response) => {
        let userInfo = {
            name: "",
            email: "",
        };
        setUserInfo(userInfo);
        setIsLoggedIn(false);
    }
    /*********************************/
    /*********************************/

    /*drive State*/
    let [isOpenCreate,setIsOpenCreate] = useState(false);
    let [companyName, setCompanyName] = useState("");
    let [enCompanyName, setEnCompanyName] = useState("");
    let fileList = [];
    let multipartReauestBody = "";
    
     /***********/

    /* Drive Handler*/
   const getBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(multipartReauestBody= btoa(reader.result));
            console.log(multipartReauestBody);
        }
   };

    /*file upload ipbut handler*/
    const uploadHandler = (files) => {
        const filesLength = files.length;
        for(let i = 0; i < filesLength; i++) {
            const file = files[i];
            fileList.push(file);
            getBase64(file);
        }
    }
    /*********************/
    
    /*folder create & file upload handler*/
    const createHandler = () => {
        const filename = companyName + " ("+enCompanyName+")";
        const folders = ["1.??????", "2.?????????","3.?????????","4.?????????","5.????????????","6.??????"];

        if(filename.includes("????????????")) {
            alert('???????????? ??? ?????? ?????? ????????? ?????????.');
            return;
        }
        if(filename.includes("(???)")) {
            alert('(???) ??? ?????? ?????? ????????? ?????????.');
            return;
        }

        /*????????? ????????? ???????????? ?????? ?????????*/
        axios({
            method: "post",
            url: "https://www.googleapis.com/drive/v3/files?supportsTeamDrives=true",
            headers: {
                Authorization: "Bearer " + accessToken,
                Accept: "application/json"
            },
            data: {
                name: filename,
                mimeType: "application/vnd.google-apps.folder",
                parents: ["1iP5iuS80wQ1bAUxHeiAgw2AE0kDOTyK2"] //????????? ?????? ID
            }

            /*???????????? ????????? ?????? ?????? 6??? ????????? */
        }).then(response => {
            console.log(response);
            folders.map((v,i) => {
                axios({
                    method: "post",
                    url: "https://www.googleapis.com/drive/v3/files?supportsTeamDrives=true",
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        Accept: "application/json"
                    },
                    data: {
                        name: v,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [response.data.id] //????????? ?????? ID
                    }

                }).then(response => {
                    if(i===0) {
                        let formData = new FormData();
                        let metadata = {
                            "Content-Type" : "application/json; charset=UTF-8",
                            name: fileList[0].name,
                            mimeType: fileList[0].type,
                            parents: [response.data.id]
                        };
                        formData.append("file", fileList[0]);
                        formData.append("metadata", JSON.stringify(metadata));
                        console.log(fileList[0]);
                        
                        const boundary = "foo_bar_baz";
                        const delimiter = "\r\n--" + boundary + "\r\n";
                        const close_delim = "\r\n--" + boundary + "--";
                        /*
                        let metadata = {
                            name: fileList[0].name,
                            mimeType: fileList[0].type,
                            parents: [response.data.id]
                        }

                        let body = 
                            delimiter +
                            'Content-Type: application/json; charset=UTF-8\r\n\r\n' + 
                            JSON.stringify(metadata) + '\r\n' +
                            delimiter +
                            'Content-Type: ' + fileList[0].type + '\r\n' +
                            'Content-Transfer-Encoding: base64\r\n' + 
                            '\r\n' +multipartReauestBody  + close_delim;

                        console.log(body);

                        axios({
                            method: "post",
                            url: "https://www.googleapis.com/upload/drive/v3/files?supportsTeamDrives=true&uploadType=multipart",
                            headers: {
                                Authorization: "Bearer " + accessToken,
                                "Content-Type": "multipart/related; boundary=foo_bar_baz"
                            },
                            data: body
                        */
                    
                        axios({
                            method: "post",
                            url: "https://www.googleapis.com/upload/drive/v3/files?supportsTeamDrives=true&uploadType=multipart",
                            headers: {
                                Authorization: "Bearer " + accessToken,
                                "Content-Type": "multipart/form-data"
                            },
                            data: formData
                    }).then(response => console.log(response)).catch(error => console.log(error))
            }}).catch(error => console.log(error))
            })
        }).catch(error => console.log(error))

    }
    /*********************************/
            
    /*CHANGE OF COMPANY NAME HANDLER*/ 
    const changeHandlerKO = (e) => {
        setCompanyName(e.target.value);
    }

    const changeHandlerEN = (e) => {
        setEnCompanyName(e.target.value);
    }
    /******************************/
    /****************/

    return(
        <>
            <div id="header"> 
                <div id="loginBtn">
                    {isLoggedIn ? (
                        <div>
                            <p id="userName">{userInfo.name}</p>
                            <div>
                                <GoogleLogout
                                    clientId={CLIENT_ID}
                                    buttonText="????????????"
                                    onLogoutSuccess={() => logout()}
                                    id="loginBtn"
                                ></GoogleLogout>
                            </div>
                        </div>
                    ) : (
                        <GoogleLogin
                            clientId={CLIENT_ID}
                            buttonText="?????????"
                            onSuccess={(response) => responseGoogleSuccess(response)}
                            onFailure={(response) => responseGoogleError(response)}
                            isSignedIn={true}
                            cookiePolicy={"single_host_origin"}
                            id="loginBtn"
                            scope='https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata'
                        />
                    )}
                </div>
            </div>
            <div id="btns">
                {isOpenCreate
                ?(<div id='onBtn'>
                    <p>????????? ??????</p>
                    ????????? ??????: <input value={companyName} onChange={(e) => changeHandlerKO(e)}/><br/>
                    ????????? ?????? ??????: <input value={enCompanyName} onChange={(e) => changeHandlerEN(e)}/><br/>
                    <p>?????? ?????????</p> <input type='file' name="files[]" onChange={((event) => uploadHandler(event.target.files))} multiple/>
                    <p><button onClick={() => createHandler()}>??????</button> <button onClick={() => setIsOpenCreate(!isOpenCreate)}>??????</button></p>
                </div>)
                :<div id="driveBtn" onClick={() => setIsOpenCreate(!isOpenCreate)}>????????? ??????</div>
                }  
            </div>
        </>
    )
}

export default Login;