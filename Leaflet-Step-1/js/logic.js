var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

d3.json(link, function (data) {
    createFeatures(data.features);
});

//var geojsonMarkerOptions = {
//    radius: 8,
//   fillColor: "#ff7800",
//   color: "#000",
//   weight: 1,
//   opacity: 1,
//   fillOpacity: 0.8
//};

//function chooseColor(magnitude) {
//   switch (magnitude) {
//      case (magnitude > 4.5):
//        return 'black';

//  case (magnitude > 4):
//    return 'blue';

//case (magnitude > 3.5):
//   return 'yellow';

//case (magnitude > 3):
//   return 'brown';

//default:
//   return 'green'
// }
//};

function getColor(d) {
    return d >= 5 ? '#a50f15' :
        d >= 4.5 ? '#de2d26' :
            d >= 4 ? '#fb6a4a' :
                d >= 3.5 ? '#fc9272' :
                    d >= 3 ? '#fcbba1' :
                        '#fee5d9'
};



function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3> Magnitude: " + feature.properties.mag + "</h3>" + "<hr>" + "<h3> Location: " + feature.properties.place + "</h3>");
    };
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
                radius: feature.properties.mag ** 1.5, //- Math.min(feature.properties.mag)) / (Math.max(feature.properties.mag) - Math.min(feature.properties.mag)),
                fillColor: getColor(feature.properties.mag),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };





            return L.circleMarker(latlng, geojsonMarkerOptions);
        }, onEachFeature: onEachFeature
    }

    );
    createMap(earthquakes);
}

//function createFeatures(earthquakeData) {
//   var earthquakes = L.geoJSON(earthquakeData);
// createMap(earthquakes);
//}

function createMap(earthquakes) {
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var myMap = L.map("map-id", {
        center: [39.8283, -98.5795],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });
}