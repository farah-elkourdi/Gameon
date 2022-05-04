const getCommentList = async function (gameEventId) {
    window.open("/viewGameEvent/" + gameEventId  , "_self")
    // let req = {
    //     method: 'GET',
    //     url: '/comments/' + gameEventId,
    //     contentType: 'application/json',
    //     datatype: 'html',
    //     params: {
    //         gameEventId: gameEventId
    //     },
    //     cache: false,
    //     withCredentials: true,
    //     success: function (res) {
    //         $('#error').empty();
    //         $('#error').hide();
    //         $('#showComments').empty();
    //         $('#showComments').html(res);
    //         $('#showComments').show();
    //     },
    //     error: function (e) {
    //         var err = $('<p></p>').text(e.responseText);
    //         $('#error').empty();
    //         $('#error').append(err);
    //         $('#error').show();
    //     }
    // };
    // $.ajax(req);
};

const onFormClick = async function (event) {
    event.preventDefault();
    const gameEventId = $('#gameEventId').val();
    const comment = $('#comment').val();
    $('#error').empty();
    $('#error').hide();
    $('#comment').val('');
    let requestConfig = {
        method: 'POST',
        url: '/comments',
        contentType: 'application/json',
        data: JSON.stringify({
            gameEventId: gameEventId,
            comment: comment
        }),
        cache: false,
        withCredentials: true
    }
    $.ajax(requestConfig).then(async function (responseMessage) {
        if (responseMessage) {
            //alert(responseMessage.message.length)
            if (!responseMessage.success) {
                var err = $('<p></p>').text(responseMessage.error);
                $('#error').empty();
                $('#error').append(err);
                $('#error').show();
            } else {
                await getCommentList(gameEventId);
            }
        }
    });
};

(function ($) {

    $('#viewComments').click(async function (event) {
        event.preventDefault();
        const gameEventId = $('#gameEventId').val();
        await getCommentList(gameEventId);
    });

    $('#submitButton').click(onFormClick);

    $(document).ready(function () {

        var event_participants = document.getElementById('event_participants').getElementsByTagName('li');
        for (let i = 0; i <= event_participants.length - 1; i++) {
            let div = event_participants[i].getElementsByTagName('div');
            let fullName = div['profileImageName'].innerText;
            let profileImage = div['profileImage'];

            const allNames = fullName.trim().split(' ');
            const initials = allNames.reduce((acc, curr, index) => {
                if (index === 0 || index === allNames.length - 1) {
                    acc = `${acc}${curr.charAt(0).toUpperCase()}`;
                }
                return acc;
            }, '');
            profileImage.textContent = initials;

        }

        var event_comments = document.getElementById('comments').getElementsByClassName('media');
        for (let i = 0; i <= event_comments.length - 1; i++) {
            let div = event_comments[i].getElementsByTagName('div');
            let fullName = event_comments[i].getElementsByTagName('h4')[0].textContent;
            let profileImage = div['userCommentProfileImage'];

            const allNames = fullName.trim().split(' ');
            const initials = allNames.reduce((acc, curr, index) => {
                if (index === 0 || index === allNames.length - 1) {
                    acc = `${acc}${curr.charAt(0).toUpperCase()}`;
                }
                return acc;
            }, '');
            profileImage.textContent = initials;

        }
    });

})(window.jQuery);