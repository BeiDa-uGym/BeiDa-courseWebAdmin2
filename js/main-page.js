function initMainPage() {
  $("#loginDiv").hide();
  $("#addCourse").hide();
  $("#coachTable").hide();
//  $("#courseDetail").hide();
  $("#newCoachInfo").hide();
  $("#memberDiv").hide();
  $("#addMemberInfo").hide();

  //  var memberTable = $('#memberTable').DataTable({
  //    data: ,
  //    pageLength: 10,
  //    lengthChange: false,
  //    deferRender: true,
  //    columns: [{ //title: 姓名
  //        className: "centerCell"
  //              },
  //      {
  //        //title: LINE ID
  //        className: "centerCell"
  //              },
  //      { //title: "姓別"
  //        className: "centerCell"
  //              },
  //      {
  //        //title: "年紀"
  //        className: "centerCell"
  //              },
  //      {
  //        //title: "電話"
  //        className: "centerCell"
  //              },
  //      {
  //        //title: "身分字號"
  //        className: "centerCell"
  //              },              
  //      {
  //        //title: "地址", 不對中，對左
  //      
  //              },
  ////      {
  ////        //title: "操作",
  ////        data: null,
  ////        defaultContent: "<button class = 'dueButton to-edit'>到期</button> " +
  ////          "<button class = 'detailButton to-edit'>詳細</button> " +
  ////          "<button class = 'deleteButton to-delete'>刪除</button>"
  ////              }
  //            ]
  //  });  

  var courseTable = $('#courseTable').DataTable({
    order: [[ 0, "desc" ]],
    data: courseData,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "課程編號"
        className: "centerCell"
              },
      {
        //title: "課程名稱", 不對中，對左
              },
      { //title: "老師"
        className: "centerCell"
              },
      {
        //title: "時間"
        className: "centerCell"
              },
      {
        //title: "卡路里燃燒"
        className: "centerCell"
              },
      {
        //title: "課程費用"
        className: "centerCell"
              },               
      {
        //title: "課程人數"
        className: "centerCell"
              },
      {
        //title: "報名人數"
        className: "centerCell"
              },
      {
        //title: "繳費人數"
        className: "centerCell"
              },              
      {
        //title: "操作",
        data: null,
        defaultContent: "<button id='courseDueBtn' class = 'dueButton to-edit'>到期</button> " +
          "<button id='courseDetailBtn' class = 'detailButton to-edit'>詳細</button> " +
          "<button id='courseDeleteBtn' class = 'deleteButton to-delete'>刪除</button>"
              }
            ]
  });

  $('#courseTable tbody').on('click', '.dueButton', function () {
    console.log("Due is clicked");

    if (!isLogin) {
      alert("必須登入後才能修改");
      return 0;
    }

    var dueIt = false;
    dueIt = confirm("確定要課程過期!無法回復!");

    if (dueIt) {
      var data = courseTable.row($(this).parents('tr')).data();
      console.log("delete:" + data[0]);

      courseHistory.push(data);

      courseData = courseData.filter(function (value, index, arr) {
        return value[0] != data[0];
      });

      // 更新 courseNum
      if (courseData.length>0) {
        var tmp1 = courseData[courseData.length - 1][0];
        var tmp2 = parseInt(tmp1.substr(1, 4));
      } else tmp2 = 0;

      if (courseHistory.length>0) {    
        var tmp3 = courseHistory[courseHistory.length - 1][0];
        var tmp4 = parseInt(tmp3.substr(1, 4));  
      } else tmp4 = 0;

      courseNum = (tmp4 > tmp2)? tmp4:tmp2;

      // 更新 database
      database.ref('users/三峽運動中心/團課課程').set({
        現在課程: JSON.stringify(courseData),
        過去課程: JSON.stringify(courseHistory),
      }, function (error) {
        if (error) {
          //console.log(error);
          return 0;
        }
        console.log('Write to database successful');
      });

      courseTable.clear().draw();
      courseTable.rows.add(courseData);
      courseTable.draw();

      courseHistoryTable.clear().draw();
      courseHistoryTable.rows.add(courseHistory);
      courseHistoryTable.draw();
    }

  });

  $('#courseTable tbody').on('click', '.detailButton', function () {
    console.log("Detail is clicked");
    
    if (!isLogin) {
      alert("必須登入後才能查看");
      return 0;
    }    
    
    courseMemberSet=[];

    $("#courseTable").hide();
    $("#courseHistoryTable").hide();
    $("#spacerBetweenTables").hide();

    //$(".dataTables_filter").hide();
    //$(".dataTables_info").hide();
    $('#courseTable_filter').hide();
    $('#courseTable_info').hide();
    $('#courseTable_paginate').hide();
    $('#courseHistoryTable_filter').hide();
    $('#courseHistoryTable_info').hide();
    $('#courseHistoryTable_paginate').hide();
    $("#addCourse").hide();
    $("#inProgress").hide();
    $("#addCourseBtn").hide();
    $("#refreshBtn").hide();

    $("#courseMemberTable_filter").css({
      "font-size": "16px"
    });
    $("#courseMemberTable_info").css({
      "font-size": "16px"
    });
    $("#courseMemberTable_paginate").css({
      "font-size": "16px"
    });

    var data = courseTable.row($(this).parents('tr')).data();
    //console.log("detail:" + data[0]);

    $("#courseNumberDetail").text("簽到頁面 - " + data[0] + " "+ data[1] + " @" + data[3]);
    
    courseForDetail = data[0];
    
    var dateAndTimeArray = data[3].split(" ");
    var dateArray = dateAndTimeArray[0].split("-");
    if (dateArray[1].length==1) dateArray[1]= "0"+dateArray[1];
    if (dateArray[2].length==1) dateArray[2]= "0"+dateArray[2];
    var dateStr = dateArray[0]+ "-" + dateArray[1] + "-" + dateArray[2];
    
    [startTimeStr, endTimeStr] = dateAndTimeArray[1].split("~");
    console.log(startTimeStr, endTimeStr);
    
    $("#courseNameDetail").val(data[1]);
    $("#coachNameDetail").val(data[2]);
    $("#assistNameDetail").val(data[9]);
    $("#courseDateDetail").val(dateStr);     
    $("#courseStartTimeDetail").val(startTimeStr);
    $("#courseEndTimeDetail").val(endTimeStr);   
    $("#CaloriesDetail").val(data[4]);
    $("#maxPersonsDetail").val(data[6]);
    $("#feeDetail").val(data[5]);
    $("#otherDescDetail").val(data[10]);
    
    $("#課程圖片")
      .attr('src', data[11])
      .width(620)
      //.height(200);

    courseMember.forEach(function (item, index, array) {
      if (item[0] == data[0]) {
        item.shift();

        var tmp1 = [];
        item.forEach(function (item1, index, array) {
          memberData.forEach(function (item2, index, array) {
            //console.log(item1[3],item2[1]);
            if (item1[3] == item2[6]) {
              tmp1 = item2;
            };
          });        

          // 準備 coureMemberSet 
          var dataToAdd = tmp1.slice(0, 1);  //姓名        
          // 隱藏個資 dataToAdd.push(tmp1.slice(3, 4));  //電話
          // 隱藏個資 dataToAdd.push(tmp1.slice(5, 6));  //地址        

          dataToAdd.push(item1[1], item1[2]); //繳費狀態及簽到狀態

          courseMemberSet.push(dataToAdd);
        });

        item.unshift(data[0]);
      }
    });

    courseMemberTable.clear().draw();
    courseMemberTable.rows.add(courseMemberSet);
    courseMemberTable.draw();

    $("#courseDetail").show();

  });

  $("#courseTable tbody").on('click', '.deleteButton', function () {
    // delete button
    console.log("delete:");
    if (!isLogin) {
      alert("必須登入後才能刪除");
      return 0;
    }
    var data = courseTable.row($(this).parents('tr')).data();

    var deleteIt = false;
    deleteIt = confirm("確定要刪除此課程!無法回復!");

    if (deleteIt) {
      //console.log("dddd");
      courseData = courseData.filter(function (value, index, arr) {
        return value[0] != data[0];
      });

      // 更新 courseNum
      if (courseData.length>0) {
        var tmp1 = courseData[courseData.length - 1][0];
        var tmp2 = parseInt(tmp1.substr(1, 4));
      } else tmp2 = 0;

      if (courseHistory.length>0) {    
        var tmp3 = courseHistory[courseHistory.length - 1][0];
        var tmp4 = parseInt(tmp3.substr(1, 4));  
      } else tmp4 = 0;

      courseNum = (tmp4 > tmp2)? tmp4:tmp2;

      // 更新 database
      database.ref('users/三峽運動中心/團課課程').set({
        現在課程: JSON.stringify(courseData),
        過去課程: JSON.stringify(courseHistory),
      }, function (error) {
        if (error) {
          //console.log(error);
          return 0;
        }
        console.log('Write to database successful');
      });

      courseMember = courseMember.filter(function (value, index, arr) {
        return value[0] != data[0];
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

      console.log(deleteIt);
      console.log(courseData);
      courseTable.clear().draw();
      courseTable.rows.add(courseData);
      courseTable.draw();
    }
  });

  var courseHistoryTable = $('#courseHistoryTable').DataTable({
    order: [[ 0, "desc" ]],
    data: courseHistory,
    pageLength: 8,
    deferRender: true,
    lengthChange: false,
    columns: [{ //title: "課程編號"
        className: "centerCell"
              },
      {
        //title: "課程名稱"
              },
      { //title: "老師"
        className: "centerCell"
              },
      {
        //title: "時間"
        className: "centerCell"
              },
      {
        //title: "卡路里燃燒"
        className: "centerCell"
              },
      {
        //title: "課程費用"
        className: "centerCell"
              },              
      {
        //title: "課程人數"
        className: "centerCell"
              },
      {
        //title: "報名人數"
        className: "centerCell"
              },
      {
        //title: "繳費人數"
        className: "centerCell"
              }, 
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class='copyButton to-edit' style='width: 150px'>複製新增課程</button>" 
              }              

            ]
  });
  
  $('#courseHistoryTable tbody').on('click', '.copyButton', function () {
    console.log("Copy course");
    
    var data = courseHistoryTable.row($(this).parents('tr')).data();     

    //console.log(data);
    $("#courseName").val(data[1]);
    $("#coachName").val(data[2]);
    var dateStr = data[3].split(" ");
    //console.log(dateStr[0]);
    $("#courseDate").val(dateStr[0]);
    $("#courseTime").val(dateStr[1]);
    $("#Calories").val(data[4]);
    $("#maxPersons").val(data[6]);
    $("#assistName").val("");
    $("#fee").val(data[5]);
    $("#otherDesc").val(""); 

    
    addCourse();
      
  });

  var courseMemberTable = $('#courseMemberTable').DataTable({
    data: courseMemberSet,
    pageLength: 8,
    lengthChange: false,
    deferRender: true,
    columns: [{ //title: "Name"
        //className: "centerCell"
              },
//      {
//        //title: "LINE ID"
//        className: "centerCell"
//              },
//      { //title: "電話"
//        className: "centerCell"
//              },
//      {
//        //title: "身分證號"
//        className: "centerCell"
//              },
//      {
//        //title: "地址"
//        className: "centerCell"
//              },
      {
        //title: "繳費"
        className: "centerCell"
              },
      {
        //title: "簽到"
        className: "centerCell"
              },
      {
        //title: "操作",
        className: "centerCell",
        data: null,
        defaultContent: "<button class = 'payButton to-edit'>繳費</button> " +
          "<button class = 'checkInButton to-edit'>簽到</button> " +
          "<button class = 'resetButton to-edit'>重置</button> " 
              }
            ]
  });
  $("#courseDetail").hide();
  $('#courseMemberTable tbody').on('click', '.payButton', function () {
    var confirmIt = confirm("請確定要繳費!");
    if (!confirmIt) return 0;
    
    console.log("payButton is clicked");

    //var data = courseMemberTable.row($(this)).data();
    var data = courseMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[1]); // 繳費狀況
    
    var thisCourse;
    var thisIndex;
    courseMember.forEach(function(item, index, array) {
      if (item[0]== courseForDetail) {
        thisCourse = item;
        thisIndex = index;
      }
    });
    
    var thisCourseLength = thisCourse.length;
    var thisI;
    for (var i = 0; i < thisCourseLength; i++) {
      //console.log(i, thisCourse[i][0], data[0])
      if (thisCourse[i][0] == data[0]) { //比對名字
        //console.log(thisCourse[i], thisIndex, i);
        thisI = i;
      };
    }   
 
    //console.log(thisCourse, thisIndex, thisI, data[1]);
    
    console.log(courseMember[thisIndex][thisI][0],courseMember[thisIndex][thisI][1]);
    courseMember[thisIndex][thisI][1] = "已繳費";
    
    //更新 courseData 中課程的繳費人數 加 1
    更新課程報名繳費人數(thisCourse[0], "繳費人數", 1);
          
    // Update courseMemberSet 及其 Table  
    for (var i=0; i< courseMemberSet.length; i++){
      //console.log(courseMemberSet[i][0], data[0]);
      if (courseMemberSet[i][0] == data[0]) {
        //console.log("match");
        courseMemberSet[i][1] = "已繳費";
      };
    };
    
    var table = $('#courseMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(courseMemberSet);
    table.draw();    
    
    // Write courseMember to database
    database.ref('users/三峽運動中心/課程管理').set({
      課程會員: JSON.stringify(courseMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    }); 
    
  });

  $('#courseMemberTable tbody').on('click', '.checkInButton', function () {
    var confirmIt = confirm("請確定已簽到!");
    if (!confirmIt) return 0;    
    console.log("checkInButton is clicked");

    //var data = courseMemberTable.row($(this)).data();
    var data = courseMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    courseMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== courseForDetail) {
        //console.log(item, data[0]);
        thisCourse = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCourseLength = thisCourse.length;
    var thisI;
    for (var i = 0; i < thisCourseLength; i++) {
      if (thisCourse[i][0] == data[0]) {
        //console.log(thisCourse[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    //console.log(courseMember[thisIndex][thisI][2]);
    courseMember[thisIndex][thisI][2] = "已簽到";

    // Update courseMemberSet 及其 Table
    for (var i=0; i< courseMemberSet.length; i++){
      //console.log(courseMemberSet[i][0], data[0]);
      if (courseMemberSet[i][0] == data[0]) {
        //console.log("match");
        courseMemberSet[i][2] = "已簽到";
      };
    };
    
    var table = $('#courseMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(courseMemberSet);
    table.draw();  
    
    // Write courseMember to database
    database.ref('users/三峽運動中心/課程管理').set({
      課程會員: JSON.stringify(courseMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });  

  $('#courseMemberTable tbody').on('click', '.resetButton', function () {
    var confirmIt = confirm("請確定要重置!");
    if (!confirmIt) return 0;
    
    console.log("resetButton is clicked");

    //var data = courseMemberTable.row($(this)).data();
    var data = courseMemberTable.row($(this).parents('tr')).data();    
    //console.log(data[0]);
    
    var thisCourse;
    var thisIndex;
    courseMember.forEach(function(item, index, array) {
      //console.log(item[1][0]);
      if (item[0]== courseForDetail) {
        //console.log(item, data[0]);
        thisCourse = item;
        thisIndex = index;
      }
    });
      
    //console.log(thisCourse, thisIndex, data[0]);
      
    var thisCourseLength = thisCourse.length;
    var thisI;
    for (var i = 0; i < thisCourseLength; i++) {
      if (thisCourse[i][0] == data[0]) {
        //console.log(thisCourse[i], thisIndex, i);
        thisI = i;
      };
    }   
    
    //console.log(courseMember[thisIndex][thisI][0],courseMember[thisIndex][thisI][1]);
    courseMember[thisIndex][thisI][1] = "未繳費";
    courseMember[thisIndex][thisI][2] = "未簽到";

    // Update courseMemberSet 及其 Table  
    for (var i=0; i< courseMemberSet.length; i++){
      //console.log(courseMemberSet[i][0], data[0]);
      if (courseMemberSet[i][1] == data[1]) {
        //console.log("match");
        courseMemberSet[i][1] = "未繳費";
        courseMemberSet[i][2] = "未簽到";
      };
    };
    
    var table = $('#courseMemberTable').DataTable();
    table.clear().draw();
    table.rows.add(courseMemberSet);
    table.draw();    
    
    // 課程繳費人數 減 1
    courseData.forEach(function(course, index, array){
      if (course[0]==courseForDetail) {
        course[8] = (parseInt(course[8])-1).toString(); //已報名人數 減 1
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

    
    // Write courseMember to database
    database.ref('users/三峽運動中心/課程管理').set({
      課程會員: JSON.stringify(courseMember),
    }, function (error) {
      if (error) {
        //console.log(error);
        return 0;
      }
      console.log('Write to database successful');
    });
    
  });
  
}



var coachList = $('#coachList').DataTable({
  data: coachSet,
  //ordering: false,
  pageLength: 14,
  lengthChange: false,
  deferRender: true,
  columns: [
    { //title: "老師姓名"
      className: "centerCell"
    },
    {
      //title: "性別"
      className: "centerCell"
    },
    {
      //title: "其他說明"
    }
  ]
});

$('#coachList tbody').on('click', 'tr', function () {
  console.log("coach is clicked");


  var data = coachList.row($(this)).data();
  //console.log(data);
  $("#coachName").val(data[0]);
  $("#addCourse").show();
  $("#coachTable").hide();

});