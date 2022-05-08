(function ($) {
  /** don't know how to put these methods into a separate js file **/

  /* May need to edit max and min participants */
  const max_soccer = 20;
  const max_football = 20;
  const max_golf = 20;
  const max_baseball = 20;
  const max_basketball = 20;
  const max_badminton = 20;
  const max_swimming = 20;
  const max_archery = 20;
  const max_dodgeball = 20;
  const max_frisbee = 20;

  const min_soccer = 1;
  const min_football = 1;
  const min_golf = 1;
  const min_baseball = 1;
  const min_basketball = 1;
  const min_badminton = 1;
  const min_swimming = 1;
  const min_archery = 1;
  const min_dodgeball = 1;
  const min_frisbee = 1;

  function checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
      throw 'Error: id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
  }

  function checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  }

  function checkArray(arr, varName) {
    is_valid = true;
    if (!arr || !Array.isArray(arr)) {
      throw `Error: ${varName} is not an array`;
    }
    if (arr.length !== 0) {
      for (let elem of arr) {
        if (!elem || !elem instanceof ObjectId) {
          is_valid = false;
          break;
        }
      }
    }
    if (!is_valid) {
      throw `Error: one or more elements in ${varName} is not a valid ObjectId`;
    }
    return arr;
  }

  /* checks if date string is in valid format yyyy-mm-dd */
  function dateIsValid(dateStr, varName) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    const date = new Date(dateStr);
    const timestamp = date.getTime();

    if (dateStr.match(regex) === null) {
      throw `Error: ${varName} is not valid format`;
    }

    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      throw `Error: ${varName} is not valid`;
    }

    if (!date.toISOString().startsWith(dateStr)) {
      throw `Error: ${varName} does not match Date object`;
    }
    return dateStr;
  }

  function checkTime(timeStr, varName) {
    if (!timeStr) throw `Error: You must supply a ${varName}!`;
    if (typeof timeStr !== 'string') throw `Error: ${varName} must be a string!`;
    timeStr = timeStr.trim();
    if (timeStr.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    let isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(timeStr);
    if (!isValid) {
      throw `Error: ${varName} is not Valid`;
    }
    return timeStr;
  }

  function convertStringToDate(date, time) {
    let s = `${date}T${time}:00`;
    let result = new Date(s);
    return result;
  }

  function checkDate(date, varName) {
    if (!date) {
      throw `Error: you must supply a ${varName}`;
    } else if (!date instanceof Date) {
      throw `Error: ${varName} is not of type Date`;
    }
    return date;
  }

  function areValidTimes(startTime, endTime) {
    
    startTime.setHours(startTime.getHours() + 1);

    if (endTime < startTime) {
      return false;
    }
    return true;
  }

  function checkNum(num, varName) {
    if (!num) {
      throw `Error: you must supply a ${varName}`;
    }
    num = +num;
    if (typeof num !== 'number' || isNaN(num)) {
      throw `Error: ${varName} is not a number`;
    }

    return num;
  }

  function validMinParticipantLimit(sport, numParticipants) {
    if (sport === 'Soccer' && numParticipants < min_soccer) {
      return false;
    }
    if (sport === 'Football' && numParticipants < min_football) {
      return false;
    }
    if (sport === 'Golf' && numParticipants < min_golf) {
      return false;
    }
    if (sport === 'Baseball' && numParticipants < min_baseball) {
      return false;
    }
    if (sport === 'Basketball' && numParticipants < min_basketball) {
      return false;
    }
    if (sport === 'Badminton' && numParticipants < min_badminton) {
      return false;
    }
    if (sport === 'Swimming' && numParticipants < min_swimming) {
      return false;
    }
    if (sport === 'Archery' && numParticipants < min_archery) {
      return false;
    }
    if (sport === 'Dodgeball' && numParticipants < min_dodgeball) {
      return false;
    }
    if (sport === 'Frisbee' && numParticipants < min_frisbee) {
      return false;
    }

    return true;
  }

  function validMaxParticipantLimit(sport, numParticipants) {
    if (sport === 'Soccer' && numParticipants > max_soccer) {
      return false;
    }
    if (sport === 'Football' && numParticipants > max_football) {
      return false;
    }
    if (sport === 'Golf' && numParticipants > max_golf) {
      return false;
    }
    if (sport === 'Baseball' && numParticipants > max_baseball) {
      return false;
    }
    if (sport === 'Basketball' && numParticipants > max_basketball) {
      return false;
    }
    if (sport === 'Badminton' && numParticipants > max_badminton) {
      return false;
    }
    if (sport === 'Swimming' && numParticipants > max_swimming) {
      return false;
    }
    if (sport === 'Archery' && numParticipants > max_archery) {
      return false;
    }
    if (sport === 'Dodgeball' && numParticipants > max_dodgeball) {
      return false;
    }
    if (sport === 'Frisbee' && numParticipants > max_frisbee) {
      return false;
    }
    return true;
  }

  function validNumParticipants(min, max) {
    if (min > max) {
      return false;
    } else {
      return true;
    }
  }
  function isCoordinator(userId, coordinatorId){
      if(userId === coordinatorId){
          return true;
      } else {
          return false;
      }
  }
  
  var allEvents = $('#allEvents');

  $('div.errorDivLeave:visible').hide();
  $('div.errorDivCancel:visible').hide();
  $('div.errorDivEdit:visible').hide();

  //Update button
  $('.userEventsEditForm').bind('click',function (event) {
    event.preventDefault(); 
    let gameEventId = filterXSS($(this).find('input[class = "gameEventId"]').val());
      let coordinatorId = filterXSS($(this).find('input[class = "coordinatorId"]').val());
      let userId = filterXSS($('#userId').attr('class'));
      let status = filterXSS($(this).find('input[class = "status"]').val());
      allEvents.children().each(function(){
        $(`#${this.id} > div.errorDivLeave`).hide();
        $(`#${this.id} > div.errorDivEdit`).hide();
        $(`#${this.id} > div.errorDivCancel`).hide();
      });
      let errorDiv = $(`#${gameEventId} > div.errorDivCancel`);
      try {
        if(!isCoordinator(userId, coordinatorId)){
          throw "Error: User is NOT the event Coordinator"
        }
        if(status.toLowerCase() === 'canceled'.toLowerCase()){
          throw "Error: Cannot update canceled event";
        }
        if(status.toLowerCase() !== 'upcoming'.toLowerCase()){
          throw "Error: Events that are NOT 'upcoming' cannot be updated";
        }
  
        window.open(`/updateGameEvent/${gameEventId}`, '_self')
      }
      catch(e) {
        errorDiv.empty();
        errorDiv.html(e);
        errorDiv.show();
      }
      
  });


  //Cancel Button on-click Event
  $('.userEventsCancelForm').bind('click',function (event) {
      event.preventDefault(); 
      
      let gameEventId = filterXSS($(this).find('input[class = "gameEventId"]').val());
      let coordinatorId = filterXSS($(this).find('input[class = "coordinatorId"]').val());
      let userId = filterXSS($('#userId').attr('class'));
      // let userId =  $(this).find('input[class = "userId"]').val();
      let status = filterXSS($(this).find('input[class = "status"]').val());
      allEvents.children().each(function(){
        $(`#${this.id} > div.errorDivLeave`).hide();
        $(`#${this.id} > div.errorDivEdit`).hide();
        $(`#${this.id} > div.errorDivCancel`).hide();
      });
     
      var requestConfig = {
        method: 'GET',
        url: `/userEvents/cancel/${gameEventId}`
      }
      let errorDiv = $(`#${gameEventId} > div.errorDivCancel`);
      try{
        if(!isCoordinator(userId, coordinatorId)){
          throw "Error: User is NOT the event Coordinator"
        }
        if(status.toLowerCase() === 'canceled'.toLowerCase()){
          throw "Error: Event is already Canceled";
        }
        if(status.toLowerCase() !== 'upcoming'.toLowerCase()){
          throw "Error: Events that are NOT 'upcoming' cannot be Canceled";
        }
        $.ajax(requestConfig).then(function(responseMessage){
          //console.log(responseMessage);
          if(responseMessage){
              if(responseMessage.success){
                  errorDiv.empty();
                  errorDiv.hide();
              //    console.log("SUCCESS changing status to 'Canceled' for gameEvent");
                  window.open("/userEvents", '_self');
              } else if (!responseMessage.success){
                  errorDiv.empty();
                  errorDiv.html(responseMessage.errorCancel);
                  errorDiv.show();
                //  console.log("Failed changing status to 'Canceled' for gameEvent");
              }
          }
        });
      } catch (e){
        errorDiv.empty();
        errorDiv.html(e);
        errorDiv.show();
      //  console.log("Failed changing status to 'Canceled' for gameEvent");
      }
   
});
  //leave button on-click event
  $('.userEventsLeaveForm').bind('click',function (event) {
      event.preventDefault(); 
      let gameEventId = filterXSS($(this).find('input[class = "gameEventId"]').val());
      let coordinatorId = filterXSS($(this).find('input[class = "coordinatorId"]').val());
      let userId = filterXSS($('#userId').attr('class'));
      // let userId =  $(this).find('input[class = "userId"]').val();
      let status = filterXSS($(this).find('input[class = "status"]').val());
      allEvents.children().each(function(){
        $(`#${this.id} > div.errorDivLeave`).hide();
        $(`#${this.id} > div.errorDivEdit`).hide();
        $(`#${this.id} > div.errorDivCancel`).hide();
      })
      var requestConfig = {
          method: 'GET',
          url: `/userEvents/leave/${gameEventId}`
      }
      let errorDiv = $(`#${gameEventId} > div.errorDivLeave`);
      try{
        if(isCoordinator(userId, coordinatorId)){
          throw "User cannot leave his/her own event"
        }
        if(status.toLowerCase() !== 'upcoming'.toLowerCase()){
          throw "User cannot leave an Old or Canceled gameEvent";
        }
        
        $.ajax(requestConfig).then(function(responseMessage){
        //  console.log(responseMessage);
          if(responseMessage){
              if(responseMessage.success){
                  errorDiv.empty();
                  errorDiv.hide();
             //     console.log("SUCCESS removing user from gameEvents");
                  window.open("/userEvents", '_self');
              } else if (!responseMessage.success){
                  errorDiv.empty();
                  errorDiv.html(responseMessage.errorLeave);
                  errorDiv.show();
                //  console.log("Failed to leave gameEvent");
              }
          }
        });
      } catch (e){
        errorDiv.empty();
        errorDiv.html(e);
        errorDiv.show();
      //  console.log("Failed to leave gameEvent");
      }
  });
  // Executes when user hits the submit button while editing a gameEvent
  var editSubmitEventHandler = function (coordinatorId, gameEventId){
    let errorDiv = $(`#${gameEventId} > div.partialErrorDivEdit`);
    let now = new Date();
    now.setHours(now.getHours()+ 1);
    let startTimeMin = now.toLocaleTimeString([], { hour12:false, hour: '2-digit', minute: '2-digit' });
    var title = filterXSS($('#title').val()),
        sportCategory = filterXSS($('#sportCategory').val()),
        description = filterXSS($('#description').val()),
        // area = $('#area').val(),
        address = filterXSS($('#address').val()),
        // longitude = $('#longitude').val(),
        // latitude = $('#latitude').val(),
        date = filterXSS($('#date').val()),
        startTime = filterXSS($('#startTime').val()),
        endTime = filterXSS($('#endTime').val()),
        minParticipants = filterXSS($('#minParticipants').val()),
        maxParticipants = filterXSS($('#maxParticipants').val());
        $('#sportCategory').find('option:eq(0)').prop('selected', true);
    errorDiv.hide();
    try {
        title = checkString(title, 'title');
        sportCategory = checkString(sportCategory, 'sportCategory');
        description = checkString(description, 'description');
        //  area = checkString(area, 'area');
        address = checkString(address, 'address');
  
        /* NEED to check validity for address, longitude, and latitude */
  
        date = checkString(date, 'date');
        date = dateIsValid(date, 'date');
        startTime = checkTime(startTime, 'startTime');
        endTime = checkTime(endTime, 'endTime');
        if (startTime < startTimeMin){
          throw `Events can only be created for 1 hour after current time`;
        }
        if (endTime > "22:00")
          throw `Events should end before 10 pm`;
        let startTime_date = convertStringToDate(date, startTime);
        let endTime_date = convertStringToDate(date, endTime);
        startTime_date = checkDate(startTime, 'startTime');
        endTime_date = checkDate(endTime, 'endTime');
  
        minParticipants = checkNum(minParticipants, 'minParticipants');
        maxParticipants = checkNum(maxParticipants, 'maxParticipants');
        if (!areValidTimes(startTime_date, endTime_date)) {
          throw "Error: endTime must be at least an hour after startTime";
        }
        if (!validMinParticipantLimit(sportCategory, minParticipants)) {
          throw `Error: invalid minParticipants for ${sportCategory}`;
        }
        if (!validMaxParticipantLimit(sportCategory, maxParticipants)) {
          throw `Error: invalid maxParticipants for ${sportCategory}`;
        }
        if (!validNumParticipants(minParticipants, maxParticipants)) {
          throw "Error: minParticipants is greater than maxParticipants";
        }
        
        var requestConfig = {
            method: 'POST',
            url: `/userEvents/edit/${gameEventId}`, 
            contentType: 'application/json',
            data: JSON.stringify({
                coordinatorId: coordinatorId,
                title: title,
                sportCategory: sportCategory,
                description: description,
                //  area: area,
                address: address,
                // longitude: longitude,
                // latitude: latitude,
                date: date,
                startTime: startTime,
                endTime: endTime,
                minParticipants: minParticipants,
                maxParticipants: maxParticipants
            })  
        }
  
        $.ajax(requestConfig).then(function(response) {
            if(response){
              if(response.success){
                errorDiv.empty();
                errorDiv.hide();
               // console.log("SUCCESS editing gameEvent in Database");
                window.open("/userEvents", '_self');
              } else if(!response.success){
                errorDiv.empty();
                errorDiv.show()
             //   console.log("Failed editing gameEvent in Database");
                errorDiv.html(response.errorEdit);
              }
            }
        });
      } catch (e) {
        errorDiv.empty();
        errorDiv.html(e);
        errorDiv.show();
        $('#title').val(title);
        $('#sportCategory').val(sportCategory);
        $('#description').html(description);
        // $('#area').val(area);
        $('#address').val(address);
        // $('#longitude').val(longitude);
        // $('#latitude').val(latitude);
        $('#date').val(date);
        $('#startTime').val(startTime);
        $('#endTime').val(endTime);
        $('#minParticipants').val(minParticipants);
        $('#maxParticipants').val(maxParticipants);
        $('#sportCategory').find('option:eq(0)').prop('selected', true);
   //     console.log("Failed editing gameEvent in Database");
    //    console.log(e);
      }
  }
  // executes when user hits the cancel button while editing
  var editCancelEventHandler = function (recoverHTML, gameEventId){
    $(`#${gameEventId}`).replaceWith(recoverHTML);
  }
  //different results depending on pressing the "submit" or "cancel" button
  function bindEventsToEditButton (editForm, recoverHTML, coordinatorId, gameEventId){
      editForm.find('.submitEditButton').on('click', function(event){
        event.preventDefault();
        editSubmitEventHandler(coordinatorId, gameEventId);
      });
     
      editForm.find('.cancelEditButton').on('click',  function(event){
        event.preventDefault();
        editCancelEventHandler(recoverHTML, gameEventId);
      });
  };
  
  /*
  //Edit button on-click events
  $('.userEventsEditForm').on('click', function(event) {
      event.preventDefault(); 
      let gameEventId = $(this).find('input[class = "gameEventId"]').val();
      let coordinatorId = $(this).find('input[class = "coordinatorId"]').val();
      let userId = $('#userId').attr('class');
   
      // let userId =  $(this).find('input[class = "userId"]').val();
      let status = $(this).find('input[class = "status"]').val();
   //   console.log(gameEventId);
      allEvents.children().each(function(){
        
        $(`#${this.id} > div.errorDivLeave`).hide();
        $(`#${this.id} > div.errorDivEdit`).hide();
        $(`#${this.id} > div.errorDivCancel`).hide();
      })
      
      let errorDiv = $(`#${gameEventId} > div.errorDivEdit`);
      let prevHtml =  $('<div>').append($(`#${gameEventId}`).clone()).html();
      
      try {
          if(!isCoordinator(userId, coordinatorId)){
              throw "Error: user is NOT the event coordinator!"
          }
          if(status !== 'upcoming'){
            throw "User cannot edit an Old or Canceled gameEvent";
          }
          var requestConfig = {
              method: 'get',
              url: '/updateGameEvent', 
              contentType: 'application/json',
              data: JSON.stringify({
                  gameEventId: gameEventId,
                  coordinatorId: coordinatorId
              })
          }
          $.ajax(requestConfig).then(function (responseMessage) {
              var editForm = $(responseMessage);
              bindEventsToEditButton(editForm, prevHtml, coordinatorId, gameEventId);
              $(`#${gameEventId}`).replaceWith(editForm);
          });
      } catch (e) {
          errorDiv.empty();
          errorDiv.html(e);
          errorDiv.show();
      }
      
     
  });
  */
})(window.jQuery);