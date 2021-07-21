// const host = `https://ades-2b25-magic-number.herokuapp.com/`;
const host = 'http://localhost:8000/';

window.addEventListener('DOMContentLoaded', function () {
    const sessionIdInput = document.getElementById('session-id-input');
    const newSessionIdInput = document.getElementById('new-session-id-input');
    const maxNumberInput = document.getElementById('max-number-input');
    document.getElementById('create-session-button').addEventListener('click', function () {
        document.getElementById('create-session-button').disabled = true;

        if (!newSessionIdInput.reportValidity() || !maxNumberInput.reportValidity()) {
            return;
        }
        const newSessionId = newSessionIdInput.value;
        const maxNumber = maxNumberInput.value;

        fetch(`${host}?new_session_id=${newSessionId}&max_number=${maxNumber}`, { method: 'POST' })
            .then(function (response) {
                document.getElementById('create-session-button').disabled = false;
                return response.json();
            })
            .then(function (json) {
                let sessionId = json.session_id;
                sessionIdInput.value = sessionId;
                sessionId = sessionId.replace(/[0-9]/g, (match) => {
                    return `<span class='number'>${match}</span>`;
                });
                sessionId = sessionId.replace(/[A-Z]/g, (match) => {
                    return `<span class='uppercase'>${match}</span>`;
                });
                document.getElementById('session-id-span').innerHTML = sessionId;
            });
    });

    // 1. Get a reference to the session id input
    // 2. get a reference to the attempt input
    const attemptInput = document.getElementById('attempt-input');
    // 3. get a reference to the submit attempt button
    const submitAttemptButton = document.getElementById('submit-attempt-button');
    // 4. get a reference to the lower bound span
    const lowerBoundSpan = document.getElementById('lower-bound');
    // 5. get a reference to the upper bound span
    const upperBoundSpan = document.getElementById('upper-bound');
    const numberOfAttemptSpan = document.getElementById('number-of-attempt');

    // add click event listener
    submitAttemptButton.addEventListener('click', function () {
        if (!attemptInput.reportValidity()) {
            return;
        }
        // 1. get the session id from the session id input
        const sessionId = sessionIdInput.value;
        // 2. get the attempt from the attempt input
        const attempt = attemptInput.value;

        // create url
        // path: /SESSION_ID
        // query: ?attempt=ATTEMPT
        const url = `${host}${sessionId}?attempt=${attempt}`;
        fetch(url, { method: 'PUT' })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                if (json.error) {
                    throw new Error(json.error);
                }
                // 1. update the lower bound span
                lowerBoundSpan.innerHTML = json[0];
                // 2. update the upper bound span
                upperBoundSpan.innerHTML = json[1];

                numberOfAttemptSpan.innerHTML = json[2];
            })
            .catch(function (err) {
                alert(err.message);
            });
    });

    const refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', function () {
        const sessionId = sessionIdInput.value;
        fetch(`${host}${sessionId}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                if (json.error) {
                    throw new Error(json.error);
                }
                // 1. update the lower bound span
                lowerBoundSpan.innerHTML = json[0];
                // 2. update the upper bound span
                upperBoundSpan.innerHTML = json[1];

                numberOfAttemptSpan.innerHTML = json[2];
            });
    });
});
