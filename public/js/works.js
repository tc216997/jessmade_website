getJson();

function getJson() {
  let http = new XMLHttpRequest();

  //prep the ajax request
  http.open('GET', '/works-images', true);
  http.responseType = 'json';

  // on readyState 4 which is when the ajax is finished
  http.onreadystatechange = function() {
    // after firing the function
    if (http.readyState === 4) {
      // if response code of 200
      if (http.status === 200) {
        console.log(http.response)
      } else {
        console.log('error retrieving data')
      }
    }
  }
  // fire the ajax request
  http.send();
}

