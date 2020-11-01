(function(global) {

    // Set up a namespace for our utility
    var ajaxUtils = {};

    // Returns an HTTP request object
    function getRequestObject() {
        if (window.XMLHttpRequest) {
            return (new XMLHttpRequest());
        } else if (window.ActiveXObject) {
            // For very old IE browsers (optional)
            return (new ActiveXObject("Microsoft.XMLHTTP"));
        } else {
            global.alert("Ajax is not supported");
            return(null);
        }
    }

    ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse, async=true) {
        var request = getRequestObject();
        request.onreadystatechange = function () {
            handleResponse(request, responseHandler, isJsonResponse)
        };

        request.open("GET", requestUrl, async);
        request.send(null); // for POST only
    };

    function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

    ajaxUtils.sendPostRequest = function (data_dict, url, responseHandler, file_upload=false) {
        var csrftoken = getCookie('csrftoken');
        console.log('FILE UPLOAD = ' + file_upload);
        if (file_upload) {
            $.ajax({
                headers: {"X-CSRFToken": csrftoken} ,
                type: "POST",
                url: url,
                data: data_dict,
                processData: false,
                contentType: false,
                }).done( function (data) {
                    status = responseHandler(data)
                });
        } else {
            $.ajax({
                headers: {"X-CSRFToken": csrftoken} ,
                type: "POST",
                url: url,
                data: data_dict,
                }).done( function (data) {
                    status = responseHandler(data)
                });
        }
    };


    // Only calls user provided 'responseHandler'
    // function if response is ready
    // and not an error
    function handleResponse(request,
                            responseHandler,
                            isJsonResponse) {
        if ((request.readyState == 4) &&
            (request.status == 200)) {

            // Default to isJsonResponse = true
            if (isJsonResponse == undefined) {
                isJsonResponse = true;
            }

            if (isJsonResponse) {
                responseHandler(JSON.parse(request.responseText));
            }
            else {
                responseHandler(request.responseText);
            }
        }
    };

    // Expose utility to the global object
    global.$ajaxUtils = ajaxUtils;

})(window);