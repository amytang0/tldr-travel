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

  //hide and show the markers and items on list by attr
  var toggledAttrs = {};

  function toggleAttr(value, showBool) {
    toggledAttrs[value] = showBool;

    for (var i = 0; i < placeObjs.length; i++) {
      var show = true;

      if (toggledAttrs[placeObjs[i].type] !== undefined) {
        show = show && toggledAttrs[placeObjs[i].type];
      }

      if (toggledAttrs[placeObjs[i].price] !== undefined) {
        show = show && toggledAttrs[placeObjs[i].price];
      }

      placeObjs[i].toggledOn = show;
    }

    repopulateItems();
  }

  function shouldShow(placeObj) {
    return !placeObj.canceled && !placeObj.initOff && placeObj.toggledOn && (onlyFaves === false || (onlyFaves && placeObj.favorite));
  }

  function repopulateItems() {
    map.removeMarkers();
    var hiddenItems = [];

    //show the markers and list items that are to be shown
    for (var i = 0; i < placeObjs.length; i++) {
      if (shouldShow(placeObjs[i])) {
        addMarker(placeObjs[i]);
        show(placeObjs[i].$el);
      } else {
        hide(placeObjs[i].$el);
        //index doesn't change despite re-ordering of objs
        hiddenItems.push(placeObjs[i].index);
      }
    }

    //set permalink for curated list
    //limitation in that ids based on index from HTML, so can only ever append new items to HTML and not add in middle or rearrange
    var url = hiddenItems.join(",");
    setParam("list", url);
  }

  //creates a list item and appends it to $list
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
      place.canceled = true;

      repopulateItems();
    });

    var $favorite = createEl('input', "favorite", $listItem);
    $favorite.setAttribute("type", "checkbox");
    $favorite.addEventListener("click", function() {
      place.favorite = $favorite.checked;

      if (onlyFaves) {
        repopulateItems();
      }
    });

    $list.appendChild($listItem);

    return $listItem;
  }

  var $placesMeta = document.getElementById("places-meta");
  var $places = $placesMeta.getElementsByClassName("place");

  //populate list and markers at beginning
  function initPlaces() {
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
            canceled: false,
            toggledOn: true,
            favorite: false
          };

          placeObj.$el = addToList(placeObj);

          //if obj is in url hide-list, hide on init
          var urlParam = getParam("list");
          var hideList = urlParam.split(",");

          if (hideList.indexOf(i.toString()) !== -1) {
            placeObj.initOff = true;
            hide(placeObj.$el);
          } else {
            placeObj.initOff = false;
            addMarker(placeObj);
          }

          placeObjs.push(placeObj);

        });
      })($places[i], i);
    }
  }

  function initSeeFaves() {
    var $seeFaves = document.getElementById("see-faves");
    $seeFaves.addEventListener("click", function() {
      onlyFaves = $seeFaves.checked;

      repopulateItems();
    });
  }

  function initAdvancedControls($advancedOptions) {
    var $advancedToggle = document.getElementById("advanced-toggle");

    $advancedToggle.addEventListener("click", function() {
      toggle($advancedOptions, $advancedToggle.checked);
    });
  }

  function initSort() {
    function sortBy(sort) {
      $list.innerHTML = "";

      if (sort === "type") {
        for (var type in TYPE_INFO) {
          if (TYPE_INFO.hasOwnProperty(type)) {
            for (var i = 0; i < placeObjs.length; i++) {
              if (shouldShow(placeObjs[i]) && placeObjs[i].type === type) {
                placeObjs[i].$el = addToList(placeObjs[i]);
              }
            }
          }
        }
      } else if (sort === "location") {
        var sortedList = placeObjs.slice();
        sortedList.sort(function(a, b) {
          if (b.lat > a.lat) {
            return 1;
          } else if (a.lat > b.lat) {
            return -1;
          } else {
            return 0;
          }
        });

        for (var i = 0; i < sortedList.length; i++) {
          if (shouldShow(sortedList[i])) {
            placeObjs[i].$el = addToList(sortedList[i]);
          }
        }
      } else if (sort === "price") {
        for (var price = 1; price <= 4; price++) {
          for (var i = 0; i < placeObjs.length; i++) {
            if (shouldShow(placeObjs[i]) && placeObjs[i].price === price) {
              placeObjs[i].$el = addToList(placeObjs[i]);
            }
          }
        }
      }
    }

    var $sort = document.getElementById("sort");
    $sort.onchange = function() {
      sortBy($sort.options[$sort.selectedIndex].value);
    };
  }

  function initFilter($filters, isInt) {
    //click to filter down categories
    for (var i = 0; i < $filters.length; i++) {
      (function($filter) {
        var value = $filter.value;
        if (isInt) {
          value = parseInt(value, 10);
        }

        $filter.addEventListener("click", function() {
          toggleAttr(value, $filter.checked);
        });
      })($filters[i]);
    }
  }

  function initReset($types, $prices) {
    var $reset = document.getElementById("reset");
    $reset.addEventListener("click", function() {
      for (var i = 0; i < placeObjs.length; i++) {
        placeObjs[i].initOff = false;
        placeObjs[i].toggledOn = true;
        placeObjs[i].canceled = false;
      }

      for (var i = 0; i < $types.length; i++) {
        $types[i].checked = true;
      }

      for (var i = 0; i < $prices.length; i++) {
        $prices[i].checked = true;
      }

      repopulateItems();
    });
  }

  function initSave() {
    var $save = document.getElementById("save");
    $save.addEventListener("click", function() {
      //TODO: open a modal with the current URL in it
      //TODO: add functionality to export to google maps and maybe also maps.me
    });
  }

  //TODO: move each thing into its own function
  function initOptions() {
    var $options = document.getElementById("options");
    show($options);

    initSeeFaves();

    var $advancedOptions = document.getElementById("advanced-options");
    var $types = $advancedOptions.getElementsByClassName("type-check");
    var $prices = $advancedOptions.getElementsByClassName("price-check");

    initAdvancedControls($advancedOptions);
    initSort();
    initFilter($types, false);
    initFilter($prices, true);
    initReset($types, $prices);
    initSave();
  }

  initPlaces();

  //if there's a list, add event listeners for the options
  if ($places.length > 0) {
    show($list, "inline-block");
    initOptions();
  }

})();
