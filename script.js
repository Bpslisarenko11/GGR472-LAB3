mapboxgl.accessToken = "pk.eyJ1Ijoic3BibGlzYXJlbmtvMTIiLCJhIjoiY2xzMjlodmljMGthcjJrbXRibnRwZ2d3eCJ9.gxylQolcBDuJTH_WfI6MrA"; //accesstoken for map style

const map = new mapboxgl.Map({
    container: "my-map", //ID for my-map container
    center: [-79.41390704282365, 43.64777081498133], //starting position coordinates in longitude and latitude
    zoom: 12, //starting zoom for the map
    maxBounds: [
        [-79.6, 43.4], // Southwest
        [-79.2, 43.8]  // Northeast
    ],

});

map.addControl(new mapboxgl.NavigationControl());

map.addControl(new mapboxgl.FullscreenControl());

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    bbox: [-79.6, 43.4, -79.2, 43.8]
});

// Append geocoder variable to goeocoder HTML div to position on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('load',() => {
    map.addSource("parks-areas", {
        type: "geojson",
        data: "https://bpslisarenko11.github.io/GGR472-LAB2/park_directions1.geojson", // Link to GeoJSON link in GitHub
    
    });
    //Add the GeoJSON link source as a layer
    map.addLayer({
        "id": "parks-shapes",
        "type": "circle",
        "source": "parks-areas",
        "paint": {
            "circle-width": 4,
            "circle-color": "#850000",
            "circle-opacity": 0.45 //make the lines semi-transparent

        }
    });
})