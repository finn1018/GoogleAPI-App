import {React,useState} from 'react';
import axios from 'axios';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import './login.css';
import './drive.css';

const CLIENT_ID = "699515209239-ml6lei41i5.apps.googleusercontent.com";

export function Login() {
    /*login State*/
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [userInfo, setUserInfo] = useState({name:"",email:""});
    let [accessToken, setAccessToken] = useState(null);
    /*******/

    /*drive State*/
    let [isOpenCreate,setIsOpenCreate] = useState(false);
    let [companyName, setCompanyName] = useState("");
    let [enCompanyName, setEnCompanyName] = useState("");
     /***********/

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
    const getAboutDrive = () => {
        axios.get('https://www.googleapis.com/drive/v3/about', {
            params: {fields: "user"},
            headers: {
                Authorization: "Bearer " + accessToken,
                Accept: "application/json"
            }}).then(response => {
                console.log(response);
            })
    }

    /* Drive Handler*/
    const createHandler = () => {
        const filename = companyName + " ("+enCompanyName+")";

        axios.post('https://www.googleapis.com/upload/drive/v3/files', {
            params: {uploadType: "media", supportsTeamDrives: true},
            headers: {
                Authorization: "Bearer " + accessToken,
                Accept: "application/json"
           },
           data: JSON.stringify({
                name: filename,
                mimeType: "application/vnd.google-apps.folder",
                parents: ["1iP5iuS80wQ1bAUxHeiAgw2AE0kDOTyK2"]
        })}).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        })
    }

    const changeHandlerKO = (e) => {
        setCompanyName(e.target.value);
    }

    const changeHandlerEN = (e) => {
        setEnCompanyName(e.target.value);
    }
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
                                    buttonText="로그아웃"
                                    onLogoutSuccess={() => logout()}
                                    id="loginBtn"
                                ></GoogleLogout>
                            </div>
                        </div>
                    ) : (
                        <GoogleLogin
                            clientId={CLIENT_ID}
                            buttonText="로그인"
                            onSuccess={(response) => responseGoogleSuccess(response)}
                            onFailure={(response) => responseGoogleError(response)}
                            isSignedIn={true}
                            cookiePolicy={"single_host_origin"}
                            id="loginBtn"
                            scope='https://www.googleapis.com/auth/drive'
                        />
                    )}
                </div>
            </div>
            <div id="btns">
                {isOpenCreate
                ?(<div id='onBtn'>
                    <p>매출처 등록</p>
                    사업자 이름: <input value={companyName} onChange={(e) => changeHandlerKO(e)}/><br/>
                    사업자 영문 이름: <input value={enCompanyName} onChange={(e) => changeHandlerEN(e)}/>
                    <p><button onClick={() => createHandler()}>등록</button> <button onClick={() => setIsOpenCreate(!isOpenCreate)}>취소</button></p>
                </div>)
                :<div id="driveBtn" onClick={() => setIsOpenCreate(!isOpenCreate)}>매출처 등록</div>
                }  
            </div>
            <button onClick={()=>getAboutDrive()}>test</button>
        </>
    )
}

export default Login;