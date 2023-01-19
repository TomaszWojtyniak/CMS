
$(function(){

	"use strict";

	var isLoginPage = true;

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$(".toggle-password").click(function() {

	  $(this).toggleClass("fa-eye fa-eye-slash");
	  var input = $($(this).attr("toggle"));
	  if (input.attr("type") == "password") {
	    input.attr("type", "text");
	  } else {
	    input.attr("type", "password");
	  }
	});
	
	if(isLoginPage) {
		$("#confirm_password_button").hide()
	}

	$("#sign_in_button").on("click", function() {
		if(isLoginPage) {
			login();
		} else {
			register();
		}
	})


	$("#sign_up_button").on("click", function() {
		isLoginPage = !isLoginPage;
		toggleLoginView(isLoginPage);
	});

	function login() {
		var username = $("#username-field").val();
		var password = $("#password-field").val();
		$.ajax({
			type: "POST",
			url: "http://localhost:3000/login",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({
				"username": username,
				"password": password
			}),
			success: function(data){
				sessionStorage.setItem("access_token", data.access_token);
				sessionStorage.setItem("username", username);
				window.location.replace("../../site/index.html");
			 },
			 error: function(xhr, textStatus, error){
				 alert("error")
			 }
		});

	}

	function register() {
		var username = $("#username-field").val();
		var password = $("#password-field").val();
		var confirm_password = $("#confirm_password-field").val();
		if (password == confirm_password) {
			$.ajax({
				type: "POST",
				url: "http://localhost:3000/register",
				contentType: "application/json",
				dataType: 'json',
				data: JSON.stringify({
					"username": username,
					"password": password
				}),
				success: function(){
					alert("Registration successfull");
					login();
				},
				error: function(xhr, textStatus, error){
					alert("error")
				}
	
			})
		} else {
			alert("Password and Confirm password dont match")
		}
	}

	function toggleLoginView (loginViewState) {
		if (loginViewState == true) {
			$(".heading-section").text("Login");
			$("#account_text").text("Have an account?")
			$("#sign_in_button").text("Sign In")
			$("#confirm_password_button").hide()
			$("#sign_up_button").text("Click here to Sign Up")
		} else {
			$(".heading-section").text("Register");
			$("#account_text").text("Don't have an account?")
			$("#sign_in_button").text("Sign Up")
			$("#confirm_password_button").show()
			$("#sign_up_button").text("Click here to Sign In")
		}
	}


});
