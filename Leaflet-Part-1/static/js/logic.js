// Store our API endpoint as usgsUrl
const usgsURL = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
console.log(usgsURL)

// Perform a GET request to the usgsURL/
d3.json(usgsURL).then 
((data) => 
 {
  // Once we get a response, send the data.features object to the createFeatures function.
   console.log(data.features)
  createFeatures(data.features);
 }
);

// change the color based on feature's of the earthquake depth
depth = ['-10-10','10-30','30-50','50-70','70-90','90+'];
colors = ['Lavender','thistle','Plum','Violet','Hotpink','Purple']

function getColor(d) 
{
  // then passing the depth into the circle color function
     // the list index NOW starts with 0 not 1 as my original code did
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
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function doOnEachFeature(feature, layer) 

  {// Each point has a tooltip with the Magnitude, the location and depth
      // date was interesting to post also
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><ul><li>Earthquake Magnitude: ${feature.properties.mag}</li><li>Earthquake Depth: ${feature.geometry.coordinates[2]}</li></ul>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  //parsing the data and has default features we can use for further processing.
 let earthquakes = L.geoJSON
 (earthquakeData, 
    {pointToLayer: function(feature, latlng) 
      {return new L.CircleMarker
       (latlng, 
          { // data points scale with magnitude level
            radius:feature.properties.mag * 3,
            // data points colors change with depth level
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: 'black',        //getColor(feature.geometry.coordinates[2]),
            weight: .2,
            opacity: .8,
            fillOpacity: 3   //0.35
          }
        );
      },
    onEachFeature: doOnEachFeature
    }
  );

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) 
{ // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
      {attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'}
      );
 
  // Create a baseMaps object.
  var baseMaps = 
  {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = 
  {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let map = L.map("map", 
  {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [street, earthquakes]
  });
  
  // Create a legend to add to map
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function () 
  {let div = L.DomUtil.create('div', 'info legend');

    for (let i = 0; i < depth.length; i++) 
      {
        let item = `<li style='background: ${colors[i]} '></li>   ${depth [i]}<br>`
        // console.log(item);
        div.innerHTML += item
      }
      return div 
  };
  legend.addTo(map);

  // Create a layer control.
  L.control.layers
 (
  // Pass it our baseMaps and overlayMaps. 
  baseMaps, overlayMaps, 
  {collapsed: false}
  // Add the layer control to the map.
 ).addTo(map);

}
