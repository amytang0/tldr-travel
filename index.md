---
layout: default
title: Tl;dr Travel
---

#Tl;dr Travel#

Interactive, short-form travel guides for simplifying your trip planning.

Meant to be a starting point, not a comprehensive guide! All information based 
on a group of friends' travel experiences.

##Travel Guides##

{% for guide in site.posts %}
<li>
  <a href="{{ guide.url }}">
    {{ guide.country }}
  </a>
</li>
{% endfor %}

