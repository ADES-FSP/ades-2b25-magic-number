const MagicNumberGame = require('./MagicNumberGame');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const attempts = [];

for (let x = 0; x < 1000000; x++) {
    // Create a game from 0 to 100
    let lowerBound = 0;
    let upperBound = 1000;
    const game1 = new MagicNumberGame(upperBound);

    // guess from 1 to magicNumber
    let i, count;
    for (i = lowerBound, count = 1; i < upperBound; i++, count++) {
        // for (i = lowerBound, count = 1; i < upperBound; i = getRandomInt(lowerBound + 1, upperBound), count++) {
        // for (i = lowerBound, count = 1; i < upperBound; i = Math.floor((upperBound + lowerBound) / 2), count++) {
        const attempt = i;
        const progress = game1.guess(attempt);
        lowerBound = progress[0];
        upperBound = progress[1];
    }
    attempts.push(count);
}

let total = 0;
for (let i = 0; i < attempts.length; i++) {
    total += attempts[i];
}
console.log(`Average number of attempt: ${total / attempts.length}`);
