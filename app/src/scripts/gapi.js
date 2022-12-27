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