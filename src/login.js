import {React,useState} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import './login.css';

const CLIENT_ID = 
    "699515209239-4plnhkeavbuagngqafdr8sml6lei41i5.apps.googleusercontent.com";

export function Login() {
    /*State*/
    let [isLoggedIn, setIsLoggedIn] = useState(false);
    let [userInfo, setUserInfo] = useState({name:"",email:""});
    /*******/

    /*Success Handler*/
    const responseGoogleSuccess = (response) => {
        console.log(response+"success");
        let userInfo = {
            name: response.profileObj.name,
            email: response.profileObj.email,
        }
        setUserInfo(userInfo);
        setIsLoggedIn(true);
    }
    /*****************/

    /*Error Handler*/
    const responseGoogleError = (response) => {
        console.log(response+"error");
    }
    /***************/

    /*Logout Session and Update State*/
    const logout = (response) => {
        console.log(response);
        let userInfo = {
            name: "",
            email: "",
        };
        setUserInfo(userInfo);
        setIsLoggedIn(false);
    }
    /*********************************/

    return(
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
                />
            )}
        </div>
    )
}

export default Login;