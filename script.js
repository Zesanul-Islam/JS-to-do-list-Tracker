// localStorage.clear();
// console.log ( localStorage );
let inputField = document.querySelector ( "#inputField" );
let taskListHeader = document.querySelector ( "#taskListHeader" );
let taskList = document.querySelector ( "#taskList" );
let addBtn = document.querySelector ( "#addBtn" );
let clearAllBtn = document.querySelector ( "#clearAllBtn" );
let modalOverLay = document.querySelector ( "#modalOverLay" );
let modalBox = document.querySelector ( "#modalBox" );
let body = document.querySelector ( "body" );
let cancelClear = document.querySelector ( "#cancelClear" );
let confirmClear = document.querySelector ( "#confirmClear" );
let modalFocusBtns = [ confirmClear, cancelClear ], modalFocusIndex = -1;
let isModalOpen = false;
function taskListHeaderLoader( len ){
    if ( len === 0 ) {
        taskListHeader.innerText = "Good Job !!! No pending task.";
    }
    else if ( len === 1 ) {
        taskListHeader.innerText = "1 pending task:";
    }
    else {
        taskListHeader.innerText = `${len} pending tasks:`;
    }
}
function newEleInTaskList( id, taskName ) {
    let newListItem = document.createElement ( "li" );
    let newDivInListItem = document.createElement ( "div" );
    let newParaInDiv = document.createElement ( "p" );
    let newButtonInDiv = document.createElement ( "button" );
    newDivInListItem.classList.add ( "taskListItems" );
    newButtonInDiv.classList.add ( "ItemButton" );
    newButtonInDiv.innerText = "X";
    newListItem.dataset.id = id;
    newParaInDiv.innerText = taskName;
    newDivInListItem.appendChild ( newParaInDiv );
    newDivInListItem.appendChild ( newButtonInDiv );
    newListItem.appendChild ( newDivInListItem );
    taskList.appendChild ( newListItem );
}
function initialLoad(){
    if ( localStorage.getItem ( "taskListArray" ) == null ) {
        localStorage.setItem ( "taskListArray" , JSON.stringify([]) );
    }
    let taskListArray = JSON.parse(localStorage.getItem ( "taskListArray" ));
    taskListHeaderLoader( taskListArray.length );
    for ( let i = 0 ; i < taskListArray.length ; i++ ) {
        newEleInTaskList( taskListArray[i].id, taskListArray[i].taskName );
    }
}
initialLoad();
addBtn.addEventListener ( "click" , ()=>{
    if ( inputField.value === "" ) return ;
    let taskListArray = JSON.parse(localStorage.getItem ( "taskListArray" ));
    let newId = Date.now();
    taskListArray.push( {id: newId, taskName: inputField.value} );
    localStorage.setItem ( "taskListArray" , JSON.stringify(taskListArray) );
    newEleInTaskList( newId, inputField.value );
    taskListHeaderLoader( taskListArray.length );
    inputField.value = "";
})
taskList.addEventListener ( "click" , (event)=>{
    if ( event.target.classList.contains( "ItemButton") === false ) return ;
    let deletedListItem = event.target.closest ( "li" );
    let deletedId = Number( deletedListItem.dataset.id );
    let taskListArray = JSON.parse(localStorage.getItem ( "taskListArray" ));
    taskListArray = taskListArray.filter((task)=>{
        if ( task.id === deletedId ) return false ;
        return true ;
    });
    localStorage.setItem ( "taskListArray" , JSON.stringify(taskListArray) );
    deletedListItem.remove();
    taskListHeaderLoader( taskListArray.length );
})
inputField.addEventListener ( "keypress" , (event)=>{
    if ( event.key === "Enter" ){
        addBtn.click();
    }
});
clearAllBtn.addEventListener ( "click" , ()=>{
    body.classList.add ( "noScroll" );
    modalOverLay.classList.remove ( "modalHidden" );
    modalOverLay.classList.add ( "modalVisible" );
    isModalOpen = true;
    modalBox.classList.remove ( "opacityZero" );
    modalBox.classList.add ( "opacityOne" );
})
function modalCloseFunction(){
    isModalOpen = false;
    modalFocusIndex = -1;
    setTimeout(()=>{
        body.classList.remove ( "noScroll" );
        modalOverLay.classList.add ( "modalHidden" );
        modalOverLay.classList.remove ( "modalVisible" );
    },500);
    modalBox.classList.add ( "opacityZero" );
    modalBox.classList.remove ( "opacityOne" );
}
document.addEventListener ( "keydown" , (event)=>{
    if ( event.key === "Escape" && isModalOpen ) {
        modalCloseFunction();
    }
    if ( event.key === "Tab" && isModalOpen ) {
        event.preventDefault();
        if ( modalFocusIndex === -1 ) {
            modalFocusIndex = 1; cancelClear.focus();
        }
        else if ( modalFocusIndex === 1 ) {
            modalFocusIndex = 0; confirmClear.focus();
        }
        else {
            modalFocusIndex = 1; cancelClear.focus();
        }
    }
})
document.addEventListener ( "click" , (event)=>{
    if ( event.target === modalOverLay && isModalOpen ) {
        modalCloseFunction();
    }
})
cancelClear.addEventListener ( "click" , ()=>{
    modalCloseFunction();
})
confirmClear.addEventListener ( "click" , ()=>{
    modalCloseFunction();
    taskList.innerText = "";
    taskListHeaderLoader( 0 );
    localStorage.setItem ( "taskListArray" , JSON.stringify([]) );
})