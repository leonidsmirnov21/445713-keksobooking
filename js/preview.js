'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileChooserMain = document.querySelector('.ad-form-header__input');
  var previewImage = document.querySelector('.ad-form-header__preview-img');
  var fileChooserApartments = document.querySelector('.ad-form__input');
  var photosContainer = document.querySelector('.ad-form__photo');

  fileChooserMain.addEventListener('change', function () {
    var file = fileChooserMain.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewImage.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  var onFileChooserApartmentsChange = function () {
    var filesApartments = fileChooserApartments.files;

    Array.from(filesApartments).forEach(function (item) {
      var fileName = item.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var imgPhoto = document.createElement('img');
          imgPhoto.src = reader.result;
          imgPhoto.style.width = '50%';
          imgPhoto.style.height = 'auto';
          photosContainer.appendChild(imgPhoto);
        });

        reader.readAsDataURL(item);
      }
    });
  };

  fileChooserApartments.addEventListener('change', onFileChooserApartmentsChange);
})();
