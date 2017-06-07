$(document).ready(function() {
  $( "#contact-btn" ).click(function() {
      $( ".contact-div" ).slideToggle( "slow");
      if($('.contact-div').hasClass('hide')){
          $('#contact-btn').animate({bottom: '0px'}, 'slow');
          $('.contact-div').removeClass('hide').addClass('show');
      } else {
          $('#contact-btn').animate({bottom: '62vh'}, 'slow');
          $('.contact-div').removeClass('show').addClass('hide');
          $('.contact-div').css('display', 'block');
      }
  });
  //$('#contact-btn').click();
});

