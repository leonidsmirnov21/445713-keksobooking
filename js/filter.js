'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var selectHousingType = document.querySelector('select#housing-type');
  var selectHousingPrice = document.querySelector('select#housing-price');
  var selectHousingRooms = document.querySelector('select#housing-rooms');
  var selectHousingGuests = document.querySelector('select#housing-guests');
  var inputWifi = mapFilters.querySelector('input#filter-wifi');
  var inputDishwasher = mapFilters.querySelector('input#filter-dishwasher');
  var inputParking = mapFilters.querySelector('input#filter-parking');
  var inputWasher = mapFilters.querySelector('input#filter-washer');
  var inputElevator = mapFilters.querySelector('input#filter-elevator');
  var inputConditioner = mapFilters.querySelector('input#filter-conditioner');

  Array.from(mapFilters.elements).forEach(function (it) {
    it.setAttribute('disabled', '');
  });

  window.filterPins = function (it) {
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

  selectHousingType.addEventListener('change', window.updatePins);
  selectHousingPrice.addEventListener('change', window.updatePins);
  selectHousingRooms.addEventListener('change', window.updatePins);
  selectHousingGuests.addEventListener('change', window.updatePins);
  inputWifi.addEventListener('change', window.debounce(window.updatePins));
  inputDishwasher.addEventListener('change', window.debounce(window.updatePins));
  inputParking.addEventListener('change', window.debounce(window.updatePins));
  inputWasher.addEventListener('change', window.debounce(window.updatePins));
  inputElevator.addEventListener('change', window.debounce(window.updatePins));
  inputConditioner.addEventListener('change', window.debounce(window.updatePins));
})();
