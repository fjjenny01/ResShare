AWS.config.update({accessKeyId: 'AKIAIKE66OTMJJFT5X7A', secretAccessKey: '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'});
AWS.config.region = 'us-east-1';
var bucket = new AWS.S3({params: {Bucket: 'czcbucket/avatars', ACL:'public-read'}});
console.log(bucket);
//bucket.listObjects(function (err, data) {console.log(err); console.log(data)});
glb_uid = document.getElementById("get-uid").innerText;
console.log(glb_uid);
$('#get-uid').innerHTML = "";
var img_dir = "images/"
var map_img = {"email":img_dir+"mail4.png", "company":img_dir+"graduation-cap2.png"}
var map = {"name":"Name", "edu":"Education", "loc":"Location", "int_fields":"Interested Fields", "email":"Email"};

//user_data = {"username":"chaozc", "first name":"Zichen", "lastname":"Chao", "email":"zichen.chao@columbia.edu", "status":1, "company":"Columbia University", "interested_field":["Software Development", "IEOR", "Consulting", "Education"], "avatar":{"url":"../public/images/default_profile.jpg", "aid":""}};
res_list = [{"username":"jingxiao", "link":"www.google.com", "subject":"HelloHello", "content":"Hi, would you please check my resume?? ...........................................Hi, would you please check my resume??Hi, would you please check my resume??Hi, would you please check my resume??Hi, would you please check my resume??","tag":int_fields}]
var prof_fields = ["email", "company"];
var int_fields = ["Software Development", "Finance", "Computer Science", "Education", "Engineering"];
user_data = null;
res_list = null;
$.ajax({
    url: "/user/profile/"+glb_uid+"/data",
    type: "GET",
    async: false,
    data: {"access_token": localStorage.getItem("ResToken")},
    dataType: "json",
    success: function (data) {
        //alert(data);
        console.log(data);
        user_data = data.user;
        console.log(user_data);
        self = data.self;
        console.log(self);
        loadProfile(user_data);
        //loadEvents(res_list);
    }
});
//console.log(m);
document.getElementById("link-info").href = "/user/profile/"+glb_uid+"/info?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-admin").href = "/user/profile/"+glb_uid+"/admin?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-topics").href = "/user/profile/"+glb_uid+"/topic?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-notification").href = "/user/profile/"+glb_uid+"/notification?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-resume").href = "/user/resume/?access_token="+localStorage.getItem("ResToken");
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
        img.className = "img-responsive img-circle";
        img.src = res_list[i]["avatar"]["url"];
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
        imgd.appendChild(img);
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

$("#img_upload input:file").change(function (){
    var file = this.files[0];
    var reader = new FileReader();
    // Set preview image into the popover data-content
    reader.onload = function (e) {

        $("#prof_img").attr('src', e.target.result);
    }
    reader.readAsDataURL(file);
});
function loadProfile(user_data){
    var prof_tb = document.getElementById("prof_tb");
    console.log(user_data);
    document.getElementById("prof_img").src = user_data["avatar"]["url"];
    document.getElementById("name").innerHTML = user_data["firstname"]+" "+user_data["lastname"]+"("+user_data["username"]+")";



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

function updatePw(){

    var newpw = document.getElementById("newpw").value;
    var confirmpw = document.getElementById("confirmpw").value;
    console.log(newpw);
    console.log(confirmpw);
    $.ajax({
        url: "/user/profile/password/edit",
        type: "POST",
        data: {"access_token": localStorage.getItem("ResToken"), "password": newpw, "confirm_password": confirmpw, "email": user_data.email},
        datatype: "String",
        success: function (data) {
            if (data.indexOf("successfully") == -1){
                document.getElementById("newpwd").className = "form-group has-warning";
                document.getElementById("confirmpwd").className = "form-group has-warning";
                document.getElementById("result").className = "text-danger";
            }
            else{
                document.getElementById("newpwd").className = "form-group";
                document.getElementById("confirmpwd").className = "form-group";
                document.getElementById("result").className = "text-success";
            }
            document.getElementById("result").innerText = data;
        }
    });

}
