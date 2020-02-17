document.addEventListener("DOMContentLoaded", postLoad);

const loginURL = 'http://localhost:3000/login';
const usersURL = 'http://localhost:3000/users/';
const mainURL = 'http://localhost:3001/';
let login;
let signUp;
let logout;
let startingButtons;
let loggedInButtons;
let currentUserId;
let deleteButton;
let header;
let guest;

function postLoad() {
    guest = document.querySelector('.guest-login');
    login = document.querySelector('.login');
    loginForm = document.getElementById('login');
    signUp = document.querySelector('.sign-up');
    signUpForm = document.getElementById('sign-up');
    logout = document.querySelector('.logout')
    deleteButton = document.querySelector('.delete-account')
    header = document.querySelector('header')

    checkUser();
    eventListeners();
}

function checkUser(){
    if(localStorage.token){
        hidelogInButtons();
        scrollToTop();
        showloggedInButtons();

        currentUserId = localStorage.getItem('id')
        const currentUser = localStorage.getItem('name')
        const currentToken = localStorage.getItem('token')

        // displayUserStats();

        deleteButton.addEventListener('click', () => deleteAccount(event))
        logout.addEventListener('click', () => logoutUser(event))
    }
}

function hidelogInButtons(){
    loggedInButtons = document.querySelector('.logged-in-buttons')
    
    loggedInButtons.style.display = "block"
    loginForm.style.visibility = "hidden"
    signUpForm.style.visibility = "hidden"
}

function showloggedInButtons(){
    currentUserId = localStorage.getItem('id')
    startingButtons = document.querySelector('.starting-buttons')

    if (currentUserId == 30){
        deleteButton.style.display = "none"
    } 

    startingButtons.style.display = "none"
    header.style.visibility = "visible"
}
  
function logoutUser(event){
    event.preventDefault();

    localStorage.clear();

    logout.style.visibility = "none"
    login.style.visibility = "block"
    signUp.style.visibility = "block"

    reloadPage();
}

function deleteAccount(event){
    event.preventDefault();

    loggedInButtons.style.display = "none"
    startingButtons.style.display = "block"

    localStorage.clear();
    reloadPage();
    deleteUser(currentUserId);
}

function eventListeners(){
    login.addEventListener('click', () => scrollToForm(loginForm));
    signUp.addEventListener('click', () => scrollToForm(signUpForm));
    guest.addEventListener('click', guestLogin)

    loginForm.addEventListener('submit', loginUser);
    signUpForm.addEventListener('submit', signUpUser);
}

function scrollToForm(form) {
    // make it so if login is chosen and then sign up only one shows 
    form.style.visibility = "visible"
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

function scrollToTop(){
    header.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

function guestLogin(){
    event.preventDefault();

    const username = 'Guest'
    const password = 'Guest'
    const body = JSON.stringify({ user: {username, password} })

    fetchCall(loginURL, 'POST', body)
        .then(parseJSON)
        .then(extractData)
        .then(checkUser)
}

function loginUser(event){
    event.preventDefault();
    loginForm.style.visibility = "hidden"

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

function displayUserStats(){
    console.log("hit")
}

function deleteUser(id){
    fetchCall(`${usersURL}${id}`, 'DELETE')
}

function reloadPage(){
    window.location.replace(mainURL)
}

function extractData(result){
    return result.error 
    ? (alert(result.error)) 
    : (localStorage.setItem('token', result.token), 
        localStorage.setItem('username', result.user.username), 
        localStorage.setItem('name', result.user.name), 
        localStorage.setItem('id', result.user.id), 
        localStorage.setItem('puckhead total points', result.user.puckheadTotalPoints))
}

function fetchCall(url, method, body) {
    const headers = { "Content-Type": "application/json" }
    return fetch(url, { method, headers, body })
}

function parseJSON(response){
    return response.json();
}
