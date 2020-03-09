/**
 * Global Variable, function
 */
var KAKAO_APP_KEY = '7d58b213449bff4878fe9939c5d027f6';

var USER_ACC_TOKEN = ''; 

// Kakao Api Call function
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

// User Token check
var userTokenCheck = function(){
    USER_ACC_TOKEN = getParameterByName('token');
    if(USER_ACC_TOKEN == null){
        USER_ACC_TOKEN = '';
    }
    if(USER_ACC_TOKEN == '' ){
        location.href = '/oauth';
    } else {
        var login_type = getParameterByName('type');
        if(login_type == 'kakao'){
            alert('카카오 로그인 되어있음.');
        } else if(login_type == 'google'){
            alert('구글 로그인 되어있음.');
        }
    }
}

// userLogout
var userLogout = function(){
    var login_type = getParameterByName('type');

    if(login_type == 'kakao'){
        alert('Kakao 로그아웃 되었습니다.');
        USER_ACC_TOKEN = '';
        location.href = '/';
    } else if(login_type == 'google'){
        USER_ACC_TOKEN = '';
        location.href = '/oauth?type=logout';
    }
    
}

// get Query string param
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}