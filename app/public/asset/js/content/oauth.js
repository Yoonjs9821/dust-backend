/**
 * 카카오 로그인
 * 
 *  */ 
// 사용할 앱의 JavaScript 키를 설정해 주세요.
Kakao.init(KAKAO_APP_KEY);
// 카카오 로그인 버튼을 생성합니다.
function loginWithKakao() {
    // 로그인 창을 띄웁니다.
    Kakao.Auth.login({
        success: function(authObj) {
            console.log(authObj.access_token);
            USER_ACC_TOKEN = authObj.access_token;
            Kakao.API.request({
            url: '/v2/user/me',
            success: function(res) {
                // alert(JSON.stringify(res));
                location.href = '/?token='+USER_ACC_TOKEN+'&type=kakao'+'&nickname='+res.properties.nickname+'&image='+res.properties.profile_image;
            },
            fail: function(error) {
                alert(JSON.stringify(error));
            }
            });
        },
        fail: function(err) {
        alert(JSON.stringify(err));
        }
    });
};

/**
 *  구글 로그인
 * 
 *  */ 
var googleUser = {};
var startApp = function() {
    gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '387934008223-evjailh60a1g8c7ka7osjr81tlo38tpl.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });
        attachSignin(document.getElementById('google-login'));
    });
};
function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function(googleUser) {
            let profile = googleUser.getBasicProfile();
            let id_token = googleUser.getAuthResponse().id_token;
            location.href = '/?token='+id_token+'&type=google'+'&nickname='+profile.getName()+'&image='+profile.getImageUrl();
        }, function(error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        alert('Google 로그아웃 되었습니다.');
        location.href = '/';
    });
}


/**
 *  페이스북 로그인
 * 
 *  */ 
window.fbAsyncInit = function() {
    FB.init({
        appId            : '2766625623432597',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v6.0'
    });
};

function facebookSignin(){
    FB.login(function(response) {
        if (response.status === 'connected') {
            var facebookToken = response.authResponse.accessToken;
            // Logged into your webpage and Facebook
            FB.api('/me', function(response) {
                var id = response.id;
                var photoUrl = 'http://graph.facebook.com/'+id+'/picture?type=square';
                var username = response.name;
                location.href = '/?token='+facebookToken+'&type=facebook'+'&nickname='+username+'&image='+photoUrl;
          });
        } else {
          // The person is not logged into your webpage or we are unable to tell. 
          alert(response.status);
        }
      },{scope: 'public_profile,email'});
}


/**
 *  네이버 로그인
 * 
 *  */ 
var naverLogin = new naver.LoginWithNaverId(
    {
        clientId: "WfRRtFcK9atinB5V0Gp0",
        callbackUrl: "http://localhost:9000/oauth",
        isPopup: false,
        callbackHandle: true
        /* callback 페이지가 분리되었을 경우에 callback 페이지에서는 callback처리를 해줄수 있도록 설정합니다. */
    }
);

/* (3) 네아로 로그인 정보를 초기화하기 위하여 init을 호출 */
naverLogin.init();

/* (4) Callback의 처리. 정상적으로 Callback 처리가 완료될 경우 main page로 redirect(또는 Popup close) */
function naverSignin() {
    naverLogin.getLoginStatus(function (status) {
        if (status) {
            /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
            var email = naverLogin.user.getEmail();
            if( email == undefined || email == null) {
                alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
                /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                naverLogin.reprompt();
                return;
            }

            window.location.replace('/?token='+facebookToken+'&type=facebook'+'&nickname='+username+'&image='+photoUrl);
        } else {
            console.log("callback 처리에 실패하였습니다.");
        }
    });
} 


//   jQuery
$(document).ready(function(){
    startApp();

    $('.naver').click(function(){
        $('#naverIdLogin').click();
    });
});