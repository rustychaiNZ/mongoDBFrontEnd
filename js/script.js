console.log('front end for mongodbIntroduction');

let url;

// Register form variables
let username;
let email;
let password;

function clearPrintOut(){
	document.getElementById('printOut').innerHTML = '';
	$('#loginFormContainer').hide();
	$('#registerNewUserContainer').hide();
}

function clearFields(){
	// Register new user field
	document.getElementById('newUserName').value = '';
	document.getElementById('newEmail').value = '';
	document.getElementById('newPassword').value = '';
	document.getElementById('confirmNewPassword').value = '';

	// Login field
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
}

$('document').ready(function(){
	
	// All hidden sections on intial boot of page
	$('#adminPage').hide();
	$('#loginFormContainer').hide();
	$('#registerNewUserContainer').hide();
	$('#productManipulationContainer').hide();
	
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
								<h3>User ID:</h3>
								<p>${usersFromMongo[i]._id}</p>
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
		$('#registerNewUserContainer').show();

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
		if(enteredPassowrd !== confirmedPassword){
			alert('Make sure passwords match');
		} else{
			password = confirmedPassword;
		}

		console.log(password);

		$.ajax({
			url : `${url}/registerUser`,
			type : 'POST',
			dataType : 'json',
			data : {
				username : username,
				email : email ,
				password : password
			},
			success : function(newUserForMongo){
				console.log(newUserForMongo);
				document.getElementById('printOut').innerHTML += 
					`<div class="col-12>
						<h3>id:${newUserForMongo['_id']} Username: ${newUserForMongo['username']}</h3>
					</div>`

				clearFields();
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

					clearFields();
					alert('log in success');
				}

			}, // success
			error : function(){
				console.log('an error has occured');
			}
		});
	});

	// Logout of account
	$('#logoutBtn').click(function(){
		sessionStorage.clear();
		console.log(sessionStorage);
		alert('Successfully loged out');
	});

	// Checks to see if someone is logged in
	if(sessionStorage['userName']){
		console.log('You are logged in');
	} else{
		console.log('Please log in');
	}

	// Products button press
	$('#productsBtn').click(function(){
		clearPrintOut();
		$('#productManipulationContainer').toggle();
	});

	// Add a new product
	$('#addProduct').click(function(){
		$('#deleteProduct').hide();
		$('#updateProduct').hide();
	});

	// Add a product
	$('#productManipulationForm').submit(function(){
		event.preventDefault();
 
		let productId = $('#productid').val();
		let productName = $('#productName').val();
		let productPrice = $('#productPrice').val();
		let userId = $('#userid').val();

		console.log(productId, productName, productPrice, userId);
 
		$.ajax({
			url : `${url}/addProduct`,
			type : 'POST',
			data : {
				productID : productId , 
				name : productName ,
				price : productPrice , 
				userId : userId
			},
			success : function(data){

			}, 
			error : function(){
				alert('error: ')
			}
		});
	});

	// Modify a product
	$('#productManipulationForm').submit(function(){
		event.preventDefault();

		let productId = $('#productid').val();
		let productName = $('#productName').val();
		let productPrice = $('#productPrice').val();
		let productQuantity = $('#')
		let userId = $('#userid').val();

		console.log(productId, productName, productPrice, userId);

		$.ajax({
			url : `${url}/updateProduct/${productId}`,
			type : 'PATCH',
			data : {
				name : productName ,
				price : productPrice , 
				userId : userId
			},
			success : function(data){
				console.log(data);
				alert(data['name']);
			}, 
			error : function(){
				alert('error: ')
			}
		});
	});

});
// Dcoument ready function ends