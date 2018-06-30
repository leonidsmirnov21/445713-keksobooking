'use strict';

(function () {
  var mapPinMain = window.utils.map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');

  // находит элементы для пинов
  var pins = document.querySelector('.map__pins');
  var template = document.querySelector('template');
  var templatePin = template.content.querySelector('.map__pin');

  var createPin = function (pin) {
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
  var renderPins = function (points) {
    var fragmentPin = document.createDocumentFragment();

    for (var i = 0; i < points.length; i++) {
      fragmentPin.appendChild(createPin(points[i]));
    }
    pins.appendChild(fragmentPin);
  };

  // отслеживает клик по пину
  var searchPin = function (evt) {
    var currentTar = evt.currentTarget;

    for (var i = 0; i < window.mapPin.length; i++) {
      if (currentTar === window.mapPin[i]) {
        window.checkCard(window.dataArray[i]);
      }
    }
  };

  var initPins = function (data) {
    window.dataArray = data;
    renderPins(window.dataArray);
    window.mapPin = window.utils.map.querySelectorAll('button[type=button]');

    for (var i = 0; i < window.mapPin.length; i++) {
      window.mapPin[i].addEventListener('click', searchPin);
    }
  };

  var initPinsError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: #ff6547;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.color = '#ffffff';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var deleteDiv = function () {
      document.querySelector('div').remove();
    };
    setTimeout(deleteDiv, 3000);
  };

  // ПЕРЕТАСКИВАНИЕ МАРКЕРА
  var onMapPinMainMouseDown = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMapPinMainMove = function (moveEvt) {
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.x,
        y: moveEvt.y
      };

      var mapWidth = window.utils.map.offsetWidth;
      var minTop = 130;
      var maxTop = 630;

      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

      if ((mapPinMain.offsetLeft - shift.x) > (mapWidth - mapPinMain.offsetWidth)) {
        mapPinMain.style.left = mapWidth - mapPinMain.offsetWidth + 'px';
      }
      if ((mapPinMain.offsetLeft - shift.x) < (mapWidth - mapWidth)) {
        mapPinMain.style.left = (mapWidth - mapWidth) + 'px';
      }
      if ((mapPinMain.offsetTop - shift.y) < (minTop - mapPinMain.offsetHeight)) {
        mapPinMain.style.top = (minTop - mapPinMain.offsetHeight) + 'px';
      }
      if ((mapPinMain.offsetTop - shift.y) > maxTop) {
        mapPinMain.style.top = maxTop + 'px';
      }
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMapPinMainMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.utils.getMainPinCoords();

      // удаляет плашку если она есть
      if (window.utils.map.classList.contains('map--faded')) {
        window.utils.map.classList.remove('map--faded');
        window.backend.download(initPins, initPinsError);
      }
      // удаляет плашку с формы
      if (adForm.classList.contains('ad-form--disabled')) {
        adForm.classList.remove('ad-form--disabled');
      }

      // вызов функции активации формы
      window.acivateForm();
    };

    document.addEventListener('mousemove', onMapPinMainMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
})();
