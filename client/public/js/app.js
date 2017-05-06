$(function(){

	$(".showcomments").click(function(){
		$("#comments").toggle();
		loadComments();
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


		/* voting buttons */
		$('#upvote').click(function(){
			console.log('test');
			var fact = $('#factcontainer').data('factid');
			vote(1, fact, voteCallback);

		});
		
		$('#downvote').click(function(){
			var fact = $('#factcontainer').data('factid');
			vote(-1, fact, voteCallback);
		});

		$('#addcommentbutton').click(function(e){
			e.preventDefault();
			var text = $("#commenttext").val();			
			var fact = $('#factcontainer').data('factid');
			if(text.length < 3){
				showMessage('Liiga lühike kommentaar!');	
				return;
			}
			$.ajax({
				type: 'POST',
				url : '/comments',
				data: {comment : text, fact : fact},
				success : function(data){
					if(data.status == 'success'){
						loadComments();	
						$("#commenttext").val('');
					}
				},
				dataType : 'json'
			});	
		})

		/* fact buttons on myfact page */

		$('.delete-fact-button').click(function(){
			var fact_id = $(this).data('id');
			var self = this;
			$.ajax({
				method : 'DELETE',
				url : '/facts/' + fact_id,
				success : function(data){
					if(data.status == 'success'){
						$(self).parent().parent().fadeOut('slow').remove();
					}
				},
				dataType : 'json',
				contentType:'application/json'
			}) 
		});

		/* delete comment */
	$('body').on('click', '.delete-comment-button', function(){
			var comment = $(this).data('id');
			var self = this;
			$.ajax({
				method : 'DELETE',
				url : '/comments/' + comment,
				success : function(data){
					if(data.status == 'success'){
						$(self).parent().parent().fadeOut('slow').remove();
					}
				},
				dataType : 'json',
				contentType:'application/json'
			}) 
		});
});
/*
laod comments*/

function makeComment(username, comment,id){
	return $('<div class="row"><div class="col-md-2 comment-username"><strong>' + username +'</strong></div><div class="col-md-10 comment-comment"> ' + comment +  '<span class="glyphicon glyphicon-remove delete-comment-button" data-id="' + id + '"aria-hidden="true"></span></div></div>')
}

	
function loadComments(){
	var fact = $('#factcontainer').data('factid');



	$.get('/comments/fact/' + fact, function(data){
		if(data.status == 'success'){
	  	 	$(".comments-comments").html('');	
			data.data.forEach(function(el){
				console.log(el);
				$(".comments-comments").append(makeComment(el.username, el.comment, el.id)); 
			});
		}
	});

}

/*update votecounts*/
function voteCallback(data){
	if(data.status == 'error'){
		showMessage(data.message);
		return;
	}
	if(data.status == 'success'){
		if(Number(data.vote) == 1){
			$("#upvotecount").text(Number($("#upvotecount").text()) + 1);
			//$("#downvotecount").text(Number($("#downvotecount").text()) -1);
		}
		else{
			//$("#upvotecount").text(Number($("#upvotecount").text()) - 1);
		    $("#downvotecount").text(Number($("#downvotecount").text()) + 1);
		}
	}
}

function vote(type, fact, success){
	$.ajax({
		type: 'POST',
		url : '/votes',
		data: {type : type, fact: fact},
		success : success,
		dataType : 'json'
	});
}
/**
 * show message on screen 
 * message - message to show
 */
function showMessage(message){
  var elem = $('#app-message');
  var content = elem.children('.message-content'); 
  content.text(message);

  elem.fadeIn();
  setTimeout(function(){
    elem.fadeOut();
  }, 5000);
}