mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "cluster-map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: [108.8, 4.4], // starting position [lng, lat]
  zoom: 4.6, // starting zoom
  // projection: "globe", // display the map as a 3D globe
});
map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

// Create all markers.
campgrounds.forEach((c) => {
  const marker = new mapboxgl.Marker({
    scale: 0.9,
    color: "#C89D7C",
  })
    .setLngLat(c.geolocation.coordinates)
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `<h6><a href="/campgrounds/${c._id}">${c.title}<a></h6><p>${c.location}`
      )
    )
    .addTo(map);
});

// Add the geolocation search bar to the map.
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  })
);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
