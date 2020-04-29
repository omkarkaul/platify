const safetyButton = document.getElementById('safety-button');

safetyButton.addEventListener('click', () => {
    location.assign(`${location.origin}/`)
});