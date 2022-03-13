import ReactDOM from 'react-dom';
import React, { useState, useEffect } from "react";
import qs from "qs";

const CLIENT_ID = "699515209239-4plnhkeavbuagngqafdr8sml6lei41i5.apps.googleusercontent.com";
const AUTHORIZE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
const PEOPLE_URI = "https://people.googleapis.com/v1/contactGroups";

const queryStr = qs.stringify({
    client_id: CLIENT_ID,
    redirect_uri: window.location.href,
    response_type: "token",
    scope: "https://www.googleapis.com/auth/contacts.readonly",
  });

const loginUrl = AUTHORIZE_URI + "?" + queryStr;

function App() {
  const { access_token } = qs.parse(window.location.hash.substr(1));
  const [contactGroups, setContactGroups] = useState([]);

  useEffect(() => {
    fetch(PEOPLE_URI, {
        param: {resourceName:"contactGroups/all"},
      headers: { Authorization: "Bearer " + access_token }
    })
      .then(response => response.json())
      .then(data => setContactGroups(data.contactGroups));
  }, [access_token]);

  if (!access_token) {
    window.location.assign(loginUrl);
    return null;
  }

  return (
    <>
      <h2>Contact Groups</h2>
      <ul>
        {contactGroups &&
          contactGroups.map(({ resourceName, name, memberCount }) => (
            <li key={resourceName}>
              {name} ({memberCount})
            </li>
          ))}
      </ul>
    </>
  );
};

ReactDOM.render(<App/>, document.createElement('root'));
