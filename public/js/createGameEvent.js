(function ($) {
  /** don't know how to put these methods into a separate js file **/

  /* May need to edit max and min participants */
  const max_soccer = 30;
  const max_football = 30;
  const max_golf = 30;
  const max_baseball = 30;
  const max_basketball = 30;
  const max_badminton = 30;
  const max_swimming = 30;
  const max_archery = 30;
  const max_dodgeball = 30;
  const max_frisbee = 30;

  const min_soccer = 2;
  const min_football = 2;
  const min_golf = 2;
  const min_baseball = 2;
  const min_basketball = 2;
  const min_badminton = 2;
  const min_swimming = 2;
  const min_archery = 2;
  const min_dodgeball = 2;
  const min_frisbee = 2;

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
    //  startTime.setHours(startTime.getHours() + 1);
    let temp = new Date(startTime);
    temp.setHours(startTime.getHours() + 1);
    //  if ( endTime < startTime) {
    if (endTime < temp) {
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
    if (sport.toLowerCase() === 'Soccer'.toLowerCase() && numParticipants > max_soccer) {
      return false;
    }
    if (sport.toLowerCase() === 'Football'.toLowerCase() && numParticipants > max_football) {
      return false;
    }
    if (sport.toLowerCase() === 'Golf'.toLowerCase() && numParticipants > max_golf) {
      return false;
    }
    if (sport.toLowerCase() === 'Baseball'.toLowerCase() && numParticipants > max_baseball) {
      return false;
    }
    if (sport.toLowerCase() === 'Basketball'.toLowerCase() && numParticipants > max_basketball) {
      return false;
    }
    if (sport.toLowerCase() === 'Badminton'.toLowerCase() && numParticipants > max_badminton) {
      return false;
    }
    if (sport.toLowerCase() === 'Swimming'.toLowerCase() && numParticipants > max_swimming) {
      return false;
    }
    if (sport.toLowerCase() === 'Archery'.toLowerCase() && numParticipants > max_archery) {
      return false;
    }
    if (sport.toLowerCase() === 'Dodgeball'.toLowerCase() && numParticipants > max_dodgeball) {
      return false;
    }
    if (sport.toLowerCase() === 'Frisbee'.toLowerCase() && numParticipants > max_frisbee) {
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

  var errorDiv = $('#errorDivCreateGameEvent');
  errorDiv.hide();
  $('#createGameEvent-form').submit(function (event) {
    event.preventDefault();
    var title = filterXSS($('#title').val()),
      sportCategory = filterXSS($('#sportCategory').val()),
      description = filterXSS($('#description').val()),
      // area = $('#area').val(),
      address = filterXSS($('#address').val()),
      longitude = filterXSS($('#longitude').val()),
      latitude = filterXSS($('#latitude').val()),
      date = filterXSS($('#date').val()),
      startTime = filterXSS($('#startTime').val()),
      endTime = filterXSS($('#endTime').val()),
      minParticipants = filterXSS($('#minParticipants').val()),
      maxParticipants = filterXSS($('#maxParticipants').val());
    $('#sportCategory').find('option:eq(0)').prop('selected', true);
    errorDiv.hide();
    
    let now = new Date();
    
    now.setHours(now.getHours()+ 1);
    let startTimeMin = now.toLocaleTimeString([], { hour12:false, hour: '2-digit', minute: '2-digit' });
    let startTimeMinDate = new Date(now);

    // modify here 
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
      if (endTime > "22:00")
        throw `Events should end before 10 pm`;
      let startTime_date = convertStringToDate(date, startTime);
      let endTime_date = convertStringToDate(date, endTime);
      startTime_date = checkDate(startTime_date, 'startTime');
      endTime_date = checkDate(endTime_date, 'endTime');
      /* check if start is over 1 hour in the future */
       if (startTime_date < startTimeMinDate){
        throw `Events can only be created for 1 hour after current time`;
       }

      minParticipants = checkNum(minParticipants, 'minParticipants');
      maxParticipants = checkNum(maxParticipants, 'maxParticipants');
      if (!areValidTimes(startTime_date, endTime_date)) {
        throw "Error: EndTime must be at least an hour after startTime";
      }
      if (!validMinParticipantLimit(sportCategory, minParticipants)) {
        throw `Error: Invalid min participants for ${sportCategory}`;
      }
      if (!validMaxParticipantLimit(sportCategory, maxParticipants)) {
        throw `Error: Invalid max participants for ${sportCategory}`;
      }
      if (!validNumParticipants(minParticipants, maxParticipants)) {
        throw "Error: Min participants is greater than max participants";
      }
      if (minParticipants === maxParticipants) {
        throw "Error: Min participants cannot be same as max participants";
      }

      var requestConfig = {
        method: 'POST',
        url: '/createGameEvent',
        contentType: 'application/json',
        data: JSON.stringify({
          title: title,
          sportCategory: sportCategory,
          description: description,
          //  area: area,
          address: address,
          longitude: longitude,
          latitude: latitude,
          date: date,
          startTime: startTime,
          endTime: endTime,
          minParticipants: minParticipants,
          maxParticipants: maxParticipants
        }),

        //response status code not 200
        error: function () {
          errorDiv.show();
          $('#title').val(title);
          $('#sportCategory').val(sportCategory);
          $('#description').val(description);
          $('#longitude').val(longitude);
          $('#latitude').val(latitude);
          $('#date').val(date);
          $('#startTime').val(startTime);
          $('#endTime').val(endTime);
          $('#minParticipants').val(minParticipants);
          $('#maxParticipants').val(maxParticipants);
          $('html, body').animate({
            scrollTop: $("#errorDivCreateGameEvent").offset().top
          }, 2000);

        },

        //runs with response status code 200
        //Need to render individual game page?
        success: function (response) {
          if (response.success == false) {
            errorDiv.empty();
            errorDiv.show()
            errorDiv.html(response.message);
            $('#title').val(title);
            $('#sportCategory').val(sportCategory);
            $('#description').val(description);
            // $('#area').val(area);
            //  $('#address').val(address);
            $('#longitude').val(longitude);
            $('#latitude').val(latitude);
            $('#date').val(date);
            $('#startTime').val(startTime);
            $('#endTime').val(endTime);
            $('#minParticipants').val(minParticipants);
            $('#maxParticipants').val(maxParticipants);
            $('html, body').animate({
              scrollTop: $("#errorDivCreateGameEvent").offset().top
            }, 2000);
          } else {
            errorDiv.empty();
            errorDiv.hide();
            window.open("/eventList", '_self');
          }
        }
      }

      $.ajax(requestConfig);
    } catch (e) {
      errorDiv.empty();
      errorDiv.html(e);
      errorDiv.show();
      $('#title').val(title);
      $('#sportCategory').val(sportCategory);
      $('#description').val(description);
      // $('#area').val(area);
      //  $('#address').val(address);
      $('#longitude').val(longitude);
      $('#latitude').val(latitude);
      $('#date').val(date);
      $('#startTime').val(startTime);
      $('#endTime').val(endTime);
      $('#minParticipants').val(minParticipants);
      $('#maxParticipants').val(maxParticipants);
      $('html, body').animate({
        scrollTop: $("#errorDivCreateGameEvent").offset().top
      }, 2000);
    }
  });

  // function checkCurrentTime(startTime, endTime) {
  //   var time = dt.getHours() + ":" + dt.getMinutes()
  //   alert(time)
  // }

})(window.jQuery);