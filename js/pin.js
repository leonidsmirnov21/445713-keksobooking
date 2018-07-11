'use strict';

(function () {
  var mapPinMain = window.utils.map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var pins = document.querySelector('.map__pins');
  var template = document.querySelector('template');
  var templatePin = template.content.querySelector('.map__pin');
  var pinsQuantityMax = 5;

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

    window.dataArrayForRender.forEach(function (it, i) {
      if (currentTar === window.mapPin[i]) {
        window.checkCard(it);
      }
    });

    var onPopupEscPress = function (event) {
      window.utils.isEscEvent(event, closePopup);
    };

    document.addEventListener('keydown', onPopupEscPress);

    var closePopup = function () {
      var articleCard = window.utils.map.querySelector('article');
      articleCard.remove();
      document.removeEventListener('keydown', onPopupEscPress);
    };
  };

  var mapFilters = document.querySelector('.map__filters');

  var initPins = function (data) {
    window.dataArray = data;
    var dataArrayShuf = window.utils.arrayShuffle(data);
    window.dataArrayForRender = dataArrayShuf.slice(0, pinsQuantityMax);

    renderPins(window.dataArrayForRender);

    window.mapPin = window.utils.map.querySelectorAll('button[type=button]');
    for (var i = 0; i < window.mapPin.length; i++) {
      window.mapPin[i].addEventListener('click', searchPin);
    }

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

    window.mapPin = window.utils.map.querySelectorAll('button[type=button]');
    for (var j = 0; j < window.mapPin.length; j++) {
      window.mapPin[j].addEventListener('click', searchPin);
    }
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
