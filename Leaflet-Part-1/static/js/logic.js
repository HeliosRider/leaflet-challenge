// Assign the API endpoint as usgsUrl variable
const usgsURL = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")

// Confirmed the variable assignment response
console.log(usgsURL)

// Perform a GET request to the usgsURL
d3.json(usgsURL).then 
((data) =>   
 {
  console.log(data.features);
// Once the response is confirmed, send the data.features object to the createFeatures function.
  createFeatures(data.features);
 }
);

// Make earthquake depth data points colors change with depth level
depth = ['-10-10','10-30','30-50','50-70','70-90','90+'];
colors = ['Lavender','thistle','Plum','Violet','Hotpink','Purple']

function getColor(d)
// This function takes the value of d and returns a color string based on its magnitude. 
{
  // Passing the earthquake depth data points into the circle color function
  return  d > 90 ?  colors[5]:
          d > 70 ?  colors[4]:
          d > 50 ?  colors[3]:
          d > 30 ?  colors[2]:
          d > 10 ?  colors[1]:
          d > -10 ? colors[0]:
          colors[6]; 
}

function createFeatures(earthquakeData) 
{
  console.log(earthquakeData);

  // Define a function that runs once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function forEachFeature(feature, layer) 

  {// Each point has a tooltip with the Magnitude, location, and depth.
      // Converted timestamp value using new Date().
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><ul><li>Earthquake Magnitude: ${feature.properties.mag}</li><li>Earthquake Depth: ${feature.geometry.coordinates[2]}</li></ul>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
 let earthquakes = L.geoJSON
 (earthquakeData, 
    {pointToLayer: function(feature, latlng) 
      {return new L.CircleMarker
       (latlng, 
          { // data points scale with magnitude level
            radius:feature.properties.mag * 5,
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

  // Send the earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) 
{ // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

  let topGraph = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
      {attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}
      );
 
  // Create a baseMaps object.
  let baseMaps = 
  {
    "Street Map": street,
    "Topographic Map": topGraph
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = 
  {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let map = L.map("map", 
  {
    center: 
    [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });
  
  // Create a legend to add to map
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function () 
  {let div = L.DomUtil.create('div', 'info legend');

    for (let i = 0; i < depth.length; i++) 
      {
        let item = `<li style='background: ${colors[i]} '></li>${depth [i]}<br>`
        console.log(item);
        div.innerHTML += item;
      }
    return div 
  };
  legend.addTo(map);

  // Create a layer control.
  L.control.layers
 (
  // Pass the layer control to the baseMaps and overlayMaps. 
  baseMaps, overlayMaps, 
  {collapsed: false}
  // Add the layer control to the map.
 ).addTo(map);
}
