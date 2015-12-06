

function uploadResume(){

  // post the file to the server
  var input = document.getElementById("add_btn");
  var fReader = new FileReader();
  fReader.readAsDataURL(input.files[0]);
  fReader.onloadend = function(event){
    window.open("data:text/json;charset=utf-8," + escape(event.target.result));

    $.post( "/user/profile/resume/upload", { file:event.target.result });
    //$.post( "/user/profile/resume/upload", { file:event.target.result }, function(data){
    //  alert(data);
    //} );
  }


  //update the UI
  var table = document.getElementById("myresumelistbody");


  var row = table.insertRow(0);


  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);

  cell1.innerHTML = "1";
  cell2.innerHTML = "fileName";


  for (var i = 0, row; row = table.rows[i]; i++) {
    row.cells[0].innerHTML = i+1 + "";
  }

  alert(table.length)



}

function updateTable(){
  var table = document.getElementById("myresumelistbody");
  for (var i = 0, row; row = table.rows[i]; i++) {
     row.cells[j].innerHTML = i+1 + "";
  }

  alert(table.length)


}

//function disable() {
//  alert("dddd");
//  return false;
//}

//document.getElementById("organigram-iFrame").onmousedown = disable();

function deleteResume(id) {

  alert("delete resume to do!");

  var updateBtn = document.getElementById(id);


}

function updateResume(){
  alert("update resume todo!");
}

function selectResume(){
  //alert(id + "");
  //this.class = selectedRow;


  alert("call select")
  var updateBtn = document.getElementById("delete_resume");
  var deleteBtn = document.getElementById("update_resume");
  if (!deleteBtn.isDisabled){
    alert("!dis");
    deleteBtn.disabled = false;
  }
  if (!updateBtn.isDisabled) {
    alert("!dis");
    updateBtn.disabled = false;
  }



  //this.selected = true;




  //$('#myresumelist').on('click', 'tbody tr', function() {
  //  $(this).addClass('highlight').siblings().removeClass('highlight');
  //})




}


$('#myresumelist').on('click', 'tbody tr', function() {
  alert("select resume");
  $(this).addClass('highlight').siblings().removeClass('highlight');
});

//$('.table > tbody > tr').click(function() {
//  // row was clicked
//  alert("select resume");
//  // row was clicked
//});





//$('tr').bind('click', function(){
//  alert("jquery");
//  //window.location = 'http://somelocation.com';
//  // Or, we can grab the HREF from the first anchor:
//  // window.location = $('a:first', this).attr('href');
//});


$(".table-striped > tbody >tr").click(function() {
  alert("call");
  var selected = $(this).hasClass("highlight");
  $("tr").removeClass("highlight");
  if(!selected)
    $(this).addClass("highlight");

});
