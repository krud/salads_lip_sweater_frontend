document.addEventListener("DOMContentLoaded", postLoad);

const loginURL = 'http://localhost:3000/login';
const usersURL = 'http://localhost:3000/users';
const mainURL = 'http://localhost:3001/';
let login;
let signUp;
let logout;
let header;

function postLoad() {
    login = document.querySelector('.login');
    loginForm = document.getElementById('login');
    signUp = document.querySelector('.sign-up');
    signUpForm = document.getElementById('sign-up');
    logout = document.querySelector('.logout')
    header = document.querySelector('header')

    checkUser();
    eventListeners();
}

function checkUser(){
    if(localStorage.token){
        logout.style.display = "block"
        login.style.display = "none"
        signUp.style.display = "none"
        // loginForm.style.display = "none"
        loginForm.style.visibility = "hidden"
        // signUpForm.style.display = "none"
        signUpForm.style.visibility = "hidden"
        header.style.visibility = "visible"

        scrollToTop(header)

        logout.addEventListener('click', () => logoutUser(event))
    }
}
  
function logoutUser(event){
    event.preventDefault();

    localStorage.clear();
    // localStorage.removeItem('token')
    // localStorage.removeItem('username')
    // localStorage.removeItem('password')
    // localStorage.removeItem('name')
    // localStorage.removeItem('id')

    logout.style.visibility = "none"
    login.style.visibility = "block"
    signUp.style.visibility = "block"


    // logout.style.visibility = "none"
    // login.style.visibility = "block"
    // signUp.style.visibility = "block"

    reloadPage();
}

function eventListeners(){
    login.addEventListener('click', () => scrollToForm(loginForm));
    signUp.addEventListener('click', () => scrollToForm(signUpForm));

    loginForm.addEventListener('submit', loginUser);
    signUpForm.addEventListener('submit', signUpUser);
}

function scrollToForm(form) {
    // make it so if login is chosen and then sign up only one shows 
    // form.style.display = "block"
    form.style.visibility = "visible"
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

function scrollToTop(form){
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

function loginUser(event){
    event.preventDefault();

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')

    const body = JSON.stringify({ user: {username, password} })

    fetchCall(loginURL, 'POST', body)
        .then(parseJSON)
        .then(extractData)
        .then(checkUser)
}

function signUpUser(event){
    event.preventDefault();
      
    const formData = new FormData(event.target)
    const name = formData.get('name')
    const username = formData.get('username')
    const password = formData.get('password')
    
    const body = JSON.stringify({ user: {name, username, password} })

    fetchCall(usersURL, 'POST', body)
        .then(parseJSON)
        .then(extractData)
        .then(checkUser)
    // const currentUser = localStorage.getItem('current user')
    // const currentToken = localStorage.getItem('token')
    // reloadPage();
}

function reloadPage(){
    window.location.replace(mainURL)
}

function extractData(result){
    return result.error ? (alert(result.error)) : (localStorage.setItem('token', result.token), localStorage.setItem('username', result.user.username), localStorage.setItem('name', result.user.name), localStorage.setItem('id', result.user.id), localStorage.setItem('puckhead points', result.user.puckheadTotalPoints))
}

function fetchCall(url, method, body) {
    const headers = { "Content-Type": "application/json" }
    return fetch(url, { method, headers, body })
}

function parseJSON(response){
    return response.json();
}
