// Initialize the map
const map = L.map('map').setView([40.7128, -74.0060], 4);

// Add the base tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

//define layers

// First layer from MapWarper (historical/custom map)
var mapWarperLayer = L.tileLayer('https://mapwarper.net/maps/tile/61034/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">MapWarper</a>',
    opacity: 0.25 // Adjust opacity to make both layers visible
});

// Second layer from OpenStreetMap
var openStreetMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    opacity: 1 // Adjust opacity to make both layers visible
});

// Add both layers to the map
map.addLayer(mapWarperLayer);
map.addLayer(openStreetMapLayer);

// For CSV data with latitude and longitude
omnivore.csv('data/historical-sites.csv')
    .on('ready', function(layer) {
        this.eachLayer(function(marker) {
            marker.bindPopup(
                `<h3>${marker.feature.properties.name}</h3>
                 <p>${marker.feature.properties.description}</p>
                 <p>Date: ${marker.feature.properties.date}</p>`
            );
        });
    })
    .addTo(map);
// Add a simple timeline control
const timelineControl = L.control({position: 'bottom'});

timelineControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info timeline');
    div.innerHTML = `
        <h4>Timeline</h4>
        <input type="range" min="1800" max="2000" value="1900" id="yearSlider">
        <span id="yearDisplay">1900</span>
    `;
    return div;
};

timelineControl.addTo(map);

// Add timeline functionality
document.getElementById('yearSlider').addEventListener('input', function(e) {
    const year = e.target.value;
    document.getElementById('yearDisplay').textContent = year;
    
    // Filter your data based on the year
    // This example assumes your data has a 'year' property
    layer.eachLayer(function(marker) {
        if (marker.feature.properties.year <= year) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

// Add a custom legend
const legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `
        <h4>Legend</h4>
        <i style="background: #ff7800"></i> Historical Site<br>
        <i style="background: #0078ff"></i> Battle Location<br>
        <i style="background: #00ff78"></i> Settlement
    `;
    return div;
};

legend.addTo(map);

// Add custom markers for different types of historical sites
function createCustomIcon(type) {
    return L.divIcon({
        className: `custom-icon ${type}`,
        html: `<span class="icon-${type}"></span>`,
        iconSize: [30, 30]
    });
}

git add
git commit -m "Add historical map"
git push origin main
