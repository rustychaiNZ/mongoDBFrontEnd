console.log('front end for mongodbIntroduction');

let url;

// Register form variables
let username = '';
let email = '';
let password = '';
let enteredPassowrd = '';
let confirmedPassword = '';

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

	// Add product
	document.getElementById('addProductName').value = '';
	document.getElementById('addProductPrice').value = '';
	document.getElementById('addProductQuantity').value = '';
}

// Hide buttons other than login in on start up
function hideAllBtnFunction(){
	$('#logoutBtn').hide();
	$('#viewUserBtn').hide();
	$('#productsBtn').hide();
}

// Show admin buttons
function showAllBtnFunction(){
	$('#logoutBtn').show();
	$('#viewUserBtn').show();
	$('#productsBtn').show();
}

$('document').ready(function(){

	// All hidden sections on intial boot of page
	$('#adminPage').hide();
	$('#loginFormContainer').hide();
	$('#registerNewUserContainer').hide();
	$('#productManipulationContainer').hide();
	$('#addProductForm').hide();
	$('#productManipulationForm').hide();
	hideAllBtnFunction();
	
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

	// Checks to see if someone is logged in
	if(sessionStorage.setItem['userName']){
		console.log('You are logged in');

	} else{
		console.log('Please log in');
	}

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
		$('#productManipulationContainer').hide();
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
		$('#productManipulationContainer').hide();
		// Form ends for registering a new user
	});

	// Register new user button click function
	$('#registerForm').submit(function(){
		// Stops the page from going to end point
		event.preventDefault();

		// Gets user input from form fields
		username = document.getElementById('newUserName').value;
		email = document.getElementById('newEmail').value;

		enteredPassowrd = document.getElementById('newPassword').value;
		confirmedPassword = document.getElementById('confirmNewPassword').value;

		// Validates to make sure that the user has entered the right password
		if(enteredPassowrd !== confirmedPassword){
			alert('Make sure passwords match');
		} else{

			password = confirmedPassword;

			// Conditional statement that ensures that the user has filled out all of the fields
			if((username !== '') && (email !== '') && (password !== '')){
			
				// Ajax will only post new user to DB if validated
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
						clearFields();
					},
					error : function(newUserForMongo){
						console.log('Already an exsisting member');
					}
				});
			} else{
				alert('Fillout all fields');
			}
		}
	});
	// Register new user button ends

	// Log into an exsisting account
	$('#loginBtn').click(function(){
		clearPrintOut();
		$('#loginFormContainer').toggle();
		$('#productManipulationContainer').hide();
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
				
				if(loginData === 'User is not found. Please register'){
					alert('Please register an account with us');
				} else if(loginData === 'not authorized'){
					alert('Incorrect user name or password');
				} else{
					sessionStorage.setItem('userId', loginData['_id']);
					sessionStorage.setItem('userName', loginData['username']);
					sessionStorage.setItem('email', loginData['email']);
					console.log(sessionStorage);

					clearFields();
					alert('log in success');
					showAllBtnFunction();
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
		hideAllBtnFunction();
		$('#productManipulationContainer').hide();
		clearPrintOut();
	});

	// Products button press
	$('#productsBtn').click(function(){
		clearPrintOut();
		$('#productManipulationContainer').toggle();
	});

	// Add a new product
	$('#addProduct').click(function(){
		clearPrintOut();
		$('#productManipulationForm').hide();
		$('#addProductForm').show();
	});

	// Add a product
	$('#addProductForm').submit(function(){
		event.preventDefault();
 		
 		let productName = $('#addProductName').val();
		let productPrice = $('#addProductPrice').val();
		let productQuantity = $('#addProductQuantity').val();
		let userId = sessionStorage.getItem('userId');

		console.log(productName, productPrice, userId);
 
		$.ajax({
			url : `${url}/addProduct`,
			type : 'POST',
			data : { 
				productName : productName ,
				quantity : productQuantity ,
				price : productPrice , 
				user_id : userId
			},
			success : function(data){
				clearFields();
			}, 
			error : function(){
				alert('error: ')
			}
		});
	});

	// Delte product button press
	$('#deleteProduct').click(function(){
		clearPrintOut();
		$('#productManipulationForm').hide();
		$('#addProductForm').hide();

		// Dynamically creates list of products from data base
		$.ajax({
			url : `${url}/viewProducts`,
			type : 'GET',
			dataType : 'json',
			success : function(productsFromMongo){
				console.log(productsFromMongo);
				for(var i = 0; i < productsFromMongo.length; i++){
					document.getElementById('printOut').innerHTML += 
					`<div class="col-6 d-flex align-self-stretch py-3"> 
						<div class="card" style="width: 100%;">
							<div class="card-body">
								<h3>Product ID:</h3>
								<p>${productsFromMongo[i]._id}</p>
								<h3>Product Name:</h3>
								<p class="product-name">${productsFromMongo[i].productName}</p>
							</div>
							<div class="card-footer">
								<button id="${productsFromMongo[i]._id}" class="btn btn-danger delete-product">Delete</button>
							</div>
						</div>
					</div>`;
					deleteProductButtonClick();
				}
			}, // success
			error : function(){
				console.log('error: cannot call api');
			} // error
		});
	});

	// When clicking delete on card in delete product section
	function deleteProductButtonClick(){
		$('.delete-product').on('click', function(){
			console.log('success');
	
			let productToDeleteId = this.id;
			let productToDeleteName = document.getElementsByClassName('product-name');
	
			if(this.id === productToDeleteId){
				console.log(`Deleted ${productToDeleteName}`);
				$.ajax({
					url : `${url}/deleteProduct/${productToDeleteId}`,
					type : 'DELETE',
					dataType : 'json',
					success : function(){
						alert(`${productToDeleteName} has been deleted`)
					}, // success
					error : function(){
						console.log('error: cannot call api');
					} // error
				});
			}
		});
	}

	// Update product button press
	$('#updateProduct').click(function(){
		$('#addProductForm').hide();
		$('#productManipulationForm').show();
	});

	// Modify a product
	$('#productManipulationForm').submit(function(){
		event.preventDefault();

		let productId = $('#productid').val();
		let productName = $('#productName').val();
		let productPrice = $('#productPrice').val();
		let productQuantity = $('#productQuantity').val();
		let userId = $('#userid').val();

		console.log(productId, productName, productPrice, productQuantity, userId);

		$.ajax({
			url : `${url}/updateProduct/${productId}`,
			type : 'PATCH',
			data : {
				name : productName,
				quantity : productQuantity,
				price : productPrice,
				userId : userId
			},
			success : function(data){
				console.log(data);
			}, 
			error : function(){
				alert('error: ')
			}
		});
	});

	// View all products button press
	$('#viewProduct').click(function(){
		$('#addProductForm').hide();
		$('#productManipulationForm').hide();
		clearPrintOut();

		// Adding a new product to database
		$.ajax({
			url : `${url}/viewProducts`,
			type : 'GET',
			dataType : 'json',
			success : function(productsFromMongo){
				console.log(productsFromMongo);
				for(var i = 0; i < productsFromMongo.length; i++){
					document.getElementById('printOut').innerHTML += 
					`<div class="col-6 d-flex align-self-stretch py-3"> 
						<div class="card" style="width: 100%;">
							<div class="card-body">
								<h3>Product ID:</h3>
								<p>${productsFromMongo[i]._id}</p>
								<h3>Product Name:</h3>
								<p>${productsFromMongo[i].productName}</p>
								<h3># of product</h3>
								<p>${productsFromMongo[i].quantity}</p>
								<h3>Price of product</h3>
								<p>${productsFromMongo[i].price}</p>
								<h3>User in charge ID:</h3>
								<p>${productsFromMongo[i].user_id}</p>
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

});
// Dcoument ready function ends