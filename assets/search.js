async function getAllData(plate) {
    const res = await fetch(`http://localhost:8080/plate`);
    const json = await res.json();

    updateDOM(json);
};

function updateDOM(data) {
    console.log(data);
}

const searchElement = document.getElementById('plate-search');

searchElement.addEventListener('input', () => {
    getAllData(searchElement.value);
})