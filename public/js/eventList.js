(function ($) {
    $(document).ready(function () {

        var element = document.getElementById('map');
        if (element) {
            var map = L.map(element);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            var target = L.latLng('40.744123327283965', '-74.03238396518681');
            map.setView(target, 12);

            var default_map = document.getElementById('default-map').getElementsByTagName('li');
            for (let i = 0; i <= default_map.length - 1; i++) {
                let cord_tag = default_map[i].getElementsByTagName('input');
                let latitude = cord_tag[0].value;
                let longtitude = cord_tag[1].value;

                var new_target = L.latLng(latitude, longtitude);
                map.setView(new_target, 12);
                L.marker(new_target).addTo(map);
            }
        }

    });

})(window.jQuery);