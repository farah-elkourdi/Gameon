const getCommentList = async function(gameEventId){
    let req = {
        method: 'GET',
        url: '/comments/' + gameEventId,
        contentType: 'application/json',
        datatype: 'html',
        params: {gameEventId: gameEventId},
        cache: false,
        withCredentials: true,
        success: function(res) {
            $('#error').empty();
            $('#error').hide();
            $('#showComments').empty();
            $('#showComments').html(res);
            $('#showComments').show();
        },
        error: function(e) 
        {
            var err = $('<p></p>').text(e.responseText);
                $('#error').empty();
                $('#error').append(err);
                $('#error').show();
        }
    };
    $.ajax(req);
};

const onFormClick = async function(event){
        event.preventDefault();
        const gameEventId = $('#gameEventId').val();
        const comment = $('#comment').val();
        $('#error').empty();
        $('#error').hide();
        let requestConfig = {
            method: 'POST',
            url: '/comments',
            contentType: 'application/json',
            data: JSON.stringify({gameEventId: gameEventId, comment: comment}),
            cache: false,
            withCredentials: true
        }
        $.ajax(requestConfig).then(async function (responseMessage) {
            if (responseMessage) {
                //alert(responseMessage.message.length)
                if(!responseMessage.success)
                {
                    var err = $('<p></p>').text(responseMessage.error);
                    $('#error').empty();
                    $('#error').append(err);
                    $('#error').show();
                }
                else
                {
                    await getCommentList(gameEventId);
                }
            }
        });
    };

(function ($) {
   
    $('#viewComments').click(async function(event) {
        event.preventDefault();
        const gameEventId = $('#gameEventId').val();
        await getCommentList(gameEventId);
    });

    $('#submitButton').click(onFormClick);

  })(jQuery);