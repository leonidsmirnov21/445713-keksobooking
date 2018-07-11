'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileChooserMain = document.querySelector('.ad-form-header__input');
  var previewImg = document.querySelector('.ad-form-header__preview-img');

  fileChooserMain.addEventListener('change', function () {
    var file = fileChooserMain.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewImg.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
