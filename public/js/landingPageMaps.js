(function ($) {
    $(document).ready(function () {

        // Where you want to render the map.
        var element = document.getElementById('map');
        // Create Leaflet map on map element.
        var map = L.map(element);
        // Add OSM tile layer to the Leaflet map.
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        // Target's GPS coordinates.
        var target = L.latLng('40.744123327283965', '-74.03238396518681');
        // Set map's center to target with zoom 14.
        map.setView(target, 12);
        // Place a marker on the same location.
        //L.marker(target).addTo(map);
        var target2 = L.latLng('40.74491217455891', '-74.02665778861372');
        map.setView(target2, 12);
        L.marker(target2).addTo(map);

        var target3 = L.latLng('40.74219773670676', '-74.03283564755172');
        map.setView(target3, 12);
        L.marker(target3).addTo(map);

        var target4 = L.latLng('40.7666107096438', '-74.03713944284772');
        map.setView(target4, 12);
        L.marker(target4).addTo(map);
    });

})(window.jQuery);