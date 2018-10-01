const translationWrapper = document.querySelector(".translation-wrapper");
const translationArea = document.querySelector("#translation-area");
const resetButton = document.querySelector("#reset");
const solButton = document.querySelector("#solution")
const theTimer = document.querySelector(".timer");
const Word = document.querySelector("#Word");
const Next = document.querySelector("#next");

var Words = '';
var firstWord = '';
loadWord();
var IndexWord = 0 ;
var timer = [0,0,0,0];
var interval;
var timerRunning = false;



// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time) {
  if (time <= 9) {
    time = "0" + time;
  }
  return time;
}

// Run a standard minute/second/hundredths timer:
function runTimer() {
  let currentTime = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
  theTimer.innerHTML = currentTime;
  timer[3]++;

  timer[0] = Math.floor((timer[3]/100)/60);
  timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
  timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));
}

// Match the text entered with the provided text on the page:
function spellCheck() {
  let textEntered = translationArea.value;
  let EngWordMatch = FindWord(textEntered);
  let EngSubWordMatch = FindSubWord(textEntered);

  if (EngWordMatch) {
    clearInterval(interval);
    translationWrapper.style.borderColor = "#388E3C";
  } else {
    if (EngSubWordMatch) {
      translationWrapper.style.borderColor = "#FBC02D";
    } else {
      translationWrapper.style.borderColor = "#E64A19";

    }
  }
}


// Start the timer:
function start() {
  let textEnterdLength = translationArea.value.length;
  if (textEnterdLength === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }

}

// Reset everything:
function reset(index) {
  clearInterval(interval);
  interval = null;
  timer = [0,0,0,0];
  timerRunning = false;
  theTimer.innerHTML = "00:00:00";
  translationWrapper.style.borderColor = "grey";
  if(index===0){
    translationArea.value = "";
    //Give the solution
  }else{
    translationArea.value = Words[IndexWord].EngWords;
  }
}
//Next word
function next(){
  clearInterval(interval);
  IndexWord++;
  reset(0);
  Word.innerHTML = '<h1>' + Words[IndexWord].HebWord; + '</h1>';
  if (IndexWord==Words.length-1){
    Next.disabled = true;
    IndexWord=0;
  }
}

//loadWord
function loadWord() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       response = JSON.parse(xhttp.responseText);
       Words = response.Words;
       firstWord=Words[0].HebWord;
       Word.innerHTML = '<h1>' + firstWord + '</h1>';
    }
  };
  xhttp.open("GET","Words.json", true);
  xhttp.send();

}

//find if the exsist in the transletion
function FindWord(wordToFind){
  return Words[IndexWord].EngWords.includes(wordToFind);
}

//find if the text that entered by the user is part of any transletion

function FindSubWord(word){
  let found = false;
  for (let i=0 ; i < Words.length && !found; i++ ){
    found = Words[IndexWord].EngWords[i].substring(0,word.length) == word;
  }
  return found;
}

// Event listeners for keyboard input and the reset
translationArea.addEventListener("keypress", start, false);
translationArea.addEventListener("keyup", spellCheck, false);
resetButton.addEventListener("click", function(){reset(0);}, false);
solButton.addEventListener("click", function(){reset(1);}, false);
Next.addEventListener("click", next, false );

