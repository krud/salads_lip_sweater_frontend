document.addEventListener("DOMContentLoaded", postLoad);

let startButton;
let career;
let careerInfo;
let careerButton;
let chosenWagon;
let player;
let carvan = {};
let checkpoints = [ "Saint Valentines Day Mascre", "Billet Family", "FOMO", "Lottery"]
let goon1;
let goon2;
let goon3;
let goon4;
let leader;

let goon;
let athletic;
let foreigner;
let learn;

let qmjhl;
let ushl;
let ncaa;
let learnJunior;

function createGame(){
    createVaribles();
    playGame();
} 

function createVaribles(){
    createCarvan();
    // createPlayer();
}

function createCarvan(){
    carvan = {
        party: [],
        food: 200, 
        medicine: 5,
    }
}

function Player(name){
    this.name = name
    this.health = 100
    this.diseases = 0
}

function playGame(){

}

function postLoad() {
   let startButton = document.querySelector(".start");

    startButton.addEventListener("click", startGame)
}

function startGame(){
    event.preventDefault();

    createGame();
    chosenWagon = document.querySelector('#party')
    career = document.querySelector('.career')

    event.target.style.visibility = "hidden"
    career.style.visibility = "visible"

    pickPlayer();
    // choseCarvan();
}

function pickPlayer(){
    goon = document.querySelector('#goon')
    athletic = document.querySelector('#athletic')
    foreigner = document.querySelector('#foreigner')
    learn = document.querySelector('#learn')

    goon.addEventListener('click', goonPicked);
    athletic.addEventListener('click', athleticPicked);
    foreigner.addEventListener('click', foreignerPicked);
    learn.addEventListener('click', learnPicked);
}

function goonPicked(){
    event.preventDefault();
    player = "goon"
    choseCarvan();
}

function athleticPicked(){
    event.preventDefault();
    player = "athletic"
    choseCarvan();
}

function foreignerPicked(){
    event.preventDefault();

    player = "import"
    choseCarvan();
}

function learnPicked(){
    event.preventDefault();

    displayDifferences();
}

function displayDifferences(){
    event.preventDefault();
    careerInfo = document.querySelector('.career-info')
    careerButton = document.querySelector('.career-continue')

    careerInfo.style.display = "block"
    career.style.display = "none"

    careerButton.addEventListener('click', continueCareer)
}

function continueCareer(){
    event.preventDefault();

    careerInfo.style.display = "none"
    career.style.display = "block"
}

function choseCarvan(){
    chosenWagon = document.querySelector('#party')
    chosenWagon.style.visibility = "visible"
    career.style.display = "none"

    console.log("hit", player)

    chosenWagon.addEventListener('submit', updateCarvan)
}

function updateCarvan(){
    event.preventDefault();

    const newFormData = new FormData(event.target)
    const wagonLeader = newFormData.get('wagon-leader')
    const member1 = newFormData.get('member1')
    const member2 = newFormData.get('member2')
    const member3 = newFormData.get('member3')
    const member4 = newFormData.get('member4')

    let leader = new Player(wagonLeader);
    let goon1 = new Player(member1);
    let goon2 = new Player(member2);
    let goon3 = new Player(member3);
    let goon4 = new Player(member4);

    carvan.party.push(leader, goon1, goon2, goon3, goon4)

    juniorCareer();
}

function juniorCareer(){
    junior = document.querySelector('.junior')

    event.target.style.visibility = "hidden"
    junior.style.visibility = "visible"
    
    pickJunior();
}

function pickJunior(){
    qmjhl = document.querySelector('#QMJHL')
    ushl = document.querySelector('#USHL')
    ncaa = document.querySelector('#NCAA')
    learnJunior = document.querySelector('#learn-junior')

    qmjhl.addEventListener('click', qmjhlPicked);
    ushl.addEventListener('click', ushlPicked);
    ncaa.addEventListener('click', ncaaPicked);
    learnJunior.addEventListener('click', learnJuniorPicked);
}

function qmjhlPicked(){
    event.preventDefault();

    console.log("hit")
}

function ushlPicked(){
    event.preventDefault();
    console.log("hit")
}

function ncaaPicked(){
    event.preventDefault();
    console.log("hit")
}

function learnJuniorPicked(){
    event.preventDefault();

    displayJuniorDifferences();
}

function displayJuniorDifferences(){
    event.preventDefault();
    juniorInfo = document.querySelector('.junior-info')
    juniorButton = document.querySelector('.junior-continue')

    juniorInfo.style.display = "block"
    junior.style.display = "none"

    juniorButton.addEventListener('click', continueJunior)
}

function continueJunior(){
    event.preventDefault();

    juniorInfo.style.display = "none"
    junior.style.display = "block"
}