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
  var colors = [
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
  ]
  return colors[i];
};

function getFloat(el, attr) {
  return parseFloat(el.getAttribute(attr));
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
