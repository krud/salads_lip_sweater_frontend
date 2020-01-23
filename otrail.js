document.addEventListener("DOMContentLoaded", postLoad);

let startButton;
let career;
let chosenWagon;
let carvan = {};
let checkpoints = [ "Saint Valentines Day Mascre", "Billet Family", "FOMO", "Lottery"]
let goon1;
let goon2;
let goon3;
let goon4;
let leader;



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

function playersWagon(){
    let chosenWagon = document.querySelector('.party')

    chosenWagon.addEventListener('submit', function(){

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

    })
    chosenWagon
}

function postLoad() {
   let startButton = document.querySelector(".start");

    startButton.addEventListener("click", startGame)
}

function startGame(){
    event.preventDefault();

    chosenWagon = document.querySelector('#party')
    career = document.querySelector('.career')

    event.target.style.visibility = "hidden"
    // chosenWagon.style.visibility = "visible"
    career.style.visibility = "visible"
}
