console.log('front end for mongodbIntroduction');

let url;

// Register form variables
let username;
let email;
let password;

function clearPrintOut(){
	document.getElementById('printOut').innerHTML = '';
}

$('document').ready(function(){
	$('#adminPage').hide();
	$('#loginFormContainer').hide();
	
	// Admin button function
	$('#adminBtn').click(function(){
		$('#adminPage').toggle();
		$('#homePage').hide();
	});

	// Home button function
	$('#homeBtn').click(function(){
		$('#homePage').toggle();
		$('#adminPage').hide();
	});

	// Get url and prot from config.json
	$.ajax({
		url : 'js/config.json',
		type : 'GET',
		dataType : 'json',
		success : function(configData){
			console.log(configData);
			url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
			console.log(url);
		},
		error : function(){
			console.log('Failed to get url for mongoDB');
		}
	});

	// Get all users from back end of server
	$('#viewUserBtn').click(function(){
		clearPrintOut();
		console.log('clicked!');
		$.ajax({
			url : `${url}/allUsers`,
			type : 'GET',
			dataType : 'json',
			success : function(usersFromMongo){
				console.log(usersFromMongo);
				for(var i = 0; i < usersFromMongo.length; i++){
					document.getElementById('printOut').innerHTML += 
					`<div class="col-6 d-flex align-self-stretch py-3"> 
						<div class="card" style="width: 100%;">
							<div class="card-body">
								<h3>User Name:</h3>
								<p>${usersFromMongo[i].username}</p>
								<h3>Email:</h3>
								<p>${usersFromMongo[i].email}</p>
								<h3>Password:</h3>
								<p>${usersFromMongo[i].password}</p>
							</div>
						</div>
					</div>`
				}
			}, // success
			error : function(){
				console.log('error: cannot call api');
			} // error
		});
	});
	// View all users button function ends

	// Register a new user form button
	$('#registerBtn').click(function(){
		clearPrintOut();
		// Creates register new user form
		document.getElementById('printOut').innerHTML +=
			`<div class="col-12 py-2">
				<form id="registerForm">
					<label for="newUserName">User Name:</label>
					<input name="newUserName" type="text" id="newUserName" class="form-control" placeholder="User name">
					<label for="newEmail">Email Address:</label>
					<input name="newEmail" type="text" id="newEmail" class="form-control" placeholder="Email Addrss">
					<label for="newPassword">Password:</label>
					<input name="newPassword" type="password" id="newPassword" class="form-control" placeholder="Password">
					<label for="confirmNewPassword">Confirm Password:</label>
					<input name="confirmNewPassword" type="password" id="confirmNewPassword" class="form-control" placeholder="confirm password">

					<input id="registerNewUserBtn" name="registerNewUserBtn" type="submit" value="submit" class="btn btn-block btn-success my-3">
				</form>
			</div>`
		// Form ends for registering a new user
	});

	// Register new user button click function
	$('#registerForm').submit(function(){
		// Stops the page from going to end point
		event.preventDefault();

		// Gets user input from form fields
		username = document.getElementById('newUserName').value;
		email = document.getElementById('newEmail').value;

		var enteredPassowrd = document.getElementById('newPassword').value;
		var confirmedPassword = document.getElementById('confirmNewPassword').value;

		// Validates to make sure that the user has entered the right password
		if(enteredPassowrd === confirmNewPassword){
			password = confirmNewPassword;
		} else{
			alert('Make sure passwords match');
		}

		$.ajax({
			url : `${url}/registerUser`,
			type : 'POST',
			dataType : 'json',
			data : $('#registerForm').serialize(),
			success : function(newUserForMongo){
				// var user = {
					// newUserForMongo.username = username;
					// newUserForMongo.email = email;
					// newUserForMongo.password = password;
				// }
				console.log(newUserForMongo);
			},
			error : function(){
				alert('Something went wrong!');
			}
		});
	});
	// Register new user button ends

	// Log into an exsisting account
	$('#loginBtn').click(function(){
		clearPrintOut();
		$('#loginFormContainer').toggle();
	});

	// Login to an exsisting user on button click
	$('#loginForm').submit(function(){
		// Stops the page from going to end point
		event.preventDefault();
		username = $('#username').val();
		password = $('#password').val();
		console.log(username,password);

		$.ajax({
			url : `${url}/loginUser`,
			type : 'POST',
			data : {
				username : username , 
				password : password
			},
			success : function(loginData){
				console.log(loginData);
				
				if(loginData === 'User is not found. Please register'){
					alert('Please register an account with us');
				} else{
					sessionStorage.setItem('userId', loginData['_id']);
					sessionStorage.setItem('userName', loginData['username']);
					sessionStorage.setItem('email', loginData['email']);
					console.log(sessionStorage);
				}

			}, // success
			error : function(){
				console.log('an error has occured');
			}
		});
	});

});
// Dcoument ready function ends