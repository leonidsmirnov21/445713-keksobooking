'use strict';

(function () {
  var SMALL_PRICE = 10000;
  var MIDDLE_PRICE = 50000;
  var mapFilters = document.querySelector('.map__filters');
  var selectHousingType = document.querySelector('select#housing-type');
  var selectHousingPrice = document.querySelector('select#housing-price');
  var selectHousingRooms = document.querySelector('select#housing-rooms');
  var selectHousingGuests = document.querySelector('select#housing-guests');

  Array.from(mapFilters.elements).forEach(function (it) {
    it.setAttribute('disabled', '');
  });

  window.filterPins = function (it) {
    var allChecksComplete = true;

    if (!(selectHousingType.value === 'any' || it.offer.type === selectHousingType.value)) {
      allChecksComplete = false;
    }

    if (!(selectHousingPrice.value === 'any'
      || (selectHousingPrice.value === 'low' && it.offer.price < SMALL_PRICE)
      || (selectHousingPrice.value === 'high' && it.offer.price > MIDDLE_PRICE)
      || (selectHousingPrice.value === 'middle' && it.offer.price >= SMALL_PRICE && it.offer.price <= MIDDLE_PRICE))) {
      allChecksComplete = false;
    }

    if (!(selectHousingRooms.value === 'any' || it.offer.rooms.toString() === selectHousingRooms.value)) {
      allChecksComplete = false;
    }

    if (!(selectHousingGuests.value === 'any' || it.offer.guests.toString() === selectHousingGuests.value)) {
      allChecksComplete = false;
    }

    var mapCheckboxes = document.querySelectorAll('.map__checkbox');
    Array.from(mapCheckboxes).forEach(function (checkbox) {
      if (checkbox.checked) {
        if (it.offer.features.indexOf(checkbox.value) === -1) {
          allChecksComplete = false;
        }
      }
    });

    return allChecksComplete;
  };
})();
