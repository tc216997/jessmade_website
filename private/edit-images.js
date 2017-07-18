let form = document.getElementById('editImage'),
    deleteYes = document.getElementById('deleteYes'),
    deleteNo = document.getElementById('deleteNo');
getData();
closeModalHandler();

// closure messing around
// step 1 invoke main function;
// step 2 
var main = (function() {
  let count = 0;
  document.getElementById('left').addEventListener('click', function(){
    count++;
    console.log(count)
  })
  document.getElementById('right').addEventListener('click', function(){
    count--;
    console.log(count)
  })
}());
//

form.addEventListener('submit', e => {
  e.preventDefault();
  let url = '/private/edit?';
  let method = '_method=PUT';
  let id = document.getElementById('imageID').innerText;
  let params = '';
  params += `&imageid=${encodeURIComponent(id)}`;
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].type === 'text' || form.elements[i].type === 'textarea') {
      let query = `&${encodeURIComponent(form.elements[i].name)}=${encodeURIComponent(form.elements[i].value)}`;
      params += query;
    }
  }
  ajax(url, params, method);
});

deleteNo.addEventListener('click', e => {
  document.getElementById('ajaxModal').style.display = 'none';
  document.getElementById('deleteConfirmation').style.display = 'none';
})

deleteYes.addEventListener('click', e => {
  let url = '/private/edit?_method=DELETE';
  let id = e.currentTarget.dataset.id;
  let param = `imageid=${id}`;
  let http = new XMLHttpRequest();
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  document.getElementById('deleteConfirmation').style.display = 'none';
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      if (http.status === 200) {
        document.getElementById('deleteSuccess').style.display = 'block';
        window.setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        document.getElementById('deleteError').style.display = 'block';
        window.setTimeout(() => {
          location.reload();
        }, 2000);
      }
    }
  }
  http.send(param);
});
//functions and handler

function ajax(url, body, method) {
  let http = new XMLHttpRequest();
  http.open('POST', url+method, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  showPending();
  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      if (http.status === 200) {
        showSuccess();
      } else {
        showError();
      }
    }
  }
  http.send(body);
}

function showPending() {
  let modal = document.getElementById('ajaxModal'),
      pending= document.getElementById('pending');
  modal.style.display = 'block';
  pending.style.display = 'block';
}

function showSuccess(){
  let ajaxModal = document.getElementById('ajaxModal'),
      pending = document.getElementById('pending'),
      success = document.getElementById('success');
  pending.style.display = 'none';
  success.style.display = 'block';
  window.setTimeout(() => {
    location.reload();
  }, 2000);
}

function showError(){
  let modal = document.getElementById('ajaxModal'),
      pending = document.getElementById('pending'),
      error = document.getElementById('error');
  pending.style.display = 'none';
  error.style.display = 'block';
  window.setTimeout(() => {
    modal.style.display = 'none';
    error.style.display = 'none';
  }, 3000);
}

function getData() {
  let http = new XMLHttpRequest();
  //prep the ajax request
  http.open('GET', '/private/images-data', true);
  http.responseType = 'json';
  // on readyState 4 which is when the ajax is finished
  http.onreadystatechange = function() {
    // after firing the function
    if (http.readyState === 4) {
      // if response code of 200
      if (http.status === 200) {
        let images = http.response.images;
        dataHandler(images);
      } else {
        console.log('error retrieving data')
      }
    }
  }
  // fire the ajax request
  http.send();
}

function dataHandler(arr) {
  arr.map(x => {
    createTableRow(x);
  });
}

function createTableRow(item) {
  let tr = document.createElement('tr');
  tr.id = 'tr' + item.id;
  for (key in item) {
    let td = document.createElement('td');
    td.id = key;
    td.innerHTML = item[key];
    tr.appendChild(td);
  }
  let editBtn = document.createElement('button'),
      deleteBtn = document.createElement('button'),
      btd = document.createElement('td');
  editBtn.id = 'edit' + item.id;
  editBtn.className = 'editBtn';
  editBtn.innerHTML = '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';
  editBtn.dataset.id = item.id;
  editBtn.dataset.name = item.imageName;
  editBtn.dataset.src = item.imageSource;
  editBtn.dataset.description = item.imageDescription;
  deleteBtn.id = 'delete' + item.id;
  deleteBtn.className = 'deleteBtn';
  deleteBtn.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
  deleteBtn.dataset.id = item.id;
  deleteBtn.dataset.name = item.imageName;
  addBtnHandler(editBtn);
  deleteConfirmation(deleteBtn);
  btd.appendChild(editBtn);
  btd.appendChild(deleteBtn);
  tr.appendChild(btd);
  document.getElementById('table-body').appendChild(tr);
}

function deleteConfirmation(btn) {
  let modal = document.getElementById('ajaxModal'),
      deleteMsg = document.getElementById('deleteConfirmation'),
      deleteYes = document.getElementById('deleteYes');
  
  btn.addEventListener('click', (e) => {
    modal.style.display = 'block';
    deleteMsg.style.display = 'block';
    document.getElementById('delete-message').innerHTML = `Are you sure you want to delete ${e.currentTarget.dataset.name}?`;
    document.getElementById('deleteYes').dataset.id = e.currentTarget.dataset.id;
  });
}

function addBtnHandler(btn) {
  let modal = document.getElementById('formModal'),
      modalHeader = document.getElementById('modal-header'),
      inputName = document.getElementById('input-name'),
      image = document.getElementById('image-preview'),
      inputSrc = document.getElementById('input-src'),
      inputDescription = document.getElementById('input-description'),
      imageID = document.getElementById('imageID');
  btn.addEventListener('click', (e) => {
    modal.style.display = 'block';
    modalHeader.innerHTML = e.currentTarget.dataset.name;
    imageID.innerHTML = e.currentTarget.dataset.id;
    inputName.value = e.currentTarget.dataset.name;
    image.src = e.currentTarget.dataset.src;
    inputSrc.value = e.currentTarget.dataset.src;
    inputDescription.value = e.currentTarget.dataset.description;
  });
}

function closeModalHandler() {
  let close = document.getElementById('modal-close'),
      modal = document.getElementById('formModal');
  close.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}