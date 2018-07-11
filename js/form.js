'use strict';

(function () {
  var MAIN_PIN_START_X = 570;
  var MAIN_PIN_START_Y = 375;
  var adForm = document.querySelector('.ad-form');
  var fieldsets = adForm.querySelectorAll('fieldset');
  var inputRooms = adForm.querySelector('select#room_number');
  var inputGuests = adForm.querySelector('select#capacity');
  var inputType = adForm.querySelector('select#type');
  var inputTimeIn = adForm.querySelector('select#timein');
  var inputTimeOut = adForm.querySelector('select#timeout');

  var disableForm = function () {
    Array.from(fieldsets).forEach(function (it) {
      it.setAttribute('disabled', '');
    });
  };
  disableForm();

  window.acivateForm = function () {
    Array.from(fieldsets).forEach(function (it) {
      it.removeAttribute('disabled', '');
    });
  };

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
    } else if (inputType.value === 'bungalo') {
      inpputPrice.min = 0;
      inpputPrice.placeholder = 0;
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

  // деактивация страницы
  var deactivatePage = function () {
    var mapPinMain = window.utils.map.querySelector('.map__pin--main');
    var mapFilters = document.querySelector('.map__filters');

    adForm.reset();
    adForm.classList.add('ad-form--disabled');
    disableForm();
    window.utils.map.classList.add('map--faded');
    window.removeCard();
    window.removePins();
    document.querySelector('.map__filters').reset();
    Array.from(mapFilters.elements).forEach(function (it) {
      it.setAttribute('disabled', '');
    });
    mapPinMain.style.left = MAIN_PIN_START_X + 'px';
    mapPinMain.style.top = MAIN_PIN_START_Y + 'px';
    window.utils.getMainPinCoords();
  };

  var initForm = function () {
    deactivatePage();

    var successBlock = document.querySelector('.success');

    var onPopupEscPress = function (evt) {
      window.utils.isEscEvent(evt, closePopup);
    };

    var openPopup = function () {
      successBlock.classList.remove('hidden');
      document.addEventListener('keydown', onPopupEscPress);
    };

    var closePopup = function () {
      successBlock.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    };

    openPopup();

    if (!(successBlock.classList.contains('hidden'))) {
      successBlock.addEventListener('click', closePopup);
    }
  };

  var initFormError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    var deleteDiv = function () {
      document.querySelector('.error-message').remove();
    };
    setTimeout(deleteDiv, 3000);
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(adForm), initForm, initFormError);
    evt.preventDefault();
  });

  var adFormReset = document.querySelector('.ad-form__reset');

  adFormReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivatePage();
  });
})();
