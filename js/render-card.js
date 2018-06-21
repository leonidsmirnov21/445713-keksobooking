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

  // создаёт список фич
  var renderFeatures = function (arrFeatures) {
    var fragmentFeatures = document.createDocumentFragment();
    var newFeatureElement;

    for (var i = 0; i < arrFeatures.length; i++) {
      newFeatureElement = document.createElement('li');
      newFeatureElement.className = 'popup__feature popup__feature--' + arrFeatures[i];
      fragmentFeatures.appendChild(newFeatureElement);
    }
    return fragmentFeatures;
  };

  // создаёт список фоток
  var renderPhotos = function (arrPhotos) {
    var photosContainer = document.createDocumentFragment();
    var templatePhoto = template.content.querySelector('.popup__photo');

    for (var i = 0; i < arrPhotos.length; i++) {
      var photoElement = templatePhoto.cloneNode(true);
      photoElement.src = arrPhotos[i];
      photosContainer.appendChild(photoElement);
    }
    return photosContainer;
  };

  // создаёт карточку с данными
  window.renderCard = function (renderObj) {
    var card = templateCard.cloneNode(true);

    card.querySelector('.popup__title').textContent = renderObj.offer.title;
    card.querySelector('.popup__text--address').textContent = renderObj.offer.address;
    card.querySelector('.popup__text--price').textContent = renderObj.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = HOUSE_TYPES[renderObj.offer.type];
    card.querySelector('.popup__text--capacity').textContent = renderObj.offer.rooms + ' комнаты для ' + renderObj.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + renderObj.offer.checkin + ', выезд до ' + renderObj.offer.checkout;
    card.querySelector('.popup__features').innerHTML = '';
    card.querySelector('.popup__features').appendChild(renderFeatures(renderObj.offer.features));
    card.querySelector('.popup__description').textContent = renderObj.offer.description;
    card.querySelector('.popup__photos').innerHTML = '';
    card.querySelector('.popup__photos').appendChild(renderPhotos(renderObj.offer.photos));
    card.querySelector('.popup__avatar').src = renderObj.author.avatar;

    return card;
  };
})();