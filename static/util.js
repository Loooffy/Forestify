function removeTree(code) {
    $(`img[code="${code}"]:lt(3)`).remove()
}

function delay() {   
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('');
    }, 160);
  });
}

function ran(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function post(url, data) {
    return $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(data),
    })
}

