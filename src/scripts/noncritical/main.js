(function(_win, _doc, undefined) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    var message = _doc.getElementById('message'),
        media = _doc.getElementById('media'),
        video = '<iframe width="854" height="480" src="https://www.youtube.com/embed/nrMwgTc69y4?autoplay=1"' +
            'frameborder="0" allowfullscreen></iframe>';

    // set jabiru configuration
    jabiru.query('&callback').toGlobal();

    // empty node helper
    function empty(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        if (el.innerText) {
            el.innerText = '';
        }
    }

    // set message
    function setMessage(text) {
        empty(message);
        message.innerHTML = text;
    }

    // get position
    function getPosition() {
        setMessage('Getting your location.');

        navigator.geolocation.getCurrentPosition(function(p) {
            setMessage('Getting weather information from your location.');

            jabiru.get({
                url: 'http://api.openweathermap.org/data/2.5/weather?' +
                    'lat=' + p.coords.latitude + '&lon=' + p.coords.longitude + '&units=metric',
                success: resolveData
            });
        }, function(e) {
            setMessage('There was a problem getting your location. Sorry.');
            console.error(e);
        }, {
            enableHighAccuracy: true
        });
    }

    function resolveData(data) {
        if (data.cod === 200) {
            var msge = 'Apparently you are in <strong>' + data.name + '</strong> ' +
                ' and the weather is <strong>' + data.weather[0].description + '</strong>.<br><br>';

            if (checkWeather(data.weather[0].id)) {
                msge = msge + 'So, maybe you can go outside and listen to Jeff Buckley later. Have a nice day!';
                setMessage(msge);
                return;
            } else {
                msge = msge + 'So, maybe it is a good time to hear a nice song...';
                setMessage(msge);
                // set video
                media.classList.add('visible');
                media.innerHTML = video;
            }
        } else {
            setMessage('There was an error fetching the weather data. Please reload the page or try again later.');
        }
    }

    function checkWeather(code) {
        var badWeatherCodes = [
            200, 201, 202, 210, 211, 212, 221, 230, 231, 232,
            300, 301, 302, 310, 311, 312, 313, 314, 321,
            500, 501, 502, 503, 504, 511, 520, 521, 522, 531,
            600, 601, 602, 611, 612, 615, 616, 620, 621, 622 ];

        if (badWeatherCodes.indexOf(code) !== -1) {
            return false;
        }

        return true;
    }

    // lazy load Jeff's background image
    function loadBackgroundImage() {
        var backgroundImg = _doc.getElementsByClassName('back--img')[0];

        backgroundImg.onload = function() {
            this.classList.add('loaded');
            this.onload = null;
        };

        backgroundImg.src = backgroundImg.getAttribute('data-src');
    }

    _win.onload = function() {
        loadBackgroundImage();
        getPosition();
    };

})(window, document);