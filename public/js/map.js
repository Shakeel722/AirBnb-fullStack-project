 

//  Creating a map

        maptilersdk.config.apiKey = apiKey; // Replace with your actual API key

        const map = new maptilersdk.Map({
            container: 'map', // The ID of the div element
            style: maptilersdk.MapStyle.STREET, // Example map style
            center: data.geometry.coordinates, // Example starting position [lng, lat]
            zoom:10 // Example starting zoom level
        });
 

//creating a marker
const marker = new maptilersdk.Marker({color:"red"})
    .setLngLat(data.geometry.coordinates) // Use the coordinates from the database
    .addTo(map);

//creating a popup
    const popup = new maptilersdk.Popup({ closeButton: false, closeOnClick: false })
        .setHTML("<h6>" + data.title + "</h6><p> " + data.location + "</p>");

    marker.setPopup(popup);


 // on hover show popup
        marker.getElement().addEventListener('mouseover', () => {
        popup.setLngLat(marker.getLngLat()).addTo(map);
    });

    marker.getElement().addEventListener('mouseout', () => {
        popup.remove();
    });