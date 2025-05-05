document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const timerDisplay = document.getElementById('time-left');
  const sessionsCount = document.getElementById('sessions-count');
  const toggleBtn = document.getElementById('toggle-btn');
  const resetBtn = document.getElementById('reset-btn');
  const workBtn = document.getElementById('work-btn');
  const shortBreakBtn = document.getElementById('short-break-btn');
  const longBreakBtn = document.getElementById('long-break-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings');
  const settingsForm = document.getElementById('settings-form');
  const workTimeInput = document.getElementById('work-time');
  const shortBreakTimeInput = document.getElementById('short-break-time');
  const longBreakTimeInput = document.getElementById('long-break-time');
  const sessionsBeforeLongBreakInput = document.getElementById(
    'sessions-before-long-break'
  );
  const bellSound = document.getElementById('bell-sound');
  const pomodoroTimer = document.querySelector('.pomodoro-timer');

  // Timer state
  const timerState = {
    mode: 'work',
    timeLeft: 25 * 60, // in seconds
    isActive: false,
    sessions: 0,
    settings: {
      workTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      sessionBeforeLongBreak: 4,
    },
    interval: null,
  };

  // Format time as MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Update timer display
  function updateDisplay() {
    timerDisplay.textContent = formatTime(timerState.timeLeft);
    sessionsCount.textContent = timerState.sessions;

    // Update toggle button text
    toggleBtn.textContent = timerState.isActive ? '❚❚' : '▶';

    // Update active mode button
    [workBtn, shortBreakBtn, longBreakBtn].forEach((btn) => {
      btn.classList.remove('active');
    });

    if (timerState.mode === 'work') {
      workBtn.classList.add('active');
      pomodoroTimer.className = 'pomodoro-timer work-mode';
    } else if (timerState.mode === 'shortBreak') {
      shortBreakBtn.classList.add('active');
      pomodoroTimer.className = 'pomodoro-timer short-break-mode';
    } else {
      longBreakBtn.classList.add('active');
      pomodoroTimer.className = 'pomodoro-timer long-break-mode';
    }
  }

  // Start/Pause timer
  function toggleTimer() {
    timerState.isActive = !timerState.isActive;

    if (timerState.isActive) {
      timerState.interval = setInterval(() => {
        if (timerState.timeLeft > 0) {
          timerState.timeLeft--;
          updateDisplay();
        } else {
          bellSound.play();
          clearInterval(timerState.interval);

          if (timerState.mode === 'work') {
            timerState.sessions++;

            if (
              timerState.sessions %
                timerState.settings.sessionBeforeLongBreak ===
              0
            ) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
          } else {
            switchMode('work');
          }

          timerState.isActive = true;
          toggleTimer();
        }
      }, 1000);
    } else {
      clearInterval(timerState.interval);
    }

    updateDisplay();
  }

  // Reset timer
  function resetTimer() {
    clearInterval(timerState.interval);
    timerState.isActive = false;

    if (timerState.mode === 'work') {
      timerState.timeLeft = timerState.settings.workTime * 60;
    } else if (timerState.mode === 'shortBreak') {
      timerState.timeLeft = timerState.settings.shortBreakTime * 60;
    } else {
      timerState.timeLeft = timerState.settings.longBreakTime * 60;
    }

    updateDisplay();
  }

  //  Switch timer mode
  function switchMode(mode) {
    clearInterval(timerState.interval);
    timerState.isActive = false;
    timerState.mode = mode;

    if (mode === 'work') {
      timerState.timeLeft = timerState.settings.workTime * 60;
    } else if (mode === 'shortBreak') {
      timerState.timeLeft = timerState.settings.shortBreakTime * 60;
    } else {
      timerState.timeLeft = timerState.settings.longBreakTime * 60;
    }

    updateDisplay();
  }

  // Save settings
  function saveSettings(event) {
    event.preventDefault();

    timerState.settings = {
      workTime: Number.parseInt(workTimeInput.value) || 25,
      shortBreakTime: Number.parseInt(shortBreakTimeInput.value) || 5,
      longBreakTime: Number.parseInt(longBreakTimeInput.value) || 15,
      sessionBeforeLongBreak:
        Number.parseInt(sessionsBeforeLongBreakInput.value) || 4,
    };

    // Update current timer based on new settings
    resetTimer();

    // Close settings modal
    settingsModal.classList.add('hidden');
  }

  // Event Listeners
  toggleBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);
  workBtn.addEventListener('click', () => switchMode('work'));
  shortBreakBtn.addEventListener('click', () => switchMode('shortBreak'));
  longBreakBtn.addEventListener('click', () => switchMode('longBreak'));

  settingsBtn.addEventListener('click', () => {
    // Update settings form with current settings
    workTimeInput.value = timerState.settings.workTime;
    shortBreakTimeInput.value = timerState.settings.shortBreakTime;
    longBreakTimeInput.value = timerState.settings.longBreakTime;
    sessionsBeforeLongBreakInput.value =
      timerState.settings.sessionBeforeLongBreak;

    // Show settings modal
    settingsModal.classList.remove('hidden');
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  settingsForm.addEventListener('submit', saveSettings);

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.classList.add('hidden');
    }
  });

  // Initialize display
  updateDisplay();
});
