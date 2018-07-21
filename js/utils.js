'use strict';

(function () {
  var ESC_KEYCODE = 27;
  window.utils = {
    map: document.querySelector('.map'),
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    arrayShuffle: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[j];
        array[j] = array[i];
        array[i] = temp;
      }
      return array;
    },
    getMainPinCoordinates: function () {
      var mapPinMain = window.utils.map.querySelector('.map__pin--main');
      var adress = document.querySelector('#address');
      var mapPinMainLeft = mapPinMain.style.left;
      var mapPinMainTop = mapPinMain.style.top;
      var mapPinMainWidth = mapPinMain.offsetWidth;
      var mapPinMainHeight = mapPinMain.offsetHeight;
      var adressLeft = +mapPinMainLeft.substr(0, mapPinMainLeft.length - 2) + mapPinMainWidth / 2;
      var adressTop = +mapPinMainTop.substr(0, mapPinMainTop.length - 2) + mapPinMainHeight;
      adress.value = Math.floor(adressLeft) + ', ' + Math.floor(adressTop);
    },
    deleteDiv: function () {
      document.querySelector('.error-message').remove();
    }
  };
})();
