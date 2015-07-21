(function() {
  function nameWithCity(name) {
    //cityName and countryName global vars gotten from html
    return name + ", " + cityName + ", " + countryName;
  }

  function attrWithCity(el, attr) {
    return nameWithCity(el.getAttribute(attr));
  }

  var $map = document.getElementById("map-canvas");

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

  var $placesMeta = document.getElementById("places-meta");
  var $places = $placesMeta.getElementsByClassName("place");

  for (var i = 0; i < $places.length; i++) {
    (function($place) {
      var name = $place.getAttribute("data-name");
      var place;

      if (name !== null) {
        place = nameWithCity(name);
      } else {
        place = $place.getAttribute("data-latlng");
      }

      getLatLong(place, function(lat, lng) {
        map.addMarker({
          lat: lat,
          lng: lng,
          infoWindow: {
            content: $place.innerHTML
          }
        });
      });
    })($places[i]);
  }

})();
