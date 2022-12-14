let wordToFind;
let lettersFound = 0;
let life = 0;

document.addEventListener("DOMContentLoaded", function() {
    generateMenu();
});

function generateMenu(){
    let playButton = document.createElement("button");
    playButton.setAttribute("id", "playButton");
    playButton.innerHTML = "Play the hangman!";
    playButton.onclick = function(){
        getRandomWord(false);
    };
    document.getElementById("menu").appendChild(playButton);
}

function getRandomWord(takeWordFromHardCodedDictionnary){
    if(takeWordFromHardCodedDictionnary){
        const wordPool = ["yes", "no"];
        return wordPool[Math.floor(Math.random() * wordPool.length)];
    } else {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://random-word-api.herokuapp.com/word", true);
        xhr.onload = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    wordToFind = JSON.parse(xhr.responseText).find(x=>x!==undefined).toUpperCase();
                    play();
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = (e) => {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }
}

 function play(){
    generateLife();
    generateWord();
    generateButtons();
    hideMenu(true);
    disableHangman(false);
}

function generateLife(){
    life = 10;
    document.getElementById("life").innerHTML = "";
    let hangedMan = document.createElement("img");
    hangedMan.setAttribute("id", "hangedMan");
    hangedMan.src = "ressources/" + life + ".png";
    document.getElementById("life").appendChild(hangedMan);
}

function generateWord() {
    lettersFound = 0;
    document.getElementById("word").innerHTML = "";
    let word = document.getElementById("word");
    for (let i = 1; i <= wordToFind.length; i++) {
        let letter = document.createElement("span");
        if (wordToFind.substring(i-1, i).match(/^[a-zA-Z]+$/)){
            letter.innerHTML = "_";
        } else {
            letter.innerHTML = wordToFind.substring(i-1, i);
            lettersFound++;
        }
        letter.setAttribute("id", i.toString());
        word.appendChild(letter);
    }
}

function generateButtons(){
    document.getElementById("buttons").innerHTML = "";
    let buttons = document.getElementById("buttons");
    for (let i = 0; i < 26; i++) {
        let button = document.createElement("button");
        let letter = String.fromCharCode(i + 65);
        button.appendChild(document.createTextNode(letter));
        button.setAttribute("id", letter);
        button.onclick = function(){
            resolveLetter(button.id);
        };
        buttons.appendChild(button);
    }
    document.addEventListener('keydown', myKeyboardListener);
}

function resolveLetter(letterSubmitted) {
    let letterIsCorrect = false;
    let index = 1;
    for (const element of wordToFind) {
        if(letterSubmitted === element){
            letterIsCorrect = true;
            if (letterSubmitted !== document.getElementById("word").children.item(index - 1).innerHTML){
                document.getElementById(index.toString()).innerHTML = letterSubmitted;
                lettersFound++;
            }
        }
        index++;
    }
    if(letterIsCorrect)
        document.getElementById(letterSubmitted).setAttribute("class", "correctLetter");
    else
        document.getElementById(letterSubmitted).setAttribute("class", "incorrectLetter");
    refreshStateOfGame(letterIsCorrect);
}

function refreshStateOfGame(letterIsCorrect){
    if(lettersFound === wordToFind.length){
        winGame();
    } else {
        if(!letterIsCorrect)
            loseLifePoint();
        if (life === 0)
            loseGame();
    }
}

function loseLifePoint(){
    life--;
    document.getElementById("hangedMan").src = "ressources/" + (life).toString() + ".png";
}

function loseGame(){
    document.removeEventListener('keydown', myKeyboardListener);
    disableHangman(true);
    hideMenu(false);
    document.getElementById("playButton").innerHTML = "Game over! The word was : " + wordToFind.toString() + "</br>Play Again...";
}

function winGame(){
    document.removeEventListener('keydown', myKeyboardListener);
    disableHangman(true);
    hideMenu(false);
    document.getElementById("playButton").innerHTML = "Game won! The word was : " + wordToFind.toString() + "</br>Play Again...";
}

function disableHangman(bool){
    for(const element of document.getElementById("hangmanGame").getElementsByTagName('*'))
        element.disabled = bool;
}

function hideMenu(bool){
    if (bool)
        document.getElementById("menu").style.display = "none";
    else
        document.getElementById("menu").style.display = "";
}

function myKeyboardListener (event) {
    if(event.key.match(/^[a-zA-Z]+$/))
        resolveLetter(event.key.toUpperCase())
}