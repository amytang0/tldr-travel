---
layout: country
title: TITLE
date: DATE
country: COUNTRY
currency: CURRENCY
lat: MAP CENTER LATITUDE
lng: MAP CENTER LONGITUDE
zoom: MAP ZOOM

---

<!-- some basic information about the country -->
<!-- currency data auto-updated from latest if API endpoint still working -->
Currency: CURRENCY NAME (1 USD = ~<span data-currency="{{ page.currency }}" 
  id="currency">CURRENCY ESTIMATE</span> CURRENCY NAME)

Tipping:

SIM Card:

Drinking:

Washrooms:

Eat:

Tourist Visa:

{::options parse_block_html="true" /}

<!-- meta data for populating map with data on the cities -->
<div id="cities-meta">
<!-- when city marker just needs an info window to explain stuff about it -->
<div class="city" data-lat="LATITUDE" data-lng="LONGITUDE">
INFO ON CITY
</div>

<!-- when clicking marker should pop up its own city guide -->
<div class="link" data-lat="LATITUDE" data-lng="LONGITUDE" data-url="CITY NAME">
CITY NAME
</div>
</div>

<!-- meta data for populating map with data on the routes -->
<div id="routes-meta">
<!-- when route can be drawn by google maps -->
<div class="route" data-origin="CITY NAME" data-destination="CITY NAME">
INFO ON ROUTE
</div>

<!-- when route can't be drawn by google maps -->
<div class="polyline" data-start-lat="LATITUDE" data-start-lng="LONGITUDE" 
      data-end-lat="LATITUDE" data-end-lng="LONGITUDE">
INFO ON ROUTE
</div>
</div>
