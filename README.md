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
  git branch guide/<name of place>
  git checkout guide/<name of place>
  bundle exec jekyll serve
```

If you're making a new __country guide__ for one that hasn't yet been added, do 
`ruby _new_guide.rb <country name>`. It'll create a semi-populated guide in 
_\_posts/\<date\>-\<country name\>.md_. It'll be viewable at 
`http://localhost:4000/guide/<country name>/`.

If you're making a new __city guide__ for a city in a country that's already 
been added, do `ruby _new_guide.rb <country name> <city name>`. The city guide 
should be in _guide/\<country name\>/\<city name\>/index.md_ and should be 
viewable at `http://localhost:4000/guide/<country name>/<city name>/`.

Currently you need to make a country guide first if there isn't yet one for the 
city you want to add.

If you open up the guide's .md file, you'll see some meta data at the top.

- Replace `AUTHOR` with your name. You're the author :)
- Replace `MAP CENTER LATITUDE` and `MAP CENTER LONGITUDE` with the latitude and 
longitude coordinates of your desired map center. You can play around with 
[Google Maps](https://www.google.com/maps) to figure out what you want by 
entering in places of interest, then right clicking on the map and clicking 
__What's here?__ to get the coordinates.
- Replace `MAP ZOOM` with a number from 0-18 for desired zoom onto the map 
center. This and the coordinates themselves will be more obvious once you have 
some pins on the map.

Now at this point what you have to do for a city guide vs country guide 
diverges. Continue to the appropriate section.
