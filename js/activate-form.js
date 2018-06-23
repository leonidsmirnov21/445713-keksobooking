'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var fieldsets = adForm.querySelectorAll('fieldset');
  var inputRooms = adForm.querySelector('select#room_number');
  var inputGuests = adForm.querySelector('select#capacity');
  var inputType = adForm.querySelector('select#type');
  var inputTimeIn = adForm.querySelector('select#timein');
  var inputTimeOut = adForm.querySelector('select#timeout');

  var disableForm = function () {
    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].setAttribute('disabled', '');
    }
  };
  disableForm();

  window.utils.getMainPinCoords();

  // проверка полей комнат и гостей при изменении поля с гостями
  var onInputGuestsChange = function () {
    if (inputRooms.value === '100' && inputGuests.value !== '0') {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else if (inputRooms.value !== '100' && (inputRooms.value < inputGuests.value || inputGuests.value < 1)) {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else {
      inputGuests.setCustomValidity('');
    }
  };
  inputGuests.addEventListener('change', onInputGuestsChange);

  // проверка полей комнат и гостей при изменении поля с комнатами
  var onInputRoomsChange = function () {
    if (inputRooms.value === '100' && inputGuests.value !== '0') {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else if (inputRooms.value !== '100' && (inputRooms.value < inputGuests.value || inputGuests.value < 1)) {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else {
      inputGuests.setCustomValidity('');
    }
  };
  inputRooms.addEventListener('change', onInputRoomsChange);

  // установка минимальных цен в зависимости от типа дома
  var onInputTypeChange = function () {
    var inpputPrice = adForm.querySelector('input#price');

    if (inputType.value === 'flat') {
      inpputPrice.min = 1000;
      inpputPrice.placeholder = 1000;
    } else if (inputType.value === 'house') {
      inpputPrice.min = 5000;
      inpputPrice.placeholder = 5000;
    } else if (inputType.value === 'palace') {
      inpputPrice.min = 10000;
      inpputPrice.placeholder = 10000;
    }
  };
  inputType.addEventListener('change', onInputTypeChange);

  // синхронизация времени заезда и выезда
  var onInputTimeInChange = function () {
    inputTimeOut.value = inputTimeIn.value;
  };
  inputTimeIn.addEventListener('change', onInputTimeInChange);

  var onInputTimeOutChange = function () {
    inputTimeIn.value = inputTimeOut.value;
  };
  inputTimeOut.addEventListener('change', onInputTimeOutChange);

  window.acivateForm = function () {
    for (var j = 0; j < fieldsets.length; j++) {
      fieldsets[j].removeAttribute('disabled', '');
    }
  };
})();
