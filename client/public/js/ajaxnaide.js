

//laeb selle funktsiooni siis kui leht on laetud, ehk nupp on siis olema millele lister külge läheb
window.onload = function(){
    //kuulame nupu vajutuse eventi click, käivitab saadaAjax
    document.getElementById("nupp").addEventListener("click", saadaAjax);
}


function saadaAjax(){
    //uus xhr objekt
    var ajaxReq = new XMLHttpRequest();

    //kui päringu staatus muutub käivitab funktsiooni
    ajaxReq.onreadystatechange = function() {

        //kontrollib state'i, 4 tähendab et tehtud
        if (this.readyState == 4) {
            //siin peaks veel kontrollima kas staatus ja vastus korrektsed
            console.log(ajaxReq.response);
            //teeb tekstist javascripti objekti
            var response = JSON.parse((ajaxReq.response));

            //kuvab konsoolis mis reponsis kirjas (f12 chrome's saab konsooli)
            console.log(response);

            //muudab lehel
            document.getElementById("fact").innerHTML  = response.fact;
            document.getElementById("votes").innerHTML = response.votes;
            document.getElementById("user").innerHTML  = response.user;
            document.getElementById("date").innerHTML  = new Date(response.timestamp);
        }
    };

    //avab päringu, paneb headerid paika
    //GET tähendab HTTP päringu tüüpi ja /fact/next on aadress kuhu päring läheb ehk
    // praegu läheb localhost/fact/next, kus server tagastab suvalise fakti
    ajaxReq.open("GET", "/fact/next", true);

    //saadab päringu serverisse
    ajaxReq.send();
}
