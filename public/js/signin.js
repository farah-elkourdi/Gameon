(function ($) {
  $(document).ready(function () {
    $('#error').empty();
    $("div#errordiv").hide();
    $('#error').hide();

    $('#btnlogin').click(function (event) {
      event.preventDefault();
      let passwordInput = filterXSS($('#password').val());
      let emailInput = filterXSS($('#email').val());
      $('#error').empty();
      $("div#errordiv").hide();
      $('#error').hide();

      var requestConfig = {
        method: 'POST',
        url: '/user/Checksignin',
        contentType: 'application/json',
        data: JSON.stringify({
          password: passwordInput,
          email: emailInput
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
            window.open("/", '_self');
          }
        }
      });
    })
  });
})(window.jQuery);