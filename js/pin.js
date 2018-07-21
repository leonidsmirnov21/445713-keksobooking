'use strict';

(function () {
  var MIN_TOP = 130;
  var MAX_TOP = 630;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var DELAY_TIME = 3000;
  var mapPinMain = window.utils.map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var pins = document.querySelector('.map__pins');
  var template = document.querySelector('template');
  var templatePin = template.content.querySelector('.map__pin');
  var PINS_QUANTITY_MAX = 5;

  window.pin = {
    remove: function () {
      var mapPins = window.utils.map.querySelectorAll('button[type=button]');
      Array.from(mapPins).forEach(function (it) {
        it.remove();
      });
    },
    onMapFiltersChange: function () {
      window.card.remove();
      window.pin.remove();

      var samePins = window.dataArray.filter(window.filterPins);

      window.itemsDataForRender = samePins.slice(0, PINS_QUANTITY_MAX);
      renderPins(window.itemsDataForRender);

      var mapPins = window.utils.map.querySelectorAll('button[type=button]');
      Array.from(mapPins).forEach(function (it) {
        it.addEventListener('click', searchPin);
      });
    }
  };

  var createPin = function (pin) {
    var pinElement = templatePin.cloneNode(true);

    pinElement.style.left = pin.location.x - MAP_PIN_WIDTH / 2 + 'px';
    pinElement.style.top = pin.location.y - MAP_PIN_HEIGHT + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    return pinElement;
  };

  var renderPins = function (points) {
    var fragmentPin = document.createDocumentFragment();

    points.forEach(function (it) {
      fragmentPin.appendChild(createPin(it));
    });

    pins.appendChild(fragmentPin);
  };

  var searchPin = function (evt) {
    var currentGoal = evt.currentTarget;

    window.itemsDataForRender.forEach(function (it, i) {
      var mapPins = window.utils.map.querySelectorAll('button[type=button]');
      if (currentGoal === mapPins[i]) {
        window.card.check(it);
      }
    });

    window.utils.map.addEventListener('click', window.onMapClick);

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

  var onInitPins = function (data) {
    window.dataArray = data;
    var itemsDataShuffle = window.utils.arrayShuffle(data);
    window.itemsDataForRender = itemsDataShuffle.slice(0, PINS_QUANTITY_MAX);

    renderPins(window.itemsDataForRender);

    var mapPins = window.utils.map.querySelectorAll('button[type=button]');

    Array.from(mapPins).forEach(function (it) {
      it.addEventListener('click', searchPin);
    });

    Array.from(mapFilters.elements).forEach(function (it) {
      it.removeAttribute('disabled', '');
    });

    if (window.utils.map.classList.contains('map--faded')) {
      window.utils.map.classList.remove('map--faded');
    }

    if (adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.remove('ad-form--disabled');
    }

    window.form.acivate();

    mapFilters.addEventListener('change', window.debounce(window.pin.onMapFiltersChange));
  };

  var onInitPinsError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(window.utils.deleteDiv, DELAY_TIME);
  };

  var onMapPinMainMouseDown = function (evt) {
    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMapPinMainMove = function (moveEvt) {
      var mapWidth = window.utils.map.offsetWidth;

      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      startCoordinates = {
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
      if ((mapPinMain.offsetTop - shift.y) > (MAX_TOP - mapPinMain.offsetHeight)) {
        mapPinMain.style.top = (MAX_TOP - mapPinMain.offsetHeight) + 'px';
      }
    };

    var onDocumentMouseUp = function () {
      document.removeEventListener('mousemove', onMapPinMainMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
      window.utils.getMainPinCoordinates();

      if (window.utils.map.classList.contains('map--faded')) {
        window.backend.download(onInitPins, onInitPinsError);
      }
    };

    document.addEventListener('mousemove', onMapPinMainMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };
  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
})();
