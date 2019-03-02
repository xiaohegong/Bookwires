const log = console.log;

function tryToLogin() {
	log(fakeUser)
	const userNameInput = document.getElementById('userName')
	const userName = userNameInput.value
	
	const userPassWordInput = document.getElementById('passWord')
	const passWord = userPassWordInput.value

	let foundUser = 0;
	for(let i = 1; i<=numberOfUsers ; i++){
		if(fakeUser[i-1].name == userName){
			foundUser = 1;
			if(fakeUser[i-1].passWord == passWord){
				currentUserId = i;
				window.location.href = "index.html"
			}else{
				alert("Wrong password")
			}
		}
	}
	if(!foundUser){
		alert("This account do not exist")
	}
	
	
}

