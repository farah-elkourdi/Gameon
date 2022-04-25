(function ($) {
$('#btnlogin').click(function (event) {
        event.preventDefault();
        let passwordInput = $('#password').val();
        let emailInput = $('#email').val();
        $('#error').empty();
        $('#error').hide();
        var requestConfig = {
            method: 'POST',
            url: '/user/Checksignin',
            contentType: 'application/json',
            data: JSON.stringify({password:passwordInput, email: emailInput  }),
            cache: false
          }
          $.ajax(requestConfig).then(function (responseMessage) {
            if (responseMessage) {
                //alert(responseMessage.message.length)
                if(responseMessage.message.length != 0)
                {
                  $('#error').empty();
                    $('#error').show();
                    let myUl = document.getElementById("error")
                    $.each(responseMessage.message, function (index, element) {
                         let li = document.createElement('li');
                        li.innerHTML = `<li>${element}</li>`;
                        myUl.appendChild(li);
                      });
                }
                else
                {
              window.open("/", '_self');
                }
            }
        });
    });
})(jQuery);