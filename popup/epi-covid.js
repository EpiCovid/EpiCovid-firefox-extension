const refresh_btn = document.querySelector("#refresh-btn")
const main_content = document.querySelector("#main-content")
var error = false;
var last_update = 0;
var confirmed = 0;
var death = 0;
var recovered = 0;

refresh_btn.addEventListener("click", updateData);

function fillContent(data)
{
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
  var last_update_content = document.createElement("div")
  last_update_content.setAttribute("class", "content last_update")
  var last_update_text = document.createElement("p")
  last_update_text.textContent = "last update : " + last_update
  last_update_content.appendChild(last_update_text)

  var confirmed_content = document.createElement("div")
  confirmed_content.setAttribute("class", "content confirmed")
  var confirmed_text = document.createElement("p")
  confirmed_text.textContent = "confirmed : " + confirmed
  confirmed_content.appendChild(confirmed_text)

  var death_content = document.createElement("div")
  death_content.setAttribute("class", "content death")
  var death_text = document.createElement("p")
  death_text.textContent = "death : " + death
  death_content.appendChild(death_text)

  var recovered_content = document.createElement("div")
  recovered_content.setAttribute("class", "content recovered")
  var recovered_text = document.createElement("p")
  recovered_text.textContent = "recovered : " + recovered
  recovered_content.appendChild(recovered_text)

  var contents = document.querySelectorAll(".content")
  for (var i = 0; i != contents.length; i++)
    main_content.removeChild(contents[i])

  main_content.appendChild(last_update_content)
  main_content.appendChild(confirmed_content)
  main_content.appendChild(recovered_content)
  main_content.appendChild(death_content)
}

window.onfocus = start
function start() {
  updateData();
}

function updateData() {
  fetch("https://services1.arcgis.com//0MSEUqKaxRlEPj5g/ArcGIS/rest/services/Coronavirus_2019_nCoV_Cases/FeatureServer/1/query?f=json&where=Confirmed+%3E+0&returnGeometry=false&outFields=Confirmed%2C+Last_Update%2C+Recovered%2C+Deaths&orderByFields=Last_Update+desc&resultRecordCount=1000")
  .then((reponse) => reponse.json())
  .then((data) => {
    fillContent(data["features"])
  })
  .catch((/* error */) => error = true)
}