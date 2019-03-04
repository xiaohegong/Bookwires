'use strict';

const emailaddress = document.querySelector("#emailaddress");
const username = document.querySelector("#username");
const pass = document.querySelector("#password");

const profileHeader = document.querySelector(".profileheader");
const followers = document.querySelector("#followerCount");
const following = document.querySelector("#followingCount");
const writtenCount = document.querySelector("#writenCount");
const description = document.querySelector(".profiletextcontainer > p");
const descriptionEditable = document.querySelector("#description");

function setUpUserPage(){

    // will make image editable when we create backend
    profileHeader.innerHTML = sampleUser.name;
    username.placeholder = sampleUser.name;
    followers.innerHTML = sampleUser.followers;
    following.innerHTML = sampleUser.following.length;
    writtenCount.innerHTML = sampleUser.writtenBook.length;

    description.innerHTML = sampleUser.description;

    emailaddress.placeholder = sampleUser.mailAddress;
    descriptionEditable.placeholder = sampleUser.description;

}
setUpUserPage();

const mainContent = document.querySelector("#main-content-containter");
const navSettings = document.querySelector(".nav").children;

const shelfButton = navSettings[0];

shelfButton.addEventListener('click', setUpShelf);

// settings buttons
const editButton = document.querySelector("#editbutton");
editButton.addEventListener('click', changeEditable);

const confirmButton = document.querySelector("#confirmbutton");
confirmButton.addEventListener('click', confirmChanges);

const cancelButton = document.querySelector("#cancelbutton");
cancelButton.addEventListener('click', cancelChanges);



function setUpShelf(e){
    e.preventDefault();
    changeActive(shelfButton);

    // clear search bar

    mainContent.firstChild.style.display = 'none';
    setTimeout(function(){
        mainContent.firstChild.style.display = 'block';
    }, 1000);
    


}

function changeActive(elem){
    for(let i=0; i<navSettings.clientHeight; i++){
        navSettings[i].className = '';
    }
    elem.className = "active";
}


function changeEditable(e){
    e.preventDefault();
    cancelButton.style.display = "inline";

    confirmButton.disabled = false;
    confirmButton.className = "btn btn-success";

    emailaddress.value = sampleUser.mailAddress;
    emailaddress.readOnly = false;

    username.value = sampleUser.name;
    username.readOnly = false;

    pass.value = sampleUser.password;
    pass.readOnly = false;

    descriptionEditable.value = sampleUser.description;
    descriptionEditable.readOnly = false;
}

function confirmChanges(e){
    e.preventDefault();
    // update User values
    sampleUser.mailAddress = emailaddress.value;
    sampleUser.name = username.value;
    sampleUser.password = pass.value;
    sampleUser.description = descriptionEditable.value;

    // reset buttons
    confirmButton.disabled= true;
    confirmButton.className = "btn btn-secondary";
    cancelButton.style.display = "none";

    //update profile html elements
    profileHeader.innerHTML = sampleUser.name;
    username.innerHTML = sampleUser.name;
    description.innerHTML = sampleUser.description;

    // update editable fields
    username.readOnly = true;
    username.placeholder = sampleUser.name;
    emailaddress.readOnly = true;
    emailaddress.placeholder = sampleUser.mailAddress;
    descriptionEditable.readOnly = true;
    descriptionEditable.placeholder = sampleUser.description;
    ppass.readOnly = true;
}

function cancelChanges(e){
    e.preventDefault();

    username.readOnly = true;
    username.placeholder = sampleUser.name;
    emailaddress.readOnly = true;
    emailaddress.placeholder = sampleUser.mailAddress;
    descriptionEditable.readOnly = true;
    descriptionEditable.placeholder = sampleUser.description;
    pass.readOnly = true;

    confirmButton.disabled= true;
    confirmButton.className = "btn btn-secondary";
    cancelButton.style.display = "none";


}