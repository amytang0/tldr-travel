require 'date'

country = ARGV.shift
city = ARGV.shift

if (country.nil?)
  puts "pass in country name as an argument. pass in city name as a second argument to create a city guide"
  exit
end

country = country.downcase.gsub(" ", "_")
date = Date::strptime(Time.new.to_s, "%Y-%m-%d")

if (city.nil?)
#generate new country guide
  TEMPLATE_FILE = '_country_template.md'

  content = File.read(TEMPLATE_FILE)
  #currently assumes title is same as place name
  content = content.gsub("COUNTRY", "\"#{country.capitalize}\"").gsub("TITLE", "\"#{country.capitalize}\"").gsub("DATE", date.strftime("%Y-%m-%d %H:%M:%S"))

  filename = "_posts/#{date.strftime("%Y-%m-%d")}-#{country.gsub(" ", "_").gsub("?", "")}.md"
  #make file in _posts for the country
  File.write(filename, content)

  #create folder in guide to add cities later
  Dir.mkdir "guide/#{country}"
else
#city guide
  city = city.downcase.gsub(" ", "_")
  TEMPLATE_FILE = '_city_template.md'

  content = File.read(TEMPLATE_FILE)
  content = content.gsub("COUNTRY", "\"#{country.capitalize}\"").gsub("CITY", "\"#{city.capitalize}\"").gsub("TITLE", "\"#{city.capitalize}\"").gsub("DATE", date.strftime("%Y-%m-%d %H:%M:%S"))

  #create folder in guide/country for the city
  Dir.mkdir "guide/#{country}/#{city}"

  filename = "guide/#{country}/#{city}/index.md"
  File.write(filename, content)
end


