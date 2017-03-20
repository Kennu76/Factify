

//laeb selle funktsiooni siis kui leht on laetud, ehk nupp on siis olema millele lister külge läheb
window.onload = function(){
    //kuulame nupu vajutuse eventi click, käivitab saadaAjax
    document.getElementById("nextfact").addEventListener("click", saadaAjax);

}
function saadaAjax() {
    $("#factcontent").load("/fact/next", function (responseTxt, statusTxt, xhr) {
        if (statusTxt == "success") {

            //alert("External content loaded successfully!");
            var response = responseTxt.split(":");
            var factR = response[1].split(",");
            var factRe = factR[0].split("#");
            var factRes = factRe[1].substring(2,(factRe[1].length-1));
            var upvote;
            var usernameR = response[2].split(",");
            var username = usernameR[0].substring(1,usernameR[0].length-1);
            if(response[4].length == 4){
                upvote = response[4].substring(0,3);
            }
            else if(response[4].length == 3){
                upvote = response[4].substring(0,2);
            }
            else{
                upvote = response[4].substring(0,1);
            }
            //console.log(response);
            //console.log(factRes);
            document.getElementById("factcontent").innerHTML = factRes;
            document.getElementById("upvotecount").innerHTML = upvote;
            document.getElementById("factusername").innerHTML = username;
            //document.getElementById("date").innerHTML = new Date(response.timestamp);
            console.log(responseTxt);
        }

        if (statusTxt == "error") {
            alert("Error: " + xhr.status + ": " + xhr.statusText);
        }
    });
}

