const fullName = "יוסי כהן"; // כאן שם הדמות בעברית
const imgSrc = "images/person.jpg"; 
const maxAttempts = 10; // עכשיו יש 10 ניסיונות

let guessedLetters = new Set();
let attempts = 0;
let gameOver = false;

const puzzleContainer = document.getElementById('puzzle-container');
const nameDisplay = document.getElementById('name-display');
const lettersGuessedDiv = document.getElementById('letters-guessed');
const guessInput = document.getElementById('guess-input');
const submitGuess = document.getElementById('submit-guess');
const messageDiv = document.getElementById('message');

const rows = 4;
const cols = 4;

// מפה של אות רגילה לאות סופית
const finalLettersMap = {
  'כ': 'ך',
  'מ': 'ם',
  'נ': 'ן',
  'פ': 'ף',
  'צ': 'ץ',
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ'
};

function normalizeLetter(letter) {
  // אם האות היא אות סופית — נחליף לאות רגילה
  return finalLettersMap[letter] || letter;
}

function setupPuzzle() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const piece = document.createElement('div');
      piece.classList.add('puzzle-piece');
      piece.style.top = `${r * 25}%`;
      piece.style.left = `${c * 25}%`;
      piece.style.backgroundImage = `url('${imgSrc}')`;
      piece.style.backgroundPosition = `-${c * 75}px -${r * 75}px`;
      piece.style.backgroundSize = "300px 300px";
      puzzleContainer.appendChild(piece);
    }
  }
}

function updateNameDisplay() {
  let display = '';
  let allRevealed = true;

  for (let ch of fullName) {
    if (ch === ' ') {
      display += ' ';
    } else if (guessedLetters.has(normalizeLetter(ch))) {
      display += ch;
    } else {
      display += '_';
      allRevealed = false;
    }
  }
  nameDisplay.textContent = display;

  if (allRevealed && !gameOver) {
    endGame(true);
  }
}

function revealNextPiece() {
  const hiddenPieces = Array.from(document.getElementsByClassName('puzzle-piece')).filter(p => !p.classList.contains('visible'));
  if (hiddenPieces.length > 0) {
    const randomPiece = hiddenPieces[Math.floor(Math.random() * hiddenPieces.length)];
    randomPiece.classList.add('visible');
  }
}

function revealAllPieces() {
  const allPieces = document.getElementsByClassName('puzzle-piece');
  for (let piece of allPieces) {
    piece.classList.add('visible');
  }
}

function updateLettersGuessed(letter, correct) {
  const span = document.createElement('span');
  span.textContent = letter;
  span.className = correct ? 'letter-correct' : 'letter-wrong';
  lettersGuessedDiv.appendChild(span);
}

function endGame(won) {
  gameOver = true;
  revealAllPieces();
  disableInput();
  if (won) {
    messageDiv.textContent = "כל הכבוד! ניצחת!";
  } else {
    messageDiv.textContent = `המשחק נגמר! השם הנכון היה: ${fullName}`;
  }
}

function disableInput() {
  submitGuess.disabled = true;
  guessInput.disabled = true;
}

function handleGuess() {
  if (gameOver) return;

  const input = guessInput.value.trim();
  guessInput.value = '';

  if (!/^[\u0590-\u05FF\u05D0-\u05EAa-zA-Z]$/.test(input)) {
    messageDiv.textContent = "יש להקליד אות אחת בלבד בעברית או באנגלית.";
    return;
  }

  const normalizedInput = normalizeLetter(input);

  if (guessedLetters.has(normalizedInput)) {
    messageDiv.textContent = "כבר ניחשת את האות הזאת.";
    return;
  }

  guessedLetters.add(normalizedInput);

  const normalizedFullName = Array.from(fullName).map(normalizeLetter).join('');

  const correct = normalizedFullName.includes(normalizedInput);

  if (correct) {
    messageDiv.textContent = "ניחוש נכון!";
  } else {
    messageDiv.textContent = "ניחוש שגוי!";
    revealNextPiece();
    attempts++;
  }

  updateNameDisplay();
  updateLettersGuessed(input, correct);

  // עדכן ספירה של ניסיונות
  if (!gameOver) {
    messageDiv.textContent += ` (${maxAttempts - attempts} ניסיונות נשארו)`;
  }

  if (attempts >= maxAttempts && !gameOver) {
    endGame(false);
  }
}

// מאזינים לאירועים
submitGuess.addEventListener('click', handleGuess);
guessInput.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    handleGuess();
  }
});

// התחלה
setupPuzzle();
updateNameDisplay();
