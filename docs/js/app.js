// Audio Context for visualization
let audioContext;
let analyser;
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
} catch (e) {
    console.error('Web Audio API is not supported in this browser');
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme === 'dark');
} else {
    setTheme(prefersDark.matches);
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Timer functionality
let timerSeconds = 10 * 60;
let timerInterval;
let isTimerRunning = true;
const timerDisplay = document.getElementById('timerDisplay');
const toggleTimer = document.getElementById('toggleTimer');
const resetTimer = document.getElementById('resetTimer');

function updateTimer() {
    if (timerSeconds > 0 && isTimerRunning) {
        let minutes = Math.floor(timerSeconds / 60);
        let seconds = timerSeconds % 60;
        timerDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerSeconds--;
    } else if (timerSeconds === 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00";
        playSound('sounds/timer-end.wav');
        showToast('Timer finished!', 'success');
    }
}

function toggleTimerState() {
    isTimerRunning = !isTimerRunning;
    toggleTimer.innerHTML = isTimerRunning ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
    document.getElementById("timer").style.opacity = isTimerRunning ? "1" : "0.6";
}

function resetTimerState() {
    timerSeconds = 10 * 60;
    updateTimer();
    showToast('Timer reset', 'success');
}

toggleTimer.addEventListener('click', toggleTimerState);
resetTimer.addEventListener('click', resetTimerState);
timerInterval = setInterval(updateTimer, 1000);

// Volume Control
const volumeControl = document.getElementById('volumeControl');
let globalVolume = 1;

volumeControl.addEventListener('input', (e) => {
    globalVolume = e.target.value / 100;
});

// Sound functionality with visualization
let customSounds = [];
const activeAudio = new Map();

function createVisualizer(audioElement, button) {
    if (!audioContext || !analyser) return;

    const source = audioContext.createMediaElementSource(audioElement);
    const visualizerBar = button.querySelector('.visualizer-bar');
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function updateVisualizer() {
        if (!audioElement.paused) {
            requestAnimationFrame(updateVisualizer);
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            const width = (average / 255) * 100;
            visualizerBar.style.width = `${width}%`;
        } else {
            visualizerBar.style.width = '0%';
        }
    }

    audioElement.addEventListener('play', updateVisualizer);
}

async function playSound(file) {
    try {
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const button = event.currentTarget;
        button.classList.add('loading');

        // Stop previous instance of this sound if it exists
        if (activeAudio.has(file)) {
            const prevAudio = activeAudio.get(file);
            prevAudio.pause();
            prevAudio.currentTime = 0;
        }

        const audio = new Audio(file);
        audio.volume = globalVolume;
        
        activeAudio.set(file, audio);

        audio.addEventListener('canplaythrough', () => {
            button.classList.remove('loading');
            button.classList.add('playing');
            createVisualizer(audio, button);
            audio.play();
        });

        audio.addEventListener('ended', () => {
            button.classList.remove('playing');
            activeAudio.delete(file);
        });

        audio.addEventListener('error', () => {
            button.classList.remove('loading');
            showToast('Error playing sound', 'error');
        });

    } catch (error) {
        console.error('Error playing sound:', error);
        showToast('Error playing sound', 'error');
    }
}

function addCustomSound() {
    const fileInput = document.getElementById('customFile');
    const file = fileInput.files[0];
    
    if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showToast('File too large. Maximum size is 10MB', 'error');
            return;
        }

        const fileName = file.name;
        const fileURL = URL.createObjectURL(file);
        
        customSounds.push({
            name: fileName,
            url: fileURL
        });
        
        updateCustomSoundsList();
        showToast('Sound added successfully', 'success');
    }
}

function updateCustomSoundsList() {
    const soundsList = document.getElementById('customSoundsList');
    soundsList.innerHTML = '';
    
    customSounds.forEach((sound, index) => {
        const button = document.createElement('button');
        button.className = 'button';
        button.innerHTML = `
            <i class="fas fa-play"></i>
            ${sound.name.substring(0, 20)}${sound.name.length > 20 ? '...' : ''}
            <div class="visualizer"><div class="visualizer-bar"></div></div>
        `;
        button.onclick = () => playSound(sound.url);
        soundsList.appendChild(button);
    });
}

// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Drag and drop functionality
const dropZone = document.getElementById('dropZone');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropZone.classList.add('drag-over');
}

function unhighlight(e) {
    dropZone.classList.remove('drag-over');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    
    if (file && file.type.startsWith('audio/')) {
        document.getElementById('customFile').files = dt.files;
        addCustomSound();
    } else {
        showToast('Please drop an audio file', 'error');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    switch(e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            toggleTimerState();
            break;
        case 'r':
            resetTimerState();
            break;
        case 'm':
            volumeControl.value = volumeControl.value > 0 ? 0 : 100;
            globalVolume = volumeControl.value / 100;
            break;
        case '1':
        case '2':
        case '3':
            const button = document.querySelector(`[data-shortcut="${e.key}"]`);
            if (button) button.click();
            break;
    }
}); 