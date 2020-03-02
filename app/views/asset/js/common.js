/**
 * Global Variable, function
 */
var callKakaoAPI = function(type, url, param, callback){
    $.ajax({
        type : type,
        url : url,
        data: param,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers : {"Authorization" : "KakaoAK 1c1232a0c46b84532426a60e0bb3d5a7"},
        success : callback,
        error: function(xhr, status, error){
            alert(status);
        },
    });
};