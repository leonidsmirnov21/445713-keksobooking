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

    for (var i = 0; i < window.dataArrayForRender.length; i++) {
      if (currentTar === window.mapPin[i]) {
        window.checkCard(window.dataArrayForRender[i]);
      }
    }
  };

  var initPins = function (data) {
    window.dataArray = data;
    window.pinsQuantityMax = 5;
    var dataArrayShuf = window.utils.arrayShuffle(data);
    window.dataArrayForRender = dataArrayShuf.slice(0, window.pinsQuantityMax);

    renderPins(window.dataArrayForRender);

    window.mapPin = window.utils.map.querySelectorAll('button[type=button]');

    for (var i = 0; i < window.mapPin.length; i++) {
      window.mapPin[i].addEventListener('click', searchPin);
    }
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

  var selectHousingType = document.querySelector('select#housing-type');
  var selectHousingPrice = document.querySelector('select#housing-price');
  var selectHousingRooms = document.querySelector('select#housing-rooms');
  var selectHousingGuests = document.querySelector('select#housing-guests');
  var mapFilters = document.querySelector('.map__filters');
  var inputWifi = mapFilters.querySelector('input#filter-wifi');
  var inputDishwasher = mapFilters.querySelector('input#filter-dishwasher');
  var inputParking = mapFilters.querySelector('input#filter-parking');
  var inputWasher = mapFilters.querySelector('input#filter-washer');
  var inputElevator = mapFilters.querySelector('input#filter-elevator');
  var inputConditioner = mapFilters.querySelector('input#filter-conditioner');

  var updatePins = function () {
    var articleCard = window.utils.map.querySelector('article');
    if (articleCard) {
      articleCard.remove();
    }

    var mapPin = window.utils.map.querySelectorAll('button[type=button]');

    for (var i = 0; i < mapPin.length; i++) {
      window.mapPin[i].remove();
    }

    var samePins = window.dataArray.filter(function (it) {
      var allChecksComplete = true;

      if (!(selectHousingType.value === 'any' || it.offer.type === selectHousingType.value)) {
        allChecksComplete = false;
      }

      if (!(selectHousingPrice.value === 'any'
        || (selectHousingPrice.value === 'low' && it.offer.price < 10000)
        || (selectHousingPrice.value === 'high' && it.offer.price > 50000)
        || (selectHousingPrice.value === 'middle' && it.offer.price >= 10000 && it.offer.price <= 50000))) {
        allChecksComplete = false;
      }

      if (!(selectHousingRooms.value === 'any' || it.offer.rooms.toString() === selectHousingRooms.value)) {
        allChecksComplete = false;
      }

      if (!(selectHousingGuests.value === 'any' || it.offer.guests.toString() === selectHousingGuests.value)) {
        allChecksComplete = false;
      }

      if (inputWifi.checked) {
        if (it.offer.features.indexOf(inputWifi.value) === -1) {
          allChecksComplete = false;
        }
      }

      if (inputDishwasher.checked) {
        if (it.offer.features.indexOf(inputDishwasher.value) === -1) {
          allChecksComplete = false;
        }
      }

      if (inputParking.checked) {
        if (it.offer.features.indexOf(inputParking.value) === -1) {
          allChecksComplete = false;
        }
      }

      if (inputWasher.checked) {
        if (it.offer.features.indexOf(inputWasher.value) === -1) {
          allChecksComplete = false;
        }
      }

      if (inputElevator.checked) {
        if (it.offer.features.indexOf(inputElevator.value) === -1) {
          allChecksComplete = false;
        }
      }

      if (inputConditioner.checked) {
        if (it.offer.features.indexOf(inputConditioner.value) === -1) {
          allChecksComplete = false;
        }
      }

      return allChecksComplete;
    });

    window.dataArrayForRender = samePins.slice(0, window.pinsQuantityMax);
    renderPins(window.dataArrayForRender);

    window.mapPin = window.utils.map.querySelectorAll('button[type=button]');
    for (var j = 0; j < window.mapPin.length; j++) {
      window.mapPin[j].addEventListener('click', searchPin);
    }
  };

  selectHousingType.addEventListener('change', updatePins);
  selectHousingPrice.addEventListener('change', updatePins);
  selectHousingRooms.addEventListener('change', updatePins);
  selectHousingGuests.addEventListener('change', updatePins);
  inputWifi.addEventListener('change', window.debounce(updatePins));
  inputDishwasher.addEventListener('change', window.debounce(updatePins));
  inputParking.addEventListener('change', window.debounce(updatePins));
  inputWasher.addEventListener('change', window.debounce(updatePins));
  inputElevator.addEventListener('change', window.debounce(updatePins));
  inputConditioner.addEventListener('change', window.debounce(updatePins));

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
