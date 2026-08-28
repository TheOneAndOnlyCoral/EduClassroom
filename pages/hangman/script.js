/* ==========================================
   WORD DATABASE
========================================== */

const levels = {

    1: [
        "vex",
        "aver",
        "zeal",
        "infer"
    ],

    2: [
        "banal",
        "depict",
        "eulogy",
        "dearth",
        "imply",
        "fawn"
    ],

    3: [
        "guile",
        "mitigate",
        "extant",
        "catalyst",
        "lucid",
        "dogged",
        "cadge",
        "abscond"
    ],

    4: [
        "caprice",
        "diffident",
        "esoteric",
        "depredation",
        "barefaced",
        "antipathy",
        "tractable",
        "ephemeral",
        "corporal",
        "enigma"
    ],

    5: [
        "amalgamate",
        "conflagration",
        "iconoclast",
        "improvidence",
        "pulchritudinous",
        "nefarious",
        "sagacious",
        "antediluvian",
        "gossamer",
        "audacious",
        "ponderous",
        "ineffable"
    ]

};


/* ==========================================
   GAME VARIABLES
========================================== */

let gameWord = "";

let selectedLevel = 1;

let lives = 10;

let guessedLetters = [];

let gameOver = false;


/* ==========================================
   ELEMENTS
========================================== */

const levelScreen =
    document.getElementById("levelScreen");

const gameScreen =
    document.getElementById("gameScreen");

const wordDisplay =
    document.getElementById("word");

const keyboard =
    document.getElementById("keyboard");

const livesDisplay =
    document.getElementById("lives");

const message =
    document.getElementById("message");

const levelDisplay =
    document.getElementById("currentLevel");

const hintDisplay =
    document.getElementById("hint");

const hintButton =
    document.getElementById("hintButton");

const restartButton =
    document.getElementById("restartButton");


/* ==========================================
   CANVAS
========================================== */

const canvas =
    document.getElementById("hangman");

const ctx =
    canvas.getContext("2d");


/* ==========================================
   START GAME
========================================== */

function startGame(level) {

    selectedLevel = level;

    const words = levels[level];

    gameWord =
        words[
            Math.floor(
                Math.random() * words.length
            )
        ];

    lives = 10;

    guessedLetters = [];

    gameOver = false;

    levelScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    levelDisplay.textContent =
        "LEVEL " + level;

    hintDisplay.textContent = "";

    message.textContent =
        "Choose a letter!";

    createKeyboard();

    updateWord();

    updateLives();

    drawHangman();

}


/* ==========================================
   KEYBOARD
========================================== */

function createKeyboard() {

    keyboard.innerHTML = "";

    const alphabet =
        "abcdefghijklmnopqrstuvwxyz";

    alphabet.split("").forEach(letter => {

        const button =
            document.createElement("button");

        button.className = "key";

        button.textContent =
            letter.toUpperCase();

        button.dataset.letter =
            letter;

        button.addEventListener(
            "click",
            () => guessLetter(letter)
        );

        keyboard.appendChild(button);

    });

}


/* ==========================================
   GUESS LETTER
========================================== */

function guessLetter(letter) {

    if(gameOver)
        return;

    if(guessedLetters.includes(letter))
        return;

    guessedLetters.push(letter);

    const button =
        document.querySelector(
            `[data-letter="${letter}"]`
        );

    if(button)
        button.disabled = true;


    if(gameWord.includes(letter)) {

        message.textContent =
            "Correct! ✨";

        updateWord();

        checkWin();

    } else {

        lives--;

        message.textContent =
            "Not quite...";

        updateLives();

        drawHangman();

        if(lives <= 0) {

            loseGame();

        }

    }

}


/* ==========================================
   DISPLAY WORD
========================================== */

function updateWord() {

    wordDisplay.innerHTML = "";

    for(const letter of gameWord) {

        const span =
            document.createElement("div");

        span.className =
            "letter";

        if(guessedLetters.includes(letter)) {

            span.textContent =
                letter.toUpperCase();

        } else {

            span.textContent = "";

        }

        wordDisplay.appendChild(span);

    }

}


/* ==========================================
   CHECK WIN
========================================== */

function checkWin() {

    const won =
        [...gameWord].every(
            letter =>
                guessedLetters.includes(letter)
        );

    if(won) {

        gameOver = true;

        message.textContent =
            "🎉 You found the word!";

        disableKeyboard();

    }

}


/* ==========================================
   LOSE
========================================== */

function loseGame() {

    gameOver = true;

    message.textContent =
        "💀 Game over! The word was " +
        gameWord.toUpperCase();

    guessedLetters =
        [...new Set(
            [...guessedLetters, ...gameWord]
        )];

    updateWord();

    disableKeyboard();

}


/* ==========================================
   LIVES
========================================== */

function updateLives() {

    livesDisplay.textContent =
        lives;

}


/* ==========================================
   DISABLE KEYBOARD
========================================== */

function disableKeyboard() {

    document
        .querySelectorAll(".key")
        .forEach(button => {

            button.disabled = true;

        });

}


/* ==========================================
   HINT
========================================== */

hintButton.addEventListener(
    "click",
    function() {

        if(gameOver)
            return;

        const hints = {

            1:
                "A short and simple word.",

            2:
                "This word is a little more challenging.",

            3:
                "Think carefully about the meaning.",

            4:
                "This is an advanced vocabulary word.",

            5:
                "Only the strongest vocabulary will survive this one."

        };

        hintDisplay.textContent =
            "💡 " + hints[selectedLevel];

    }
);


/* ==========================================
   RESTART
========================================== */

restartButton.addEventListener(
    "click",
    function() {

        gameScreen.classList.add("hidden");

        levelScreen.classList.remove("hidden");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }
);


/* ==========================================
   HANGMAN DRAWING
========================================== */

function drawHangman() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeStyle =
        "#a66cff";

    ctx.lineWidth = 4;

    ctx.shadowBlur = 12;

    ctx.shadowColor =
        "#8c5cff";

    ctx.lineCap =
        "round";


    /* Gallows */

    if(lives <= 9) {

        line(
            35, 175,
            35, 20
        );

    }

    if(lives <= 8) {

        line(
            35, 20,
            135, 20
        );

    }

    if(lives <= 7) {

        line(
            135, 20,
            135, 45
        );

    }


    /* Head */

    if(lives <= 6) {

        ctx.beginPath();

        ctx.arc(
            135,
            65,
            20,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    /* Body */

    if(lives <= 5) {

        line(
            135, 85,
            135, 125
        );

    }


    /* Left arm */

    if(lives <= 4) {

        line(
            135, 95,
            105, 115
        );

    }


    /* Right arm */

    if(lives <= 3) {

        line(
            135, 95,
            165, 115
        );

    }


    /* Left leg */

    if(lives <= 2) {

        line(
            135, 125,
            108, 160
        );

    }


    /* Right leg */

    if(lives <= 1) {

        line(
            135, 125,
            162, 160
        );

    }

}


/* Draw line */

function line(
    x1,
    y1,
    x2,
    y2
) {

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.stroke();

}


/* ==========================================
   INTERACTIVE STARFIELD
========================================== */

const space =
    document.getElementById("space");

const starCtx =
    space.getContext("2d");

let stars = [];

const mouse = {

    x: window.innerWidth / 2,

    y: window.innerHeight / 2

};


/* Resize */

function resizeSpace() {

    space.width =
        window.innerWidth;

    space.height =
        window.innerHeight;

}

resizeSpace();

window.addEventListener(
    "resize",
    resizeSpace
);


/* Mouse */

window.addEventListener(
    "mousemove",
    event => {

        mouse.x =
            event.clientX;

        mouse.y =
            event.clientY;

    }
);


/* Create stars */

function createStars() {

    stars = [];

    const amount =
        Math.min(
            550,
            Math.floor(
                window.innerWidth *
                window.innerHeight /
                2300
            )
        );

    for(
        let i = 0;
        i < amount;
        i++
    ) {

        stars.push({

            x:
                Math.random()
                * space.width,

            y:
                Math.random()
                * space.height,

            size:
                Math.random()
                * 1.8 + .3,

            speed:
                Math.random()
                * .25 + .05,

            brightness:
                Math.random()
                * .7 + .3,

            twinkle:
                Math.random()
                * Math.PI * 2

        });

    }

}

createStars();


/* Animate stars */

function animateStars(time) {

    starCtx.clearRect(
        0,
        0,
        space.width,
        space.height
    );


    stars.forEach(star => {

        const dx =
            star.x - mouse.x;

        const dy =
            star.y - mouse.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const radius = 130;


        /* Mouse repulsion */

        if(distance < radius) {

            const force =
                (radius - distance)
                / radius;

            const angle =
                Math.atan2(dy, dx);

            star.x +=
                Math.cos(angle)
                * force
                * 4;

            star.y +=
                Math.sin(angle)
                * force
                * 4;

        }


        /* Star movement */

        star.y +=
            star.speed;


        /* Wrap around */

        if(
            star.y >
            space.height + 5
        ) {

            star.y = -5;

            star.x =
                Math.random()
                * space.width;

        }


        /* Twinkle */

        const alpha =
            star.brightness +
            Math.sin(
                time * .002 +
                star.twinkle
            ) * .2;


        starCtx.beginPath();

        starCtx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        starCtx.fillStyle =
            `rgba(
                255,
                255,
                255,
                ${Math.max(.1, alpha)}
            )`;

        starCtx.fill();

    });


    requestAnimationFrame(
        animateStars
    );

}

requestAnimationFrame(
    animateStars
);
