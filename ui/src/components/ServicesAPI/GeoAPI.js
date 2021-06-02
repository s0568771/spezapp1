import React from 'react';
// import validateConstants from "mapbox-gl/src/style-spec/validate/validate_constants";

export function updateGeolocationToLocalstore(){
    let state = {
        lat: 0,
        lng: 0
    }
    // console.log('update startet')
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            state.lat = lat;
            state.lng = lng;
            localStorage.setItem('Geo', JSON.stringify(state));
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );
    return JSON.parse(localStorage.getItem('Geo'));
}
export function getGeolocationToLocalstore(){
    // localStorage.clear()
    if (!localStorage.getItem('Geo')){
        // console.log('update Geo-data...')
        // console.log(localStorage.getItem('Geo'))
        return updateGeolocationToLocalstore();
    }else{
        // console.log('returned Geo-data...')
        return JSON.parse(localStorage.getItem('Geo'));
    }

}

//
// console.log(getMensaByID(1)[0].coordinates[0])
// console.log(getMensaByID(1)[0].coordinates[1])
// Quelle von: https://spectrum.chat/react-native/help/geolocation-and-calculating-distances~4afd885f-e51c-4f87-8e20-8675017f254d
// return Entfernung in Km
export function distance(coordinate1_lat, coordinate1_lng, coordinate2_lat, coordinate2_lng) {
    const toRadian = n => (n * Math.PI) / 180
    let lat2 = coordinate2_lat
    let lon2 = coordinate2_lng
    let lat1 = coordinate1_lat
    let lon1 = coordinate1_lng
    let R = 6371 // km
    let x1 = lat2 - lat1
    let dLat = toRadian(x1)
    let x2 = lon2 - lon1
    let dLon = toRadian(x2)
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return d // in km
}

export default React.memo(getGeolocationToLocalstore);