'use strict';

(function () {
  var mapPinMain = window.util.map.querySelector('.map__pin--main');
  var mapPin = window.util.map.querySelectorAll('button[type=button]');
  var adForm = document.querySelector('.ad-form');
  var fieldsets = adForm.querySelectorAll('fieldset');
  var inputAdress = document.querySelector('#address');

  var getMainPinCoords = function () {
    var mapPinMainLeft = mapPinMain.style.left;
    var mapPinMainTop = mapPinMain.style.top;
    var mapPinMainWidth = mapPinMain.offsetWidth;
    var mapPinMainHeight = mapPinMain.offsetHeight;
    var inputAdressLeft = +mapPinMainLeft.substr(0, mapPinMainLeft.length - 2) + mapPinMainWidth / 2;
    var inputAdressTop = +mapPinMainTop.substr(0, mapPinMainTop.length - 2) + mapPinMainHeight;
    inputAdress.value = Math.floor(inputAdressLeft) + ', ' + Math.floor(inputAdressTop);
  };

  var showPins = function () {
    for (var i = 0; i < mapPin.length; i++) {
      mapPin[i].classList.remove('hidden');
    }
  };

  var acivateForm = function () {
    for (var j = 0; j < fieldsets.length; j++) {
      fieldsets[j].removeAttribute('disabled', '');
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

      var mapWidth = window.util.map.offsetWidth;
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
      getMainPinCoords();

      // удаляет плашку если она есть
      if (window.util.map.classList.contains('map--faded')) {
        window.util.map.classList.remove('map--faded');
      }
      // удаляет плашку с формы
      if (adForm.classList.contains('ad-form--disabled')) {
        adForm.classList.remove('ad-form--disabled');
      }
      // вызов функции показа пинов
      showPins();

      // вызов функции активации формы
      acivateForm();
    };

    document.addEventListener('mousemove', onMapPinMainMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);
})();
