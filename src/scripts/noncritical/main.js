(function(_win, _doc, undefined) {
    'use strict';

    /*
     * aliasses
     * _win: window global object
     * _doc: document object
     */

    var message = _doc.getElementById('message'),
        media = _doc.getElementById('media'),
        video = _doc.createElement('iframe'),
        songs = [
            {
                title: 'Everybody Here Wants You',
                slug: 'nrMwgTc69y4'
            },
            {
                title: 'So Real',
                slug: 'EcaxrqhUJ4c'
            },
            {
                title: 'Grace',
                slug: 'A3adFWKE9JE'
            },
            {
                title: 'Forget Her',
                slug: 'HO0svGjVEP8'
            },
            {
                title: 'Last Goodbye',
                slug: '3MMXjunSx80'
            }
        ];

    video.width = 854;
    video.height = 480;
    video.setAttribute('frameborder', '0');
    video.setAttribute('allowfullscreen', 'true');
    
    // animate padding when iframe is loaded
    video.onload = function() {
        media.classList.add('visible');
        setTimeout(function() {
            _win.scrollTo(0, message.getBoundingClientRect().y - 5);
        }, 450)
    };

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

    // get a random song
    function getSong() {
        var index = Math.floor(Math.random() * songs.length);

        return songs[index];
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
                    'lat=' + p.coords.latitude + '&lon=' + p.coords.longitude + '&units=metric' +
                    '&APPID=8a9fddf3938ff20a939357ee9aaad67c',
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
            var song,
                msge = 'Apparently you are in <strong>' + data.name + '</strong> ' +
                    ' and the weather is <strong>' + data.weather[0].description +
                    '</strong>.<br>';

            if (isBadWeather(data.weather[0].id)) {
                msge = msge + 'So, maybe you can go outside and listen to Jeff Buckley later. Have a nice day!';
                setMessage(msge);
                return;
            } else {
                song = getSong();

                msge = msge + 'So, maybe it is a good time to listen to <strong>' + song.title + '</strong>...';
                setMessage(msge);
                
                // set video
                media.appendChild(video);
                video.src = 'https://www.youtube.com/embed/' + song.slug +
                    '?autoplay=1&rel=0&amp;controls=0&amp;showinfo=0';
            }
        } else {
            setMessage('There was an error fetching the weather data. Please reload the page or try again later.');
        }
    }

    function isBadWeather(code) {
        var badWeatherCodes = [
            200, 201, 202, 210, 211, 212, 221, 230, 231, 232,
            300, 301, 302, 310, 311, 312, 313, 314, 321,
            500, 501, 502, 503, 504, 511, 520, 521, 522, 531,
            600, 601, 602, 611, 612, 615, 616, 620, 621, 622,
            804 ];

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

        backgroundImg.src = backgroundImg.dataset.src;
    }

    _win.onload = function() {
        loadBackgroundImage();
        
        var startBtn = _doc.getElementById('start');

        startBtn.addEventListener('click', function() {
            startBtn.classList.add('hidden');
            message.classList.add('show');
            getPosition();
        }, false);
    };

})(window, document);