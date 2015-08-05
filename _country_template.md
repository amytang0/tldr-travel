---
layout: country
title: TITLE
author: AUTHOR
date: DATE
country: COUNTRY
lat: MAP CENTER LATITUDE
lng: MAP CENTER LONGITUDE
zoom: MAP ZOOM
currency: CURRENCY CODE

---

<!-- see http://www.xe.com/iso4217.php#A for current currency code -->

<!-- some basic information about the country, can add or remove sections as 
needed -->
##Logistics##

<!-- currency data auto-updated from latest if API endpoint still working -->
- __Currency:__ CURRENCY NAME (1 USD = ~<span data-currency="{{ page.currency 
}}" id="currency">CURRENCY ESTIMATE</span> CURRENCY NAME)
- __Tourist Visa:__ ANY SPECIAL VISAS NEEDED?
- __Vaccinations:__ ANY SHOTS NEEDED BEFORE VISITING?

##Food##

- __Eat:__ WHAT'S SPECIAL TO EAT HERE? HOW MUCH DO THINGS USUALLY COST?
- __Water:__ IS THE WATER OKAY?
- __Drinking Age:__ WHAT'S THE DRINKING AGE?
- __Tipping:__ DO PEOPLE TIP?

##Transportation##

- __Public:__ DO PEOPLE TAKE PUBLIC TRANSPORTATION? HOW MUCH DOES IT COST?
- __Car:__ CAN RENT CAR? HOW MUCH?

##Survival##

- __SIM Card:__ IS IT POSSIBLE TO GET A SIM? HOW MUCH FOR A PLAN?
- __Washrooms:__ ANYTHING WEIRD ABOUT THE BATHROOMS?

{::options parse_block_html="true" /}

<!-- meta data for populating map with data on the cities -->
<div id="cities-meta">
<!-- when city marker just needs an info window to explain stuff about it -->
<!-- can stick an image in if you want. place in guide/<country name> -->
<div class="city" data-name="CITY NAME">
INFO ON CITY

![alt text](name.extension)
</div>

<!-- when clicking marker should pop up its own city guide -->
<!-- link needs an image. place in guide/<country name> -->
<div class="link" data-name="CITY NAME"></div>
</div>

<!-- meta data for populating map with data on the routes -->
<div id="routes-meta">
<!-- when route can be drawn by google maps -->
<div class="route" data-origin="CITY NAME" data-destination="CITY NAME">
INFO ON ROUTE
</div>

<!-- when route can't be drawn by google maps -->
<div class="polyline" data-origin="CITY NAME" data-destination="CITY NAME">
INFO ON ROUTE
</div>
</div>
