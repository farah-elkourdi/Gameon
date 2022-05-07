(function ($) {
  $(document).ready(function () {
    $('#description').val("");
    $('#error').empty();
    $("div#errordiv").hide();
    $('#error').hide();
    $('#btnsend').click(function (event) {
      event.preventDefault();
      let titleInput = filterXSS($('#msgtitle').val());
      let descriptionInput = filterXSS($('#description').val());
      let emailInput = filterXSS($('#email').val());
      $('#error').empty();
      $("div#errordiv").hide();
      $('#error').hide();
      var requestConfig = {
        method: 'POST',
        url: '/contactus/Checksignup',
        contentType: 'application/json',
        data: JSON.stringify({
          msgtitle: titleInput,
          description: descriptionInput,
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
            $('#error').empty();
            $('#error').show();
            let myUl = document.getElementById("error")
            $('#description').val("")
            $('#msgtitle').val("")
            $('#email').val("")
            let li = document.createElement('li');
            li.innerHTML = `<li> your response was sent.</li>`;
            myUl.appendChild(li);

            //window.open("/", '_self');
            //alert("Your response was submitted")
          }
        }
      });
    });
  });
})(jQuery);