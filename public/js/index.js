$(document).ready(function() {
  $( "#contact-btn" ).click(function() {
      $( ".contact-div" ).slideToggle( "slow");
      contactToggle();
  });
});

$(document).ready(function() {
  $('form').on('submit', function(e){
    //show modal, prevent redirect
    e.preventDefault();
    $('.modal').css('display', 'block');
    // show loading icon
    showSendingMsg();
    // check if request is allowed
    if ($('#antispam-form').val() === ''){
      let formData = serializeJson($(this).serializeArray());
      $.ajax({
        url:'/send-email',
        type:'POST',
        data: formData,
        datatype: 'json',
        error: function(response) {
          errorHandler(response);
        },
        success: function(response) {
          successHandler();
        }
      });
    }
    
  });
});

function contactToggle() {
    if($('.contact-div').hasClass('hide')){
      $('#contact-btn').animate({bottom: '0px'}, 'slow');
      $('.contact-div').removeClass('hide').addClass('show');
      $('a').css('cursor', 'pointer');
      $('a').off('click').on('click', function(e){
        return true;
      });
    } else {
      $('#contact-btn').animate({bottom: '72vh'}, 'slow');
      $('.contact-div').removeClass('show').addClass('hide');
      $('.contact-div').css('display', 'block');
      $('a').css('cursor', 'default');
      $('a').click(function(e) {
        e.preventDefault();
        return false;
      });
    }  
}

function showSendingMsg() {
  $('#sending-icon').css('display', 'block');
  $('#sending-message').css('display', 'block');  
}

function hideSendingMsg() {
  $('#sending-icon').css('display', 'none');
  $('#sending-message').css('display', 'none');  
}

function successHandler() {
  hideSendingMsg();
  $('#success-icon').css('display', 'block');
  $('#success-message').css('display', 'block');
  window.setTimeout(() => {
    $('.modal').css('display', 'none');
    $('#success-icon').css('display', 'none');
    $('#success-message').css('display', 'none');
    $( ".contact-div" ).slideToggle( "slow");
    contactToggle();
    clearForm();
  }, 4000);  
}

function errorHandler(res) {
  hideSendingMsg();
  $('#error-icon').css('display', 'block');
  $('#error-message').css('display', 'block');
  $('#error-message').html(res.responseJSON.status);
  window.setTimeout(() => {
    $('.modal').css('display', 'none');
    $('#error-icon').css('display', 'none');
    $('#error-message').css('display', 'none');
  }, 4000);
}

function hideErrorMsg() {
  $('#error-icon').css('display', 'none');
  $('#error-message').css('display', 'none');    
}

function serializeJson(array) {
  let json = {};
  array.map(item => {
    json[item.name] = item.value;
  });
  return json;
}

function autofill(){
  $('#form-name').val('<script>console.log(attack)</script>Terry Chong');
  $('#form-number').val('123-456-7799');
  $('#form-email').val('tchong916@gmail.com');
  $('#form-subject').val('Test email');
  $('#form-message').val('What is the price of 1 box of macarons?');
}

function clearForm(){
  $('#form-name').val('');
  $('#form-number').val('');
  $('#form-email').val('');
  $('#form-subject').val('');
  $('#form-message').val('');  
}