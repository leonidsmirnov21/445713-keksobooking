'use strict';

(function () {
  var TITLE_NAMES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var OBJECT_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES_SERVICES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS_ARR = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var createObjects = function (quantity) {
    var objects = [];
    var obj = {};

    // создаю пустой массив для цифр аватара
    var numbersAvatar = [];

    // заполняю пустой массив для цифр аватара данными
    for (var j = 0; j < quantity; j++) {
      numbersAvatar[j] = j + 1;
    }
    // перемешиваю массив цифр
    window.util.arrayShuffle(numbersAvatar);
    // перемешиваю массив title
    window.util.arrayShuffle(TITLE_NAMES);

    for (var i = 0; i < quantity; i++) {
      // создаю пустой объект
      obj = {};
      obj.author = {};
      obj.offer = {};
      obj.location = {};

      if (numbersAvatar[i] <= 9) {
        obj.author.avatar = 'img/avatars/user0' + numbersAvatar[i] + '.png';
      } else {
        obj.author.avatar = 'img/avatars/user' + numbersAvatar[i] + '.png';
      }

      obj.offer.title = TITLE_NAMES[i];
      obj.location.x = window.util.generateRandIndex(300, 900);
      obj.location.y = window.util.generateRandIndex(130, 630);
      obj.offer.address = obj.location.x + ', ' + obj.location.y;
      obj.offer.price = window.util.generateRandIndex(1000, 1000000);
      obj.offer.type = OBJECT_TYPE[window.util.generateRandIndex(0, OBJECT_TYPE.length - 1)];
      obj.offer.rooms = window.util.generateRandIndex(1, 5);
      obj.offer.guests = window.util.generateRandIndex(1, 8);
      obj.offer.checkin = CHECKIN_TIMES[window.util.generateRandIndex(0, CHECKIN_TIMES.length - 1)];
      obj.offer.checkout = obj.offer.checkin;

      var NEW_FEATURES_SERVICES = FEATURES_SERVICES.slice();
      window.util.arrayShuffle(NEW_FEATURES_SERVICES);
      NEW_FEATURES_SERVICES.length = window.util.generateRandIndex(0, NEW_FEATURES_SERVICES.length);
      obj.offer.features = NEW_FEATURES_SERVICES;

      obj.offer.description = '';
      var NEW_PHOHTOS_ARR = PHOTOS_ARR.slice();
      obj.offer.photos = window.util.arrayShuffle(NEW_PHOHTOS_ARR);
      objects.push(obj);
    }
    return objects;
  };
  window.points = createObjects(8);
})();
