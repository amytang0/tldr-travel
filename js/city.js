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

  var placeObjs = [];
  var onlyFaves = false;

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

  //hide and show the markers and items on list by type
  function toggleType(type, showBool) {
    for (var i = 0; i < placeObjs.length; i++) {
      if (placeObjs[i].type === type) {
        placeObjs[i].show = showBool;

        if (showBool) {
          show(placeObjs[i].$el);
        } else {
          hide(placeObjs[i].$el);
        }
      }
    }
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

  function addToList(place) {
    var $listItem = document.createElement('div');
    $listItem.className = "list-item";

    var $info = createEl('div', "info", $listItem);
    $info.innerHTML = place.content;

    var $price = createEl("div", "price", $info);
    $price.innerHTML = place.price;

    var $type = createEl("div", "type", $info);
    $type.innerHTML = place.type;

    var $link = createEl("a", "link", $info);
    $link.innerHTML = "link";
    $link.setAttribute("href", place.link);
    $link.setAttribute("target", "_blank");

    var $cancel = createEl('button', "cancel", $listItem);
    $cancel.innerHTML = "×";
    $cancel.addEventListener("click", function() {
      hide($listItem);
      place.show = false;

      repopulateMarkers();
    });

    var $favorite = createEl('input', "favorite", $listItem);
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
    place.$el = $listItem;
  }

  var $placesMeta = document.getElementById("places-meta");
  var $places = $placesMeta.getElementsByClassName("place");

  if ($places.length > 0) {
    //add options
    var $options = document.getElementById("options");
    show($options);

    var $seeFaves = document.getElementById("see-faves");
    $seeFaves.addEventListener("click", function() {
      if ($seeFaves.checked) {
        onlyFaves = true;
      } else {
        onlyFaves = false;
      }

      repopulateMarkers();
    });

    var $advancedToggle = document.getElementById("advanced-toggle");
    var $advancedOptions = document.getElementById("advanced-options");
    $advancedToggle.addEventListener("click", function() {
      if ($advancedToggle.checked) {
        show($advancedOptions);
      } else {
        hide($advancedOptions);
      }
    });

    //TODO: event listener on sort
    //TODO: implement sorts
    //TODO: default sort by category

    //click to filter down categories
    var $filters = document.getElementsByClassName("type-check");
    for (var i = 0; i < $filters.length; i++) {
      (function($filter) {
        $filter.addEventListener("click", function() {
          if ($filter.checked) {
            toggleType($filter.value, true);
          } else {
            toggleType($filter.value, false);
          }

          repopulateMarkers();
        });
      })($filters[i]);
    }
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
          price: price,
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
