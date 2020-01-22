document.addEventListener("DOMContentLoaded", postLoad);

const loginURL = 'http://localhost:3000/login';
const usersURL = 'http://localhost:3000/users';
const mainURL = 'http://localhost:3001/';
let login;
let signUp;
let logout;

function postLoad() {
    login = document.querySelector('.login');
    loginForm = document.getElementById('login');
    signUp = document.querySelector('.sign-up');
    signUpForm = document.getElementById('sign-up');
    logout = document.querySelector('.logout')

    checkUser();
    eventListeners();
}

function checkUser(){
    if(localStorage.token){
        logout.style.display = "block"
        login.style.display = "none"
        signUp.style.display = "none"
        loginForm.style.display = "none"
        signUpForm.style.display = "none"

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
    form.style.display = "block"
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


// // const mainURL = "http://localhost:3000";
// const playerURL = "http://localhost:3000/players";

// let gameMenu;
// let gameContainer;
// let categoryDropdown;
// let allPlayers;
// let selectedPlayers;
// let categorySelected;
// let alphabet;
// let answer;
// let guess;
// let buttons;
// let letters;
// let myletters = [];
// let newAnswer;
// let wordHolder;
// let space;
// let correct;

// // let testing;
// // let card;
// const pSelected = document.createElement('div')

// function postLoad() {
//     gameMenu = document.querySelector('.game-menu');
//     categoryDropdown = document.getElementById("category-dropdown");
  
//     categorySelected = document.querySelector('.category-selected')
    
//     fetch(playerURL)
//         .then(parseJSON)
//         .then(extractData)
//         .then(players => {
//             allPlayers = players
//             displayCategory()
//             // players.filter(displayCategory)
//         })
//     // gameMenu.addEventListener('click', showGame);

// }

// function findPlayers(){
//     selectedPlayers =  allPlayers.filter(filterPlayers);
// }

// function filterPlayers(player){
//     if (player.currentTeam === categorySelected.innerText){
//         return player
//     }
// }

// function displayCategory(){
//     let allTeams = allPlayers.map(player => player.currentTeam)
//     let mySet = new Set(allTeams)
//     allTeams = Array.from(mySet)

//     allTeams.map(createOptions);
//     categoryDropdown.addEventListener('change', selectCategory)
// }

// function createOptions(team){
//     const gameCategory = document.createElement('option');

//     gameCategory.className = "game-category";
//     gameCategory.textContent = team
//     gameCategory.value = team;

//     categoryDropdown.append(gameCategory);
// }

// function selectCategory(event){
//     event.preventDefault();

//     const test = document.querySelector('.start-game')

//     test.style.visibility = "hidden"
//     categorySelected.textContent = event.target.value;

//     findPlayers(allPlayers);
//     startGame(selectedPlayers);
// }

// function startGame(selectedPlayers){

//     createVariables(selectedPlayers[1])
    
//     // createVariables(selectedPlayers)
//     // play(selectedPlayers)
// }

// function createVariables(player){
//     answer = correctName(player.lastName)
//     createLetters(answer)
//     createGuess(answer)

// }

// function play(){
//     // make buttons draggable
//     // make word-holder dropzone
// }

// function playerCard(player){
//     testing = document.querySelector('.game-card');
//     card = document.createElement('div');
    
//     playerImage(player.img)
//     correctName(player.lastName)

//     testing.append(card)
// }

// function playerImage(image){
//     const pImg = document.createElement('img');
//     pImg.src = `${image}`;
//     pImg.style.backgroundSize = 'contain'
//     pImg.style.height = '25rem'

//     card.append(pImg);
// }

// function createGuess(newAnswer){
//     wordHolder = document.querySelector('.word-holder');
//     let correct = document.createElement('div')

//     for (i =0; i < newAnswer.length; i++){
//         correct.setAttribute('id', 'my-word')
//         guess = document.createElement('span')

//         if (newAnswer[i] === " "){
//             guess.innerHTML = " "
//             guess.setAttribute('class', 'space');
//             space = 1
//         } else {
//             guess.innerHTML = "_"
//             guess.setAttribute('class', 'guess-box');
//         }

//         wordHolder.appendChild(correct);
//         correct.appendChild(guess);
//     }
// }

// function correctName(surname){
//     answer = surname.split('').map(letter => {
//         return letter.toUpperCase();
//     })
//     return answer
// }

// function createLetters(answer){
//     alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
//     'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
//     'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

//     buttons = document.querySelector('.buttons');
//     let counter = 0

//     for (i = 0; i < answer.length; i++){
//         if (answer[i] != " "){
//             myletters.push(answer[i])
//             counter = counter + 1 
//         }
//     }

//     while (counter < 20){
//         let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
//         myletters.push(letter)
//         counter = counter + 1
//     }

//     for (i = 0; i < myletters.length; i++){
//         let letter = myletters[Math.floor(Math.random() * myletters.length)];
//         addLetter(letter)
//     }
// }

// function addLetter(letter){
//     list = document.createElement('span');
//     list.id = 'letter'
//     // list.id = 'draggable';
//     // list.datatset.draggable="true";
//     // // list.datatset.ondragstart= `${event.dataTransfer.setData('text/plain',null)}`;
//     list.innerHTML = letter;

//     buttons.appendChild(list);
// }

// //helpers

// function parseJSON(response){
//     return response.json();
// }

// function extractData(object) {
//     return object.map(unNest);
// }

// function unNest(element) {
//     return element;
// }

// // function fetchCall(url, method, body) {
// //     const headers = { "Content-Type": "application/json" }
// //     return fetch(url, { method, headers, body })
// // }