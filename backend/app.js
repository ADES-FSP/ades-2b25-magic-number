const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const MagicNumberGame = require('../logic/MagicNumberGame');
const createHttpError = require('http-errors');

const app = express();
app.use(cors());

const sessions = {};

app.post('/', function (req, res) {
    const sessionId = nanoid(10);
    sessions[sessionId] = new MagicNumberGame(100);
    return res.json({ session_id: sessionId });
});

// create middleware
app.put('/:sessionId', function (req, res, next) {
    const sessionId = req.params.sessionId;
    const attempt = req.query.attempt;

    if (isNaN(attempt)) {
        // hint: go google "How to check if variable is a number"
        // if attempt is NOT A NUMBER
        next(createHttpError(400, 'Attempt is NOT A NUMBER (╯°□°)╯︵ ┻━┻'));
    }
    const attemptNumber = +attempt;
    if (!Number.isInteger(attemptNumber)) {
        // hint: "How to check if variable is integer javasciprt"
        // if attemptNumber is NOT AN INTEGER
        return next(createHttpError(400, 'Attempt is NOT AN INTEGER (╯°□°)╯︵ ┻━┻'));
    }

    if (attemptNumber < 0) {
        // if attemptNumber is NOT POSITIVE
        return next(createHttpError(400, 'Attempt is NOT A POSITIVE INTEGER (╯°□°)╯︵ ┻━┻'));
    }

    const game = sessions[sessionId];
    const progress = game.guess(attempt);
    // send the progress as json string in the body of the response.
    return res.json(progress);
});

app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Unknown Error!';
    return res.status(status).json({
        error: message,
    });
});

app.listen(8000, function () {
    console.log('App is listening to port 8000');
});
