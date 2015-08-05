#Hello Friend!#

If there's something on the site that you felt was missing -- maybe a category 
of crucial content or perhaps something in the user experience -- please [create 
an issue](https://github.com/wangfowen/tldr-travel/issues). All feedback is 
welcome!

If I've asked you to help write a guide for a place you've been, please continue 
reading. I apologize in advance for the difficulty in contributing. Currently 
writing a guide involves a bit of coding.

##Initial Setup##

To start, clone the repo in your terminal, create a new branch, and load the 
local environment:

```
  git clone git@github.com:wangfowen/tldr-travel.git
  cd tldr-travel/
  git checkout -b guide/<name of place>
  bundle exec jekyll serve
```

If you're making a new __country guide__ for one that hasn't yet been added, do 
`ruby _new_guide.rb "<country name>"`. It'll create a semi-populated guide in 
_\_posts/\<date\>-\<country name\>.md_. It'll be viewable at 
`http://localhost:4000/guide/<country name>/`.

If you're making a new __city guide__ for a city which already has an 
accompanying country guide, do `ruby _new_guide.rb "<country name>" "<city 
name>"`.  The city guide should be in _guide/\<country name\>/\<city 
name\>/index.md_ and should be viewable at `http://localhost:4000/guide/<country 
name>/<city name>/`.

Currently you need to make a country guide first if there isn't yet one for the 
city you want to add.

If you open up the guide's .md file, you'll see some metadata at the top.

- Replace `AUTHOR` with your name. You're the author :)
- Replace `MAP CENTER LATITUDE` and `MAP CENTER LONGITUDE` with the latitude and 
longitude coordinates of your desired map center. You can play around with 
[Google Maps](https://www.google.com/maps) to figure out what you want by 
entering in places of interest, then right clicking on the map and clicking 
__What's here?__ to get the coordinates.
- Replace `MAP ZOOM` with a number from 0-18 for desired zoom onto the map 
center. This and the coordinates themselves will be more obvious once you have 
some pins on the map.

We can now get to filling out the actual content of the guide! This can be done 
in markdown, no need to write HTML. For the markdown to work it has to be flush 
against the left, no indenting. Feel free to fill out the ones you find relevant 
/ delete the others. You may of course also add other ones I didn't think of!

Now at this point what you have to do for a city guide vs country guide 
diverges. If you look at your .md file, hopefully my comments make what you have 
to do intuitive enough. If not, continue to the appropriate section for more 
thorough explanations.

##Country Guide##

Another field in the metadata to replace is `CURRENCY CODE`. Find [the 
appropriate one](http://www.xe.com/iso4217.php#A) for the country. If you list 
the exchange rate in your guide, once in a while it'll update your rough 
estimate with a more accurate one.

Below the actual content of the guide are the `cities-meta` div and 
`routes-meta` div, which contain the metadata for the city markers and route 
lines drawn on the map. Each child div within those are individual things that 
will appear on the map.

Within the `cities-meta`, there are two types of possible marker divs -- ones 
with a `city` class and ones with a `link` class.

`city` markers when you click on them will pop up an info window. The content 
within the div is what will appear in the window. This also can be written in 
markdown. If you don't have much to say about the city and just want to write a 
bit about them, use this type.

A `data-name` attribute on the div is required for positioning the marker on the 
map. Putting the city name should be sufficient, unless Google Maps screws up. 
If you put "lima", it'll search for "Lima, Peru" and hopefully that'll find the 
right place on the map. If not, play around with it to get what you want mapped.

`link` markers, when you click on them will open up the corresponding city 
guides. Nothing is needed within the div and `data-name` should just be the 
city's name. Use this type if you want to write a whole city guide about the 
place.

Link markers need an image representing the place. 100px by 100px is a good size 
(it'll be scaled down so don't worry about exact size, just better for load 
speeds). It should be named _city_name.extension_ ("machu_picchu.jpg" for 
example) and placed in the folder _guide/\<country name\>_.

Within the `routes-meta`, there are also two types of possible route divs -- 
ones with a `route` class and ones with a `polyline` class. 

`route` draws the line that Google Maps gives when you try to navigate between 
the places. `polyline` draws a straight line, so you do this when Google Maps 
can't find navigation. When you click on them they pop up an info window so 
write content inside the div similar to the `city` ones.

In both cases you need a `data-origin` and `data-destination` attribute. They 
correspond to the start and end points of the route. Putting the city name 
should also be sufficient for these. They search the same way as the cities.

##City Guide##

Below the actual content of the guide is the `places-meta` div. This is the 
metadata for what to populate the list and accompanying map. Each child within 
the div that has a `place` class is an item that'll show up on the map / list.

Within the `place` div, whatever content you write within it is what will appear 
in the list item, as well as within the info box when you click on the 
corresponding marker. This can be written in markdown.

Each `place` div also has a couple attributes to fill in. `data-type` determines 
the category for the item. The options are:

- sightseeing: historical landmarks, touristy things
- food: restaurants and food experiences
- shopping: cool shops
- nature: parks, hikes, nice scenery
- nightlife: clubs, bars
- experience: cool things to try at least once
- other: misc

`data-price` determines the price grouping for the item. The options are:

- 0: free
- 1: <$10
- 2: $11-$30
- 3: $31-$60
- 4: >$61

`data-link` is an optional field for if you want to provide a link to more 
information.

`data-img` is also an optional field for if you want to add an image to the 
item. The attribute should be the _name.extension_ ("foo.jpg" for example). 
Place the image in the folder _guide/\<country name\>/\<city name\>_. The image 
should be about 300px by 300px (it'll be scaled down so don't worry about exact 
size, just better for load speeds).

`data-name` is a semi-optional field. You must either have that or 
`data-latlng`. One or the other is used to provide the marker on the map for 
where it is. `data-name` is the name of the place. If you put "Sagrada Familia" 
for a Barcelona guide, it'll search for "Sagrada Familia, Barcelona, Spain". If 
  it finds the place, it'll map it. Sometimes that mapping is incorrect, in 
  which case use `data-latlng` to manually give the exact coordinates you want.
