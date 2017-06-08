$(document).ready(function() {
  $( "#contact-btn" ).click(function() {
      $( ".contact-div" ).slideToggle( "slow");
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
  });
  $('#contact-btn').click();
});

$(document).ready(function() {
  $('#submit-button').click(function(e){
    //show modal, prevent redirect
    e.preventDefault();
    $('.modal').css('display', 'block');
    // prep ajax object and send to server
    console.log('prep ajax object to send to server');
  });
});

