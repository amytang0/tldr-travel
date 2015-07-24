(function() {
  function nameWithCity(name) {
    //cityName and countryName global vars gotten from html
    return name + ", " + cityName + ", " + countryName;
  }

  function attrWithCity(el, attr) {
    return nameWithCity(el.getAttribute(attr));
  }

  //object keys have to maintain same as values from city.html layout's checkboxes
  var TYPE_INFO = {
    sightseeing: {
      color: "D11919", //red
      description: "historical landmarks, touristy things"
    },
    food: {
      color: "FFCC00", //yellow
      description: "restaurants and food experiences"
    },
    shopping: {
      color: "0066FF", //blue
      description: "cool shops"
    },
    nature: {
      color: "006600", //green
      description: "parks, hikes, nice scenery"
    },
    nightlife: {
      color: "7519D1", //purple
      description: "clubs, bars"
    },
    experience: {
      color: "484748", //grey
      description: "cool things to try at least once"
    },
    other: {
      color: "E65C00", //orange
      description: "miscellaneous other things"
    }
  };

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

  function selectItem(el) {
    var prevSelected = $list.getElementsByClassName("selected-item");

    for (var i = 0; i < prevSelected.length; i++) {
      prevSelected[i].className = prevSelected[i].className.replace("selected-item", "");
    }

    el.className += " selected-item";
    //scroll pane to match when fits on screen with map
    if (window.innerWidth > 480) {
      el.scrollIntoView();
    }
  }

  function addMarker(m) {
    map.addMarker({
      lat: m.lat,
      lng: m.lng,
      icon: pinIcon(TYPE_INFO[m.type].color),
      infoWindow: {
        content: m.content
      },
      click: function() {
        selectItem(m.$el);
      }
    });
  }

  //hide and show the markers and items on list by type
  function toggleAttr(attr, value, showBool) {
    for (var i = 0; i < placeObjs.length; i++) {
      if (placeObjs[i][attr] === value) {
        placeObjs[i].show = showBool;

        toggle(placeObjs[i].$el, showBool);
      }
    }
  }

  function repopulateItems() {
    map.removeMarkers();

    for (var i = 0; i < placeObjs.length; i++) {
      if (placeObjs[i].show && (onlyFaves === false || (onlyFaves && placeObjs[i].favorite))) {
        addMarker(placeObjs[i]);
        show(placeObjs[i].$el);
      } else {
        hide(placeObjs[i].$el);
      }
    }
  }

  function addToList(place) {
    var $listItem = document.createElement('div');
    $listItem.className = "list-item";

    var $info = createEl('div', "info", $listItem);
    $info.innerHTML = place.content;

    var $price = createEl("div", "price", $info);
    $price.innerHTML = "price category: " + place.price;

    var $type = createEl("div", "type", $info);
    $type.innerHTML = "type: " + place.type;

    var $link = createEl("a", "link", $info);
    $link.innerHTML = "link";
    $link.setAttribute("href", place.link);
    $link.setAttribute("target", "_blank");

    var $cancel = createEl('button', "cancel", $listItem);
    $cancel.innerHTML = "×";
    $cancel.addEventListener("click", function() {
      hide($listItem);
      place.show = false;

      repopulateItems();
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
        repopulateItems();
      }
    });

    $list.appendChild($listItem);
    place.$el = $listItem;
  }

  var $placesMeta = document.getElementById("places-meta");
  var $places = $placesMeta.getElementsByClassName("place");

  //populate places
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

      repopulateItems();
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

    //TODO: optimize sorts
    function sortBy(sort) {
      $list.innerHTML = "";

      if (sort === "type") {
        for (var type in TYPE_INFO) {
          if (TYPE_INFO.hasOwnProperty(type)) {
            for (var i = 0; i < placeObjs.length; i++) {
              if (placeObjs[i].type === type) {
                addToList(placeObjs[i]);
              }
            }
          }
        }
        //TODO: implement
      } else if (sort === "location") {
        for (var price = 1; price <= 4; price++) {
          for (var i = 0; i < placeObjs.length; i++) {
            if (placeObjs[i].price === price) {
              addToList(placeObjs[i]);
            }
          }
        }

      } else if (sort === "price") {
        for (var price = 1; price <= 4; price++) {
          for (var i = 0; i < placeObjs.length; i++) {
            if (placeObjs[i].price === price) {
              addToList(placeObjs[i]);
            }
          }
        }
      }
    }

    var $sort = document.getElementById("sort");
    $sort.onchange = function() {
      sortBy($sort.options[$sort.selectedIndex].value);
    };

    //TODO: get initial state to be sorted
    //sortBy("type");

    //click to filter down categories
    var $filters = $advancedOptions.getElementsByClassName("type-check");
    for (var i = 0; i < $filters.length; i++) {
      (function($filter) {
        $filter.addEventListener("click", function() {
          toggleAttr("type", $filter.value, $filter.checked);

          repopulateItems();
        });
      })($filters[i]);
    }

    //click to filter down prices
    var $prices = $advancedOptions.getElementsByClassName("price-check");
    for (var i = 0; i < $prices.length; i++) {
      (function($price) {
        $price.addEventListener("click", function() {
          toggleAttr("price", parseInt($price.value, 10), $price.checked);

          repopulateItems();
        });
      })($prices[i]);
    }
  }

})();
