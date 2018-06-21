'use strict';

(function () {
  var mapPinMain = window.util.map.querySelector('.map__pin--main');
  var mapPin = window.util.map.querySelectorAll('button[type=button]');
  var adForm = document.querySelector('.ad-form');
  var fieldsets = adForm.querySelectorAll('fieldset');
  var inputAdress = document.querySelector('#address');

  var hidePins = function () {
    for (var i = 0; i < mapPin.length; i++) {
      mapPin[i].classList.add('hidden');
    }
  };
  hidePins();

  var disableForm = function () {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].setAttribute('disabled', '');
    }
  };
  disableForm();

  var getMainPinCoords = function () {
    var mapPinMainLeft = mapPinMain.style.left;
    var mapPinMainTop = mapPinMain.style.top;
    var mapPinMainWidth = mapPinMain.offsetWidth;
    var mapPinMainHeight = mapPinMain.offsetHeight;
    var inputAdressLeft = +mapPinMainLeft.substr(0, mapPinMainLeft.length - 2) + mapPinMainWidth / 2;
    var inputAdressTop = +mapPinMainTop.substr(0, mapPinMainTop.length - 2) + mapPinMainHeight;
    inputAdress.value = Math.floor(inputAdressLeft) + ', ' + Math.floor(inputAdressTop);
  };
  getMainPinCoords();
})();
