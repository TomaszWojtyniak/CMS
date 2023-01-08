
(function($) {

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


	$("#sign_up_button").on("click", function() {
		isLoginPage = !isLoginPage;
		toggleLoginView(isLoginPage);
	});

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


})(jQuery);
