#Hello Friend!#

If there's something on the site that you felt was missing -- maybe a category 
of crucial content or perhaps something in the user experience -- please [create 
an issue](https://github.com/wangfowen/tldr-travel/issues). All feedback is 
welcome!

If I've asked you to help write a guide for a place you've been, please continue 
reading. I apologize in advance for the difficulty in contributing. Currently 
writing a guide involves a bit of coding.

To start, clone the repo in your terminal and create a new branch.

```
  git clone git@github.com:wangfowen/tldr-travel.git
  cd tldr-travel/
  git branch guide/<name of place>
  git checkout guide/<name of place>

```

If you're making a new country guide for one that hasn't yet been added, do

```ruby

  ruby _new_guide.rb <country name>

```

If you're making a new city guide for a city in a country that's already been 
added, do

```ruby

  ruby _new_guide.rb <country name> <city name>

```

Currently you need to make a country guide first if there isn't yet one for the 
city you want to add.

The country guide should be in \_posts/<date>-<country name>.md.

The city guide should be in guide/<country name>/<city name>/index.md.
