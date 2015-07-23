var COLORS = [
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#98df8a",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5"
];

var TYPE_COLORS = {
  "sightseeing": "red", //historical landmarks, touristy things
  "food": "brown", //restaurants and food experiences
  "shopping": "blue", //cool shops
  "nature": "green", //parks, hikes, nice scenery
  "nightlife": "purple", //clubs, bars
  "experience": "black", //cool things to try at least once
  "other": "orange" //misc
}

function callAjax(url, callback){
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getColor(i) {
  return COLORS[i];
};

function getFloat(el, attr) {
  return parseFloat(el.getAttribute(attr));
}

function getInt(el, attr) {
  return parseInt(el.getAttribute(attr), 10);
}

//trigger callback if can get lat long for a place name. otherwise gracefully fail
function getLatLong(place, callback) {
  GMaps.geocode({
    address: place,
    callback: function(results, status) {
      if (status == "OK") {
        var latlng = results[0].geometry.location;
        callback(latlng.lat(), latlng.lng());
      } else {
        console.log("Didn't find a match for " + place);
      }
    }
  })
}
