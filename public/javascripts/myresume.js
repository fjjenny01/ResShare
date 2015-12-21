var hasChosen = false;  //if user has chosen the file to upload
var hasSelected = false;  //if user has selected one of the resume in the list
var tags = [];  //the tags of the selected resume
var resumelist=  []; //the resume list of the current user
var selected = -1; //the index of the selected resume

$( document ).ready(function() {
  //load resume list
  localStorage.setItem("ResToken", "qwertyuiop");
  $.ajax({
    url: "/user/resume/data",
    type: "GET",
    data: {"access_token": localStorage.getItem("ResToken")},
    dataType: "json",
    success: function (data) {
      console.log(data);
      for (var i=0;i<data.length;i++){
        resumelist.push(data[i]["resumename"]);
        resumelist.push(data[i]["rid"]);
        resumelist.push(data[i]["url"]);
        resumelist.push(data[i]["status"]);
      }

      initializeResumeList();
    }
  });

  //load the profile pic of current user
  $.ajax({
    url: "/user/data",
    type: "GET",
    async: false,
    data: {"access_token": localStorage.getItem("ResToken")},
    dataType: "json",
    success: function (data) {
      user_data = data["user"];
      console.log(user_data);
      loadProfile(user_data);
    }
  });


});


function initializeResumeList(){

  //update the UI
  var table = document.getElementById("myresumelistbody");
  while(table.rows.length > 0) {
    table.deleteRow(0);
  }
  console.log("resumelist");
  //console.log(resumelist.length);
  for (var i=0;i<resumelist.length;i++){
    if (i%4==0){
      var real_i = i/4;
      var row = table.insertRow(-1);
      row.onclick = selectResume();
      row.setAttribute('id',real_i+1+"");
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);

      cell1.innerHTML = real_i + 1 + "";
      cell2.innerHTML = resumelist[i];

    }


  }

}

//add resume to be upload
function addResume(){
  var input = document.getElementById("add_btn");
  if (input.files[0].name!=null){

    //show modal
    $('#add_resume_modal').modal('show');
    hasChosen=true;
  }

}

  //commit upload
  function uploadResume() {
    if (hasChosen) {

      AWS.config.update({
        accessKeyId: 'AKIAIKE66OTMJJFT5X7A',
        secretAccessKey: '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'
      });
      AWS.config.region = 'us-east-1';
      var bucket = new AWS.S3({params: {Bucket: 'czcbucket', ACL: 'public-read'}});


      //console.log(bucket);
      //upload to AWS S3
      var input = document.getElementById("add_btn");
      var uuid = generateUUID();
      //console.log("uuid:");
      //console.log(uuid);
      var key = uuid+".pdf";
      var fileName = input.files[0].name;
      var url = "";
      var params = {Key: key, Body: input.files[0]};

      bucket.upload(params, function (err, data) {
        //console.log(data);
        //url = data.Location;
        url = "https://s3.amazonaws.com/czcbucket/"+uuid+".pdf";
        //console.log(url);
        console.log(tags);

        $.ajax({
          url: "/user/resume/upload",
          type: "POST",
          data: {"access_token": localStorage.getItem("ResToken"), "rid":uuid,"resumename":fileName, "url": url,"tag":JSON.stringify(tags)},
          dataType: "json",
          success: function (data) {

          }
        });

        tags = [];
        uncheckTags();
        //console.log("BBBBBBBBBB");
        resumelist.push(fileName);
        resumelist.push(uuid);
        resumelist.push(url);

        initializeResumeList();

      });

    }

    else {
      alert("please choose a resume to upload");
    }

    hasChosen = false;

  }



  //delete the resume from database
  function deleteResume() {
    if (hasSelected && selected>-1) {

      var rid  =  resumelist[selected * 4 +1];
      var status = resumelist[selected * 4 +3];

      $.ajax({
        url: "/user/resume/delete",
        type: "POST",
        data: {"access_token": localStorage.getItem("ResToken"), "rid":rid, "status":status},
        dataType: "json",
        success: function (data) {

        }
      });

      resumelist.splice(selected*4,4);

      initializeResumeList();

      //set the iframe to something unaccessible
      var preview = document.getElementById("organigram-iFrame");
      var url = resumelist[selected*4+2];
      var src = "http://docs.google.com/gview?url=https://s3.amazonaws.com/resumefiles/resume_JINFANG.pdf&embedded=true";
      preview.setAttribute('src',src);

    }

    else {
      alert("Please select a resume to delete");
    }

  }

  //when user click on the certain row of the table of the resume list
  function selectResume() {
      /* Get all rows from your 'table' but not the first one
       * that includes headers. */
      var rows = $('tr');

      /* Create 'click' event handler for rows */
      rows.on('click', function(e) {

        /* Get current row */
        var row = $(this);

        /* Check if 'Ctrl', 'cmd' or 'Shift' keyboard key was pressed
         * 'Ctrl' => is represented by 'e.ctrlKey' or 'e.metaKey'
         * 'Shift' => is represented by 'e.shiftKey' */
        if ((e.ctrlKey || e.metaKey) || e.shiftKey) {
          /* If pressed highlight the other row that was clicked */
          row.addClass('highlight');
        } else {
          /* Otherwise just highlight one row and clean others */
          rows.removeClass('highlight');
          row.addClass('highlight');
        }

        console.log(row["context"]);
        var row_id = row["context"].getAttributeNode("id").value;
        console.log('row_id');
        console.log(row_id);

        selected =row_id-1;
        hasSelected=true;

        //update the iframe
        var preview = document.getElementById("organigram-iFrame");
        var url = resumelist[selected*4+2];
        console.log("url");
        console.log(url);
        var src = "http://docs.google.com/gview?"+"url="+ url+ "&embedded=true";
        //console.log(src);
        preview.setAttribute('src',src);


      });

      /* This 'event' is used just to avoid that the table text
       * gets selected (just for styling).
       * For example, when pressing 'Shift' keyboard key and clicking
       * (without this 'event') the text of the 'table' will be selected.
       * You can remove it if you want, I just tested this in
       * Chrome v30.0.1599.69 */
      $(document).bind('selectstart dragstart', function(e) {
        e.preventDefault(); return false;
      });


  }

  //show the tag modal to user before commit share
  function shareResume() {
    if (hasSelected && selected > -1){
      $('#share_resume_modal').modal('show');
      var fileName = document.getElementById("fileName");
      fileName.innerHTML = resumelist[selected*4];
    }


  }

//commit share
function commitShare(){

  var fileName = document.getElementById("fileName");
  var rid = resumelist[selected *4 + 1];
  fileName.innerHTML = resumelist[selected*4];
  console.log(fileName.innerHTML);
  var subjectText = document.getElementById("subject").value;
  console.log(subjectText);
  var contentText = document.getElementById("content").value;

  console.log(contentText);
  if (subjectText!="" && contentText!=""){

    $.ajax({
      url: "/user/resume/share",
      type: "POST",
      data: {"access_token": localStorage.getItem("ResToken"), "rid":rid,"subject":subjectText, "content": contentText},
      dataType: "json",
      success: function (data) {

      }
    });

    $('#share_resume_modal').modal('hide');
    fileName.innerHTML = "";
    document.getElementById("subject").value = "";
    document.getElementById("content").value = "";

  }

}

//save the tags of current selected resume
function saveTags(){
  $('#tag_checkbox input:checkbox').each(function () {
    var sThisVal = (this.checked ? $(this).next('label').text() : "");
    if (sThisVal!=""){
      tags.push(sThisVal);
    }

  });

  $('#add_resume_modal').modal('hide');
}

function uncheckTags(){
  $('#tag_checkbox input:checkbox').each(function () {
    if (this.checked){
      this.checked = false;
    }

  });

}

  //create uuid for resume name
  function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
      ; //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }


//load profile picture of the current user
function loadProfile(user_data){
  var prof_tb = document.getElementById("user_prof_pic");
  prof_tb.src = user_data["avatar"]["url"];
  console.log(prof_tb.src);

}
