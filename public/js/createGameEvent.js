

(function ($) {

        var errorDiv = $('#errorDivCreateGameEvent');
        $('#createGameEvent-form').submit(function (event){
            event.preventDefault();

            var title = $('#title').val(),
            sportCategory = $('#sportCategory').val(),
            description = $('#description').val(),
            area = $('#area').val(), 
            address = $('#address').val(), 
            longitude = $('#longitude').val(), 
            latitude = $('#latitude').val(),
            date = $('#date').val(), 
            startTime = $('#startTime').val(), 
            endTime = $('#endTime').val(), 
            minParticipants = $('#minParticipants').val(), 
            maxParticipants = $('#maxParticipants').val();

            errorDiv.hide();

            try {
                title = checkString(title, 'title');
                sportCategory = checkString(sportCategory, 'sportCategory');
                description = checkString(description, 'description');
                area = checkString(area, 'area');
                address = checkString(address, 'address');

                /* NEED to check validity for address, longitude, and latitude */

                date = checkString(date, 'date');
                date = dateIsValid(date, 'date');
                startTime = checkTime(startTime, 'startTime');
                endTime = checkTime(endTime, 'endTime');
                let startTime_date = convertStringToDate(date, startTime);
                let endTime_date = convertStringToDate(date, endTime);
                startTime_date = checkDate(startTime, 'startTime');
                endTime_date = checkDate(endTime, 'endTime');

                minParticipants = checkNum(minParticipants, 'minParticipants');
                maxParticipants = checkNum(maxParticipants, 'maxParticipants');

                var requestConfig = {
                    method: 'POST',
                    url: '/createGameEvent',
                    contentType: 'application/json',
                    data: JSON.stringify({title: title , sportCategory: sportCategory , description: description, area: area, address:address, longitude: longitude, 
                        latitude: latitude, date: date, startTime: startTime, endTime: endTime, minParticipants: minParticipants, maxParticipants: maxParticipants}), 
    
                    //response status code not 200
                    error: function (){
                        errorDiv.show();
                        $('#title').val(title);
                        $('#sportCategory').val(sportCategory);
                        $('#description').val(description);
                        $('#area').val(area);
                        $('#address').val(address); 
                        $('#longitude').val(longitude); 
                        $('#latitude').val(latitude);
                        $('#date').val(date);
                        $('#startTime').val(startTime); 
                        $('#endTime').val(endTime);
                        $('#minParticipants').val(minParticipants); 
                        $('#maxParticipants').val(maxParticipants); 
                    },
    
                    //runs with response status code 200
                    //Need to render individual game page?
                    success: function(response){
                        console.log("SUCCESS ADDING TO Database");
                        console.log(response);
                    }
                }
                $.ajax(requestConfig);
                } catch (e){
                    errorDiv.empty();
                    errorDiv.html(e);
                    errorDiv.show();
                    $('#title').val(title);
                    $('#sportCategory').val(sportCategory);
                    $('#description').val(description);
                    $('#area').val(area);
                    $('#address').val(address); 
                    $('#longitude').val(longitude); 
                    $('#latitude').val(latitude);
                    $('#date').val(date);
                    $('#startTime').val(startTime); 
                    $('#endTime').val(endTime);
                    $('#minParticipants').val(minParticipants); 
                    $('#maxParticipants').val(maxParticipants); 
                }
    
        });
    



})(jQuery);