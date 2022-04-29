(function ($) {
$('#btnsend').click(function (event) {
        event.preventDefault();
        let titleInput = $('#title').val();
        let descriptionInput = $('#description').val();
        let emailInput = $('#email').val();
        $('#error').empty();
        $('#error').hide();
        var requestConfig = {
            method: 'POST',
            url: '/contactus/Checksignup',
            contentType: 'application/json',
            data: JSON.stringify({title:titleInput, description: descriptionInput, email:emailInput }),
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
                  $('#error').empty();
                  $('#error').show();
                  let myUl = document.getElementById("error")
                  $('#description').val("")
                  $('#title').val("")
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
})(jQuery);