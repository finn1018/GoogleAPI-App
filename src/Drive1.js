import {React, useState} from 'react';
import ActiveForm from './ActiveForm';
import './Drive1.css';


function Drive1(props) {
    const [isFormShowing, setIsFormShowing] = useState(false);
    const [koCN, setKoCN] = useState("");
    const [enCN, setEnCN] = useState("");
    const [identifier, setIdentifier]= useState("");

    const changeShowForm = () => {
        if(props.isLoggedIn) {
            setIsFormShowing(!isFormShowing);
        } else {
            alert("로그인을 진행해 주세요.");
        }
    }

    return (
        <>
            {!isFormShowing ? <div id="drive1_box" onClick={() => changeShowForm()}>고객사 폴더 만들기</div>
                            : <ActiveForm changeShowForm = {() => changeShowForm()} 
                                setKoCN = {setKoCN} setEnCN = {setEnCN} setIdentifier = {setIdentifier}
                                koCN = {koCN} enCN = {enCN} identifier = {identifier}
                                accessToken = {props.accessToken} 
                                id="activeform"/>
            }   
        </>
    )
}
export default Drive1;