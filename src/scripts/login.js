function onSuccess(googleUser) {
    console.log('Logged in as:' + googleUser.getBasicProfile().getName());
}

function onFaliure(error) {
    console.log(error)
}
function renderButton(){
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onFailure': onFaliure
    })
}

async function loginBySubmit(){
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    if (username == '' || password == '') { 
        alert('Error, no username/password given'); 
        return;
    }

    let url = `http://localhost:3000/acc/${username}`
    let request = new XMLHttpRequest()
    request.open("GET", url. true);
    request.setRequestHeader('password', password)
    request.send()
    request.onload = function(){
        let jsonResponse = `${request.response}`
        if (request.status == 403) {
            alert('Incorrect Password');
            return
        }
        alert(jsonResponse)
        let parsedRes = JSON.parse(jsonResponse)
        let newWindow = window.open(`https://dorrito5653.github.io/wmw-execute/src/game.html`)
        newWindow.localStorage.setItem('sessionId', `${parsedRes[0].sessionId}`)
    }
}