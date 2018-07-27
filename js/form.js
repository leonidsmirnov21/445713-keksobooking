'use strict';

(function () {
  var MAIN_PIN_START_X = 570;
  var MAIN_PIN_START_Y = 375;
  var FREE_PRICE = 0;
  var SMALL_PRICE = 1000;
  var MIDDLE_PRICE = 5000;
  var BIG_PRICE = 10000;
  var DELAY_TIME = 3000;
  var adForm = document.querySelector('.ad-form');
  var fieldsets = adForm.querySelectorAll('fieldset');
  var inputRooms = adForm.querySelector('select#room_number');
  var inputGuests = adForm.querySelector('select#capacity');
  var inputType = adForm.querySelector('select#type');
  var inputTimeIn = adForm.querySelector('select#timein');
  var inputTimeOut = adForm.querySelector('select#timeout');
  var adFormReset = document.querySelector('.ad-form__reset');

  var disableForm = function () {
    Array.from(fieldsets).forEach(function (it) {
      it.disabled = true;
    });
  };
  disableForm();

  window.utils.getMainPinCoordinates();

  var onInputGuestsChange = function () {
    if (inputRooms.value === '100' && inputGuests.value !== '0') {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else if (inputRooms.value !== '100' && (inputRooms.value < inputGuests.value || inputGuests.value < 1)) {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else {
      inputGuests.setCustomValidity('');
    }
  };

  var onInputRoomsChange = function () {
    if (inputRooms.value === '100' && inputGuests.value !== '0') {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else if (inputRooms.value !== '100' && (inputRooms.value < inputGuests.value || inputGuests.value < 1)) {
      inputGuests.setCustomValidity('Кол-во гостей не может быть больше кол-ва комнат. Только "100 комнат" для "не для гостей"');
    } else {
      inputGuests.setCustomValidity('');
    }
  };

  var onInputTypeChange = function () {
    var inpputPrice = adForm.querySelector('input#price');

    if (inputType.value === 'flat') {
      inpputPrice.min = SMALL_PRICE;
      inpputPrice.placeholder = SMALL_PRICE;
    } else if (inputType.value === 'house') {
      inpputPrice.min = MIDDLE_PRICE;
      inpputPrice.placeholder = MIDDLE_PRICE;
    } else if (inputType.value === 'palace') {
      inpputPrice.min = BIG_PRICE;
      inpputPrice.placeholder = BIG_PRICE;
    } else if (inputType.value === 'bungalo') {
      inpputPrice.min = FREE_PRICE;
      inpputPrice.placeholder = FREE_PRICE;
    }
  };

  var onInputTimeInChange = function () {
    inputTimeOut.value = inputTimeIn.value;
  };

  var onInputTimeOutChange = function () {
    inputTimeIn.value = inputTimeOut.value;
  };

  var removeListeners = function () {
    inputGuests.removeEventListener('change', onInputGuestsChange);
    inputRooms.removeEventListener('change', onInputRoomsChange);
    inputType.removeEventListener('change', onInputTypeChange);
    inputTimeIn.removeEventListener('change', onInputTimeInChange);
    inputTimeOut.removeEventListener('change', onInputTimeOutChange);
    adForm.removeEventListener('submit', onAdFormSubmit);
    adFormReset.removeEventListener('click', onAdFormResetClick);
  };

  var deactivatePage = function (cb) {
    var mapPinMain = window.utils.map.querySelector('.map__pin--main');
    var mapFilters = document.querySelector('.map__filters');
    var mainImageForm = document.querySelector('.ad-form-header__preview-img');
    var photosContainer = document.querySelector('.ad-form__photo');

    adForm.reset();
    adForm.classList.add('ad-form--disabled');
    disableForm();
    window.utils.map.classList.add('map--faded');
    window.card.remove();
    window.pin.remove();
    document.querySelector('.map__filters').reset();
    Array.from(mapFilters.elements).forEach(function (it) {
      it.disabled = true;
    });
    mapPinMain.style.left = MAIN_PIN_START_X + 'px';
    mapPinMain.style.top = MAIN_PIN_START_Y + 'px';
    window.utils.getMainPinCoordinates();
    mainImageForm.src = 'img/muffin-grey.svg';
    Array.from(photosContainer.children).forEach(function (it) {
      it.remove();
    });
    mapFilters.removeEventListener('change', window.pin.onMapFiltersChange);
    removeListeners();
    cb();
  };

  var onInitForm = function () {
    deactivatePage(onInputTypeChange);

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
      successBlock.removeEventListener('click', closePopup);
    };

    openPopup();

    if (!(successBlock.classList.contains('hidden'))) {
      successBlock.addEventListener('click', closePopup);
    }
  };

  var onInitFormError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(window.utils.deleteDiv, DELAY_TIME);
  };

  var onAdFormSubmit = function (evt) {
    window.backend.upload(new FormData(adForm), onInitForm, onInitFormError);
    evt.preventDefault();
  };

  var onAdFormResetClick = function (evt) {
    evt.preventDefault();
    deactivatePage(onInputTypeChange);
  };

  var addListenersForm = function () {
    inputGuests.addEventListener('change', onInputGuestsChange);
    inputRooms.addEventListener('change', onInputRoomsChange);
    inputType.addEventListener('change', onInputTypeChange);
    inputTimeIn.addEventListener('change', onInputTimeInChange);
    inputTimeOut.addEventListener('change', onInputTimeOutChange);
    adForm.addEventListener('submit', onAdFormSubmit);
    adFormReset.addEventListener('click', onAdFormResetClick);
  };

  window.form = {
    acivate: function () {
      Array.from(fieldsets).forEach(function (it) {
        it.disabled = false;
      });
      addListenersForm();
    }
  };
})();
