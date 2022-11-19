function noAcc(){
    document.getElementById("player-username").innerHTML="!player_login";
    document.getElementById('menu-popup').innerHTML=""
    document.getElementById('login-popup').style.display="block;"
}

function createSocket(){

}

function openGadgets(){
    document.getElementById('menu-popup').style.display="block;"

}

function customize(){

}

function init(){
    let token = localStorage.getItem("token")
    if (!token) {
        noAcc()
        return
    }

    let url = 'http://localhost:3000/acc/'
    let req = new XMLHttpRequest()
    req.open("GET", url, true)
    req.setRequestHeader('token', token)
    req.send()
    req.onload = function(){
        if (req.status == 404) {
            noAcc()
            return
        }

        let struser = `${req.response}`,
            user = JSON.parse(struser),
            username = user[0].username
        
        document.getElementById('player-username').innerHTML=username
    }
}


window.onload = init()