/**
 * Created by jinfang on 12/16/15.
 */
function check(){
    var str="";
    $('#happy input:checkbox').each(function () {
        var sThisVal = (this.checked ? $(this).next('label').text() : "");
        str+=sThisVal;
    });

    alert(str);
}


function addTag(){
    $('#add_resume_modal').modal('show');
}


function displayResult()
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

    textarea.setAttribute('rows', '2');
    textarea.setAttribute('cols', '70');
    var placeholder = 'Jin Fang:@Username:';
    textarea.value = placeholder;
    //textarea.setAttribute('placeholder',placeholder);

    td.appendChild(textarea);
    row.appendChild(td);
    var data = $('textarea').val();
    $('textarea').focus().val('').val(data);

}