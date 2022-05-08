(function ($) {
    $(document).ready(function () {

        //Setting map
        var element = document.getElementById('map');
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

        // Setting organizer ratings
        var ratings_element = document.getElementById('orgainzer-rating').getElementsByClassName('ratings');
        for (let i = 0; i <= ratings_element.length - 1; i++) {
            let inputs = ratings_element[i].getElementsByTagName('i');
            for (let j = 0; j <= inputs.length - 1; j++) {
                let rating = +inputs[j].getAttribute('data-rating');
                let rat_mark = +inputs[j].getAttribute('data-rat_map');
                if (rating >= rat_mark) {
                    inputs[j].className  += ' rating-color';
                }
            }
        }
    });

})(window.jQuery);