const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const userCar = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", 4, "red");

const N = 600;
const cars = generateCars(N);
let bestCar = cars[0];

const countdownElement = document.getElementById("countdown-text");
const countdownContainer = document.getElementById("countdown");

// Variable to store the adjusted start time
let adjustedStartTime;

function startCountdown() {
    let count = 3;
    countdownElement.innerText = count;
    countdownContainer.style.display = "flex";

    const interval = setInterval(() => {
        count--;
        countdownElement.innerText = count;
        if (count < 0) {
            clearInterval(interval);
            countdownContainer.style.display = "none"; // Hide countdown
            adjustedStartTime = Date.now(); // Set adjusted start time after countdown
            startRace(); // Start the race
        }
    }, 1000);
}

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i !== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(1), -900, 30, 50, "DUMMY", 3, getRandomColor()),
    new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 3, getRandomColor())
];

// Set finish line just after the last traffic car
road.finishLineY = Math.min(...traffic.map(car => car.y)) - 200;

let raceOver = false;

function startRace() {
    animate(); // Start the animation loop
}

// Show countdown and start it
startCountdown();

function save() {
    // Save the best car's brain to localStorage
    const data = JSON.stringify(bestCar.brain);
    localStorage.setItem("bestBrain", data);
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

const bestCarTrajectory = [];

function animate(time) {
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    if (!raceOver) {
        // Calculate elapsed time since the race started
        let elapsedTime = ((Date.now() - adjustedStartTime) / 1000).toFixed(2);
        document.getElementById("timer").innerText = `Time: ${elapsedTime} s`;
    }

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    userCar.update(road.borders, traffic);

    road.updateFinishLine(traffic);

    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));

    if (!raceOver) {
        bestCarTrajectory.push({ x: bestCar.x, y: bestCar.y });
    }

    const carToFollow = userCar.y > bestCar.y ? bestCar : userCar;

    carCtx.save();
    carCtx.translate(0, -carToFollow.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }

    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);
    userCar.draw(carCtx, false);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    if (!raceOver) {
        // Check for collisions with traffic cars
        for (let i = 0; i < traffic.length; i++) {
            if (detectCollision(userCar, traffic[i])) {
                endGame("AI Car Wins!"); // Trigger game over
                return;
            }
        }

        // Check for collisions with road borders
        if (road.borders.some(border => detectCollision(userCar, border))) {
            endGame("AI Car Wins!"); // Trigger game over
            return;
        }

        // End the race if any car (AI or user) crosses the finish line
        if (userCar.y < road.finishLineY || bestCar.y < road.finishLineY) {
            raceOver = true;
            const winner = userCar.y < bestCar.y ? 'You beat AI Car!' : 'AI Car Wins!';
            endGame(winner);
            document.getElementById("raceStatus").innerText = `Race Finished! Winner: ${winner}`;
            document.getElementById("game-over").style.display = "flex";
            localStorage.setItem("bestCarTrajectory", JSON.stringify(bestCarTrajectory));
        }
    }

    requestAnimationFrame(animate);
}

function detectCollision(car1, car2) {
    return (
        car1.x < car2.x + car2.width &&
        car1.x + car1.width > car2.x &&
        car1.y < car2.y + car2.height &&
        car1.y + car1.height > car2.y
    );
}

function endGame(message) {
    raceOver = true;
    document.getElementById("raceStatus").innerText = message;

    if (message === "You beat AI Car!") {
        document.getElementById("trophy-icon").style.display = "block"; // Show trophy icon
    } else {
        document.getElementById("trophy-icon").style.display = "none"; // Hide trophy icon if not winning
    }

    document.getElementById("game-over").style.display = "flex";
    localStorage.setItem("bestCarTrajectory", JSON.stringify(bestCarTrajectory));
}



function restartGame() {
    document.getElementById("game-over").style.display = "none";
    location.reload(); // Reloads the page to restart the game
}
