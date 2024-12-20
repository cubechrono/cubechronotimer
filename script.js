// Event listeners for PC and mobile
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (!running && !holdStartTime) {
      holdStartTime = Date.now();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (!running) {
      const holdDuration = Date.now() - holdStartTime;
      holdStartTime = null;

      if (isReady && holdDuration >= 150) {
        running = true;
        isReady = false;
        timerElement.textContent = "0.00";
        startTimer();
      }
    } else {
      running = false;
      stopTimer();
      displayScramble();
    }
  }
});

// Touch events for mobile
document.addEventListener("touchstart", (e) => {
  if (!running && !holdStartTime) {
    holdStartTime = Date.now();
  }
});

document.addEventListener("touchend", (e) => {
  if (!running) {
    const holdDuration = Date.now() - holdStartTime;
    holdStartTime = null;

    if (isReady && holdDuration >= 150) {
      running = true;
      isReady = false;
      timerElement.textContent = "0.00";
      startTimer();
    }
  } else {
    running = false;
    stopTimer();
    displayScramble();
  }
});
