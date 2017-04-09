//laeb selle funktsiooni siis kui leht on laetud, ehk nupp on siis olema millele lister külge läheb
window.onload = function(){
    i = 0;

    //kuulame nupu vajutuse eventi click, käivitab saadaAjax
    document.getElementById("nextfact").addEventListener("click", saadaAjax);
    document.getElementById("loadMoreButton").addEventListener("click", moreComments);

}
function saadaAjax() {
    $("#factcontent").load("/fact/next", function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {
            var info = JSON.parse(responseTxt);
            var currentURL = window.location;
            currentURL.hash = ""+info.fact;

            document.getElementById("factcontent").innerHTML = info.fact;
            document.getElementById("upvotecount").innerHTML = info.votes;
            document.getElementById("downvotecount").innerHTML = info.downvotes;
            document.getElementById("factusername").innerHTML = info.user;
            //document.getElementById("date").innerHTML = new Date(response.timestamp);
            //console.log(responseTxt);
        }

        if (statusTxt == "error") {
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        }
    });
}


    function moreComments(){
        var numberOfComments = 9;
        var start = 3;

        // Algselt tuleks loadMoreButton nupp ära kaotada, sest hetkel me ei tea, kas baasi jäi veel kirjeid.
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

