async function search(plate) {
    if (plate != '') {
        const res = await fetch(`https://api.kiwiplates.nz/api//combination/${plate}/?vehicleTypeId=1`);
        const json = await res.json();
    };
    // getAvailability(plate);
}

const searchElement = document.getElementById('plate-search');

searchElement.addEventListener('input', () => {
    search(searchElement.value);
})