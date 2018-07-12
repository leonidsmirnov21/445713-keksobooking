'use strict';

(function () {
  var MIN_TOP = 130;
  var MAX_TOP = 630;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var mapPinMain = window.utils.map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var pins = document.querySelector('.map__pins');
  var template = document.querySelector('template');
  var templatePin = template.content.querySelector('.map__pin');
  var pinsQuantityMax = 5;

  var createPin = function (pin) {
    var pinElement = templatePin.cloneNode(true);

    pinElement.style.left = pin.location.x - MAP_PIN_WIDTH / 2 + 'px';
    pinElement.style.top = pin.location.y - MAP_PIN_HEIGHT + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    return pinElement;
  };

  // рисует пины
  var renderPins = function (points) {
    var fragmentPin = document.createDocumentFragment();

    points.forEach(function (it) {
      fragmentPin.appendChild(createPin(it));
    });

    pins.appendChild(fragmentPin);
  };

  // отслеживает клик по пину
  var searchPin = function (evt) {
    var currentTar = evt.currentTarget;

    window.dataArrayForRender.forEach(function (it, i) {
      var mapPin = window.utils.map.querySelectorAll('button[type=button]');
      if (currentTar === mapPin[i]) {
        window.checkCard(it);
      }
    });

    window.onPopupEscPress = function (event) {
      window.utils.isEscEvent(event, closePopup);
    };

    document.addEventListener('keydown', window.onPopupEscPress);

    var closePopup = function () {
      var articleCard = window.utils.map.querySelector('article');
      articleCard.remove();
      document.removeEventListener('keydown', window.onPopupEscPress);
    };
  };

  var mapFilters = document.querySelector('.map__filters');

  var initPins = function (data) {
    window.dataArray = data;
    var dataArrayShuf = window.utils.arrayShuffle(data);
    window.dataArrayForRender = dataArrayShuf.slice(0, pinsQuantityMax);

    renderPins(window.dataArrayForRender);

    var mapPin = window.utils.map.querySelectorAll('button[type=button]');

    Array.from(mapPin).forEach(function (it) {
      it.addEventListener('click', searchPin);
    });

    Array.from(mapFilters.elements).forEach(function (it) {
      it.removeAttribute('disabled', '');
    });
  };

  var initPinsError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var deleteDiv = function () {
      document.querySelector('div').remove();
    };
    setTimeout(deleteDiv, 3000);
  };

  window.removePins = function () {
    var mapPin = window.utils.map.querySelectorAll('button[type=button]');
    Array.from(mapPin).forEach(function (it) {
      it.remove();
    });
  };


  window.updatePins = function () {
    window.removeCard();
    window.removePins();

    var samePins = window.dataArray.filter(window.filterPins);

    window.dataArrayForRender = samePins.slice(0, pinsQuantityMax);
    renderPins(window.dataArrayForRender);

    var mapPin = window.utils.map.querySelectorAll('button[type=button]');
    Array.from(mapPin).forEach(function (it) {
      it.addEventListener('click', searchPin);
    });
  };

  // ПЕРЕТАСКИВАНИЕ МАРКЕРА
  var onMapPinMainMouseDown = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMapPinMainMove = function (moveEvt) {
      var mapWidth = window.utils.map.offsetWidth;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.x,
        y: moveEvt.y
      };

      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

      if ((mapPinMain.offsetLeft - shift.x) > (mapWidth - mapPinMain.offsetWidth)) {
        mapPinMain.style.left = mapWidth - mapPinMain.offsetWidth + 'px';
      }
      if ((mapPinMain.offsetLeft - shift.x) < (mapWidth - mapWidth)) {
        mapPinMain.style.left = (mapWidth - mapWidth) + 'px';
      }
      if ((mapPinMain.offsetTop - shift.y) < (MIN_TOP - mapPinMain.offsetHeight)) {
        mapPinMain.style.top = (MIN_TOP - mapPinMain.offsetHeight) + 'px';
      }
      if ((mapPinMain.offsetTop - shift.y) > MAX_TOP) {
        mapPinMain.style.top = MAX_TOP + 'px';
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
