/*-------------------------- Ping Pong Game (28/Dec/23) --------------------------------*/

const ball = document.getElementById('ball');
const rod1 = document.getElementById('rod1');
const rod2 = document.getElementById('rod2');

// Define variables for game elements and settings
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let user, score = 0, highScore = 0, winner;
let movement;   // setInterval
let gameOn = false;

/*------------------------------------------------------------------------------------*/

function initializeGame() {
    user = localStorage.getItem("user");
    highScore = localStorage.getItem("highScore");
    if (user == null || highScore == null) {
        user = prompt("Hi!! Welcome to our Game.\nEnter your name:");
        localStorage.setItem("user", user);
    }
    else {
        alert("Hi!! "+ user +" Welcome to our Game.\nHighscore: " + (parseFloat(highScore) * 10));
    }
    resetBoard();
}
initializeGame();


/*------------------------------------------------------------------------------------*/

// Function to reset the game board
function resetBoard() {
    // Set up initial positions of rods and ball
    rod1.style.left = (windowWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (windowWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';
    ball.style.top = (windowHeight - ball.offsetHeight) / 2 + 'px';

    // Implement the logic to position the ball based on the losing player

    // Reset other game-related variables
    score = 0;
    gameOn = false;
}

/*------------------------------------------------------------------------------------*/

// Function to handle winning and update scores
function storeWin(score) {
    // Update max score in local storage
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    clearInterval(movement);

    // Show an alert with the winner and max score
    let resetGame = confirm("Game Over! " + user + " scored " + (score * 10) + ".\nHighscore: " + (parseFloat(highScore) * 10) + "\n\nDo you want to play again?");

    if (resetGame) {
        resetBoard();   // Reset the game board
        // initializeGame();   // Start a new game
    } 
    else {
        alert("Thank you for playing!");
    }
}

/*------------------------------------------------------------------------------------*/

// Function for the main game loop
function gameLoop() {
    let ballSpeedX = 2, ballSpeedY = 2;
    let ballRect = ball.getBoundingClientRect();
    let ballDia = ballRect.width;   // ballDiameeter
    let ballX = ballRect.x;
    let ballY = ballRect.y;
    let rodHeight = rod1.offsetHeight;
    let rodWidth = rod1.offsetWidth;

    // Implement the main game logic, including ball movement and collision detection
    movement = setInterval(function () {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        let rod1X = rod1.getBoundingClientRect().x;
        let rod2X = rod2.getBoundingClientRect().x;

        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';

        // If the ball touches the boundary
        if ((ballX + ballDia) > windowWidth || ballX < 0) {
            ballSpeedX = -ballSpeedX; // Reverse the direction
        }

        // Check for collision with Rod 1
        if (ballY <= rodHeight && ballX >= rod1X && ballX <= (rod1X + rodWidth)) {
            ballSpeedY = -ballSpeedY; // Reverse the direction
            score++;
        }

        // Check for collision with Rod 2
        else if ((ballY + ballDia) >= (windowHeight - rodHeight) && ballX >= rod2X && ballX <= (rod2X + rodWidth)) {
            ballSpeedY = -ballSpeedY; // Reverse the direction
            score++;
        }

        // Check if the game ends
        if (ballY <= 0 || (ballY + ballDia) >= windowHeight) {
            storeWin(score);
        }

        // // Increase speed after a certain score
        // if (score >= increaseSpeedThreshold) {
        //     ballSpeedX += 0.1;
        //     ballSpeedY += 0.1;
        // }

    }, 15);     // animation speed
}

/*------------------------------------------------------------------------------------*/

// Event listener for keyboard input
window.addEventListener('keydown', function (event) {
    let rodSpeed = 20;
    let rodRect = rod1.getBoundingClientRect();

    // Implement logic to move rods and start the game when Enter key is pressed
    if (event.key === 'ArrowLeft' && (rodRect.x > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }
    else if (event.key === 'ArrowRight' && ((rodRect.x + rodRect.width) < windowWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }

    if (event.key === 'Enter' && !gameOn) {
        gameOn = true;
        gameLoop();
    }
});

/*------------------------------------------------------------------------------------*/