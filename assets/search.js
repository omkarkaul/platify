/** fetches data from reverse proxy using user entered plate */
async function getAllData(plate) {
    const res = await fetch(`https://platify-proxy.now.sh/api?plate=${plate}`);
    const json = await res.json();

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

/** builds a hashset of keys for O(1) lookup of banned data types */
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

/** builds a row div element for appending to data table */
function buildRowElement(key, value) {
    const row = document.createElement("div")
    row.className = "row"
    const dataType = document.createElement("div")
    dataType.className = "col-sm"
    dataType.id = "regular-col"
    const data = document.createElement("div")
    data.className = "col-sm"
    data.id = "regular-col"
    
    key = key.replace(/_/g, " "); // replace all underscores with spaces

    dataType.innerHTML = `<b>${key.toUpperCase()}</b>`;
    data.innerHTML = value;

    row.appendChild(dataType)
    row.appendChild(data)

    return row
}

/** updating platify DOM! */
function updateDOM(json) {
    const bannedKeys = getBannedKeys();
    console.log(json)
    if (json.status == 200) {
        const plateAvailabile = json['availability'];
        const content = json['content'];
        const errorCode = json['content']['error_code']

        if (!plateAvailabile && 
            (content !== null || content !== undefined) && 
            (errorCode !== 40 && errorCode !== 30)) {
            // plate is not available and plate is registered to a car

            dataTable.hidden = false;
            
            for (let key of Object.keys(json.content)) {
                if (!bannedKeys.has(key)) {
                    const row = buildRowElement(key, json.content[key])
                    dataTable.appendChild(row)
                }
            }
        } else if (errorCode === 40) {
            // invalid plate            
            alert(`${plateValue} is not a valid plate!`)
            searchElement.value = '';
            plateValue = '';
        } else {
            // plate is available (i.e. plate is not registered to a car)
            alert(`${plateValue} is not registered!`)
            searchElement.value = '';
            plateValue = '';
        }
        
    } else {
        serviceUnavailable('Search service is unavailable! :( \nFile an issue on github.', json)
    }
}

/** called when reverse proxy sends a bad response */
function serviceUnavailable(message, json) {
    //TODO
    alert(message)
    searchElement.value = '';
}

// Listeners and variables ----------------------------------------

let plateValue = '';
const searchElement = document.getElementById('plate-search');
const plateSearchButton = document.getElementById('plate-search-button');
const dataTable = document.getElementById('platify-data-table');
dataTable.hidden = true;

searchElement.addEventListener('input', () => {
    plateValue = searchElement.value;
});
searchElement.addEventListener('keypress', async (e) => {
    dataTable.hidden = true;
    if (e.keyCode == 13 && plateValue != '') {
        plateSearchButton.disabled = true;
        const data = await getAllData(plateValue);
        plateSearchButton.disabled = false;

        clearDataTable();
        updateDOM(data);
    }
}); 

plateSearchButton.addEventListener('click', async () => {
    dataTable.hidden = true;
    if (plateValue != '') {
        plateSearchButton.disabled = true;
        const data = await getAllData(plateValue);
        plateSearchButton.disabled = false;

        clearDataTable();
        updateDOM(data);
    }
});

const aboutButton = document.getElementById('about-button');
aboutButton.addEventListener('click', () => {
    dataTable.hidden = true;
    location.assign(`${location.origin}/about`)
});