'use strict';

(function () {
  // находит элементы для карточки
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  // создаёт карточку при клике на пин
  var renderFinalCard = function (evt) {
    var currentImg = evt.currentTarget.querySelector('img');
    var srcFrom = currentImg.src.search('img/avatars/user');
    var srcTo = currentImg.src.length;
    var currentSrc = currentImg.src.substr(srcFrom, srcTo);
    var articleCard = window.util.map.querySelector('article');

    for (var i = 0; i < window.points.length; i++) {
      if (currentSrc === window.points[i].author.avatar) {
        if (!articleCard) {
          window.util.map.insertBefore(window.renderCard(window.points[i]), mapFiltersContainer);
        } else {
          articleCard.remove();
          window.util.map.insertBefore(window.renderCard(window.points[i]), mapFiltersContainer);
        }
      }
    }
  };

  // вешает обработчик на все пины
  var mapPin = window.util.map.querySelectorAll('button[type=button]');
  for (var i = 0; i < mapPin.length; i++) {
    mapPin[i].addEventListener('click', renderFinalCard);
  }

  // вешает обработчик на карту и отлавливает клик по крестику
  var onMapClick = function (evt) {
    var cardClose = window.util.map.querySelector('.popup__close');
    var articleCard = window.util.map.querySelector('article');
    if (evt.target === cardClose) {
      articleCard.remove();
    }
  };
  window.util.map.addEventListener('click', onMapClick);
})();
