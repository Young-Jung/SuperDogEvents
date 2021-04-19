var eventsArray = [{
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 240000,
        eventDate: "06/01/2017",
    },
    {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 250000,
        eventDate: "06/01/2018",
    }, {
        event: "ComicCon",
        city: "New York",
        state: "New York",
        attendance: 257000,
        eventDate: "06/01/2019",
    }, {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 130000,
        eventDate: "06/01/2017",
    }, {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 140000,
        eventDate: "06/01/2018",
    }, {
        event: "ComicCon",
        city: "San Diego",
        state: "California",
        attendance: 150000,
        eventDate: "06/01/2019",
    }, {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 40000,
        eventDate: "06/01/2017",
    }, {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 45000,
        eventDate: "06/01/2018",
    }, {
        event: "HeroesCon",
        city: "Charlotte",
        state: "North Carolina",
        attendance: 50000,
        eventDate: "06/01/2019",
    },
];
// the default display is all events
var filteredEvents = eventsArray;

// build a dropdown of specific cities
function buildDropDown() {
    displayDropDown();
    displayStats();
    displayData();
}

function displayDropDown() {
    var eventDD = document.getElementById("eventDropDown");
    let curEvents = [];
    curEvents = getData();
    let distinctEvents = [...new Set(curEvents.map((ev) => ev.city))];

    let linkHTMLEnd =
        '<div class="dropdown-divider"></div><a class="dropdown-item" onclick="getEvents(this)" data-string="All" >All</a>';
    let resultHTML = "";

    for (let i = 0; i < distinctEvents.length; i++) {
        resultHTML += `<a class="dropdown-item" onclick="getEvents(this)" data-string="${distinctEvents[i]}">${distinctEvents[i]}</a>`;

    }
    resultHTML += linkHTMLEnd;
    eventDD.innerHTML = resultHTML;
}

function getData() {
    let curEvents = JSON.parse(localStorage.getItem("storageArray")) || [];

    if (curEvents.length == 0) {
        curEvents = eventsArray;
        localStorage.setItem("storageArray", JSON.stringify(curEvents));
    }

    return curEvents;
}

function getEvents(element) {
    // getFiltering
    let city = element.getAttribute("data-string");
    getFiltering(city);
    displayStats();
}



function getFiltering(city) {
    curEvents = JSON.parse(localStorage.getItem("storageArray")) || eventsArray;
    filteredEvents = curEvents;
    document.getElementById("statsHeader").innerHTML = `Stats For ${city} Events`;
    if (city != "All") {
        //Explain how array filtering works-
        filteredEvents = curEvents.filter(function (item) {
            if (item.city == city) {
                return item;
            }
        });
    }
}

// Save Events
function saveEvent() {
    // Save Local Storage
    let curEvents = JSON.parse(localStorage.getItem("storageArray")) || eventsArray;

    let obj = {};
    obj["event"] = document.getElementById("newEvent").value;
    obj["city"] = document.getElementById("newCity").value;
    obj["state"] = document.getElementById("newState").value;
    obj["attendance"] = document.getElementById("newAttendance").value;
    // let eventDate = document.getElementById("newEventDate").value;
    // let eventDate2 = `${eventDate} 00:00`;
    // obj["eventDate"] = new Date(eventDate2).toLocaleDateString();
    obj["eventDate"] = formatDate(document.getElementById("newEventDate").value);

    curEvents.push(obj);

    localStorage.setItem("storageArray", JSON.stringify(curEvents));
    if (obj["city"] == "") {
        city = "All";
    } else {
        city = obj["city"];
    }

    getFiltering(city);
    buildDropDown();
}





function displayStats() {
    let total = 0;
    let average = 0;
    let most = 0;
    let least = -1;
    let currentAttendence = 0;

    for (let i = 0; i < filteredEvents.length; i++) {
        currentAttendance = parseInt(filteredEvents[i].attendance);
        total += currentAttendance;

        if (most < currentAttendance) {
            most = currentAttendance;
        }

        if (least > currentAttendance || least < 0) {
            least = currentAttendance;
        }
    }

    average = total / filteredEvents.length;
    document.getElementById("total").innerHTML = total.toLocaleString();
    document.getElementById("most").innerHTML = most.toLocaleString();
    document.getElementById("least").innerHTML = least.toLocaleString();
    document.getElementById("average").innerHTML = average.toLocaleString(
        undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }
    );
}

function displayData() {
    const template = document.getElementById("Data-Template");
    const resultsBody = document.getElementById("resultsBody");
    // Clear table first
    resultsBody.innerHTML = "";
    curEvents = JSON.parse(localStorage.getItem("storageArray")) || [];

    if (curEvents.length == 0) {
        curEvents = eventsArray;
        localStorage.setItem("storageArray", JSON.stringify(curEvents));
    }

    // same as importNode (can be outside this html)

    for (let i = 0; i < curEvents.length; i++) {
        const dataRow = document.importNode(template.content, true);

        dataRow.getElementById("event").textContent = curEvents[i].event;
        dataRow.getElementById("city").textContent = curEvents[i].city;
        dataRow.getElementById("state").textContent = curEvents[i].state;
        dataRow.getElementById("attendance").textContent = curEvents[i].attendance;
        dataRow.getElementById("eventDate").textContent = curEvents[i].eventDate;
        //dataRow.getElementById("eventDate").textContent = formatPhoneNumber(curEvents[i].eventDate);

        // Add the row to the page
        resultsBody.appendChild(dataRow);
    }
}

function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return [month, day, year].join('/');
}