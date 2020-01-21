document.addEventListener("DOMContentLoaded", postLoad);

const playerURL = "http://localhost:3000/players";

let allPlayers;
let category;
let selectedPlayers;
let answer;
let myletters = [];
let buttons;
let wordHolder;
let hintCard;
let helpers;
let list;
let counter2 = 0;
let correct

function postLoad() {
    dropdown = document.getElementById("dropdown");
    
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

    createVariables(selectedPlayer);
    dragEvents();
    const hintButton = document.querySelector('.hint')

    hintButton.addEventListener('click', showHint)
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

function displayPlayer(pl){
    const image = document.querySelector('img')
    image.src = pl
    image.style.border = `2px solid whitesmoke`
    console.log(pl)
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

    buttons = document.querySelector('.buttons');
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
            guess.innerHTML = " "
            guess.setAttribute('class', 'space');
            space = 1
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
    let hint1 = document.createElement('p')
    let hint2 = document.createElement('p')

    hint1.textContent = `Primary Position: ${player.primaryPosition}`
    hint2.textContent = `Primary Number: ${player.primaryNumber}`

    hintCard.append(hint1, hint2)
}

// function createClues(player){

// }

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
            dragged.parentNode.removeChild( dragged );

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
            // correct.parentNode.removeChild(correct);
            // buttons.parentNode.removeChild(buttons);
            // counter2 = counter2 + 1
            // startGame(selectedPlayers[counter2])
            console.log("FUCK Yes!")
            console.log("selectedP2", selectedPlayers)
        } else{
            console.log("you stupid")
        }
    }
// my-word, buttons
}


//helpers

function parseJSON(response){
    return response.json();
}

function extractData(object) {
    return object.map(unNest);
}

function unNest(element) {
    return element;
}

// function fetchCall(url, method, body) {
//     const headers = { "Content-Type": "application/json" }
//     return fetch(url, { method, headers, body })
// }