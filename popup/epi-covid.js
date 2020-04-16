// Get all main elements by ID
const refresh_btn = document.querySelector("#refresh-btn")
const main_content = document.querySelector("#main-content")
const loader = document.querySelector("#loader")

// Set global variable
var error = false;
var last_update = 0;
var confirmed = 0;
var death = 0;
var recovered = 0;

// Add listener on the refresh button
const debouncedUpdateData = debounce(updateData, 500, null);
refresh_btn.addEventListener("click", debouncedUpdateData);

// When first open, update the data
window.onfocus = updateData

/**
 * This function return a div with the selected class names and data
 * @param {String} class_name
 * @param {Number} data
 */
function createContent(class_name, data) {
  var div = document.createElement("div")
  div.setAttribute("class", class_name)
  var span = document.createElement("span")
  span.textContent = data

  div.appendChild(span)
  return div
}

/**
 * Fills global variable "confirmed", "last_update", "death" and "recovered"
 * @param {Array} data 
 */
function fillData(data) {
  last_update = data[0]["attributes"]["Last_Update"];
  last_update = new Date(last_update).toLocaleTimeString()
  confirmed = 0;
  death = 0;
  recovered = 0;
  for (var i = 0; i != data.length; i++) {
    confirmed += data[i]["attributes"]["Confirmed"]
    recovered += data[i]["attributes"]["Recovered"]
    death += data[i]["attributes"]["Deaths"]
  }
}

/**
 * Inject data contents into the html popup, and supress the previous one
 * @param {Array} data 
 */
function fillContent(data) {
  fillData(data)
  var last_update_content = createContent("content last_update", last_update)
  var confirmed_content = createContent("content confirmed", confirmed)
  var death_content = createContent("content death", death)
  var recovered_content = createContent("content recovered", recovered)

  var contents = document.querySelectorAll(".content")
  for (var i = 0; i != contents.length; i++)
    main_content.removeChild(contents[i])

  main_content.appendChild(last_update_content)
  main_content.appendChild(confirmed_content)
  main_content.appendChild(recovered_content)
  main_content.appendChild(death_content)
}

/**
 * Return the debounded function passed as parameter
 * @param {Function} func
 * @param {Number} wait
 * @param {Any} immediate
 */
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  }
}

/**
 * Fetch arcgis api, retrieve required data and call fillContent()
 */
function updateData() {
  error = false
  loader.setAttribute("class", "loading")
  fetch("https://services1.arcgis.com//0MSEUqKaxRlEPj5g/ArcGIS/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?f=json&where=Confirmed+%3E+0&returnGeometry=false&outFields=Confirmed%2C+Last_Update%2C+Recovered%2C+Deaths&orderByFields=Last_Update+desc&resultRecordCount=1000")
    .then((reponse) => reponse.json())
    .then((data) => {
      loader.setAttribute("class", "")
      fillContent(data["features"])
    })
    .catch((/* error */) => error = true)
}