document.addEventListener("DOMContentLoaded", postLoad);

const playerURL = "http://localhost:3000/players";
const gameURL = "http://localhost:3000/puckhead_games";

let allPlayers;
let category;
let selectedPlayers;
let answer;
let myletters = [];
let buttons;
let buttonHolder;
let wordHolder;
let hintCard;
let helpers;
let list;
let counter2 = 0;
let correct;
let myHints;
let points = 0;

function postLoad() {
    dropdown = document.getElementById("dropdown");

        // const currentUser = localStorage.getItem('name')
        // const currentToken = localStorage.getItem('token')

        // console.log(currentUser)
        // console.log(currentToken)
    
    fetch(playerURL)
        .then(parseJSON)
        .then(extractData)
        .then(players => {
            allPlayers = players
            displayCategory()
        })
        .catch(error => console.log(error))

}

function displayCategory(){
    let allTeams = allPlayers.map(player => player.currentTeam);
    let mySet = new Set(allTeams);
    allTeams = Array.from(mySet);

    allTeams.map(createOptions);
    dropdown.addEventListener('change', choseCategory);
}

function createOptions(team){
    const gameCategory = document.createElement('option');

    gameCategory.textContent = team;
    gameCategory.value = team;

    dropdown.append(gameCategory);
}

function choseCategory(event){
    event.preventDefault();

    category = document.querySelector('.category-dropdown');
    helpers = document.querySelector('.helpers');

    helpers.style.visibility = "visible"
    category.style.visibility = "hidden";
    category.dataset.chosenCategory = event.target.value;

    findPlayers(allPlayers);
    startGame(selectedPlayers[0]);
}

function findPlayers(){
    let testing = allPlayers.filter(filterPlayers);
    selectedPlayers = shuffle(testing)
}

function filterPlayers(player){
    if (player.currentTeam === category.dataset.chosenCategory){
        return player
    }
}

function startGame(selectedPlayer){
    console.log("players", selectedPlayers)
    createPoints();
    createVariables(selectedPlayer);
    dragEvents();

    const hintButton = document.querySelector('.hint')
    const resetButton = document.querySelector('.reset')

    hintButton.addEventListener('click', showHint)
    resetButton.addEventListener('click', () => resetPlayer(selectedPlayer))
}

function createPoints(){
    let myPoints = document.querySelector('.my-points')
    myPoints.textContent = `Total Points: ${points}`
}

function createVariables(player){
    answer = correctName(player.lastName);
    displayPlayer(player.img)
    createLetters(answer)
    createGuessHolder(answer)
    createHints(player)
    // createClues(player)
    console.log("answer", answer)
}

function displayPlayer(player){
    const image = document.querySelector('img')
    image.src = player
    image.style.border = `2px solid whitesmoke`
}

function correctName(surname){
    answer = surname.split('').map(letter => {
        return letter.toUpperCase();
    })
    return answer
}

function createLetters(answer){
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    buttonHolder = document.querySelector('.button-holder');
    buttons = document.createElement('div');
    buttons.className = 'buttons';
    buttonHolder.appendChild(buttons)

    let counter = 0

    for (i = 0; i < answer.length; i++){
        if (answer[i] != " "){
            myletters.push(answer[i])
            counter = counter + 1 
        }
    };

    while (counter < 20){
        let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        myletters.push(letter)
        counter = counter + 1
    };

    let newletters = shuffle(myletters)
    newletters.map(addLetter)
}

function shuffle(array){
    var currentIndex = array.length;
        var temporaryValue, randomIndex;
    
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
    
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
}

function addLetter(letter){
    list = document.createElement('span');
    
    list.id = 'draggable';
    list.draggable="true";
    list.innerHTML = letter;

    buttons.appendChild(list);
}

function createGuessHolder(newAnswer){
    wordHolder = document.querySelector('.word-holder');
    correct = document.createElement('div')

    for (i =0; i < newAnswer.length; i++){
        correct.setAttribute('id', 'my-word')
        guess = document.createElement('span')

        if (newAnswer[i] === " "){
            guess.textContent = " "
            guess.setAttribute('class', 'space dropzone');
            guess.id = "filled"
        } else {
            guess.setAttribute('class', 'dropzone');
            guess.id = ""
        }
        wordHolder.appendChild(correct);
        correct.appendChild(guess);
    }
}

function createHints(player){
    hintCard = document.querySelector('.hint-card')
    myHints = document.createElement('div')
    let hint1 = document.createElement('p')
    let hint2 = document.createElement('p')

    hint1.textContent = `Primary Position: ${player.primaryPosition}`
    hint2.textContent = `Primary Number: ${player.primaryNumber}`

    hintCard.append(myHints)
    myHints.append(hint1, hint2)
}

function resetPlayer(player){
    correct.remove()
    buttons.remove()
    myletters = []
    myHints.remove()
    createVariables(player)
}

function dragEvents(){
    let dragged;
    document.addEventListener('drag', function(event){}, false);

    document.addEventListener("dragstart", function(event) {
        dragged = event.target;
        event.target.style.opacity = .5;
    }, false);

    document.addEventListener("dragend", function(event) {
        event.target.style.opacity = "";
    }, false);

    document.addEventListener("dragover", function(event) {
        event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function(event) {
        if (event.target.className == "dropzone") {
            event.target.style.background = "purple";
          }
        
    }, false);

    document.addEventListener("dragleave", function(event) {
        if (event.target.className == "dropzone") {
            event.target.style.background = "";
          }
        
        }, false);

    document.addEventListener("drop", function(event) {
        event.preventDefault();
        if (event.target.className == "dropzone") {
            event.target.style.background = "";
            dragged.style.visibility = "hidden"

            event.target.textContent =  dragged.textContent
            event.target.id =  "filled"
        }
        check();
    }, false);

}

function showHint(event){
    hintCard.style.visibility = "visible"
}

function check(){
    let dropzone = document.querySelectorAll('.dropzone')
    let dropzoneId = Array.from(dropzone)
    
    let filledSet = new Set(dropzoneId.map(x => x.id))

    if (filledSet.size === 1) {
        dropzoneId = dropzoneId.map(id => id.textContent)
        if (dropzoneId.join() === answer.join()){
            if ((counter2 + 1) === selectedPlayers.length){
                points = points + answer.length
                createPoints();
                gameOver(points);
            } else {
                console.log("game", selectedPlayers.length)
                hintCard.style.visibility = "hidden"
                correct.remove()
                buttons.remove()
                myletters = []
                myHints.remove()
                points = points + answer.length
                
                // counter2 = counter2 + 22
                counter2 = counter2 + 1
                startGame(selectedPlayers[counter2])
            }
        }
    }
}

function gameOver(){
    const game = document.querySelector('.game')
    const playerImage = document.querySelector('.img-div')
    
    game.style.backgroundImage = `url('https://i.gifer.com/BVWu.gif')`
    game.style.backgroundRepeat = 'no-repeat'
    game.style.backgroundSize = 'cover'
    playerImage.style.visibility = "hidden"
    helpers.style.visibility = "hidden"

    correct.remove()
    buttons.remove()
    myletters = []
    myHints.remove()
    
    const id = localStorage.getItem('id')
    const body = JSON.stringify({ puckhead_game: { user_id: id, points}})
    
    fetchCall(gameURL, 'POST', body)
}

function parseJSON(response){
    return response.json();
}

function extractData(object) {
    return object.map(unNest);
}

function unNest(element) {
    return element;
}

function fetchCall(url, method, body) {
    const headers = { "Content-Type": "application/json" }
    return fetch(url, { method, headers, body })
}