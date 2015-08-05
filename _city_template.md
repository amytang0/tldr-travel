---
layout: city
title: TITLE
author: AUTHOR
date: DATE
city: CITY
country: COUNTRY
lat: MAP CENTER LATITUDE
lng: MAP CENTER LONGITUDE
zoom: MAP ZOOM

---

<!-- anything unique about the city that differs from the country -->
##Food##

- __Eat:__ WHAT'S SPECIAL TO EAT HERE? HOW MUCH DO THINGS USUALLY COST?

##Transportation##

- __Public:__ WHAT'S TRANSPORTATION LIKE? HOW MUCH DOES IT USUALLY COST? ANY 
INFO TO HELP WITH IT?

{::options parse_block_html="true" /}

<div id="places-meta">
<!-- place image if there is one in guide/<country name>/<city name> -->
<div class="place" data-type="TYPE" data-price="NUMBER" data-link="TRIPADVISOR 
LINK" data-name="PLACE NAME" data-img="IMG.JPG">
INFO ON PLACE
</div>

<!-- use latlng if google maps can't find the name -->
<div class="place" data-type="TYPE" data-price="NUMBER" data-latlng="LAT, LNG">
INFO ON PLACE
</div>
</div>

<!-- TYPES

  sightseeing: historical landmarks, touristy things
  food: restaurants and food experiences
  shopping: cool shops
  nature: parks, hikes, nice scenery
  nightlife: clubs, bars
  experience: cool things to try at least once
  other: misc

-->

<!-- PRICE NUMBER

0 = free
1 = <$10
2 = $11-$30
3 = $31-$60
4 = >$61

-->
