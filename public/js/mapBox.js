export const getMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYm9nZGFuLWNvbnN0YW50aW4iLCJhIjoiY2s4Z3pzNXRrMDBpYzNxbzczczFkY2szOSJ9.1Ag3GxTWzMQyB5aUrYBRlA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/bogdan-constantin/ck8h232yg035v1ipo8p459n90',
        scrollZoom: false
    })

    const bounds = new mapboxgl.LngLatBounds()
    locations.forEach(loc => {

        // create marker
        const markup = document.createElement('div')
        markup.className = 'marker'

        // add morker
        new mapboxgl.Marker({
            element: markup,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map)

        new mapboxgl.Popup({ offset: 30 })
            .setLngLat(loc.coordinates)
            .setHTML(`${loc.day}. ${loc.description}`)
            .addTo(map)

        // set map bounds coordinates
        bounds.extend(loc.coordinates)
    })

    map.fitBounds(bounds, {
        padding: 200
    })
}