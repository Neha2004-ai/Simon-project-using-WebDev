let gameSeq = [];
let userSeq = [];
const btns = ["red", "yellow", "green", "blue"];

let started = false;
let level = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;

const statusText = document.getElementById("status");
const clickSound = document.getElementById("click-sound");
const wrongSound = document.getElementById("wrong-sound");

document.addEventListener("keydown", handleStart);
document.addEventListener("click", handleStart);

function handleStart() {
  if (!started) {
    startGame();
  }
}

function startGame() {
  started = true;
  level = 0;
  gameSeq = [];
  userSeq = [];
  statusText.innerText = "Game Started!";
  setTimeout(levelUp, 500);
}

function levelUp() {
  userSeq = [];
  level++;
  statusText.innerText = `Level ${level}`;

  const randomColor = btns[Math.floor(Math.random() * 4)];
  gameSeq.push(randomColor);
  playSequence();
}

function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = gameSeq[i];
    const btn = document.getElementById(color);
    btnFlash(btn);
    i++;
    if (i >= gameSeq.length) {
      clearInterval(interval);
    }
  }, 600);
}

function btnFlash(btn) {
  playSound(btn.id);
  btn.classList.add("flash");
  setTimeout(() => {
    btn.classList.remove("flash");
  }, 300);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => {
    btn.classList.remove("userflash");
  }, 250);
}

function btnPress() {
  if (!started) return;

  const btn = this;
  const userColor = btn.id;
  userSeq.push(userColor);

  playSound(userColor);
  userFlash(btn);

  checkAnswer(userSeq.length - 1);
}

function playSound(color) {
  if (btns.includes(color)) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.warn("Click sound blocked:", e));
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play().catch(e => console.warn("Wrong sound blocked:", e));
  }
}

function checkAnswer(index) {
  if (userSeq[index] === gameSeq[index]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  playSound("wrong");
  document.body.classList.add("game-over");

  setTimeout(() => {
    document.body.classList.remove("game-over");
  }, 500);

  const score = level - 1;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  statusText.innerHTML = `
     <strong>Game Over!</strong><br>
     Your Score: <strong>${score}</strong><br>
     High Score: <strong>${highScore}</strong><br>
     <em>Click or press any key to restart</em>
  `;

  resetGame();
}

function resetGame() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
}


document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", btnPress);
});
