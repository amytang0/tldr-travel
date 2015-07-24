(function() {
  function nameWithCountry(name) {
    //countryName global var gotten from html
    return name + ", " + countryName;
  }

  function attrWithCountry(el, attr) {
    return nameWithCountry(el.getAttribute(attr));
  }

  //update currency if haven't fetched it within the past month
  var $currency = document.getElementById("currency");
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

  var infoWindow = new google.maps.InfoWindow({
    content: ""});
  var WEIGHT = 6;
  var OPACITY = 0.6;

  function openWindow(latLng, content) {
    infoWindow.close();
    infoWindow.setPosition(latLng);
    infoWindow.setContent(content);
    infoWindow.open(map.map);
  };

  var $citiesMeta = document.getElementById("cities-meta");
  var $cities = $citiesMeta.getElementsByClassName("city");
  var $links = $citiesMeta.getElementsByClassName("link");
  var $fullGuides = document.getElementById("full-guides");

  //cities
  for (var i = 0; i < $cities.length; i++) {
    (function($city) {
      var city = attrWithCountry($city, "data-name");

      getLatLong(city, function(lat, lng) {
        map.addMarker({
          lat: lat,
          lng: lng,
          icon: pinIcon("FE7569"),
          click: function(e) {
            openWindow({lat: lat + 0.7, lng: lng}, $city.innerHTML);
          }
        });
      });
    })($cities[i]);
  }

  for (var i = 0; i < $links.length; i++) {
    (function($link) {
      var url = $link.getAttribute("data-name");
      var city = nameWithCountry(url);

      var linkP = createEl("a", "guide-link", $fullGuides);
      linkP.innerHTML = url.charAt(0).toUpperCase() + url.slice(1);
      linkP.setAttribute("href", url);

      getLatLong(city, function(lat, lng) {
        map.addMarker({
          lat: lat,
          lng: lng,
          icon: pinIcon("0660B0"),
          //TODO: open in a modal?
          click: function(e) {
            window.open(url, "_self");
          }
        });
      });
    })($links[i]);
  }

  var $routesMeta = document.getElementById("routes-meta");
  var $routes = $routesMeta.getElementsByClassName("route");
  var $polylines= $routesMeta.getElementsByClassName("polyline");

  //routes
  for (var i = 0; i < $routes.length; i++) {
    (function($route, i) {
      map.drawRoute({
        origin: attrWithCountry($route, "data-origin"),
        destination: attrWithCountry($route, "data-destination"),
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


})();
