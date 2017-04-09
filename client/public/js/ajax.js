//laeb selle funktsiooni siis kui leht on laetud, ehk nupp on siis olema millele lister külge läheb
window.onload = function(){
    i = 0;

    //kuulame nupu vajutuse eventi click, käivitab saadaAjax
    document.getElementById("nextfact").addEventListener("click", saadaAjax);
    document.getElementById("loadMoreButton").addEventListener("click", moreComments);

}
function saadaAjax() {
    $("#factcontent").load("/facts/next", function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            var info = JSON.parse(responseTxt);
            var currentURL = window.location;
            currentURL.hash = ""+info.id;
            console.log(info);

            document.getElementById("factcontent").innerHTML = info.fact;
            document.getElementById("upvotecount").innerHTML = info.upvotes;
            document.getElementById("downvotecount").innerHTML = info.downvotes;
            document.getElementById("factusername").innerHTML = info.username;
        }

        if (statusTxt == "error") {
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        }
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
                    info.name +
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

