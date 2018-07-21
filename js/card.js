'use strict';

(function () {
  var HOUSE_TYPES = {
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',
    flat: 'Квартира'
  };

  var template = document.querySelector('template');
  var templateCard = template.content.querySelector('.map__card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  var createFeatures = function (features) {
    var fragmentFeatures = document.createDocumentFragment();
    var newFeatureElement;

    features.forEach(function (it) {
      newFeatureElement = document.createElement('li');
      newFeatureElement.className = 'popup__feature popup__feature--' + it;
      fragmentFeatures.appendChild(newFeatureElement);
    });
    return fragmentFeatures;
  };

  var createPhotos = function (photos) {
    var photosContainer = document.createDocumentFragment();
    var templatePhoto = template.content.querySelector('.popup__photo');

    photos.forEach(function (it) {
      var photoElement = templatePhoto.cloneNode(true);
      photoElement.src = it;
      photosContainer.appendChild(photoElement);
    });
    return photosContainer;
  };

  var createCard = function (pointRender) {
    var card = templateCard.cloneNode(true);

    card.querySelector('.popup__title').textContent = pointRender.offer.title;
    card.querySelector('.popup__text--address').textContent = pointRender.offer.address;
    card.querySelector('.popup__text--price').textContent = pointRender.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = HOUSE_TYPES[pointRender.offer.type];
    card.querySelector('.popup__text--capacity').textContent = pointRender.offer.rooms + ' комнаты для ' + pointRender.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + pointRender.offer.checkin + ', выезд до ' + pointRender.offer.checkout;
    card.querySelector('.popup__features').innerHTML = '';
    card.querySelector('.popup__features').appendChild(createFeatures(pointRender.offer.features));
    card.querySelector('.popup__description').textContent = pointRender.offer.description;
    card.querySelector('.popup__photos').innerHTML = '';
    card.querySelector('.popup__photos').appendChild(createPhotos(pointRender.offer.photos));
    card.querySelector('.popup__avatar').src = pointRender.author.avatar;

    Array.from(card.children).forEach(function (it) {
      if (it !== card.querySelector('.popup__avatar') && it.innerHTML === '') {
        it.classList.add('hidden');
      }
    });

    return card;
  };

  window.card = {
    remove: function () {
      var articleCard = window.utils.map.querySelector('article');
      if (articleCard) {
        articleCard.remove();
      }
    },
    check: function (point) {
      var articleCard = window.utils.map.querySelector('article');
      if (!articleCard) {
        window.utils.map.insertBefore(createCard(point), mapFiltersContainer);
      } else {
        window.card.remove();
        window.utils.map.insertBefore(createCard(point), mapFiltersContainer);
        document.removeEventListener('keydown', window.onPopupEscPress);
      }
    }
  };

  window.onMapClick = function (evt) {
    var cardClose = window.utils.map.querySelector('.popup__close');
    if (evt.target === cardClose) {
      window.card.remove();
      window.utils.map.removeEventListener('click', window.onMapClick);
      document.removeEventListener('keydown', window.onPopupEscPress);
    }
  };
})();
