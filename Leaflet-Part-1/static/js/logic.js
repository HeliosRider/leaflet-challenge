// First, we assign the data set url to a new url name.
const usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// The console.log() is used throughout the script to print the given parameter results on the console.
console.log(usgsURL)

// Here we perform a GET request to retrieve the earthquake geoJSON data
d3.json(usgsURL).then
  ((data) => 
    { 
    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into two separate functions
    // to calculate the color and radius.
    console.log(data.features); 
    
    // Once the response is verified, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    }
  );

// Here we assign the earthquake depth data points and colors to an array.
// Using an array
depth = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
colors = ['Lavender', 'thistle', 'Plum', 'Violet', 'Hotpink', 'Purple']

function getColor(d)
// This function determines the color of the marker based on the magnitude of the earthquake.
// by taking the value of d and returning a color string based on the earthquake magnitude
// which changes with depth level. 
// Reference (a), (b), and (e).
{
  // Here we Pass the earthquake depth data points into the circle color function
  return d > 90 ? colors[5] :
    d > 70 ? colors[4] :
      d > 50 ? colors[3] :
        d > 30 ? colors[2] :
          d > 10 ? colors[1] :
            d > -10 ? colors[0] :
              colors[6];
}

function createFeatures(earthquakeData) 
{
  console.log(earthquakeData);

  // Here we define the function that runs once for each feature in the features array and 
  // give each feature a popup that describes the place and time of the earthquake.
  function forEachFeature(feature, layer) 
  
  {// Here each point is assigned a tooltip with the Magnitude, location, and depth.
   // here we converted the timestamp value to an actual date using the new Date() function. 
   // Reference (c)
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><ul><li>Earthquake Magnitude: ${feature.properties.mag}</li><li>Earthquake Depth: ${feature.geometry.coordinates[2]}</li></ul>`);
  }

  // Here we create a GeoJSON layer that contains the features array on the earthquakeData object.
  // We run the onEachFeature function once for each piece of data in the array.
  // Reference (d)
  let earthquakes = L.geoJSON
    (earthquakeData,
      {
        pointToLayer: function (feature, latlng) {
          return new L.CircleMarker
            (latlng,
              { // data points scale with magnitude level
                radius: feature.properties.mag * 5,
                // data points colors change with depth level
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: '#00050c',
                weight: 1,
                opacity: 1.0,
                fillOpacity: .85
              }
            );
        },
        onEachFeature: forEachFeature
      }
    );

  // Here we send the earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) 
{ 
  // Here we create the tile layer that will be the background of our map
  // Reference (e)
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' })

  let topGraph = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    { attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' }
  );

  // Here we create a baseMaps object.
  let baseMaps =
  {"Street Map": street, "Topographic Map": topGraph};

  //  Here we create an overlay object to hold our overlay.
  let overlayMaps =
  { Earthquakes: earthquakes};

  // Here we create our map, giving it the streetmap and earthquakes layers to display on load.
  let map = L.map("map",
    {
      center:
        [
          37.09, -95.71
        ],
      zoom: 3,
      layers: [street, earthquakes]
    });

  // Here we create a legend control objectto add to map
  // Then add all the details for the legend
  // Reference (e)
  let legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');

 // Here we Loop through our intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depth.length; i++) {
      let item = `<li style='background: ${colors[i]} '></li>${depth[i]}<br>`
      console.log(item);
      div.innerHTML += item;
    }
    return div
  };
  legend.addTo(map);

  // He we create the layer control.
  L.control.layers
    (
      // Here pass the layer control to the baseMaps and overlayMaps. 
      baseMaps, overlayMaps,
      { collapsed: false }

      // Here we add the layer control to the map.
    ).addTo(map);
}

// References: 
// a. "https://stackoverflow.com/questions/28168879"
// b. "https://gis.stackexchange.com/questions/355100/vuejs-leaflet-get-color-function"
// c. "https://www.google.com/search?q=new+date(feature.properties.time)+javascript&rlz"
// d. "https://leafletjs.com/examples/geojson/"
// e. "https://leafletjs.com/examples/choropleth/"
