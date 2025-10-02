// script.js
const display = document.getElementById('display');
const historyElem = document.getElementById('history');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const themeButton = document.querySelector('.theme-toggle');
const calculator = document.querySelector('.calculator');
const calcDisplay = document.querySelector('.display');
const buttons = document.querySelectorAll('.buttons button');
const toast = document.getElementById('toast');
let calculationHistory = [];

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    const expression = display.value;
    try {
        // Replace ^ with ** for exponentiation if needed, but since we use ** directly, it's fine
        const result = eval(expression);
        display.value = result;
        addToHistory(`${expression} = ${result}`);
        display.classList.add('glow');
        setTimeout(() => display.classList.remove('glow'), 500);
    } catch (error) {
        display.value = 'Error';
    }
}

function addToHistory(entry) {
    calculationHistory.push(entry);
    if (calculationHistory.length > 5) calculationHistory.shift();
    historyElem.textContent = calculationHistory[calculationHistory.length - 1] || '';
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
    updateThemeButtonText();
    playClick(); // Play sound on theme toggle too
}

function updateThemeButtonText() {
    if (document.body.classList.contains('dark')) {
        themeButton.textContent = 'Тёмная';
    } else {
        themeButton.textContent = 'Светлая';
    }
}

function playClick() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine'; // Changed to sine for smoother sound
    oscillator.frequency.value = 800; // Adjusted frequency
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 50);
}

function handleButtonClick(action) {
    playClick();
    action();
}

// Enhanced Keyboard support with more keys, including scientific
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/^[0-9]$/.test(key)) {
        handleButtonClick(() => appendToDisplay(key));
    } else if (key === '+') {
        handleButtonClick(() => appendToDisplay('+'));
    } else if (key === '-') {
        handleButtonClick(() => appendToDisplay('-'));
    } else if (key === '*') {
        handleButtonClick(() => appendToDisplay('*'));
    } else if (key === '/') {
        handleButtonClick(() => appendToDisplay('/'));
    } else if (key === '.') {
        handleButtonClick(() => appendToDisplay('.'));
    } else if (key === '(') {
        handleButtonClick(() => appendToDisplay('('));
    } else if (key === ')') {
        handleButtonClick(() => appendToDisplay(')'));
    } else if (key === 'Enter' || key === '=') {
        handleButtonClick(calculate);
    } else if (key === 'Backspace') {
        handleButtonClick(backspace);
    } else if (key === 'Delete' || key === 'c' || key === 'C') {
        handleButtonClick(clearDisplay);
    } else if (key.toLowerCase() === 's' && event.ctrlKey) { // Ctrl+S for sin as example
        handleButtonClick(() => appendToDisplay('Math.sin('));
    } // Add more if needed
});

// Copy to clipboard on double click (unique feature)
display.addEventListener('dblclick', () => {
    navigator.clipboard.writeText(display.value).then(() => {
        toast.textContent = 'Copied to clipboard!';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

// Complex onload animation using JavaScript
window.addEventListener('DOMContentLoaded', () => {
    // Animate theme toggle
    setTimeout(() => {
        themeButton.classList.add('visible');
    }, 200);

    // Animate calculator container with rotation and scale
    setTimeout(() => {
        calculator.classList.add('visible');
    }, 500);

    // Animate display sliding in
    setTimeout(() => {
        calcDisplay.classList.add('visible');
    }, 800);

    // Animate buttons sequentially with delay, rotation, and bounce
    buttons.forEach((btn, index) => {
        setTimeout(() => {
            btn.classList.add('visible');
        }, 1000 + index * 60); // Slightly faster stagger for more buttons
    });
});

// Initial update
updateThemeButtonText();