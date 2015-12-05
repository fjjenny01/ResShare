
/*
$.ajax({
url: '/piece.json',
type: "GET",
dataType: "json",
success: function (data) {
    alert(data);
}
});
*/
var map = {"name":"Name", "edu":"Education", "loc":"Location", "int_fields":"Interested Fields", "email":"Email"};
var data = {"Email":"example@columbia.edu", "Name":"Sahu", "Education":"Columbia University", "Location":"NY", "int_fields":{"Software Development":true, "IEOR":true, "Consulting":true, "Education":true}};
var prof_fields = ["email", "name", "loc", "edu", "int_fields"];
var int_fields = ["Software Development", "IEOR", "Consulting", "Education"];
function loadProfile(data){

}
function feedDataModal(){
	var fbd = document.getElementById("profile-form");
	fbd.innerHTML = "";
	for (var i = 0; i < prof_fields.length; ++i){
		var fd = document.createElement("div");
		var lb = document.createElement("label");
		fd.class = "form-group";
		lb.class = "control-label";
		lb.innerText = map[prof_fields[i]];
		fd.appendChild(lb);
		if (prof_fields[i] == "int_fields"){
			for (var i = 0; i < int_fields.length; ++i){
				var cbd = document.createElement("div");
				var cb = document.createElement("input");
				cb.type = "checkbox";
				cbd.appendChild(cb)
				cbd.innerHTML = cbd.innerHTML+" "+int_fields[i]
				fd.appendChild(cbd);
			}
		}
		else{
			var ipt = document.createElement("input");
			ipt.className = "form-control";
			ipt.type = "text";
			ipt.id = "set-"+prof_fields[i];
			if (prof_fields[i] == "email"){
				ipt.disabled = true;
				ipt.placeholder = document.getElementById(prof_fields[i]).innerText;
			}
			else{
				ipt.value = document.getElementById(prof_fields[i]).innerText;
			}
			fd.appendChild(ipt);
		}
		fbd.appendChild(fd);
	}
	//document.getElementById("set-name").value = document.getElementById("name").innerText;

	
}

function editProfile(){
	document.getElementById("name").innerHTML = document.getElementById("set-name").value+'<img class="img-hover pull-right" src="img/gear39.png" data-toggle="modal" data-target="#myModal" onclick="feedDataModal()">';
	document.getElementById("loc").innerHTML = document.getElementById("set-loc").value;
	document.getElementById("edu").innerHTML = document.getElementById("set-edu").value;

	//document.getElementById("show").innerHTML = document.getElementById("upload").value;
/*
var input = document.getElementById("upload");
var fReader = new FileReader();
fReader.readAsDataURL(input.files[0]);
fReader.onloadend = function(event){
$.post( "test.php", { file:event.target.result } );
}
window.open("data:text/json;charset=utf-8," + escape(event.target.result));

document.getElementById("show").innerHTML = event.target.result;
}*/

}

/*
$(function()
    {
        $('#upload').on('change',function ()
        {
            var filePath = $(this).val();
            console.log(filePath);
        });
    });
*/
/*test*/
