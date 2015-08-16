(function() {
  function nameWithCountry(name) {
    //countryName global var gotten from html
    return name + ", " + countryName;
  }

  function attrWithCountry(el, attr) {
    return nameWithCountry(el.getAttribute(attr));
  }

  blankHrefs();

  //update currency if haven't fetched it within the past month
  var $currency = document.getElementById("currency");
  if ($currency !== null) {
    var currencyName = $currency.getAttribute("data-currency");

    var lastCurrencyFetchSec = parseInt(localStorage.getItem(currencyName + "Date"), 10);

    var now = new Date();
    var oneMonthFromNow;

    if (now.getMonth() == 11) {
        oneMonthFromNow = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        oneMonthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    if ((oneMonthFromNow / 1000) > lastCurrencyFetchSec) {
      //get from local storage
      $currency.innerHTML = localStorage.getItem(currencyName)
    } else {
      //fetch from exchange rates api
      callAjax("https://openexchangerates.org/api/latest.json?app_id=5566c0f060774b049011c229ca72463c",
        function(data) {
          var json = JSON.parse(data);

          if (json.rates[currencyName] !== undefined) {
            var rate = Math.round(json.rates[currencyName] * 100) / 100;
            $currency.innerHTML = rate;

            //set local storage so don't have to request next time
            localStorage.setItem(currencyName, rate);
            localStorage.setItem(currencyName + "Date", json.timestamp);
          }
        }
      );
    }
  }

  var $map = document.getElementById("map-canvas");

  //init map
  var mapLat = getFloat($map, "data-lat");
  var mapLng = getFloat($map, "data-lng");
  var zoom = getFloat($map, "data-zoom");

  var map;
  var infoWindow;

  try {
    map = new GMaps({
      div: '#map-canvas',
      lat: mapLat,
      lng: mapLng,
      zoom: zoom
    });

    map.map.setOptions({scrollwheel: false});

    infoWindow = new google.maps.InfoWindow({content: ""});
  } catch (err) {
    console.log(err);
    map = {};
    infoWindow = {};
  }

  var WEIGHT = 6;
  var OPACITY = 0.6;

  var $citiesMeta = document.getElementById("cities-meta");
  var $cities = $citiesMeta.getElementsByClassName("city");
  var $links = $citiesMeta.getElementsByClassName("link");
  var $fullGuides = document.getElementById("full-guides");
  var $fullGuidesList = createEl("ul", "city-guides-list", $fullGuides);

  var $routesMeta = document.getElementById("routes-meta");
  var $routes = $routesMeta.getElementsByClassName("route");
  var $polylines= $routesMeta.getElementsByClassName("polyline");


  function openWindow(latLng, content) {
    infoWindow.close();
    infoWindow.setPosition(latLng);
    infoWindow.setContent(content);
    infoWindow.open(map.map);
  };

  function loadCities() {
    //cities
    for (var i = 0; i < $cities.length; i++) {
      (function($city) {
        var city = attrWithCountry($city, "data-name");

        getLatLong(city, function(lat, lng) {
          map.addMarker({
            lat: lat,
            lng: lng,
            icon: pinIcon("F44E4D"),
            click: function(e) {
              openWindow({lat: lat + 0.7, lng: lng}, $city.innerHTML);
            }
          });
        });
      })($cities[i]);
    }
  }

  function loadLinks() {
    for (var i = 0; i < $links.length; i++) {
      (function($link, i) {
        var cityName = $link.getAttribute("data-name");
        var url = urlize(cityName);
        var city = nameWithCountry(cityName);

        var $linkL = createEl("li", "guide-item", $fullGuidesList);
        $linkL.style["border-left"] = "5px solid " + getColor(i);

        var $linkImg = createEl("img", "guide-img", $linkL);
        $linkImg.setAttribute("src", url + ".jpg");

        var $linkP = createEl("a", "guide-link", $linkL);
        $linkP.innerHTML = capitalize(cityName);
        $linkP.setAttribute("href", url);

        try {
          getLatLong(city, function(lat, lng) {
            map.addMarker({
              lat: lat,
              lng: lng,
              icon: pinIcon(getColor(i).substring(1)),
              click: function(e) {
                window.open(url, "_self");
              }
            });
          });
        } catch (err) {
          console.log("Error in loading link " + city + " on map: " + err);
        }
      })($links[i], i);
    }

  }

  function loadRoutes() {
    //routes
    for (var i = 0; i < $routes.length; i++) {
      (function($route, i) {
        var origin = attrWithCountry($route, "data-origin");
        var destination = attrWithCountry($route, "data-destination");

        map.drawRoute({
          origin: origin,
          destination: destination,
          travelMode: 'driving',
          strokeColor: getColor(i),
          strokeOpacity: OPACITY,
          strokeWeight: WEIGHT,
          click: function(e) {
            openWindow(e.latLng, $route.innerHTML);
          }
        });
      })($routes[i], i);
    }

  }

  function loadPolys() {
    //polylines, when can't route
    for (var i = 0; i < $polylines.length; i++) {
      (function($line, i) {
        var origin = attrWithCountry($line, "data-origin");
        var destination = attrWithCountry($line, "data-destination");

        getLatLong(origin, function(startLat, startLng) {
          getLatLong(destination, function(endLat, endLng) {
            map.drawPolyline({
              path: [
                [startLat, startLng],
                [endLat, endLng]
              ],
              strokeColor: getColor(i + $routes.length),
              strokeOpacity: OPACITY,
              strokeWeight: WEIGHT,
              click: function(e) {
                openWindow(e.latLng, $line.innerHTML);
              }
            });
          });
        });
      })($polylines[i], i);
    }
  }

  //once rest of map loads, show the related info
  loadLinks();
  show(document.getElementById("map-info"));
  hide(document.getElementById("loading"));

  if (map.drawRoute === undefined) {
    show(document.getElementById("map-error"));
    hide(document.getElementById("map-stuff"));
  } else {
    loadCities();
    loadRoutes();
    loadPolys();
  }

})();
