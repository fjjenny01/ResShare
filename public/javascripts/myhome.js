/*
AWS.config.update({accessKeyId: 'AKIAIKE66OTMJJFT5X7A', secretAccessKey: '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'});
AWS.config.region = 'us-east-1';
var bucket = new AWS.S3({params: {Bucket: 'czcbucket'}});
console.log(bucket);
bucket.listObjects(function (err, data) {console.log(err); console.log(data)});
*/

var img_dir = "images/"
var map_img = {"email":img_dir+"mail4.png", "company":img_dir+"graduation-cap2.png"}
var map = {"name":"Name", "edu":"Education", "loc":"Location", "int_fields":"Interested Fields", "email":"Email"};

//user_data = {"username":"chaozc", "first name":"Zichen", "lastname":"Chao", "email":"zichen.chao@columbia.edu", "status":1, "company":"Columbia University", "interested_field":["Software Development", "IEOR", "Consulting", "Education"], "avatar":{"url":"../public/images/default_profile.jpg", "aid":""}};
res_list = [{"username":"jingxiao", "link":"www.google.com", "subject":"HelloHello", "content":"Hi, would you please check my resume?? ...........................................Hi, would you please check my resume??Hi, would you please check my resume??Hi, would you please check my resume??Hi, would you please check my resume??","tag":int_fields}]
var prof_fields = ["email", "company"];
//var int_fields = ["Software Development", "IEOR", "Consulting", "Education"];

//localStorage.setItem("ResToken", "qwertyuiop");
console.log(localStorage.getItem("ResToken"));

$.ajax({
	url: "/user/data",
	type: "GET",
	async: false,
	data: {"access_token": localStorage.getItem("ResToken")},
	dataType: "json",
	success: function (data) {
    	//alert(data);
    	user_data = data["user"];
		console.log(user_data);
    	res_list = data["resume"];
		console.log(res_list);
		loadProfile(user_data);
		loadEvents(res_list);
	}
});
//
//$.get ("/user/data", { json: JSON.stringify({"access_token": localStorage.getItem("ResToken")}) }, function (data){
//	user_data = data["user"];
//		console.log(user_data);
//    	res_list = data["resume"];
//		console.log(res_list);
//		loadProfile(user_data);
//		loadEvents(res_list);
//});

function search(){
	var input = document.getElementById("searchInput").value.split(" ").join("+");
	$.ajax({
		url: "/user/search/?kw="+input,
		type: "POST",
		dataType: "json",
		success: function (data) {
			res_list = data;
			loadEvents(res_list);
		}
	});
}

//loadEvents(res_list);
function loadEvents(res_list){
	var mp = document.getElementById("main-panel");
	mp.innerHTML = "";
	for (var i = 0; i < res_list.length; i++){
		var div = document.createElement("div");
		var imgd = document.createElement("div");
		var cttd = document.createElement("div");
		imgd.className = "col-lg-2";
		cttd.className = "col-lg-10";
		var img = document.createElement("img");
		img.className = "img-hover img-responsive img-circle";
		img.src = res_list[i]["avatar"]["url"];
		var aimg = document.createElement("a");
		console.log(res_list[i].uid);
		aimg.href = "/user/profile/"+res_list[i].uid+"/info?access_token="+localStorage.getItem("ResToken");
		aimg.appendChild(img);
		var fstLine = document.createElement("div");
		var usr = document.createElement("h5");
		usr.innerText = res_list[i]["username"];
		//fstLine.appendChild(usr);
		for (var j = 0; j < res_list[i]["tag"].length; j++){
			var sp = document.createElement("span");
			sp.className = "label label-info margin-tag pull-right";
			sp.innerText = res_list[i]["tag"][j];
			usr.appendChild(sp);
		}
		var asub = document.createElement("a");
		asub.href = "http://"+res_list[i]["link"];
		var sub = document.createElement("h4");
		sub.innerText = res_list[i]["subject"];
		sub.className = "text-info";
		var content = document.createElement("p");
		content.innerText = res_list[i]["content"];
		var dvd = document.createElement("div");
		dvd.className = "divider";
		imgd.appendChild(aimg);
		asub.appendChild(sub);
		cttd.appendChild(asub);
		cttd.appendChild(usr);
		cttd.appendChild(content);
		div.appendChild(imgd);
		div.appendChild(cttd);
		div.appendChild(dvd);
		mp.appendChild(div);
	}

}
//function view_user(uid){
//	console.log(uid);
//	$.ajax({
//		url: "/user/profile/"+uid+"/info",
//		type: "GET",
//		data: {"access_token": localStorage.getItem("ResToken")},
//		dataType: "json",
//		success: function (data) {
//		}
//	});
//}
function loadProfile(user_data){
	var prof_tb = document.getElementById("prof_tb");
	console.log(user_data);
	if(user_data["firstname"]&&user_data["lastname"]){
		document.getElementById("name_page").innerHTML= user_data["firstname"]+" "+user_data["lastname"]+"'s HomePage"
	}else{
		document.getElementById("name_page").innerHTML= user_data["username"]+"'s HomePage"
	}
	document.getElementById("user_prof_link").href = "/user/profile/"+user_data.uid+"/info?access_token="+localStorage.getItem("ResToken");
	document.getElementById("prof_img").src = user_data["avatar"]["url"];
	document.getElementById("name").innerHTML = user_data["firstname"]+" "+user_data["lastname"]+"("+user_data["username"]+")";
	for (var i = 0; i < prof_fields.length; ++i){
		var tr = document.createElement("tr");
		var td = document.createElement("td");
		var img = document.createElement("img");
		img.src = map_img[prof_fields[i]];
		td.appendChild(img);
		tr.appendChild(td);
		td = document.createElement("td");
		td.id = prof_fields[i];
		td.innerHTML = user_data[prof_fields[i]];
		tr.appendChild(td);
		prof_tb.appendChild(tr);
	}

	var int_d = document.getElementById("int_fields");
	var cnt = 0;
	var div = null;
	for (var j = 0; j < user_data["interested_field"].length; ++j){
		var sp = document.createElement("span");
		sp.className = "label label-primary margin-tag";
		sp.innerText = user_data["interested_field"][j];
		cnt = cnt+1;
		if (cnt%2 == 1){
			div = document.createElement("div");
			div.appendChild(sp);
		}
		else{
			div.appendChild(sp);
			int_d.appendChild(div);
		}	
	}

	/*
	for (var i = 0; i < prof_fields.length; ++i){
		if (prof_fields[i] == "name"){
			document.getElementById("name").innerHTML = user_data[map[prof_fields[i]]]+'<img class="img-hover pull-right" src="../public/images/gear39.png" data-toggle="modal" data-target="#myModal" onclick="feedDataModal()">';
		}
		else if (prof_fields[i] == "int_fields"){
			var int_d = document.getElementById("int_fields");
			var cnt = 0;
			var div = null;
			for (var j = 0; j < int_fields.length; ++j){
				if (user_data[prof_fields[i]][int_fields[j]] == true)
					var sp = document.createElement("span");
					sp.className = "label label-primary margin-tag";
					sp.innerText = int_fields[j];
					cnt = cnt+1;
					if (cnt%2 == 1){
						div = document.createElement("div");
						div.appendChild(sp);
					}
					else{
						div.appendChild(sp);
						int_d.appendChild(div);
					}
					
			}
		}
		else{
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			var img = document.createElement("img");
			img.src = map_img[prof_fields[i]];
			td.appendChild(img);
			tr.appendChild(td);
			td = document.createElement("td");
			td.id = prof_fields[i];
			td.innerHTML = user_data[map[prof_fields[i]]];
			tr.appendChild(td);
			prof_tb.appendChild(tr);
		}
	}
	*/
}


function feedDataModal(){
	var fbd = document.getElementById("profile-form");
	fbd.innerHTML = "";
	//fbd.innerHTML = '<div class="form-group"><input type="file" id="upload" size="chars"> </div>';
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
				cb.id = int_fields[i];
				cbd.appendChild(cb);
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
//redirect to my home page link
var my_homepage_url =  "/user?access_token="+ localStorage.getItem("ResToken")
document.getElementById("myhome_page_link").href = my_homepage_url
document.getElementById("name_page").href = my_homepage_url

function editProfile(){
	document.getElementById("name").innerHTML = document.getElementById("set-name").value+'<img class="img-hover pull-right" src="../public/images/gear39.png" data-toggle="modal" data-target="#myModal" onclick="feedDataModal()">';
	document.getElementById("loc").innerHTML = document.getElementById("set-loc").value;
	document.getElementById("edu").innerHTML = document.getElementById("set-edu").value;


}

