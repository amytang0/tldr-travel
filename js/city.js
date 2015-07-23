var placeObjs = [];
var onlyFaves = false;

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

  function repopulateMarkers() {
    map.removeMarkers();

    for (var i = 0; i < placeObjs.length; i++) {
      if (placeObjs[i].show) {
        if (onlyFaves === false || (onlyFaves && placeObjs[i].favorite)) {
          addMarker(placeObjs[i]);
        }
      }
    }
  }

  function create(elType, className, parentEl) {
    var el = document.createElement(elType);
    el.className = className;
    parentEl.appendChild(el);

    return el;
  }


  function addToList(place) {
    var $listItem = document.createElement('div');
    $listItem.className = "list-item";

    var $info = create('div', "info", $listItem);
    $info.innerHTML = place.content;

    var $cancel = create('button', "cancel", $listItem);
    $cancel.innerHTML = "×";
    $cancel.addEventListener("click", function() {
      $listItem.style.display = "none";
      place.show = false;

      repopulateMarkers();
    });

    var $favorite = create('input', "favorite", $listItem);
    $favorite.setAttribute("type", "checkbox");
    $favorite.addEventListener("click", function() {
      if ($favorite.checked) {
        place.favorite = true;
      } else {
        place.favorite = false;
      }

      if (onlyFaves) {
        repopulateMarkers();
      }
    });

    $list.appendChild($listItem);
  }

  var $placesMeta = document.getElementById("places-meta");
  var $places = $placesMeta.getElementsByClassName("place");

  if ($places.length > 0) {
    //add advanced options
    var $advanced = document.getElementById("advanced-options");

    var $seeFaves = create('input', "see-faves", $advanced);
    $seeFaves.setAttribute("type", "checkbox");
    $seeFaves.addEventListener("click", function() {
      if ($seeFaves.checked) {
        onlyFaves = true;
      } else {
        onlyFaves = false;
      }

      repopulateMarkers();
    });
  }

  for (var i = 0; i < $places.length; i++) {
    (function($place, i) {
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
          index: i,
          show: true,
          favorite: false
        };

        placeObjs.push(placeObj);
        addMarker(placeObj);
        addToList(placeObj);
      });
    })($places[i], i);
  }

})();
