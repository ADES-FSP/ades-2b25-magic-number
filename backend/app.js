const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const MagicNumberGame = require('./MagicNumberGame');
const createHttpError = require('http-errors');

const app = express();
app.use(cors());

app.post('/init', function (req, res, next) {
    return MagicNumberGame.init()
        .then(function () {
            return res.sendStatus(200);
        })
        .catch(next);
});

app.post('/', function (req, res, next) {
    const newSessionId = req.query.new_session_id;
    const maxNumber = req.query.max_number || 100;
    const sessionId = newSessionId || nanoid(10);
    return MagicNumberGame.create(sessionId, maxNumber)
        .then(function () {
            return res.json({ session_id: sessionId });
        })
        .catch(next);
});

app.get('/:sessionId', function (req, res, next) {
    const sessionId = req.params.sessionId;
    return MagicNumberGame.progress(sessionId)
        .then(function (progress) {
            return res.json(progress);
        })
        .catch(next);
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
    return game
        .guess(attempt)
        .then(function (progress) {
            return res.json(progress);
        })
        .catch(next);
});

app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Unknown Error!';
    return res.status(status).json({
        error: message,
    });
});

const port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log('App is listening to port ' + port);
});
