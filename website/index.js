window.addEventListener('DOMContentLoaded', function () {
    const sessionIdInput = document.getElementById('session-id-input');
    document.getElementById('create-session-button').addEventListener('click', function () {
        document.getElementById('create-session-button').disabled = true;

        fetch(`http://localhost:8000/`, { method: 'POST' })
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
        const url = `http://localhost:8000/${sessionId}?attempt=${attempt}`;
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
            })
            .catch(function (err) {
                alert(err.message);
            });
    });
});
