import {React, useState} from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Drive1 from './Drive1';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import './index.css';

const CLIENT_ID = "699515209239-4plnhkeavbuagngqafdr8sml6lei41i5.apps.googleusercontent.com";


function App() {
    const [aT,setAT] = useState(null); 
    const [isLoggedIn, setIsLoggedIn] = useState(false); //로그인 상태

    const responseGoogleSuccess = (response) => {
        setAT(response.accessToken);
        setIsLoggedIn(true);
    }

    const responseGoogleError = (response) => {
        console.log(response+" error");
    }

    const logout = (response) => {
        setIsLoggedIn(false);
    }

    return (
        <div id="wrap">
            <div className="flex_container">
                <div id="header">
                    <Header/>
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
                </div>
                <div id="menu">
                    <Drive1 accessToken={aT} isLoggedIn={isLoggedIn}/>
                </div>
            </div>
        </div>
    )
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);