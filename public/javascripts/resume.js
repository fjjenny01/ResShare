/**
 * Created by jinfang on 12/19/15.
 */
var url = "";

$( document ).ready(function() {

    //load resume list
    localStorage.setItem("ResToken", "qwertyuiop");
    var url = "";
    $.ajax({
        url: "/resume/e9df4ce4-5f92-46ac-88cc-24f20c7df74e/data",
        type: "GET",
        data: {"access_token": localStorage.getItem("ResToken")},
        dataType: "json",
        success: function (data) {
            console.log(data);
            url = data["url"];
        }
    });

    console.log(url);

    initialize();

});


function initialize(){
    var preview  = document.getElementById("organigram-iFrame");

    var src = "http://docs.google.com/gview?"+"url="+ url+ "&embedded=true";
    console.log(url);
    preview.setAttribute('src',url);

}
