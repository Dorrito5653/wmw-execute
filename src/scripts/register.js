async function registerBySubmit(){
    let email = document.querySelector('#email').value
    let password = document.querySelector('#username').value
    let username = document.querySelector('#password').value

    if (validateEmail(email) == false) {
        alert('Invalid Email')
        return
    }

    if (validatePassword(password) == false) {
        alert('Passwords must be minimum 8 characters long, contain 1 capital, 1 lowercase, and 1 special character')
        return
    }

    if (validateUsername(username) == false) {
        alert('Usernames must be 4 to 20 characters long')
    }
}

function validateEmail(email){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (email.match(mailformat)) {
        return true
    } else {
        return false
    }
}

function validatePassword(pass) {
    var passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
    if (pass.match(passwordregex)) {
        return true
    } else {
        return false
    }
}

function validateUsername(username) {
    if (username.length < 4 || username.length > 20) {
        return false
    } else return true
}