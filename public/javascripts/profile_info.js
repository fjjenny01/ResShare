AWS.config.update({accessKeyId: 'AKIAIKE66OTMJJFT5X7A', secretAccessKey: '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'});
AWS.config.region = 'us-east-1';
var bucket = new AWS.S3({params: {Bucket: 'czcbucket/avatars', ACL:'public-read'}});
console.log(bucket);
//bucket.listObjects(function (err, data) {console.log(err); console.log(data)});
glb_uid = document.getElementById("get-uid").innerText;
remove("get-uid");
console.log(glb_uid);
//$('#get-uid').innerHTML = "";
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
        user_data = data.user;
        console.log(user_data);
        self = data.self;
        console.log(self);
        loadProfile(user_data);
        //loadEvents(res_list);
    }
});
console.log(self);

document.getElementById("link-info").href = "/user/profile/"+glb_uid+"/info?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-admin").href = "/user/profile/"+glb_uid+"/admin?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-topics").href = "/user/profile/"+glb_uid+"/topic?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-notification").href = "/user/profile/"+glb_uid+"/notification?access_token="+localStorage.getItem("ResToken");
document.getElementById("link-resume").href = "/user/resume/?access_token="+localStorage.getItem("ResToken");

function remove(id) {
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}

if (self == false){
    remove("link-admin");
    remove("link-notification");
    remove("link-resume");

}

//redirect to my home page link
var my_homepage_url =  "/user?access_token="+ localStorage.getItem("ResToken")
document.getElementById("myhome_page_link").href = my_homepage_url
document.getElementById("name_page").href = my_homepage_url

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

    document.getElementById("name_page").innerHTML= "My HomePage"

    document.getElementById("prof_img").src = user_data["avatar"]["url"];
    document.getElementById("name").innerHTML = user_data["firstname"]+" "+user_data["lastname"]+"("+user_data["username"]+")";
    document.getElementById("email").placeholder = user_data["email"];

    if (self == true){
        remove("else");
        document.getElementById("set-username").value = user_data["username"];
        document.getElementById("set-lastname").value = user_data["lastname"];
        document.getElementById("set-firstname").value = user_data["firstname"];
        document.getElementById("set-company").value = user_data["company"];

        var int_d = document.getElementById("int-f-cb");
        for (var i = 0; i < int_fields.length; ++i){
            var cbd = document.createElement("div");
            var cb = document.createElement("input");
            cb.type = "checkBox";
            cb.id = int_fields[i];
            cbd.appendChild(cb);
            cbd.innerHTML = cbd.innerHTML+" "+int_fields[i]
            int_d.appendChild(cbd);
            if (user_data["interested_field"].indexOf(int_fields[i]) >= 0){
                document.getElementById(int_fields[i]).checked = true;
            }

        }
    }
    else{
        remove("ifself");
        document.getElementById("else-username").innerText = user_data["username"];
        document.getElementById("else-lastname").innerText = user_data["lastname"];
        document.getElementById("else-firstname").innerText = user_data["firstname"];
        document.getElementById("else-company").innerText = user_data["company"];
        document.getElementById("else-email").innerText = user_data["email"];
        var iit = document.getElementById("else-int");
        for (var j = 0; j < user_data.interested_field.length; j++){
            var sp = document.createElement("span");
            sp.className = "label label-info margin-tag pull-right";
            sp.innerText = user_data.interested_field[j];
            iit.appendChild(sp);
        }
    }


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

function editProfile(){
    document.getElementById("name").innerHTML = document.getElementById("set-firstname").value+" "+document.getElementById("set-lastname").value+"("+document.getElementById("set-username").value+")";
    user_data.firstname = document.getElementById("set-firstname").value;
    user_data.lastname = document.getElementById("set-lastname").value;
    user_data.username = document.getElementById("set-username").value;
    user_data.company = document.getElementById("set-company").value;
    user_data.interested_field = [];
    for (var i = 0; i < int_fields.length; ++i){
        if (document.getElementById(int_fields[i]).checked){
            user_data.interested_field.push(int_fields[i]);
        }
    }
    var input = document.getElementById("upload");
    console.log(input.files.length);
    if (input.files.length == 1){
        var timestamp = new Date().getTime();
        var params = {Key: timestamp.toString()+"."+input.files[0].type.split('/')[1], Body: input.files[0]};
        console.log(params);
        user_data.avatar.url = "https://s3.amazonaws.com/czcbucket%2Favatars/"+params.Key;
        bucket.upload(params, function (err, data) {

        });
        console.log(user_data.avatar.url);
    }

    $.ajax({
        url: "/user/profile/info/edit",
        type: "POST",
        data: {"access_token": localStorage.getItem("ResToken"), "user": JSON.stringify(user_data)},
        dataType: "json",
        success: function (data) {
            alert(data);
        }
    });
    /*
     var input = document.getElementById("upload");
     var params = {Key: '123.pdf', Body: input.files[0]};
     bucket.upload(params, function (err, data) {
     console.log(err);
     console.log(data);
     });
     */

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
