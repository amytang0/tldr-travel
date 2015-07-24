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

function createEl(elType, className, parentEl) {
  var el = document.createElement(elType);
  el.className = className;
  parentEl.appendChild(el);

  return el;
}

function show(el) {
  el.style.display = "block";
}

function hide(el) {
  el.style.display = "none";
}

//pinColor is hash code without the hashtag
function pinIcon(pinColor) {
  return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

}
