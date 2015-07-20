(function() {
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
  var mapLat = getInt($map, "data-lat");
  var mapLng = getInt($map, "data-lng");
  var zoom = getInt($map, "data-zoom");

  var map = new GMaps({
    div: '#map-canvas',
    lat: mapLat,
    lng: mapLng,
    zoom: zoom
  });

  //routes
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

  var $routesMeta = document.getElementById("routes-meta");
  var $routes = $routesMeta.getElementsByClassName("route");
  var $polylines= $routesMeta.getElementsByClassName("polyline");

  for (var i = 0; i < $routes.length; i++) {
    (function($route) {
      map.drawRoute({
        origin: $route.getAttribute("data-origin"),
        destination: $route.getAttribute("data-destination"),
        travelMode: 'driving',
        strokeColor: getColor(i),
        strokeOpacity: OPACITY,
        strokeWeight: WEIGHT,
        click: function(e) {
          openWindow(e.latLng, $route.innerHTML);
        }
      });
    })($routes[i]);
  }

  for (var i = 0; i < $polylines.length; i++) {
    (function($line) {
      var startLat = getInt($line, "data-start-lat");
      var startLng = getInt($line, "data-start-lng");
      var endLat = getInt($line, "data-end-lat");
      var endLng = getInt($line, "data-end-lng");

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
    })($polylines[i]);
  }

})();
