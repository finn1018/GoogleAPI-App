import axios from 'axios';
import { useState } from 'react';
import './ActiveForm.css';
import loadingImg from './img/loading.gif';

function ActiveForm(props) {
    const [name, setName] = useState("");
    const [result, setResult] = useState("");
    const [isFinishedCreateFolder, setIsFinishedCreateFolder] = useState(false);
    const [folderID1, setFolderID1] = useState("");
    const [folderID2, setFolderID2] = useState("");
    const [isOpenedNewTab, setIsOpenedNewTab] = useState(false); //
    const [searchedFolders, setSearchedFolders] = useState([]);
    const [isclickedItem, setIsclickedItem] = useState(false);
    const [isFinishedSearch,setIsFinishedSearch] = useState(false);
    const [items,setItems] = useState("");
    const [isBlured, setIsBlured] = useState(false);

    const check_num = /[0-9]/; // 숫자 
    const check_eng = /[a-zA-Z]/; // 문자 
    const check_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자 
    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

    if(folderID2 !== "" && !isOpenedNewTab) { // 새로 만들어진 고객사 폴더 안의 하위 폴더인 '1.자료' 폴더가 새 탭으로 열림 
        setIsOpenedNewTab(true);
        window.open('https://drive.google.com/drive/u/0/folders/1iP5iuS80wQ1bAUxHeiAgw2AE0kDOTyK2/'+folderID1+"/"+folderID2);
        props.setKoCN("");
        props.setEnCN("");
        props.setIdentifier("");
        setIsFinishedCreateFolder(false);
        setItems("");
        setIsFinishedSearch(false);
        setIsclickedItem(false);
        setSearchedFolders([]);
        setIsBlured(false);
    }
    
    const clickReset = () => { //초기화 버튼
        if(window.confirm("초기화합니다.")) {
            props.setKoCN("");
            props.setEnCN("");
            props.setIdentifier("");
            setName("");
            setResult("");
            setIsFinishedCreateFolder(false);
            setFolderID1("");
            setFolderID2("");
            setIsOpenedNewTab(false);
            setItems("");
            setIsFinishedSearch(false);
            setIsclickedItem(false);
            setSearchedFolders([]);
            setIsBlured(false);
        } else {
            return;
        }
    }
    const actSubmit = () => {
        if(props.koCN === "" || props.enCN === "") 
            document.getElementById("submit_btn").className = "click_disable";
        else 
            document.getElementById("submit_btn").className = "click_able";
    }

    const searchValue = (nextPageToken) => {
        axios({
            method: "get",
            url: "https://www.googleapis.com/drive/v3/files",
            headers: {
                Authorization: "Bearer " + props.accessToken,
                Accept: "application/json",
            },
            params: {
                pageToken: nextPageToken,
                corpora: "drive",
                driveId: "0AMPBt-VXLR8uUk9PVA",
                includeTeamDriveItems: true,
                orderBy: "name",
                pageSize: 500,
                q: "('1b4NqLnsu1D5vyrd9H7VzB8XExiL2ZD3M' in parents or '1iP5iuS80wQ1bAUxHeiAgw2AE0kDOTyK2' in parents) and trashed=false and mimeType = 'application/vnd.google-apps.folder'",
                supportsAllDrives: true,
                fields: "nextPageToken, files(name,id,parents)"
            }
        }).then(res => {
            setSearchedFolders(prevList => [...prevList, ...res.data.files]); //현재 매입처 및 매출처 폴더 리스트 저장

            if(res.data.nextPageToken !== undefined) 
                searchValue(res.data.nextPageToken) //가져올 폴더가 더 있으면 재귀
            else 
                document.getElementById("loading_box").className="inactive"; // 로딩 이미지 사라지게
        })
        .catch(res => {console.log(res)});
    }


    if(!isFinishedSearch) { // 폴더 리스트 가져오기 (한 번 실행되면 실행 안 됨)
        setIsFinishedSearch(true); 
        searchValue("");
    }

    const showList = () => {
        if(!isBlured) {
            document.getElementById("searched_item").className="active";
            return items;
        }
    } 

    const searchedItem = (value) => {
        let num = 0;
        for(let i = 0; i < searchedFolders.length;i++) {
            if(num > 4) break;
            if(searchedFolders[i].name.includes(value)){
                num++;
                setItems(prev => [...prev,
                    <li key={searchedFolders[i].id}>
                        <a onMouseDown={() => onMouseDownItem()} onMouseUp={() => onMouseUpItem()}rel="noopener noreferrer" target='_blank' href={'https://drive.google.com/drive/u/0/folders/'+ searchedFolders[i].parents[0] + '/' + searchedFolders[i].id}>{searchedFolders[i].name}</a>
                    </li>])
            }
        }
        if(setItems === "") document.getElementById("searched_item").className="";
    }

    const changeKoCN = (value) => {
        value = value.replace(/^\s+|\s+$/gm,''); //문자열 앞 뒤 공백 제거

        if(value ==="") {
            document.getElementById("searched_item").className="";
        }
        if(items.length === 0 ) {
            document.getElementById("searched_item").className="";
        }

        props.setKoCN(value);

        let checkKo = true;
        if(check_num.test(value) || check_eng.test(value) || check_spc.test(value)) {
            checkKo=false;
            document.getElementById("alert_box_Drive").innerHTML = "한글만 입력해 주세요.";
        }else {
            checkKo = true;
        }

        let checkStr = true;
        if(value.includes("(주)")) {
            document.getElementById("alert_box_Drive").innerHTML = "(주)를 제외하고 입력해 주세요.";
            checkStr = false;
        } else if(value.includes("주식회사")) {
            document.getElementById("alert_box_Drive").innerHTML = "주식회사를 제외하고 입력해 주세요.";
            checkStr = false;
        } else {
            checkStr = true;
        }

        if(checkKo && checkStr) {
            document.getElementById("alert_box_Drive").innerHTML = "";
            actSubmit();
        }

        setItems(""); 
        if(value!==""){
            searchedItem(value);
        }
    }

    const changeEnCN = (value) => {
        value = value.replace(/^\s+|\s+$/gm,''); //문자열 앞 뒤 공백 제거
        let checkEn = true;
        if(check_kor.test(value)||check_num.test(value)) {
            checkEn=false;
            document.getElementById("alert_box_Drive").innerHTML = "한글 및 숫자는 제외하고 입력해 주세요.";
        }else {
            checkEn = true;
        }

        if(checkEn) {
            document.getElementById("alert_box_Drive").innerHTML = "";
            actSubmit();
        }
        props.setEnCN(value);
    }

    const changeIdentifier = (value) => {
        props.setIdentifier(value)
    }

    const createFolder = (name) => {
        const childFolderNames = ["1.자료", "2.견적서","3.발주서","4.계약서","5.네트워크","6.백업"];

        axios({
            method: "post",
            url: "https://www.googleapis.com/drive/v3/files?supportsTeamDrives=true",
            headers: {
                Authorization: "Bearer " + props.accessToken,
                Accept: "application/json"
            },
            data: {
                name: name,
                mimeType: "application/vnd.google-apps.folder",
                parents: ["1iP5iuS80wQ1bAUxHeiAgw2AE0kDOTyK2"] //매출처 폴더 ID
            }
        })
        .then(res => {
            let num = 0;
            let r = name + " 폴더가 매출처 폴더에 생성되었습니다.\n";
            setResult(r);
            setFolderID1(res.data.id);
            childFolderNames.map((v,i) => {
                return axios({
                    method: "post",
                    url: "https://www.googleapis.com/drive/v3/files?supportsTeamDrives=true",
                    headers: {
                        Authorization: "Bearer " + props.accessToken,
                        Accept: "application/json"
                    },
                    data: {
                        name: v,
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [res.data.id] //생성된 부모 폴더 ID
                    }
                }).then(res => {++num; r = r + childFolderNames[i]+" 폴더가 "+name+" 폴더에 생성되었습니다.\n"; setResult(r); if(i===0) setFolderID2(res.data.id); if(num===5) {setIsFinishedCreateFolder(true);}})
                    .catch(res => {r = r + childFolderNames[i] +" 폴더가 생성 되지 않았습니다. ("+res+")"});
            })
        }).catch(res => {
            setResult(name +" 폴더가 생성되지 않았습니다. ("+res+")");
        });
    }

    const showConfirmModal = () => {
        let name = "";
        if (props.identifier === "") {
            name = props.koCN + " (" + props.enCN +")";
        } else {
            name = props.koCN + " (" + props.enCN +") "+ props.identifier;
        }
        if(window.confirm("매출처 폴더에 '"+name+"' 이름으로 폴더를 생성합니다.")) {
            setIsFinishedCreateFolder(false);
            setFolderID2("");
            setFolderID1("");
            setIsOpenedNewTab(false);
            setName(name);
            createFolder(name);
        } else {
            return;
        }
    }

    const onMouseDownItem = () => {
        setIsclickedItem(true);
    }

    const onMouseUpItem = () => {
        setIsclickedItem(false);
        document.getElementById("searched_item").className="";
    }

    const focusKoInput = () => {
        if(items.length !== 0) {
            document.getElementById("searched_item").className="active";
            setIsBlured(false);
        }
    }

    const blurKoInput = () => {
        if(!isclickedItem){
            document.getElementById("searched_item").className=""; 
            setIsBlured(true);
        }
    }

    return (
        <>
            <div id="form_container">
                <div id="back_button">
                    <div id="back_arrow" onClick={() => props.changeShowForm()}/>
                    <div id="arrow_name">BACK</div>
                </div>
                <div id="loading_box">
                        <img src={loadingImg} alt="loading.."/>
                </div>
                <div id="input_form">
                    <div className="input_text">
                        <div className="input_form_name">폴더 이름</div>
                        <div className="input_text_box">
                            <p className="input_text_box_name">국문 회사 이름</p>
                            <input className='"input_text_box_form' value={props.koCN} onChange={(event) => changeKoCN(event.target.value)} onFocus={()=>focusKoInput()} onBlur={()=>blurKoInput()}/>
                        </div>
                        <div id="searched_item">
                            <ul>{items.length!==0?showList():""}</ul>
                        </div>
                        <div className="input_text_box">
                            <p className="input_text_box_name">영문 회사 이름</p>
                            <input className='input_text_box_form' value={props.enCN} onChange={(event) => changeEnCN(event.target.value)}/>
                        </div>
                        <div className="input_text_box">
                            <p id="id" className="input_text_box_name">식별 이름</p>
                            <input className='input_text_box_form' value={props.identifier} onChange={(event) => changeIdentifier(event.target.value)}/>
                            <div id="alert_box_Drive"></div>
                        </div>
                        <div className="submit_reset_button">
                            <div id="submit_btn" className="click_disable" onClick={() => showConfirmModal()}>생성하기</div>
                            <div id="reset_btn" onClick={() => clickReset()}>초기화하기</div>
                        </div>
                    </div>
                    <div className="input_file">
                        <div className="input_form_name">실행 결과</div>
                        <div className='result_box'>
                            {result.split('\n').map((line) => {return <span>{line}<br/></span>})}
                        </div>
                        {
                            isFinishedCreateFolder ?
                            <div>
                                <div className="openWebBtn"><a rel="noopener noreferrer" target='_blank' href={'https://drive.google.com/drive/u/0/folders/1iP5iuS80wQ1bAUxHeiAgw2AE0kDOTyK2/'+folderID1}>{name}</a></div>
                                <div className="openWebBtn"><a rel="noopener noreferrer" target='_blank' href={'https://drive.google.com/drive/u/0/folders/1iP5iuS80wQ1bAUxHeiAgw2AE0kDOTyK2/'+folderID1+"/"+folderID2}>{name+" / 1.자료"}</a></div>
                            </div>
                            :<div></div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ActiveForm;