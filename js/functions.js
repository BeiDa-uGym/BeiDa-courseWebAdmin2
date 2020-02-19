function addCourse() {
  console.log("addCourse");

  if (!isLogin) {
    alert("必須登入後才能新增課程");
    return 0;
  }

  //courseNum++;
  $("#courseNumber").text("新增團課課程 - U" + zeroFill(courseNum+1, 4));

  $("#courseTable").hide();
  $("#courseHistoryTable").hide();
  $("#spacerBetweenTables").hide();

  $(".dataTables_filter").hide();
  $(".dataTables_info").hide();
  $('#courseTable_paginate').hide();
  $('#courseHistoryTable_paginate').hide();

  $("#addCourse").show();


  $("#inProgress").hide();
  $("#addCourseBtn").hide();
  $("#refreshBtn").hide();
  //      $("#addCourseBtn").attr("disabled", true);
  //      $("#refreshBtn").attr("disabled", true);
}

function courseConfirm() {
  console.log("courseConfirm");

  if (!isLogin) {
    alert("必須登入後才能新增課程");
    return 0;
  }

  var startDate = new Date($("#courseDate").val());
  var nextDate = new Date();
  //console.log(startDate);
  nextDate.setDate(startDate.getDate() - 7);
  var repeatTimes=$("#repeatN").val();
  for (var i=0; i<repeatTimes; i++){
    courseNum++;
    nextDate.setDate(nextDate.getDate() + 7);
    nextDateStr = nextDate.toLocaleDateString();
    nextDateStr = nextDateStr.replace(/\//g, "-");
    //console.log(courseNum, nextDateStr);
    
    var courseNameTmp;
    courseNameTmp = (repeatTimes>1)? $("#courseName").val()+" ("+(i+1)+")":$("#courseName").val();
    
    var dataToAdd = [
              "U" + zeroFill(courseNum, 4),
              courseNameTmp,
              $("#coachName").val(),
              nextDateStr + " " + $("#courseTime").val(),
              $("#Calories").val(),
              $("#fee").val(),      
              $("#maxPersons").val(),
              "0", //已報名人數
              "0", //已繳費人數
              $("#assistName").val(),
              $("#otherDesc").val(),
              securePicUrl,
            ];

    // 更新 local courseData 及 courseMember
    courseData.push(dataToAdd);
    courseMember.push(["U" + zeroFill(courseNum, 4)]); //Fix bug:重複週期 新增課程 會只有增加最後一個課程 到 courseMember
  }
  


  // 課程寫入資料庫
  database.ref('users/三峽運動中心/團課課程').set({
    現在課程: JSON.stringify(courseData),
    過去課程: JSON.stringify(courseHistory),
  }, function (error) {
    if (error) {
      console.log("Write to database error, revert courseData back");
      courseData.pop();
    }
    console.log('Write to database successful');
  });


  database.ref('users/三峽運動中心/課程管理').set({
    課程會員: JSON.stringify(courseMember),
  }, function (error) {
    if (error) {
      //console.log(error);
      return 0;
    }
    console.log('Write to database successful');
  });

  // 更新課程表格
  var courseTable = $('#courseTable').DataTable();
  courseTable.clear().draw();
  courseTable.rows.add(courseData);
  courseTable.draw();

  $("#addCourse").hide();
  $("#courseTable").show();
  $("#spacerBetweenTables").show();
  $("#courseHistoryTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#courseTable_paginate').show();
  $('#courseHistoryTable_paginate').show();

  $("#inProgress").show();
  $("#addCourseBtn").show();
  $("#refreshBtn").show();
  //      $("#addCourseBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);      
}

function courseCancel() {
  console.log("courseCancel");
  //courseNum--;
  $("#addCourse").hide();
  $("#spacerBetweenTables").show();
  $("#courseHistoryTable").show();
  $("#courseTable").show();

  $(".dataTables_filter").show();
  $(".dataTables_info").show();
  $('#courseTable_paginate').show();
  $('#courseHistoryTable_paginate').show();

  $("#inProgress").show();
  $("#addCourseBtn").show();
  $("#refreshBtn").show();
  //      $("#addCourseBtn").attr("disabled", false);
  //      $("#refreshBtn").attr("disabled", false);       
}

function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
    return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + ""; // always return a string
}

function refreshCourse() {
  console.log("Refresh Course");

  var courseTable = $('#courseTable').DataTable();
  courseTable.clear().draw();
  courseTable.rows.add(courseData);
  courseTable.draw();

  var courseTable = $('#courseHistoryTable').DataTable();
  courseTable.clear().draw();
  courseTable.rows.add(courseHistory);
  courseTable.draw();
}

function backToHome() {
  console.log("Refresh Course");
  
  location.reload();

//  $("#courseDetail").hide();
//
//  $("#courseTable").show();
//  $("#courseHistoryTable").show();
//  $("#spacerBetweenTables").show();
//
//  $(".dataTables_filter").show();
//  $(".dataTables_info").show();
//  $('#courseTable_paginate').show();
//  $('#courseHistoryTable_paginate').show();
//  $("#addCourse").hide();
//  $("#inProgress").show();
//  $("#addCourseBtn").show();
//  $("#refreshBtn").show();
}

function courseUpdate() {
  console.log("courseUpdate");

  if (!isLogin) {
    alert("必須登入後才能更新課程");
    return 0;
  }

  var confirmReplace = confirm("確定要更新此課程!");

  if (!confirmReplace) {
    return 0;
  } else {  
    // TODO: 尋找 courseData 這筆資料，並取代
    for (var i =0; i< courseData.length; i++){
      //console.log(courseData[i][0]);
      if (courseData[i][0]==courseForDetail) {
        var dataToReplace = [ 
          courseForDetail,
          $("#courseNameDetail").val(),
          $("#coachNameDetail").val(),
          $("#courseTimeDetail").val(),
          $("#CaloriesDetail").val(),
          $("#feeDetail").val(),          
          $("#maxPersonsDetail").val(),
          courseData[i][7],
          courseData[i][8],
          $("#assistNameDetail").val(),
          $("#otherDescDetail").val(), 
          securePicUrl,
        ]
        
        courseData[i] = dataToReplace;
        //console.log(dataToReplace);
        break;
      }
    }
        
    // 課程寫入資料庫
    database.ref('users/三峽運動中心/團課課程').set({
      現在課程: JSON.stringify(courseData),
      過去課程: JSON.stringify(courseHistory),
    }, function (error) {
      if (error) {
        console.log("Write to database error, revert courseData back");
        courseData.pop();
      }
      console.log('Write to database successful');
    });

    // 更新課程表格
    var courseTable = $('#courseTable').DataTable();
    courseTable.clear().draw();
    courseTable.rows.add(courseData);
    courseTable.draw();

    $("#courseDetail").hide();
    $("#courseTable").show();
    $("#spacerBetweenTables").show();
    $("#courseHistoryTable").show();

    $(".dataTables_filter").show();
    $(".dataTables_info").show();
    $('#courseTable_paginate').show();
    $('#courseHistoryTable_paginate').show();

    $("#inProgress").show();
    $("#addCourseBtn").show();
    $("#refreshBtn").show();    

  }

}

function logInAndOut() {
  //  if (!isLogin) {
  //    $("#password").val("");
  //    $("#loginDiv").show();
  //  } else {
  //    firebase.auth().signOut();
  console.log(isLogin);
  if (!isLogin) {
    window.location.href = '0-login.html';
  } else {
    firebase.auth().signOut();
  }
}

//function signIn() {
//  //check email
//  if (!validateEmail($("#emailAddress").val())) {
//    $("#emailAddress").val("");
//    $("#emailAddress").attr("placeholder", "Email Address Error, try again!");
//    $("#emailAddress").css("background-color", "yellow");
//  } else {
//    $("#loginDiv").hide();
//    firebase.auth().signInWithEmailAndPassword($("#emailAddress").val(), $("#password").val()).catch(function (error) {
//      // Handle Errors here.
//      var errorCode = error.code;
//      var errorMessage = error.message;
//      alert("Login Error! Try again!")
//    });
//  }
//
//}

//function validateEmail(email) {
//  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//
//  return re.test(String(email).toLowerCase());
//}
//
//
//function signInAbort() {
//  $("#loginDiv").hide();
//}

function addNewCoach() {
  console.log("Query and Check coach");

  var coachs = $('#coachList').DataTable();
  coachs.clear().draw();
  coachs.rows.add(coachSet);
  coachs.draw();

  $("#addCourse").hide();
  $("#coachTable").show();
  $("#coachList_paginate").css({
    "font-size": "16px"
  });

}

function backToAddCourse() {
  console.log("Back to AddCourse");

  $("#addCourse").show();
  $("#coachTable").hide();
  $("#newCoachInfo").hide();
}

function goToAddCoach() {
  console.log("goto add new coach");

  $("#coachTable").hide();
  $("#newCoachInfo").show();
}

function addCoachInfo() {
  console.log("Add Coach Info");

  if ($("#newCoachName").val() == "") {
    alert("老師姓名不能為空白");
    return 0;
  }

  var dataToAdd = [
    $("#newCoachName").val(),
    $("#newCoachGender").val(),
    $("#newCoachOthers").val(),
  ];

  // 更新 local courseData
  coachSet.push(dataToAdd);

  // update database  
  database.ref('users/三峽運動中心/教練管理').set({
    老師資料: JSON.stringify(coachSet),
  }, function (error) {
    if (error) {
      //console.log(error);
      return 0;
    }
    console.log('Write to database successful');
  });

  // update the form
  $("#coachName").val($("#newCoachName").val());

  backToAddCourse();
}

function memberManage() {
  console.log("客戶管理");

  if (!isLogin) {
    alert("必須登入後才能進行客戶管理");
    return 0;
  }

  window.location.href = '1-addMember.html';

  //  $("#memberDiv").show();
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add();
  //  memberTable.draw();
}

function closeMember() {
  console.log("關閉客戶管理");

  $("#memberDiv").hide();
}

function addMember() {
  console.log("新增客戶");

  $("#memberDiv").hide();
  $("#addMemberInfo").show();
}

function closeAddMember() {
  console.log("close addMemberInfo");
  $("#addMemberInfo").hide();
  $("#memberDiv").show();
}

function addMemberInfo() {
  console.log("確定新增會員");

  if (!isLogin) {
    alert("必須登入後才能進行新增客戶");
    return 0;
  }

  var dataToAdd = [
            $("#newMemberName").val(),
            $("#newMemberLINEId").val(),
            $("#newMemberGender").val(),
            $("#newMemberBirth").val(),
            $("#newMemberPhoneNum").val(),
            $("#newMemberIdNum").val(),
            $("#newMemberAssress").val(),
          ];

  //console.log(dataToAdd);

  //  取回 完整的 LINE Id
//  memberData.forEach(function(member, index, array){
//    member[1]=memberLineId[index];
//  });
  
  // 更新 local courseData
  memberData.push(dataToAdd);


  // 課程寫入資料庫
  database.ref('users/三峽運動中心/客戶管理').set({
    會員資料: JSON.stringify(),
  }, function (error) {
    if (error) {
      console.log("Write to database error");
      courseData.pop();
    }
    console.log('Write to database successful');
  });


  // 更新課程表格  
  //  var memberTable = $('#memberTable').DataTable();
  //  memberTable.clear().draw();
  //  memberTable.rows.add();
  //  memberTable.draw();  
  //  
  //  $("#addMemberInfo").hide();
  //  $("#memberDiv").show(); 

}

//function 檢查課程是否滿員(課程編號){
//  var 已滿員 = false;
//  courseData.forEach(function(course, index, array){
//    if (course[0]==課程編號) {
//      var 已報名人數 = parseInt(course[7]); //已報名人數
//      var 上限人數   = parseInt(course[6]); //上限人數
//      //測試用: 上限人數 = 2;
//      if (已報名人數 >= 上限人數) {
//        //alert(修改資料+"已滿員");
//        已滿員 = true;
//        return; // 只跳出迴圈
//      }
//    }        
//  });   
//
//  if (已滿員) {
//    return "已滿員";      
//  } else {
//    return 0;
//  }
//}

function 更新課程報名繳費人數(課程編號, 修改資料, 修改數量){
  var dataIndex;
  switch (修改資料) {
    case "報名人數":
     dataIndex = 7;
     break;
    case "繳費人數":
     dataIndex = 8;
     break;
    default:
     console.log("修改資料不對");
     return 1;
  }

  courseData.forEach(function(course, index, array){
    if (course[0]==課程編號) {
      course[dataIndex] = (parseInt(course[dataIndex])+修改數量).toString(); //報名或繳費人數 加 修改數量
    }        
  });   

  database.ref('users/三峽運動中心/團課課程').set({
    現在課程: JSON.stringify(courseData),
    過去課程: JSON.stringify(courseHistory),
  }, function(error){
       if (error) {
         //console.log(error);
         return 0;
       }
         console.log('Write to database successful');
  });     
}

// functions for Cloudinary
function readURL(input) {
  console.log("readURL");
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      console.log("aaa");
      $('#上傳課程圖片')
        .attr('src', e.target.result)
        .width(520)
        //.height(200);
      
      $("#上傳訊息").text("圖片尚未上傳");
      securePicUrl ="";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function readURL_detail(input) {
  console.log("readURL_detail");
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      console.log("bbb");
      $('#課程圖片')
        .attr('src', e.target.result)
        .width(520)
        //.height(200);
      
      $("#上傳訊息-詳細").text("圖片尚未上傳");
      securePicUrl ="";
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function onProgress(){
  console.log(event.loaded, event.total);
} 

function onSuccess(){
  response = JSON.parse(this.responseText);
  
  securePicUrl = response.secure_url;
  
  if ( securePicUrl != undefined) {
    console.log("Success", securePicUrl);
    if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳成功");
    if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳成功");
  } else {
    alert("圖片上傳失敗");
    if ($("#上傳訊息").text() == "圖片上傳中 ...") $("#上傳訊息").text("圖片上傳失敗");
    if ($("#上傳訊息-詳細").text() == "圖片上傳中 ...") $("#上傳訊息-詳細").text("圖片上傳失敗");    
  }
}    
    
function uploadToCloudinary() {
  console.log("upload file to Cloudinary");
  
  var 需要上傳 = ($("#上傳訊息").text() == "圖片尚未上傳" );

  if ( !需要上傳 ){
    alert("圖片尚未選擇或圖片已上傳");
    return 0;
  }
  
  $("#上傳訊息").text("圖片上傳中 ...");
  
  var formElement =document.getElementById('picUpload')
  var dataToSend = new FormData(formElement)
  dataToSend.append("upload_preset", presetName);
  //console.log(dataToSend.getAll("upload_preset"));
  
  var xhr = new XMLHttpRequest();
  xhr.onprogress = onProgress;
  xhr.onload = onSuccess;
  xhr.open("post", cloudinaryPostUrl);
  console.log(dataToSend)
  xhr.send(dataToSend);
  
}

function updateToCloudinary() {
  console.log("update file to Cloudinary");
  
  var 需要上傳 = ($("#上傳訊息-詳細").text() == "圖片尚未上傳" );

  if ( !需要上傳 ){
    alert("圖片尚未選擇或圖片已上傳");
    return 0;
  }
  
  $("#上傳訊息-詳細").text("圖片上傳中 ...");
  
  var formElement =document.getElementById('picUpdate')
  var dataToSend = new FormData(formElement)
  dataToSend.append("upload_preset", presetName);
  //console.log(dataToSend.getAll("upload_preset"));
  
  var xhr = new XMLHttpRequest();
  xhr.onprogress = onProgress;
  xhr.onload = onSuccess;
  xhr.open("post", cloudinaryPostUrl);
  xhr.send(dataToSend);  
}