(function ($) {
  $('#firstName').text("");
  $('#lastName').text("");
  $('#password').text("");
  $('#email').text("");
  $('#street').text("");

  $('#signupSubmit').click(function (event) {
    event.preventDefault();
    let firstNameInput = $('#firstName').val();
    let lastNameInput = $('#lastName').val();
    let passwordInput = $('#password').val();
    let emailInput = $('#email').val();
    let streetInput = $('#street').val();
    let areaInput = $('#area').val();
    let latInput = $('#labelStreet').attr('lat');
    let lonInput = $('#labelStreet').attr('lon');
    $('#error').empty();
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
})(jQuery);