function editProfile(){
	document.getElementById("name").innerHTML = document.getElementById("set-name").value+'<img class="img-hover pull-right" src="img/gear39.png" data-toggle="modal" data-target="#myModal">';
	document.getElementById("loc").innerHTML = '<img src="img/pin56.png">'+document.getElementById("set-loc").value;
	document.getElementById("edu").innerHTML = '<img src="img/graduation-cap2.png">'+document.getElementById("set-edu").value;

}