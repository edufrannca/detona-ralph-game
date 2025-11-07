const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        livesDisplay: document.querySelector(".menu-lives h2"),
        startBtn: document.querySelector("#start-btn"),
        restartBtn: document.querySelector("#restart-btn"),
    },
    values: {
        gameVelocity: 450,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lives: 3,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};


function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play().catch(() => {});
}


function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}


function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endRound(); // 🆕 função que trata o fim da rodada
    }
}


function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }
        });
    });
}


function startGame() {
    state.values.result = 0;
    state.values.currentTime = 60;

    state.view.score.textContent = 0;
    state.view.timeLeft.textContent = 60;
    state.view.startBtn.style.display = "none";
    state.view.restartBtn.style.display = "none";

    state.actions.timerId = setInterval(randomSquare, 490);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}


function restartGame() {
    startGame();
}


function endRound() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    // Diminui uma vida
    state.values.lives--;
    state.view.livesDisplay.textContent = `x${state.values.lives}`;

    if (state.values.lives > 0) {
        alert(`Game Over! Restam ${state.values.lives} vida(s).`);
        state.view.restartBtn.style.display = "inline-block";
    } else {
        alert("GAME OVER FINAL! 😵 Você perdeu todas as vidas!");
        resetGame();
    }
}


function resetGame() {
    state.values.lives = 3;
    state.values.result = 0;
    state.values.currentTime = 60;

    state.view.livesDisplay.textContent = "x3";
    state.view.score.textContent = 0;
    state.view.timeLeft.textContent = 60;

    state.view.startBtn.style.display = "inline-block";
    state.view.restartBtn.style.display = "none";
}


function init() {
    addListenerHitBox();

    // Desbloquear som no primeiro clique
    document.addEventListener(
        "click",
        () => {
            const unlock = new Audio();
            unlock.play().catch(() => {});
        },
        { once: true }
    );

    state.view.startBtn.addEventListener("click", startGame);
    state.view.restartBtn.addEventListener("click", restartGame);
}

init();
