var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

d3.json(link, function (data) {
    createFeatures(data.features);
});


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
                fillOpacity: 0.9
            };





            return L.circleMarker(latlng, geojsonMarkerOptions);
        }, onEachFeature: onEachFeature
    }

    );
    createMap(earthquakes);


}






function createMap(earthquakes) {
    plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
    d3.json(plates_url, function (plates_data) {
        var myStyle = {
            color: 'white',
            fillOpacity: 0,
            weight: 1
        }
        var plates = L.geoJSON(plates_data, { style: myStyle });

        var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "dark-v10",
            accessToken: API_KEY
        });

        var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "satellite-v9",
            accessToken: API_KEY
        });

        var baseMaps = {
            'Dark Map': darkmap,
            'Satellite Map': satellitemap
        };

        var overlayMaps = {
            "Earthquakes": earthquakes,
            "Tectonic Plates": plates

        };



        var myMap = L.map("map-id", {
            center: [17, 1.6596],
            zoom: 3,
            layers: [darkmap, earthquakes]
        });

        L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(myMap);

        var legend = L.control({ position: "bottomright" });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create("div", "legend");
            div.innerHTML += "<h3>Magnitude</h3>";
            div.innerHTML += '<i style="background: #fee5d9"></i><span>2.5-3.0</span><br>';
            div.innerHTML += '<i style="background: #fcbba1"></i><span>3.0-3.5</span><br>';
            div.innerHTML += '<i style="background: #fc9272"></i><span>3.5-4.0</span><br>';
            div.innerHTML += '<i style="background: #fb6a4a"></i><span>4.0-4.5</span><br>';
            div.innerHTML += '<i style="background: #de2d26"></i><span>4.5-5.0</span><br>';
            div.innerHTML += '<i style="background: #a50f15"></i><span>5+</span><br>';




            return div;

        };
        legend.addTo(myMap);
    });
}

