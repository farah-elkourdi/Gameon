(function ($) {
  $(document).ready(function () {
    $('#firstName').text("");
    $('#lastName').text("");
    $('#password').text("");
    $('#email').text("");
    $('#street').text("");
    $('#error').empty();
    $("div#errordiv").hide();
    $('#error').hide();

    $('#signupSubmit').click(function (event) {
      event.preventDefault();
      let firstNameInput = filterXSS($('#firstName').val());
      let lastNameInput = filterXSS($('#lastName').val());
      let passwordInput = filterXSS($('#password').val());
      let emailInput = filterXSS($('#email').val());
      let streetInput = filterXSS($('#street').val());
      let areaInput = filterXSS($('#area').val());
      let latInput = filterXSS($('#labelStreet').attr('lat'));
      let lonInput = filterXSS($('#labelStreet').attr('lon'));
      $('#error').empty();
      $("div#errordiv").hide();
      $('#error').hide();
      var requestConfig = {
        method: 'POST',
        url: '/user/Checksignup',
        contentType: 'application/json',
        data: JSON.stringify({
          lon: lonInput,
          lat: latInput,
          firstName: firstNameInput,
          lastName: lastNameInput,
          password: passwordInput,
          email: emailInput,
          street: streetInput,
          area: areaInput
        }),
        cache: false
      }
      $.ajax(requestConfig).then(function (responseMessage) {
        if (responseMessage) {
          //alert(responseMessage.message.length)
          if (responseMessage.message.length != 0) {
            $('#error').empty();
            $("div#errordiv").show();
            $('#error').show();
            let myUl = document.getElementById("error")
            $.each(responseMessage.message, function (index, element) {
              let li = document.createElement('li');
              li.innerHTML = `<li>${element}</li>`;
              myUl.appendChild(li);
            });
          } else {
            window.open("/user/login", '_self');
          }
        }
      });
    });
  });
})(jQuery);