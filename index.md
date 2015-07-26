---
layout: default
title: Tl;dr Travel

---

#Tl;dr Travel#

Tl;dr Travel is a collection of interactive, short-form travel guides made to 
help simplify your trip planning.

All guides are currently based on a group of friends' travel experiences, 
curated from what they enjoyed during their time in the places. 

Disclaimer: The guides are meant to be a starting point for your planning, not 
at all comprehensive.

##Travel Guides##

<ul>
  {% for guide in site.posts %}
  <li>
    <a href="{{ guide.url }}">
      {{ guide.country }}
    </a>
  </li>
  {% endfor %}
</ul>
