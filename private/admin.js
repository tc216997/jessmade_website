let form = document.getElementById('photo-upload'),
    imgName = document.getElementById('form-image-name'),
    imgLink = document.getElementById('form-image-link'),
    ajaxModal = document.getElementById('myModal'),
    uploadingIconP = document.getElementById('sending-icon'),
    uploadingMsgP = document.getElementById('sending-message'),
    successIconP = document.getElementById('success-icon'),
    successMsgP = document.getElementById('success-message'),
    errorIconP = document.getElementById('error-icon'),
    errorMsgP = document.getElementById('error-message');

form.addEventListener('submit', function(e){
  e.preventDefault();
  let http = new XMLHttpRequest(),
      url = '/private/upload',
      params = '';
  // turn form value into strings
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].type === 'text') {
      let query = `&${encodeURIComponent(form.elements[i].name)}=${encodeURIComponent(form.elements[i].value)}`
      params += query;
    }
  }

  //prep the ajax request
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  showLoading(ajaxModal, uploadingIconP, uploadingMsgP);
  // on readyState 4 which is when the ajax is finished
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      // response code of 200
      if (http.status === 200) {
        showSuccess(ajaxModal, successIconP, successMsgP);
        clearForm();
      } else {
        let responseObject = JSON.parse(http.response)
        showError(ajaxModal, errorIconP, errorMsgP, responseObject.status);
      }
    }
  }
  // fire the ajax request
  http.send(params);
});

document.getElementById('preview-button').addEventListener('click', e => {
  // first check source value
  let imageSource = document.getElementById('form-image-link').value;
  if (imageSource) {
    document.getElementById('image-modal').style.display = 'block';
    document.getElementById('image-preview').src = imageSource;
  }
});

document.getElementById('image-close').addEventListener('click', e => {
  document.getElementById('image-modal').style.display = 'none';
});


function autoFill() {
  document.getElementById('form-image-name').value = 'Wedding Cake';
  document.getElementById('form-image-link').value = 'https://imgbb.co/wedding_cake.jpg';  
  document.getElementById('form-image-description').value = 'Wedding cake consist of butter cream and fruits';
}

function clearForm(){
  document.getElementById('form-image-name').value = '';
  document.getElementById('form-image-link').value = '';
  document.getElementById('form-image-description').value = '';
}

// show loading modal
function showLoading(modal, icon, message) {
  modal.style.display = 'block';
  icon.style.display = 'block';
  message.style.display = 'block';  
}

// hide the loading icon and message
function hideLoading() {
  document.getElementById('sending-icon').style.display = 'none';
  document.getElementById('sending-message').style.display = 'none';  
}

// show the success message
function showSuccess(modal, successIcon, successMessage) {
  hideLoading();
  successIcon.style.display='block';
  successMessage.style.display='block';
  window.setTimeout(function() {
    modal.style.display='none';
    successIcon.style.display='none';
    successMessage.style.display='none';
    //clearForm();
  }, 3000);
}

// show the error message
function showError(modal, errorIcon, errorMessage, responseMessage) {
  hideLoading();
  errorIcon.style.display='block';
  errorMessage.style.display='block';
  errorMessage.innerHTML = responseMessage;
  window.setTimeout(function() {
    modal.style.display='none';
    errorIcon.style.display='none';
    errorMessage.style.display='none';
  }, 3000);
}

