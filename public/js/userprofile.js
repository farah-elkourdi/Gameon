(function ($) {
 // $('#osm-map').hide();
  $('#firstName').text("");
  $('#lastName').text("");
 // $('#password').text("");
  //$('#email').text("");
  // $('#street').text("");
  // var selectedvalue = $('#area').attr("selectvalue");
  // document.getElementById('area').value = selectedvalue;


        $('#saveSubmit').click(function (event) {
        event.preventDefault();
        let firstNameInput = filterXSS($('#firstName').val());
        let lastNameInput = filterXSS($('#lastName').val());
       // let passwordInput = $('#password').val();
        //let emailInput = $('#email').val();
      //  let streetInput = $('#street').val();
      //  let areaInput = $('#area').val();
      //  let latInput = $('#labelStreet').attr('lat');
     //   let lonInput = $('#labelStreet').attr('lon');
        $('#error').empty();
        $('#error').hide();
        var requestConfig = {
            method: 'POST',
            url: '/user/Checkprofile',
            contentType: 'application/json',
         //   data: JSON.stringify({ lon:lonInput , lat: latInput , firstName: firstNameInput, lastName: lastNameInput, street:streetInput ,  area:areaInput  }),
         data: JSON.stringify({ firstName: firstNameInput, lastName: lastNameInput }),
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
              //    $('#osm-map').show();
                  alert("your profile is updated")
              window.open("/user/profile", '_self');
              
                }
            }
        });
    });

    
})(jQuery);