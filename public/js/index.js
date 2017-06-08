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
          $('#contact-btn').animate({bottom: '70vh'}, 'slow');
          $('.contact-div').removeClass('show').addClass('hide');
          $('.contact-div').css('display', 'block');
          $('a').css('cursor', 'default');
          $('a').click(function(e) {
            e.preventDefault();
            return false;
          });
      }
  });
  //$('#contact-btn').click();
});

