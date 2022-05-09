function checkId(id) {
    if (!id) throw 'Error: You must provide an id to search for';
    if (typeof id !== 'string') throw 'Error: id must be a string';
    id = id.trim();
    if (id.length === 0)
        throw 'Error: id cannot be an empty string or just spaces';
    return id;
};


const getCommentList = async function (gameEventId) {
    try {
        checkId(gameEventId);
    } catch (e) {
        var err = $('<p></p>').text(e.responseText);
        $('#error').empty();
        $('#error').append(err);
        $('#error').show();
    }
    let req = {
        method: 'GET',
        url: '/comments/' + gameEventId,
        contentType: 'application/json',
        datatype: 'html',
        params: {
            gameEventId: gameEventId
        },
        cache: false,
        withCredentials: true,
        success: function (res) {
            $('#error').empty();
            $('#error').hide();
            $('#showComments').empty();
            $('#showComments').html(res);
        },
        error: function (e) {
            var err = $('<p></p>').text(e.responseText);
            $('#error').empty();
            $('#error').append(err);
            $('#error').show();
        }
    };
    $.ajax(req);

};

const onFormClick = async function (event) {
    event.preventDefault();
    const gameEventId = filterXSS($('#gameEventId').val());
    const comment = filterXSS($('#comment').val());
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
        $('#comment').val('');
        if (responseMessage) {
            //alert(responseMessage.message.length)
            if (!responseMessage.success) {
                var err = $('<p></p>').text(responseMessage.error);
                $('#error').empty();
                $('#error').append(err);
                $('#error').show();
            } else {
                $('#error').hide();
                await getCommentList(gameEventId);
            }
        }
    });
};

(function ($) {
    $(document).ready(function () {
        var errorDiv = $('#errorDiv');
        $('#error').empty();
        $('#error').hide();
        $('#comment').val('');
        errorDiv.empty();
        errorDiv.hide();

        $('#submitButton').click(onFormClick);
        if ($('#comments').is(':visible')) {
            getCommentList(filterXSS($('#gameEventId').val()));

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
        }
        // $('#comments').ready();

        $('#viewComments').click(async function (event) {
            event.preventDefault();
            const gameEventId = filterXSS($('#gameEventId').val());
            await getCommentList(gameEventId);
        });

        $('#leaveButton').click(function (event) {
            event.preventDefault();
            let id = filterXSS($('#gameEventId').val());
            var requestConfig = {
                method: 'POST',
                url: `/viewGameEvent/leave/${id}`,
                contentType: 'application/json',
                data: JSON.stringify({}),
                cache: false
            };

            $.ajax(requestConfig).then(function (response) {
                    if (response.success == true) {
                        window.open(`/viewGameEvent/${id}`, '_self');
                    } else {
                        errorDiv.empty();
                        errorDiv.show();
                        errorDiv.html(response.message);
                    }

                })
                .catch(function (response) {
                    errorDiv.empty();
                    errorDiv.show()
                    errorDiv.html(response.message);
                });
        });

        $('#joinButton').click(function (event) {
            event.preventDefault();
            let id = filterXSS($('#gameEventId').val());
            var requestConfig = {
                method: 'POST',
                url: `/viewGameEvent/${id}`,
                contentType: 'application/json',
                data: JSON.stringify({}),
                cache: false
            };

            $.ajax(requestConfig).then(function (response) {
                    if (response.success == true) {
                        window.open(`/viewGameEvent/${id}`, '_self');
                    } else {
                        errorDiv.empty();
                        errorDiv.show();
                        errorDiv.html(response.message);
                    }

                })
                .catch(function (response) {
                    errorDiv.empty();
                    errorDiv.show()
                    errorDiv.html(response.message);
                });
        });

        var event_participants = document.getElementById('event_participants').getElementsByTagName('li');
        for (let i = 0; i <= event_participants.length - 1; i++) {
            let fullName = $(`#profileImageName_${i}`).text();
            let profileImage = $(`#profileImage_${i}`)

            const allNames = fullName.trim().split(' ');
            const initials = allNames.reduce((acc, curr, index) => {
                if (index === 0 || index === allNames.length - 1) {
                    acc = `${acc}${curr.charAt(0).toUpperCase()}`;
                }
                return acc;
            }, '');
            profileImage.text(initials);

        }
    });

})(window.jQuery);