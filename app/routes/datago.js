const express = require('express');
const router = express.Router();
const request = require('request');
const cors = require('cors');
const myCorsOptions = {
  origin: function(origin, callback){
    if ("http://localhost:3000".indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error("Not Allowed Origin !!!"));
    }
  }
}

const MsrstnInfoInqireSvc_Url = 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/'; // 측정소 정보
const MsrstnInfoInqireSvc_method1 = 'getMsrstnList'; // 측정소 목록 조회
const MsrstnInfoInqireSvc_method2 = 'getNearbyMsrstnList'; // 근접측정소 목록 조회
const MsrstnInfoInqireSvc_method3 = 'getTMStdrCrdnt'; // TM 기준좌표 조회
const MsrstnInfoInqireSvc_Encoding_key = 'JVVz9wTLyaNmQihosXPfMDVr2O7NgwfeMXCIMtKEThGOJnLUTEGX%2FeJOb7DAOCIjF2mhyjsMBjdp7wo12a5PSA%3D%3D';
const MsrstnInfoInqireSvc_Decoding_key = 'JVVz9wTLyaNmQihosXPfMDVr2O7NgwfeMXCIMtKEThGOJnLUTEGX/eJOb7DAOCIjF2mhyjsMBjdp7wo12a5PSA==';

const ArpltnInforInqireSvc = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/";  // 대기오염 정보
const ArpltnInforInqireSvc_method1 = 'getMsrstnAcctoRltmMesureDnsty'; // 측정소별 실시간 측정정보 조회
const ArpltnInforInqireSvc_Encoding_key = 'JVVz9wTLyaNmQihosXPfMDVr2O7NgwfeMXCIMtKEThGOJnLUTEGX%2FeJOb7DAOCIjF2mhyjsMBjdp7wo12a5PSA%3D%3D';
const ArpltnInforInqireSvc_Decoding_key = 'JVVz9wTLyaNmQihosXPfMDVr2O7NgwfeMXCIMtKEThGOJnLUTEGX/eJOb7DAOCIjF2mhyjsMBjdp7wo12a5PSA==';

// 근접측정소 목록 조회
router.get('/Mmethod2', cors(myCorsOptions), function (req, res, next) {
  const posX = req.query.posX;  
  const posY = req.query.posY;
  
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' 
                          + MsrstnInfoInqireSvc_Encoding_key; /* Service Key*/
      queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); /* */
      queryParams += '&' + encodeURIComponent('tmX') + '=' + encodeURIComponent(posX); /* */
      queryParams += '&' + encodeURIComponent('tmY') + '=' + encodeURIComponent(posY); /* */
      // queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.0'); /* */

  request({
    url: MsrstnInfoInqireSvc_Url + MsrstnInfoInqireSvc_method2 + queryParams,
    method: 'GET'
  }, function (error, response, body) {
      console.log('Reponse received', body);
      res.json(body);
  });
});

// 측정소별 실시간 측정정보 조회
router.get('/Amethod1', cors(myCorsOptions), function (req, res, next) {
  const stationName = req.query.stationName;
   
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' 
                          + ArpltnInforInqireSvc_Encoding_key; /* Service Key*/
      queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); /* */
      queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(stationName); /* */
      queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent('DAILY'); /* */
      queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.0'); /* */

  request({
    url: ArpltnInforInqireSvc + ArpltnInforInqireSvc_method1 + queryParams,
    method: 'GET'
  }, function (error, response, body) {
      console.log('Reponse received', body);
      res.json(body);
  });
});

// 통계청 위경도 TM 좌표계 변환
// 1. GET accessToken
const sgisAuthurl = "https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json";
const consumer_key = "57e501a6391f4cb8ba92";
const consumer_secret = "e67feaa6e3ba45f0877c";
router.get('/sgisAuth', cors(myCorsOptions), function (req, res, next) {
  let queryParams = '?' + 'consumer_key' + '=' 
                        + consumer_key + '&'
                        + 'consumer_secret' + '=' 
                        + consumer_secret;
  request({
      url: sgisAuthurl + queryParams,
      method: 'GET'
  }, function (error, response, body) {

    console.log('Reponse received', JSON.parse(body));
    let result = JSON.parse(body);
    res.json(result); 
  });
});

// 2. GET TM
const sgisTMurl = "https://sgisapi.kostat.go.kr/OpenAPI3/transformation/transcoord.json";
const WGS84 = 4326; // WGS84 경위도
const GRS80 = 5181; // GRS80 중부원점
router.get('/sgisTM', cors(myCorsOptions), function (req, res, next) {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const accessToken = req.query.accessToken;

  let queryParams = '?' + 'accessToken' + '=' 
                        + accessToken + '&'
                        + 'src' + '=' 
                        + WGS84 + '&'
                        + 'dst' + '=' 
                        + GRS80 + '&'
                        + 'posX' + '=' 
                        + longitude + '&'
                        + 'posY' + '=' 
                        + latitude;

  request({
      url: sgisTMurl + queryParams,
      method: 'GET'
  }, function (error, response, body) {

    console.log('Reponse received', JSON.parse(body));
    let result = JSON.parse(body);
    res.json(result);
  });
});

module.exports = router;
