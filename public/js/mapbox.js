

export const tMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaHBzdGhyIiwiYSI6ImNrY3NwczJmZDFxbnYyc2xoZHpoNWt2NGsifQ.WrJnaQkd8oUgcyAqF_Uzew';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hpsthr/ckcsqfytm22hp1iqoupujjygy',
    scrollZoom:false
});

const bound = new mapboxgl.LngLatBounds();
locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = "marker"

    new mapboxgl.Marker({
        element: el,
        anchor: "bottom"
    }).setLngLat(loc.coordinates).addTo(map)

    new mapboxgl.Popup({offset:30}).setLngLat(loc.coordinates).setHTML(`<p> Day ${loc.day} ${loc.description} </p>`).addTo(map)

    bound.extend(loc.coordinates)
})

map.fitBounds(bound, {
    padding: {
        top: 200,
        bottom: 150,
        right: 100,
        left: 100
    }
})

}


