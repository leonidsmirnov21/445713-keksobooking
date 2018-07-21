'use strict';

(function () {
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var URL_GET = URL_POST + '/data';

  var makeXhr = function (onLoad, onError, method, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;

        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open(method, url);
    return xhr;
  };

  window.backend = {
    download: function (onLoad, onError) {
      makeXhr(onLoad, onError, 'GET', URL_GET).send();
    },
    upload: function (data, onLoad, onError) {
      makeXhr(onLoad, onError, 'POST', URL_POST).send(data);
    }
  };
})();
