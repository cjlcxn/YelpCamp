mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: currCamp.geolocation.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

// Create a new marker.
const marker = new mapboxgl.Marker()
  .setLngLat(currCamp.geolocation.coordinates)
  .setPopup(
    new mapboxgl.Popup().setHTML(
      `<h6>${currCamp.title}</h6><p>${currCamp.location}`
    )
  )
  .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
