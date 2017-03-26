$(function(){
	$(".showcomments").click(function(){
		$("#comments").toggle();
	});


	$('#login-form-link').click(function(e) {
        	$("#login-form").delay(100).fadeIn(100);
     		$("#register-form").fadeOut(100);
    		$('#register-form-link').removeClass('active');
    		$(this).addClass('active');
    		e.preventDefault();
    	});
    	$('#register-form-link').click(function(e) {
    		$("#register-form").delay(100).fadeIn(100);
     		$("#login-form").fadeOut(100);
    		$('#login-form-link').removeClass('active');
    		$(this).addClass('active');
    		e.preventDefault();
    	});
    	$(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });

		$("#bestof-interval").change(function(e){
			window.location.search = "time=" + $(this).val();
		});
});

function vote(type, fact, success){
	$.ajax({
		type: 'POST',
		url : '/votes',
		data: {type : type, fact: fact},
		success : success,
		dataType : 'json'
	});
}

function showMessage(message){
  var elem = $('#app-message');
  var content = elem.children('.message-content'); 
  content.text(message);

  elem.fadeIn();
  setTimeout(function(){
    elem.fadeOut();
  }, 5000);
}