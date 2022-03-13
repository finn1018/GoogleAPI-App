import {GoogleLogin, GoogleLogout} from 'react-google-login';
import {React,useState} from 'react';
import './GoogleOAuth.css';

const CLIENT_ID = "699515209239-4plnhkeavbuagngqafdr8sml6lei41i5.apps.googleusercontent.com";

function GoogleOAuth(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false); //로그인 상태
    const [userInfo, setUserInfo] = useState({name:"",email:""}); // 로그인 정보

    const responseGoogleSuccess = (response) => {
        let userInfo = {
            name: response.profileObj.name,
            email: response.profileObj.email,
        }
        console.log(response.accessToken);
        let at = response.accessToken;
        console.log(at);
        props.setAccessToken(at);
        console.log(props.accessToken);
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

    return (
        <>
            <div id="googleBtn">
                {!isLoggedIn ? (<
                                GoogleLogin clientId={CLIENT_ID}
                                buttonText="LOGIN"
                                onSuccess={(response) => responseGoogleSuccess(response)}
                                onFailure={(response) => responseGoogleError(response)}
                                isSignedIn={true}
                                cookiePolicy={"single_host_origin"}
                                id="loginBtn"
                                scope='https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata'
                                render={renderProps => (
                                    <button onClick={renderProps.onClick} disabled={renderProps.disabled}>LOGIN</button>
                                  )}
                                />)
                            : (<
                                GoogleLogout clientId={CLIENT_ID}
                                buttonText="LOGOUT"
                                onLogoutSuccess={() => logout()}
                                id="logoutBtn"
                                render={renderProps => (
                                    <button onClick={renderProps.onClick} disabled={renderProps.disabled}>LOGOUT</button>
                                  )}
                                />)
                }
            </div>
        </>
    )
}

export default GoogleOAuth;