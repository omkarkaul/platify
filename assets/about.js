const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => {
    location.assign(`${location.origin}/search`)
});