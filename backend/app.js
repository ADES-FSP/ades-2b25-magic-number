const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const MagicNumberGame = require('./MagicNumberGame');
const createHttpError = require('http-errors');

const app = express();
app.use(cors());

app.get('/', function (req, res, next) {
    return res.json({
        Hello: "This is a Magic Number Game app's backend, head over to https://ades-fsp.github.io/ades-2b25-magic-number/ to access the game",
        APIs: {
            'Create Session': {
                description: 'Creates a new sessions.',
                method: 'POST',
                path: '/',
                queries: {
                    session_id:
                        '(Optional) Your proposed session id, rejected if already exists. Defaults to a random 10 digit string',
                    max_number: '(Optional) The upper bound of the magic number. Defaults to 100',
                },
            },
            'Submit Attempt': {
                method: 'PUT',
                path: '/:sessionId',
            },
            'Get Progress': {
                method: 'GET',
                path: '/:sessionId',
            },
        },
    });
});

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

    return MagicNumberGame.guess(sessionId, attemptNumber)
        .then(function (progress) {
            return res.json(progress);
        })
        .catch(next);
});

app.use((req, res, next) => next(createHttpError(404, `Unknown resource ${req.method} ${req.originalUrl}`)));

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
