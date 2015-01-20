/**
 * Created by Zang on 2015-01-16.
 */
var targetURL = "../../";
var countdownfrom = 6;

function countRedirect(){
    if (countdownfrom!=1){
        countdownfrom-=1;
        var redirect = document.getElementById('redirect');
        if (redirect == null){
            return;
        }
        else{
            redirect.innerHTML = countdownfrom;
        }
    }
    else{
        window.location=targetURL;
        return;
    }
    setTimeout("countRedirect()",1000);
}

countRedirect();