const log = console.log

function tryToSignUp(){
	const userNameInput = document.getElementById("userName");
	const passWordInput = document.getElementById("passWord");
	const userMailInput = document.getElementById("mail");
	const passWConfirmInput = document.getElementById("passWordConfirm");
	
	const userName = userNameInput.value;
	const passWord = passWordInput.value;
	const passWCon = passWConfirmInput.value;
	const userMail = userMailInput.value;
	
	if(passWCon!=passWord){
		alert("Two inputs of password not match, please input again")
		return
	}
	
	for(let i = 1; i<=numberOfUsers ; i++){
		if(fakeUser[i-1].name == userName){
			alert("This account already exist, please change another userName")
			return
		}
	}
	
	fakeUser.push(userCreater(userName,userMail,passWord))
	log(fakeUser)
	alert("New account created, sign up completed")
}