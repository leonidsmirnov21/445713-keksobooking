'use strict';

(function () {
  // находит элементы для пинов
  var pins = document.querySelector('.map__pins');
  var template = document.querySelector('template');
  var templatePin = template.content.querySelector('.map__pin');

  var renderPin = function (pin) {
    var pinElement = templatePin.cloneNode(true);
    var mapPinWidth = 50;
    var mapPinHeight = 70;

    pinElement.style.left = pin.location.x - mapPinWidth / 2 + 'px';
    pinElement.style.top = pin.location.y - mapPinHeight + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    return pinElement;
  };

  // рисует пины
  var paintPins = function () {
    var fragmentPin = document.createDocumentFragment();
    for (var i = 0; i < window.points.length; i++) {
      fragmentPin.appendChild(renderPin(window.points[i]));
    }
    pins.appendChild(fragmentPin);
  };
  paintPins();
})();
