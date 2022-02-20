import {React,useState} from 'react';
import ReactDOM from 'react-dom';
import {GoogleLogin, GoogleLogout} from 'react-google-login';

const CLIENT_ID = 
    "699515209239-4plnhkeavbuagngqafdr8sml6lei41i5.apps.googleusercontent.com";

function App() {
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
        <div className="row mt-5">
        <div className="col-md-12">
          {isLoggedIn ? (
            <div>
              <h1>Welcome, {userInfo.name}</h1>

              <GoogleLogout
                clientId={CLIENT_ID}
                buttonText={"Logout"}
                onLogoutSuccess={() => logout()}
              ></GoogleLogout>
            </div>
          ) : (
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Sign In with Google"
              onSuccess={(response) => responseGoogleSuccess(response)}
              onFailure={(response) => responseGoogleError(response)}
              isSignedIn={true}
              cookiePolicy={"single_host_origin"}
            />
          )}
        </div>
      </div>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);