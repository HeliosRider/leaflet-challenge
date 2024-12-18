# leaflet-challenge
    Earthquake mapping
    Code input references: 
        1. "https://leafletjs.com/examples.html"
        2. "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php"
            2.1. "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

# Background
   The United States Geological Survey (USGS) is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. 

# Task
   Develop a way to visualize USGS data that will allow the USGS to better educate the public and other government organizations on issues facing the planet. 

# Data Engineering
    1. CSS
    2. D3 Library
    3. GeoJSON
    4. HTML
    5. JavaScript
    6. Leaflet.js library

# Data Analysis
    1. Map Creation
        a. TileLayer verified loaded without error 
        b. Connected to geojson API verified using "d3.json(usgsURL)" 
        c. Markers with size corresponding to earthquake magnitude were achieved using "(layer.bindPopup)"
        d. A legend was created to show the depth and corresponding color for each marker 

    2. Data Points Listed
        a. All data points verified to scale with magnitude level 
        b. All data points verified to change colors with depth level 
        c. All data points verified to have a tooltip with the Magnitude, the location and depth 
        e. All data points verified to load in the correct locations 
# Outcome
    An interactrive USGS map was created using the data engineering processes. The user will be able to identify the severity of earthwaukes
    in a given location.
