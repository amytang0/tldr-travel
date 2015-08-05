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
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
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

function show(el, display) {
  var style = "block";

  if (display !== undefined) {
    style = display;
  }

  el.style.display = style;
}

function hide(el) {
  el.style.display = "none";
}

function toggle(el, bool) {
  if (bool) {
    show(el);
  } else {
    hide(el);
  }
}

//pinColor is hash code without the hashtag
function pinIcon(pinColor) {
  return new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));

}

function getParam(key) {
  key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
  var results = regex.exec(location.search);

  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setParam(key, value) {
  key = encodeURI(key);
  value = encodeURI(value);

  var kvp = document.location.search.substr(1).split('&');
  var currentPath = window.location.pathname;
  var params = "?";

  if (kvp.length === 1 && kvp[0] === "") {
    params += key + "=" + value;
  } else {
    var i = kvp.length;

    while(i--) {
      var x = kvp[i].split('=');

      if (x[0] === key) {
        x[1] = value;
        kvp[i] = x.join('=');
        break;
      }
    }

    if (i < 0) {
      kvp[kvp.length] = [key, value].join('=');
    }

    params += kvp.join("&");
  }

  if (window.history.replaceState) {
    window.history.replaceState("", "", currentPath + params);
  } else {
    //this will reload the page, better to change history if option available
    document.location.search = params;
  }
}

function capitalize(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function urlize(str) {
  return str.replace(" ", "_").toLowerCase();
}

function blankHrefs() {
  var main = document.getElementById("main");
  var as = main.getElementsByTagName("a");

  for (var i = 0; i < as.length; i++) {
    as[i].setAttribute("target", "_blank");
  }
}
