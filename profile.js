'use strict';

class User{
    constructor(email, firstName, lastName, password, profileImagePath, description) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.profileImagePath = profileImagePath;
        this.description = description;
        this.books
      }
}

const user = new User("cbarkowski@domain.com", "Charles", "Barkowski", "woof", "img/dog.jpeg", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, consequuntur atque blanditiis, omnis ipsum autem distinctio fugiat cumque minima odio ducimus maxime enim, facere voluptas repudiandae in. Aliquam, aperiam? Saepe.");

function setUpUserPage(){
    const profileHeader = document.querySelector(".profileheader");
}

const mainContent = document.querySelector("#main-content-containter");
const navSettings = document.querySelector(".nav").children;

const shelfButton = navSettings[0];

shelfButton.addEventListener('click', setUpShelf);



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