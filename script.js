mapboxgl.accessToken = "pk.eyJ1Ijoic3BibGlzYXJlbmtvMTIiLCJhIjoiY2xzMjlodmljMGthcjJrbXRibnRwZ2d3eCJ9.gxylQolcBDuJTH_WfI6MrA"; //accesstoken for map style

const map = new mapboxgl.Map({
    container: "my-map", //ID for my-map container
    center: [-79.37390704282365, 43.64777081498133], //starting position coordinates in longitude and latitude
    zoom: 11, //starting zoom for the map
    maxBounds: [
        [-79.6, 43.4], // Maximum map zoom out coordinates Southwest
        [-79.2, 43.8]  // Maximum map zoom out coordinates Northeast
    ],

});

// Zoom controls
map.addControl(new mapboxgl.NavigationControl(), "top-left");

// Full screen control
map.addControl(new mapboxgl.FullscreenControl(), "top-left");

// Add geocoder to the map
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    bbox: [-79.6, 43.4, -79.2, 43.8] // Only features within this coordinate area will return search results
});

// Access the geocoder Id from HTML page and append the geocoder variable to it
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


map.on('load',() => {
    // Add Geojson source file
    map.addSource("parks-areas", {
        type: "geojson",
        data: 'https://raw.githubusercontent.com/Bpslisarenko11/GGR472-LAB3/main/park_area.geojson', // Link to GeoJSON link in GitHub
    
    });
    //Add the GeoJSON link source as a new layer
    map.addLayer({
        "id": "parks-shapes",
        "type": "circle",
        "source": "parks-areas",
        "paint": {
            "circle-color": [
                "step",
                ["get", "Area (square meters)"], // Access the Area property of the Geojson
                //Assign colours based on Area values of each feature in the Geojson
                "#6b89ff",
                7500, "#0033ff",
                20000, "#001c8a",
                50000, "#8b00d6",
                85000, "#d10000"
            ],
            "circle-opacity": 1.0,
            "circle-radius": [
                //insert case condition for changing the radius of the circles
                "case",
                ["boolean", ["feature-state", "hover"], false],
                11, // change radius to 11 when hovering over circle
                6 // set circle radius to 6 otherwise
            ],
            "circle-outline": "#002aff"

        }
    });

    map.addLayer({
       'id': 'parks-names1',
       'type': 'symbol',
       'source': 'parks-areas',
       'layout': {
           'text-field': ['get', 'Name'],
           'text-variable-anchor': ['bottom'],
           'text-radial-offset': 0.8,
           'text-justify': 'auto'
       },
       'paint': {
           'text-color': 'black',
           "text-halo-color" : "#ffffff", //Adds white halo background to text
           "text-halo-width" : 3
       },
       "filter": ["==", ["get", "Name"], ""]
    });
});

// Add event listener that changes the zoom level and poistion when button is clicked
document.getElementById('reset-button').addEventListener('click', () => {
    map.flyTo({
        center: [-79.37390704282365, 43.64777081498133],
        zoom: 11,
        essential: true
    });
});


// Create new variable for hover conditions 
let parksize = null;

map.on('mousemove', 'parks-shapes', (e) => {
    if (e.features.length > 0) { //If there are features in array enter conditional

        if (parksize !== null) { //reset the size of the first "park-shapes" circle if hovering over multiple circles
            map.setFeatureState(
                { source: 'parks-areas', id: parksize },
                { hover: false }
            );
        }

        parksize = e.features[0].id; //change the parksize variable to the feature Id
        map.setFeatureState(
            { source: 'parks-areas', id: parksize },
            { hover: true } //When hovering over a feature, the circle size will change
        ); 
    
    }
});


map.on('mouseleave', 'parks-shapes', () => { //If the mouse hover isn't active over the "parks-shapes" then reset the parksize variable and circle size
    if (parksize !== null) {
        map.setFeatureState(
            { source: 'parks-areas', id: parksize },
            { hover: false }
        );
    }
    parksize = null;
});


map.on('mouseenter', 'parks-shapes', (e) => {
    map.getCanvas().style.cursor = 'pointer'; //When hovering over "parks-shapes layer" change the mouse icon to pointer
    let parklabel = e.features[0].properties.Name; //Add new variable for text
    console.log(parklabel)
    map.setFilter("parks-names1", ["==", ["get", "Name"], parklabel]) //Add hover text feature for park points
});

map.on('mouseleave', 'parks-shapes', (e) => {
    map.getCanvas().style.cursor = ''; //When pointer icon is no longer over "parks-shapes" layer reverse back to mouse cursor icon
    parklabel = null //change variable to null when leaving hover
    map.setFilter("parks-names1", ["==", ["get", "Name"], parklabel]) //remove the text layer when no longer hovering over feature
});

map.on('click', 'parks-shapes', (e) => {
    new mapboxgl.Popup() //Create a popup when clicking the "parks-shapes" layer
    .setLngLat(e.lngLat) //Popup appears at the longitude and latitude of the click
        .setHTML("<b>Park name: </b>" + e.features[0].properties.Name + "<br>" +
            "<b>Location:</b> " + e.features[0].properties.Location) //Access "parks-shapes" data to add name and location data to popup
        .addTo(map); //Add the pop up to the map
});


// Create new variable
let parkpoint;

// Create a new event listener 
document.getElementById("parkdata").addEventListener('click',(e) => { 
    //set the value of the parkpoint variable  
    parkpoint = document.getElementById('parks1').value;

    //Create conditional statements depending on the value of parkpoint, which will determine the flyTo location
    if (parkpoint == 'none') {
        map.flyTo({
            center: [-79.37390704282365, 43.64777081498133],
            zoom: 11,
            essential: true

        });

    } 
    
    if (parkpoint == "High Park") {
        map.flyTo({
            center: [-79.46283559068684,43.64648446531683],
            zoom: 15,
            essential: true

        });

    }

    if (parkpoint == "Tommy Thompson Park") {
        map.flyTo({
            center: [-79.33519738606873,43.62410246744221],
            zoom: 15,
            essential: true

        });
    }

    if (parkpoint == "Trinity Bellwoods Park") {
        map.flyTo({
            center: [-79.4138705551673,43.64742621836032],
            zoom: 15,
            essential: true

        });
    }

    if (parkpoint == "Greenwood Park") {
        map.flyTo({
            center: [-79.32810971490721,43.668653982196815],
            zoom: 15,
            essential: true

        });
    }
});

//Create new variable
let areapoints

//Add new event listener
document.getElementById("filter-area").addEventListener('click',(e) => { 
    //Set the value of the areapoints variable  
    areapoints = document.getElementById('area-park').value;

    //Create conditional if statements which based on the value of areapoints, detemrines the features of the geojson layer that get filtered or removed
    if (areapoints == '0-7500') {
        map.setFilter(
            "parks-shapes",
            [ "<=", ["get", "Area (square meters)"], 7500]
        );
    }

    if (areapoints == '7500-20000') {
        map.setFilter(
            "parks-shapes",
            [ "all", [">", ["get", "Area (square meters)"], 7500], [ "<=", ["get", "Area (square meters)"], 20000]]
        );
    }

    if (areapoints == '20000-50000') {
        map.setFilter(
            "parks-shapes",
            [ "all", [">", ["get", "Area (square meters)"], 20000], [ "<=", ["get", "Area (square meters)"], 50000]]
        );
    }

    if (areapoints == '50000-85000') {
        map.setFilter(
            "parks-shapes",
            [ "all", [">", ["get", "Area (square meters)"], 50000], [ "<=", ["get", "Area (square meters)"], 85000]]
        );
    }

    if (areapoints == '85000+') {
        map.setFilter(
            "parks-shapes",
            [">", ["get", "Area (square meters)"], 85000]
        );
    }

    if (areapoints == 'remove') {
        map.setFilter(
            "parks-shapes",
            ["has", "Area (square meters)"]
        );
    }
}) 