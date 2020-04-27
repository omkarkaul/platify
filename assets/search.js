async function getAllData(plate) {
    const res = await fetch(`https://platify-proxy.now.sh/api?plate=${plate}`);
    const json = await res.json();
    console.log(json)
    return json;
};

/** function for clearing the data table if it has any content */
function clearDataTable() {
    const dataTable = document.getElementById('platify-data-table');

    // removing all children except for first child (which is header row)
    while (dataTable.firstChild) {
        if (dataTable.firstElementChild != dataTable.lastElementChild) {
            dataTable.removeChild(dataTable.lastChild);
        } else {
            break;
        }
    };
}

function getBannedKeys() {
    const bannedKeys = new Set();

    bannedKeys.add('rightcar');
    bannedKeys.add('test_regime');
    bannedKeys.add('driver_safety_test');
    bannedKeys.add('fuel_promo_badge');
    bannedKeys.add('pollutants_stars');
    bannedKeys.add('warning_severity');
    bannedKeys.add('warning_message');
    bannedKeys.add('warning_action');
    bannedKeys.add('warning_details');
    bannedKeys.add('safety_promo_badge');
    bannedKeys.add('promo_badge');

    return bannedKeys;
}

function buildRowElement(key, value) {
    const row = document.createElement("div")
    row.className = "row"
    const dataType = document.createElement("div")
    dataType.className = "col-sm"
    dataType.id = "regular-col"
    const data = document.createElement("div")
    data.className = "col-sm"
    data.id = "regular-col"
    
    key = key.replace(/_/g, " ");

    dataType.innerHTML = `<b>${key.toUpperCase()}</b>`;
    data.innerHTML = value;

    row.appendChild(dataType)
    row.appendChild(data)

    return row
}

/** updating platify DOM! */
function updateDOM(json) {
    dataTable.hidden = false;
    const bannedKeys = getBannedKeys();
    
    if (json.status == 200) {
        const plateAvailabile = json['availability']
        
        if (!plateAvailabile) {
            for (let key of Object.keys(json.content)) {
                if (!bannedKeys.has(key)) {
                    const row = buildRowElement(key, json.content[key])
                    dataTable.appendChild(row)
                }
            }
        }
        
    } else if (json.content == null) {
        console.log('Cannot search this plate!');
    } 
    
    else {
        serviceUnavailable();
    }
}

function serviceUnavailable(json) {
    console.log('Service unavailable!')
}

let plateValue;
const searchElement = document.getElementById('plate-search');
const plateSearchButton = document.getElementById('plate-search-button');
const dataTable = document.getElementById('platify-data-table');
dataTable.hidden = true;

searchElement.addEventListener('input', () => {
    plateValue = searchElement.value;
});
searchElement.addEventListener('keypress', async (e) => {
    dataTable.hidden = true;
    if (e.keyCode == 13) {
        plateSearchButton.disabled = true;
        const data = await getAllData(plateValue);
        plateSearchButton.disabled = false;

        clearDataTable();
        updateDOM(data);
    }
}); 

plateSearchButton.addEventListener('click', async () => {
    dataTable.hidden = true;
    plateSearchButton.disabled = true;
    const data = await getAllData(plateValue);
    plateSearchButton.disabled = false;

    clearDataTable();
    updateDOM(data);
});

const aboutButton = document.getElementById('about-button');
aboutButton.addEventListener('click', () => {
    location.assign(`${location.origin}/about`)
});