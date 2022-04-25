const {ObjectId} = require('mongodb');
const isValidCoordinates = require('is-valid-coordinates')
const openGeocoder = require('node-open-geocoder')
var validator = require("email-validator");

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


module.exports = {
  checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
      throw 'Error: id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkArray(arr, varName){
    is_valid = true;
    if(!arr || !Array.isArray(arr)){
        throw `Error: ${varName} is not an array`;
    }
    if(arr.length !== 0){
      for(let elem of arr){
        if(!elem || !elem instanceof ObjectId){
            is_valid = false;
            break;
        }
       }  
    }
    if(!is_valid){
      throw `Error: one or more elements in ${varName} is not a valid ObjectId`;
    }
    return arr;
  },

  /* we might nee further input checking for Date*/
  checkDate(date, varName){
    if(!date){
      throw `Error: you must supply a ${varName}`
    }
    if(!date instanceof Date){
      throw `Error: ${varName} is not a Date object`
    }
    return date;
  },

  checkNum (num, varName){
    if(!num){
      throw `Error: you must supply a ${varName}`;
    }
    //num gets passed as string in form data, so we need to set it as a number
    num = Number(num);
    if(typeof num !== 'number' || isNaN(num)){
      throw `Error: ${varName} is not a number`;
    }
    return num.toString();
  },

  checkMinParticipantLimit (sport, numParticipants, varName){
    if(sport === 'Soccer' && numParticipants < min_soccer){
      throw `${varName} for Soccer must be greater than ${min_soccer}`;
    }
    if(sport === 'Football' && numParticipants < min_football){
      throw `${varName} for Soccer must be greater than ${min_football}`;
    }
    if(sport === 'Golf' && numParticipants < min_golf){
      throw `${varName} for Soccer must be greater than ${min_golf}`;
    }
    if(sport === 'Baseball' && numParticipants < min_baseball){
      throw `${varName} for Soccer must be greater than ${min_baseball}`;
    }
    if(sport === 'Basketball' && numParticipants < min_basketball){
      throw `${varName} for Soccer must be greater than ${min_basketball}`;
    }
    if(sport === 'Badminton' && numParticipants < min_badminton){
      throw `${varName} for Soccer must be greater than ${min_badminton}`;
    }
    if(sport === 'Swimming' && numParticipants < min_swimming){
      throw `${varName} for Soccer must be greater than ${min_swimming}`;
    }
    if(sport === 'Archery' && numParticipants < min_archery){
      throw `${varName} for Soccer must be greater than ${min_archery}`;
    }
    if(sport === 'Dodgeball' && numParticipants < min_dodgeball){
      throw `${varName} for Soccer must be greater than ${min_dodgeball}`;
    }
    if(sport === 'Frisbee' && numParticipants < min_frisbee){
      throw `${varName} for Soccer must be greater than ${min_frisbee}`;
    }
    
    return numParticipants;
  }, 

  checkMaxParticipantLimit(sport, numParticipants, varName){
    if(sport === 'Soccer' && numParticipants > max_soccer){
      throw `${varName} for Soccer must be less than ${max_soccer}`;
    }
    if(sport === 'Football' && numParticipants > max_football){
      throw `${varName} for Soccer must be less than ${max_football}`;
    }
    if(sport === 'Golf' && numParticipants > max_golf){
      throw `${varName} for Soccer must be less than ${max_golf}`;
    }
    if(sport === 'Baseball' && numParticipants > max_baseball){
      throw `${varName} for Soccer must be less than ${max_baseball}`;
    }
    if(sport === 'Basketball' && numParticipants > max_basketball){
      throw `${varName} for Soccer must be less than ${max_basketball}`;
    }
    if(sport === 'Badminton' && numParticipants > max_badminton){
      throw `${varName} for Soccer must be less than ${max_badminton}`;
    }
    if(sport === 'Swimming' && numParticipants > max_swimming){
      throw `${varName} for Soccer must be less than ${max_swimming}`;
    }
    if(sport === 'Archery' && numParticipants > max_archery){
      throw `${varName} for Soccer must be less than ${max_archery}`;
    }
    if(sport === 'Dodgeball' && numParticipants > max_dodgeball){
      throw `${varName} for Soccer must be less than ${max_dodgeball}`;
    }
    if(sport === 'Frisbee' && numParticipants > max_frisbee){
      throw `${varName} for Soccer must be less than ${max_frisbee}`;
    }
    return numParticipants;
  },

  
  checkCoordinates(x,y)
  {
    if(!isNaN(parseFloat(x)) && !isNaN(parseFloat(y)) ) 
    {
x= parseFloat(x);
y= parseFloat(y);
      return isValidCoordinates(x, y)
    }
    else
    {return false}
    
  },

  checkAddress(street,area)
  {
    var status; 
    openGeocoder()
    .geocode( street +', '+ area)
    .end((err, res) => {
      var data = res; 
      if (!data)
      status = false;
      else if (data.length === 0)
      status = false;
      else
     status = true;
      return status ;
    })
  },

 validString(str) 
 {
if (!str || typeof str !== 'string' || !str.trim()) return false;
    return true;
},

 validfloat(float){
  if(!isNaN(parseFloat(float))) {
    return true;
} return false;
},
checkEmail(email)
{
return validator.validate(email); 
}


};
