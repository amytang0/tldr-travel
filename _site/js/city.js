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

  var PRICE_INFO = {
    0: "Free",
    1: "<$10",
    2: "$11-$30",
    3: "$31-$60",
    4: ">$61"
  };

  blankHrefs();

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

  map.map.setOptions({scrollwheel: false});

  function selectItem(el) {
    var prevSelected = $list.getElementsByClassName("selected-item");

    for (var i = 0; i < prevSelected.length; i++) {
      prevSelected[i].className = prevSelected[i].className.replace("selected-item", "");
    }

    el.className += " selected-item";
  }

  var listeners = {};

  function addMarker(placeObj) {
    var marker = map.addMarker({
      lat: placeObj.lat,
      lng: placeObj.lng,
      icon: pinIcon(TYPE_INFO[placeObj.type].color),
      infoWindow: {
        content: placeObj.content
      },
      mouseup: function() {
        selectItem(placeObj.$el());

        //scroll pane to match when fits on screen with map
        if (window.innerWidth > 480) {
          placeObj.$el().scrollIntoView();
        }
      }
    });

    if (listeners[placeObj.index] !== undefined) {
      placeObj.$el().removeEventListener("click", listeners[placeObj.index]);
    }

    var listener = function(e) {
      if (e.target.className.indexOf("corner-button") !== -1) {
        return;
      }

      google.maps.event.trigger(marker, 'click');

      selectItem(placeObj.$el());
    };

    placeObj.$el().addEventListener("click", listener);
    listeners[placeObj.index] = listener;
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
        show(placeObjs[i].$el());
      } else {
        hide(placeObjs[i].$el());
        //index doesn't change despite re-ordering of objs
        hiddenItems.push(placeObjs[i].index);
      }
    }

    //set permalink for curated list
    //limitation in that ids based on index from HTML, so can only ever append new items to HTML and not add in middle or rearrange
    var url = hiddenItems.join(",");
    setParam("list", url);
  }

  function placeId(placeObj) {
    return "place-" + placeObj.index;
  }

  //creates a list item and appends it to $list
  function addToList(placeObj) {
    var $listItem = document.createElement('div');
    $listItem.className = "list-item";
    $listItem.setAttribute("id", placeId(placeObj));

    var $info = createEl('div', "info", $listItem);
    $info.innerHTML = placeObj.content;

    var $price = createEl("div", "price", $info);
    $price.innerHTML = PRICE_INFO[placeObj.price];

    var $type = createEl("div", "type " + placeObj.type, $info);
    $type.innerHTML = capitalize(placeObj.type);

    if (placeObj.link !== null) {
      var $link = createEl("a", "link", $info);
      $link.innerHTML = "Link";
      $link.setAttribute("href", placeObj.link);
      $link.setAttribute("target", "_blank");
    }

    var $cancel = createEl('button', "cancel corner-button", $listItem);
    $cancel.innerHTML = "×";
    $cancel.addEventListener("click", function() {
      hide($listItem);
      placeObj.canceled = true;

      repopulateItems();
    });

    var $favoriteCheckbox = createEl('input', "favorite-checkbox", $listItem);
    $favoriteCheckbox.setAttribute("id", "checkbox-" + placeObj.index);
    $favoriteCheckbox.setAttribute("type", "checkbox");

    var $favorite = createEl('label', "favorite corner-button", $listItem);
    $favorite.innerHTML = "♡";
    $favorite.setAttribute("for", "checkbox-" + placeObj.index);
    $favorite.addEventListener("click", function() {
      //a bit unintuitive but click event happens before the actual checkbox changes, so it's the opposite of what it should be
      placeObj.favorite = !$favoriteCheckbox.checked;

      if (onlyFaves) {
        repopulateItems();
      }
    });

    $list.appendChild($listItem);

    return $listItem;
  }

  function renderList(itemsList) {
    for (var i = 0; i < itemsList.length; i++) {
      addToList(itemsList[i]);
    }

    repopulateItems();
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
            favorite: false,
            $el: function() {
              return document.getElementById(placeId(this));
            }
          };

          //TODO: is there a way to wait for all callbacks to occur, then renderList and repopulateItems instead of having this so tightly coupled?
          addToList(placeObj);

          //if obj is in url hide-list, hide on init
          var urlParam = getParam("list");
          var hideList = urlParam.split(",");

          if (hideList.indexOf(i.toString()) !== -1) {
            placeObj.initOff = true;
            hide(placeObj.$el());
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
      var sortedList = [];

      if (sort === "type") {
        for (var type in TYPE_INFO) {
          if (TYPE_INFO.hasOwnProperty(type)) {
            for (var i = 0; i < placeObjs.length; i++) {
              if (placeObjs[i].type === type) {
                sortedList.push(placeObjs[i]);
              }
            }
          }
        }
      } else if (sort === "location") {
        var sorted = placeObjs.slice();
        sorted.sort(function(a, b) {
          if (b.lat > a.lat) {
            return 1;
          } else if (a.lat > b.lat) {
            return -1;
          } else {
            return 0;
          }
        });

        for (var i = 0; i < sorted.length; i++) {
          sortedList.push(sorted[i]);
        }
      } else if (sort === "price") {
        for (var price = 0; price <= 4; price++) {
          for (var i = 0; i < placeObjs.length; i++) {
            if (placeObjs[i].price === price) {
              sortedList.push(placeObjs[i]);
            }
          }
        }
      }

      return sortedList;
    }

    var $sort = document.getElementById("sort");
    $sort.onchange = function() {
      var sortedList = sortBy($sort.options[$sort.selectedIndex].value);
      renderList(sortedList);
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
    var $saveBox = document.getElementById("save-box");
    var $background = document.getElementById("modal-background");
    var $saveUrl = document.getElementById("save-url");
    var $closeBox = document.getElementById("close-box");

    $save.addEventListener("click", function() {
      show($background);
      show($saveBox);
      $saveUrl.setAttribute("value", window.location.href);
      $saveUrl.select();

      //TODO: add functionality to export to google maps and maybe also maps.me
    });

    $closeBox.addEventListener("click", function() {
      hide($background);
      hide($saveBox);
    });
  }

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
    hide(document.getElementById("loading"));
    show($list, "inline-block");
    initOptions();
  }

})();
