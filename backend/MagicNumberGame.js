const { Pool } = require('pg');
const connectionString =
    'postgres://zvdqqhvfawjiec:b6b7246328753cfb402fd5180d6e97c11572e7a9b7d90ff47a42847cbbe07eed@ec2-23-21-4-7.compute-1.amazonaws.com:5432/d4rua75tj9i9of';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports = class MagicNumberGame {
    static create(sessionId, max) {
        const upperBound = max;
        const magicNumber = getRandomInt(1, max);
        return MagicNumberGame.createGame(sessionId, upperBound, magicNumber);
    }

    static createGame(sessionId, upperBound, magicNumber) {
        return pool.query(
            `
                INSERT INTO magic_number_game_tab
                (session_id, lower_bound, upper_bound, magic_number)
                VALUES
                ($1, 0, $2, $3)
            `,
            [sessionId, upperBound, magicNumber],
        );
    }

    static extractProgress(result) {
        const rows = result.rows[0];
        return [rows.lower_bound, rows.upper_bound, rows.number_of_attempt];
    }

    static progress(sessionId) {
        return pool
            .query(
                `
                SELECT lower_bound, upper_bound, number_of_attempt
                FROM magic_number_game_tab
                WHERE session_id = $1
            `,
                [sessionId],
            )
            .then(MagicNumberGame.extractProgress);
    }

    static updateBounds(sessionId, attempt) {
        return pool
            .query(
                `
                UPDATE magic_number_game_tab 
                SET 
                    number_of_attempt = CASE WHEN lower_bound != upper_bound THEN number_of_attempt + 1 ELSE number_of_attempt END,
                    lower_bound = CASE WHEN $1 <= magic_number THEN $1 ELSE lower_bound END,
                    upper_bound = CASE WHEN $1 >= magic_number THEN $1 ELSE upper_bound END
                WHERE session_id = $2
                RETURNING *
            `,
                [attempt, sessionId],
            )
            .then(MagicNumberGame.extractProgress);
    }

    static guess(sessionId, attempt) {
        return MagicNumberGame.updateBounds(sessionId, attempt);
    }
};
