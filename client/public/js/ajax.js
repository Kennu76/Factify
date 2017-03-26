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
            //parser = new JSONParser();
            //json = (JSONObject) parser.parse(stringToParse);
            //console.log(json);
            //alert("External content loaded successfully!");
            //console.log(responseTxt);
            var response = responseTxt.split(":");
            //console.log(response);

            // fact
            var factR = response[1].split(",");
            var factRe = factR[0].split("#");
            var factRes = factRe[1].substring(2, (factRe[1].length - 1));

            // Username
            var usernameR = response[2].split(",");
            var username = usernameR[0].substring(1, usernameR[0].length - 1);

            // Upvote nr
            var upvote = response[4].split(",");
            if (upvote[0].length == 4) {
                upvote = upvote[0].substring(0, 3);
            }
            else if (upvote[0].length == 3) {
                upvote = upvote[0].substring(0, 2);
            }
            else {
                upvote = upvote[0].substring(0, 1);
            }

            // Downvote nr
            var downvote;
            if (response[5].length == 4) {
                downvote = response[5].substring(0, 3);
            }
            else if (response[5].length == 3) {
                downvote = response[5].substring(0, 2);
            }
            else {
                downvote = response[5].substring(0, 1);
            }
            var currentURL = window.location;

            currentURL.hash = "#Fact: " + factRes;

            //console.log(response);
            //console.log(factRes);
            document.getElementById("factcontent").innerHTML = factRes;
            document.getElementById("upvotecount").innerHTML = upvote;
            document.getElementById("downvotecount").innerHTML = downvote;
            document.getElementById("factusername").innerHTML = username;
            //document.getElementById("date").innerHTML = new Date(response.timestamp);
            console.log(responseTxt);
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

                var response = responseTxt.split(":");
                var comments = response[1].split(",");
                var comment = comments[0].substring(1, comments[0].length-2);
                var names = response[2].split(",");
                var name = names[0].substring(1, names[0].length-2);

                $("#commentSection").append("<div class='row'>" +
                    "<div class='col-md-2'>" +
                        "<strong>" +
                    name +
                    "</strong>" +
                            "</div>" +
                        "<div class='col-md-10'>" +
                        comment +
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

