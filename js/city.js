var placeObjs = [];

(function() {
  function nameWithCity(name) {
    //cityName and countryName global vars gotten from html
    return name + ", " + cityName + ", " + countryName;
  }

  function attrWithCity(el, attr) {
    return nameWithCity(el.getAttribute(attr));
  }

  var $map = document.getElementById("map-canvas");
  var $list = document.getElementById("places-list");

  //init map
  var mapLat = getFloat($map, "data-lat");
  var mapLng = getFloat($map, "data-lng");
  var zoom = getFloat($map, "data-zoom");

  var map = new GMaps({
    div: '#map-canvas',
    lat: mapLat,
    lng: mapLng,
    zoom: zoom
  });

  function addMarker(m) {
    map.addMarker({
      lat: m.lat,
      lng: m.lng,
      infoWindow: {
        content: m.content
      }
    });
  }

  function addMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].show) {
        addMarker(markers[i]);
      }
    }
  }

  function addToList(place) {
    var listItem = document.createElement('div');
    listItem.className = "list-item";
    listItem.innerHTML = place.content;
    $list.appendChild(listItem);
  }

  var $placesMeta = document.getElementById("places-meta");
  var $places = $placesMeta.getElementsByClassName("place");

  for (var i = 0; i < $places.length; i++) {
    (function($place) {
      var name = $place.getAttribute("data-name");
      var type = $place.getAttribute("data-type");
      var link = $place.getAttribute("data-link");
      var price = getInt($place, "data-price");
      var place;

      if (name !== null) {
        place = nameWithCity(name);
      } else {
        place = $place.getAttribute("data-latlng");
      }

      //TODO: change color of marker based on type

      getLatLong(place, function(lat, lng) {
        var placeObj = {
          lat: lat,
          lng: lng,
          name: place,
          type: type,
          link: link,
          content: $place.innerHTML,
          show: true
        };

        placeObjs.push(placeObj);
        addMarker(placeObj);
        addToList(placeObj);
      });
    })($places[i]);
  }

})();
