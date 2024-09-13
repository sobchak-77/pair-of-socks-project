// -------------------------
// --- SERVICE FUNCTIONS ---
// -------------------------

// --- get a div element ---
function createBox(className) {
  const div = document.createElement('div');
  div.classList.add(className);

  return div;
};

// --- get a button element ---
function createBtn(className, txt) {
  const btn = document.createElement('button');
  btn.classList.add(className);
  btn.textContent = txt;

  return btn;
};

// --- get a span element ---
function createSpan(className, txt) {
  const span = document.createElement('span');
  span.classList.add(className);
  span.textContent = txt;

  return span;
};

// -------------------------
// --- STOPWATCH SECTION ---
// -------------------------

// --- define HTML elements --- 
const stopwatch = document.querySelector('.stopwatch');
const secondEl = document.getElementById('second');
const millisecEl = document.getElementById('millisec');

// --- special variables ---
let second = 0,
  millisec = 0,
  interval = null,
  counter = 0;

// --- start the stopwatch ---
function startTimer() {
  millisec++;
  
  // --- change millisecs ---

  if (millisec < 9) {
    millisecEl.textContent = '0' + millisec;
  } else if (millisec > 9) {
    millisecEl.textContent = millisec;
  };

  if (millisec > 99) {
    second++;
    secondEl.textContent = '0' + second;
    millisec = 0;
    millisecEl.textContent = '0' + millisec;
  };

  // --- change seconds ---
  
  if (second < 9) {
    second.textContent = '0' + second;
  } else if (second > 9) {
    secondEl.textContent = second;
  };

  // --- time is over ---

  if (second === 60) {
    clearInterval(interval);
    showLoseTxt();
  };
};

// --- reset all stopwatch values ---
function resetTimer() {
  // variable values
  second = 0;
  millisec = 0;

  // timer values
  secondEl.textContent = '00';
  millisecEl.textContent = '00';
};

// --- show the current score ---
function showScoreTxt() {
  const score = createBox('score');
  score.textContent = `You did it in ${second} : ${millisec}`;

  resetTimer();
  gameContainer.append(score);
};

// --------------------
// --- THE GAME END ---
// --------------------

function showLoseTxt() {
  gameContainer.innerHTML = '';

  const loseTxt = createBox('game__end-txt');
  loseTxt.textContent = 'Oops, game over... Try again!';

  gameContainer.append(loseTxt);
};

function showWinTxt() {
  gameContainer.innerHTML = '';
  showScoreTxt();

  const winTxt = createBox('game__end-txt');
  winTxt.textContent = `All pairs found. Good job. Let's try again!`;
  
  gameContainer.append(winTxt);
};

// -------------------------
// --- GAME DESK SECTION ---
// -------------------------

// ---define HTML elements ---
const gameContainer = document.getElementById('game');
const restartBtn = document.getElementById('re-btn');
const helloTxt = document.getElementById('hello-txt');

// --- specials variables ---
let card_1 = null;
let card_2 = null;

// --- get numbers array ---
function createNumArr(pairs) {
  let cardNumArr = [];
  
  for (let i = 1; i <= pairs; i++) {
    cardNumArr.push(i, i);
  };

  return cardNumArr;
};

// --- get shuffle numbers array ---
function shuffleArr(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = Math.floor(Math.random() * arr.length);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  return arr;
};

// --- flip the card ---
function flipCard(card, faceValue, faceCount) {
  card.addEventListener('click', () => {
    // start stopwatch
    clearInterval(interval);
    interval = setInterval(startTimer, 10);

    // can't press on one card twice
    if (card.classList.contains('flip') || card.classList.contains('match')) {
      return;
    };

    // close cards if both are unmatched
    if (card_1 !== null && card_2 !== null) {
      if (!card_1.classList.contains('match') && !card_1.classList.contains('match')) {
        card_1.classList.remove('flip');
        card_1.style.backgroundImage = 'unset';
        card_1 = null;
        card_2.classList.remove('flip');
        card_2.style.backgroundImage = 'unset';
        card_2 = null;
      };
    };

    card.classList.add('flip');
    setTimeout(() => {
      card.style.backgroundImage = `url(img/sock_${faceValue}.svg)`;
    }, 100);
    
    if (card_1 === null) {
      card_1 = card;
    } else {
      card_2 = card;
    };

    // get cards value
    let valueCard_1 = card_1.textContent;
    let valueCard_2 = card_2.textContent;

    // two opened cards are NOT the same
    if (card_1 !== null && card_2 !== null) {
      if (valueCard_1 !== valueCard_2) {
        setTimeout(() => {
          card_1.classList.remove('flip');
          card_1.style.backgroundImage = 'unset';
          card_1 = null;
          card_2.classList.remove('flip');
          card_2.style.backgroundImage = 'unset';
          card_2 = null;
        }, 400);
      };
    };

    // two opened cards are the same
    if (card_1 !== null && card_2 !== null) {
      if (valueCard_1 === valueCard_2) {
        card_1.classList.add('match');
        card_1 = null;
        card_2.classList.add('match');
        card_2 = null;
      };
    };

    // all cards opened and matched
    let matchArr = document.querySelectorAll('.match');
    if (faceCount === matchArr.length) {
      // stop the stopwatch
      clearInterval(interval);
      // show score
      setTimeout(showWinTxt, 400);
    };
  });
};

// --- get game card ---
function getCard(face, faceCount) {
  const card = createBox('card');
  card.textContent = face;
  flipCard(card, face, faceCount);

  return card;
};

// --- to start the game ---
function startGame() {
  const gameDesk = createBox('game__desk');
  const cardFaceArr = shuffleArr( createNumArr(8) );
  const faceCount = cardFaceArr.length;
  
  // give the value to every card
  cardFaceArr.forEach((face) => {
    gameDesk.append( getCard(face, faceCount) );
  });

  // reset stopwatch values
  resetTimer();

  gameContainer.append(gameDesk);
};

// --- clean desk game, stopwatch and start new game ---
restartBtn.addEventListener('click', () => {
  clearInterval(interval);
  helloTxt.classList.add('hide');
  resetTimer();
  gameContainer.innerHTML = '';
  startGame();
});