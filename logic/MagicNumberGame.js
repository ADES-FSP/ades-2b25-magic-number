function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = class MagicNumberGame {
    constructor(max) {
        this.lowerBound = 0;
        this.upperBound = max;
        this.magicNumber = getRandomInt(1, max);
    }

    progress() {
        return [this.lowerBound, this.upperBound];
    }

    guess(attempt) {
        if (attempt < this.magicNumber) {
            this.lowerBound = attempt;
        } else if (attempt > this.magicNumber) {
            this.upperBound = attempt;
        } else {
            this.lowerBound = attempt;
            this.upperBound = attempt;
        }
        return this.progress();
    }
};
