console.log('front end for mongodbIntroduction');

$('document').ready(function(){
	$('#adminPage').hide();
	
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

	// Get all users from back end of server
	$('#viewUserBtn').click(function(){
		console.log('clicked!');
		$.ajax({
			url : 'http://192.168.33.10:3000/allUsers',
			type : 'GET',
			dataType : 'json',
			sucess : function(usersFromMongo){
				console.log(usersFromMongo);
			}, // success
			error : function(){
				alert('error: cannot call api');
			} // error
		});
	});
	// View all users button function ends
});
// Dcoument ready function ends