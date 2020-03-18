// Cloudinary post URL
//var cloudinaryPostUrl = "https://api.cloudinary.com/v1_1/beida-ugym/image/upload";
//var presetName = "llftctau"

// 改為 Cloudinary beida-coupon 帳號
//var cloudinaryPostUrl = "https://api.cloudinary.com/v1_1/beida-coupon/image/upload";
//var presetName = "ntb4ppf4"

// 改為使用 Imgur BeiDa-Coupon 帳號
var bearerId = "Bearer 5130399359e4fe9be958edd10450a8763df34277";
var clientId = "Client-ID e113d4b4cf3d463";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC8XdbhwMkdyC5N3Nit3NRcIBKbjWEqjww",
  authDomain: "ugym-beida.firebaseapp.com",
  databaseURL: "https://ugym-beida.firebaseio.com",
  projectId: "ugym-beida",
  storageBucket: "ugym-beida.appspot.com",
  messagingSenderId: "1054766854677",
  appId: "1:1054766854677:web:56615d24634c799334941c",
  measurementId: "G-7V4C3BW5VL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// analytic 功能先不用
//firebase.analytics();

var database = firebase.database();

var isLogin = false;
firebase.auth().onAuthStateChanged(function (user) {
  console.log(user);

  if (user == null) {
    // not login
    console.log("no login");
    $("#loginStatus").text("請登入來寫入資料庫");
    $("#logToggle").text("登入");
    isLogin = false;
    $("#memberMangementBtn").attr("disabled", true);
    $("#addCourseBtn").attr("disabled", true);
    
    //以下三行不知為何沒作用
//    $("#courseDueBtn").attr("disabled", true);    
//    $("#courseDetailBtn").attr("disabled", true);        
//    $("#courseDeleteBtn").attr("disabled", true); 
    
//    var aaa = $('#courseTable').DataTable();
//    console.log(aaa);
//    aaa.buttons.disable();    
    
  } else {
    // login
    console.log(user.email);
    $("#loginStatus").text("Hello " + user.email);
    $("#logToggle").text("登出");
    isLogin = true;
    $("#memberMangementBtn").attr("disabled", false);
    $("#addCourseBtn").attr("disabled", false);
    
    //以下三行不知為何沒作用    
//    $("#courseDueBtn").attr("disabled", false);    
//    $("#courseDetailBtn").attr("disabled", false);        
//    $("#courseDeleteBtn").attr("disabled", false);     
  }
});

function readFromDB() {
  console.log("Read Database");

  $.loading.start('Loading data');
  // 一次全讀
  firebase.database().ref('users/三峽運動中心').once('value').then(function (snapshot) {
    console.log("data read done");
    //readTimes++;
    var result = snapshot.val();
    courseData = JSON.parse(result.團課課程.現在課程);
    courseHistory = JSON.parse(result.團課課程.過去課程);

//    if (courseData.length>0) {
//      var tmp1 = courseData[courseData.length - 1][0];
//      var tmp2 = parseInt(tmp1.substr(1, 4));
//    } else tmp2 = 0;
//
//    if (courseHistory.length>0) {    
//      var tmp3 = courseHistory[courseHistory.length - 1][0];
//      var tmp4 = parseInt(tmp3.substr(1, 4));  
//    } else tmp4 = 0;
// 
//    courseNum = (tmp4 > tmp2)? tmp4:tmp2;
    
      courseNum = 0;
      courseData.forEach(function(course, index, array){
         var 課程號碼 = parseInt(course[0].substr(1, course[0].length));
         if (課程號碼 > courseNum) courseNum = 課程號碼;
      });
      
      courseHistory.forEach(function(course, index, array){
         var 課程號碼 = parseInt(course[0].substr(1, course[0].length));
         if (課程號碼 > courseNum) courseNum = 課程號碼;
      }); 
    
    //console.log(courseNum);

    refreshCourse();
    
    memberData   = JSON.parse(result.客戶管理.會員資料);   
    courseMember = JSON.parse(result.課程管理.課程會員);    
    coachSet     = JSON.parse(result.教練管理.老師資料);
    
    $.loading.end();
  });  
  
// 分 4 次讀，比較慢也比較出問題
//  var toRead = 4;
//  var readTimes = 0;
//  firebase.database().ref('users/三峽運動中心/團課課程').once('value').then(function (snapshot) {
//    console.log("data read done");
//    readTimes++;
//    var result = snapshot.val();
//    courseData = JSON.parse(result.現在課程);
//    courseHistory = JSON.parse(result.過去課程);
//
//    if (courseData.length>0) {
//      var tmp1 = courseData[courseData.length - 1][0];
//      var tmp2 = parseInt(tmp1.substr(1, 4));
//    } else tmp2 = 0;
//
//    if (courseHistory.length>0) {    
//      var tmp3 = courseHistory[courseHistory.length - 1][0];
//      var tmp4 = parseInt(tmp3.substr(1, 4));  
//    } else tmp4 = 0;
// 
//    courseNum = (tmp4 > tmp2)? tmp4:tmp2;
//    
//    //console.log(courseNum);
//
//    refreshCourse();
//
//    if (readTimes == toRead) $.loading.end();
//  });
//
//  firebase.database().ref('users/三峽運動中心/客戶管理').once('value').then(function (snapshot) {
//    console.log("member read done");
//    readTimes++;
//    var result = snapshot.val();
//    memberData = JSON.parse(result.會員資料);
//
//    if (readTimes == toRead) $.loading.end();
//  });
//
//  firebase.database().ref('users/三峽運動中心/課程管理').once('value').then(function (snapshot) {
//    console.log("class read done");
//    readTimes++;
//    var result = snapshot.val();
//    courseMember = JSON.parse(result.課程會員);
//
//    if (readTimes == toRead) $.loading.end();
//  });
//  
//  firebase.database().ref('users/三峽運動中心/教練管理').once('value').then(function (snapshot) {
//    console.log("Coach read done");
//    readTimes++;
//    var result = snapshot.val();
//    coachSet = JSON.parse(result.老師資料);
//
//    if (readTimes == toRead) $.loading.end();
//  });  

}

function readMemberfromDB() {
  console.log("Read  Database");  
  
  var toRead = 1;
  var readTimes = 0;  
  
  $.loading.start('Loading data')
  firebase.database().ref('users/三峽運動中心/客戶管理').once('value').then(function (snapshot) {
    console.log("member read done");
    readTimes++;
    var result = snapshot.val();
    memberData = JSON.parse(result.會員資料);

    if (readTimes == toRead) $.loading.end();
    
    // 更新客戶表格
//    var memberTable = $('#memberTable').DataTable();
//    memberTable.clear().draw();
//    memberTable.rows.add();
//    memberTable.draw();
    
    
  });  
}