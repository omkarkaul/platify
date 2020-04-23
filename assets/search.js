async function getAllData(plate) {
    
    const res = await fetch(`http://localhost:8080/${plate}`);
    const json = await res.json();

    updateDOM(json);
};

function updateDOM(data) {
    // update plate-availability
    const plateAvailability = document.getElementById('plate-availability');
    plateAvailability.innerHTML = data.availability? `Availability: True!` : `Availability: False!`
}

const searchElement = document.getElementById('plate-search');
const plateElement = document.getElementById('plate');

searchElement.addEventListener('input', () => {
    const plateValue = searchElement.value;

    if (plateValue !== '') {
        plateElement.innerHTML = searchElement.value;
        getAllData(searchElement.value);
    } else {
        plateElement.innerHTML = 'N/A';
    }
});