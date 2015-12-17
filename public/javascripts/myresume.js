var hasChosen = false;
var hasSelected = false;
var tags = [];
function addResume(){
  alert("on change");
  var input = document.getElementById("add_btn");
  if (input.files[0].name!=null){

    //show modal
    $('#add_resume_modal').modal('show');
    hasChosen=true;
  }

}

  function uploadResume() {
    if (hasChosen) {

      AWS.config.update({
        accessKeyId: 'AKIAIKE66OTMJJFT5X7A',
        secretAccessKey: '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'
      });
      AWS.config.region = 'us-east-1';
      var bucket = new AWS.S3({params: {Bucket: 'czcbucket'}});


      console.log(bucket);
      //upload to AWS S3
      var input = document.getElementById("add_btn");
      var uuid = generateUUID();
      console.log("uuid:");
      console.log(uuid);
      var key = uuid+".pdf";
      var fileName = input.files[0].name;
      var params = {Key: key, Body: input.files[0]};
      bucket.upload(params, function (err, data) {
        console.log(err);
        console.log(data);
      });


      //update the UI
      var table = document.getElementById("myresumelistbody");

      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);

      cell1.innerHTML = "1";
      cell2.innerHTML = fileName;


      for (var i = 0, row; row = table.rows[i]; i++) {
        row.cells[0].innerHTML = i + 1 + "";
      }

      alert(table.length)
    }

    else {
      alert("please choose a resume to upload");
    }


  }


//function disable() {
//  alert("dddd");
//  return false;
//}

//document.getElementById("organigram-iFrame").onmousedown = disable();

  function deleteResume(id) {
    if (hasSelected) {
      alert("delete resume to do!");
    }

    else {
      alert("Please select a resume to delete");
    }

    //var updateBtn = document.getElementById("delete_resume");


  }

  function selectResume() {
    //alert(id + "");
    //this.class = selectedRow;


    alert("call select")
    var updateBtn = document.getElementById("delete_resume");
    var deleteBtn = document.getElementById("update_resume");
    if (!deleteBtn.isDisabled) {
      alert("!dis");
      deleteBtn.disabled = false;
    }
    if (!updateBtn.isDisabled) {
      alert("!dis");
      updateBtn.disabled = false;
    }
  }

  function shareResume() {
    $('#share_resume_modal').modal('show');
    //alert("share");

  }

  $('#myresumelist').on('click', 'tbody tr', function () {
    alert("select resume");
    $(this).addClass('highlight').siblings().removeClass('highlight');
  });


  $(".table-striped > tbody >tr").click(function () {
    alert("call");
    var selected = $(this).hasClass("highlight");
    $("tr").removeClass("highlight");
    if (!selected)
      $(this).addClass("highlight");

  });


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
    alert(uuid);
    return uuid;
  }



function saveTags(){
  var str="";
  $('#tag_checkbox input:checkbox').each(function () {
    var sThisVal = (this.checked ? $(this).next('label').text() : "");
    str+=sThisVal;
    tags.push(sThisVal);
  });

  alert(tags.toString());
  $('#add_resume_modal').modal('hide');
}


function displayReply()
{
  alert("display");
  var table=document.getElementById("commentListBody");
  var row = table.insertRow(-1);


  var td = document.createElement('td');
  var img = document.createElement("IMG");
  img.setAttribute('src', '/images/default_profile.jpg');
  img.setAttribute('class', 'img-circle');
  img.setAttribute('alt', 'Cinque Terre');
  img.setAttribute('width','30');
  img.setAttribute('height','25');
  td.appendChild(img);
  row.appendChild(td);
  var td = document.createElement('td');

  //td.setAttribute('colspan', '4');
  td.setAttribute('text-align','left');
  var textarea = document.createElement('textarea');
  textarea.setAttribute('class','noscroll');
  //textarea.setAttribute('rows', '1');
  textarea.setAttribute('cols', '70');
  var placeholder = 'Jin Fang:@Username:';
  textarea.value = placeholder;
  //textarea.setAttribute('placeholder',placeholder);

  td.appendChild(textarea);
  row.appendChild(td);
  var data = $('textarea.noscroll').val();
  $('textarea.noscroll').focus().val('').val(data);


  //var ta = document.querySelector('textarea');

  //autosize(textarea);
  //var evt = document.createEvent('Event');
  //evt.initEvent('autosize:update', true, false);
  //ta.dispatchEvent(evt);


  //autosize($('textarea'));
  //$('textarea.comment').autogrow();

}





$( document ).ready(function() {

  // auto adjust the height of
  $('textarea.noscroll').delegate( 'textarea', 'keyup', function (){
    $(this).height( 0 );
    $(this).height( this.scrollHeight );
  });
  $('textarea.noscroll').find( 'textarea' ).keyup();

});