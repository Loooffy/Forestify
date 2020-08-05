function delay(timeToDelay) {   
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('');
    }, timeToDelay);
  });
}

function ran(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getToken() {
    let regex = /token=(.*?);|token=(.*?)$/
    let token = document.cookie.match(regex)
    token = token ? token.slice(1,3).filter(t => t != undefined)[0] : null
    return token
}

function ajaxReq(url, data, method, token) {
    let req = {
        url: url,
        type: method,
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(data),
        headers: {
            "Authorization": "Bearer " + token
        },
    }

    if (method === 'GET') {
        delete req.contentType
        delete req.processData
    }

    if (!data) {
        delete req.data
    }

    let result = $.ajax(req)

    return result
}

