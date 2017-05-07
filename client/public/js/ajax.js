//laeb selle funktsiooni siis kui leht on laetud, ehk nupp on siis olema millele lister külge läheb
window.onload = function(){
    i = 0;
    if($('#nextfact').length == 0)
        return false;
    //kuulame nupu vajutuse eventi click, käivitab saadaAjax
    //document.getElementById("nextfact").addEventListener("click", saadaAjax);
    $('#nextfact').click(saadaAjax);
    //document.getElementById("loadMoreButton").addEventListener("click", moreComments);
    if(window.location.hash != '' && window.location.hash != '#'){
        var fact = window.location.hash;
        loadFact(fact.replace("#","")); 
        return;
    }
    saadaAjax();

}

function loadFact(fact){
    $.get("/facts/" + fact, function(data){
           if(data.status == 'error')
                return; 
           $("#comments").hide();
           $(".comments-comments").html('');
           $("#factcontainer").data('factid', data.fact_id); 
           document.getElementById("factcontent").innerHTML = data.fact;
           document.getElementById("upvotecount").innerHTML = data.upvotes;
           document.getElementById("downvotecount").innerHTML = data.downvotes;
           document.getElementById("factusername").innerHTML = data.username;
    });
}

function saadaAjax() {
    $.get("/facts/next", function (data) {
           window.location.hash = data.fact_id;
           $("#comments").hide();
           $(".comments-comments").html('');
           $("#factcontainer").data('factid', data.fact_id); 
           document.getElementById("factcontent").innerHTML = data.fact;
           document.getElementById("upvotecount").innerHTML = data.upvotes;
           document.getElementById("downvotecount").innerHTML = data.downvotes;
           document.getElementById("factusername").innerHTML = data.username;
    });
}


    function moreComments(){
        var numberOfComments = 9;
        var start = 3;

        $('#loadMoreButton').hide();
        $("#comment-1").load("/comment/next", function (responseTxt, statusTxt, xhr) {
            if (statusTxt == "success") {
                var info = JSON.parse(responseTxt);
                console.log(info);
                document.getElementById("comment-1").innerHTML = "Kasutaja1 kommentaar";

                $("#commentSection").append("<div class='row'>" +
                    "<div class='col-md-2'>" +
                        "<strong>" +
                    info.user +
                    "</strong>" +
                            "</div>" +
                        "<div class='col-md-10'>" +
                        info.comment +
                        "</div>" +
                    "</div>");

            }

            if (statusTxt == "error") {
                alert("Error: " + xhr.status + ": " + xhr.statusText);
            }
            if(i<numberOfComments-start){
                i++;
                $('#loadMoreButton').show();
            }




        });

}

