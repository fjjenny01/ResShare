/*
document.addEventListener("DOMContentLoaded", function() {


    // JavaScript form validation

    var checkPassword = function(str)
    {
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        return re.test(str);
    };

    var checkForm = function(e)
    {
        if(this.username.value == "") {
            alert("Error: Username cannot be blank!");
            this.username.focus();
            e.preventDefault(); // equivalent to return false
            return;
        }
        re = /^\w+$/;
        if(!re.test(this.username.value)) {
            alert("Error: Username must contain only letters, numbers and underscores!");
            this.username.focus();
            e.preventDefault();
            return;
        }
        if(this.pwd1.value != "" && this.pwd1.value == this.pwd2.value) {
            if(!checkPassword(this.pwd1.value)) {
                alert("The password you have entered is not valid!");
                this.pwd1.focus();
                e.preventDefault();
                return;
            }
        } else {
            alert("Error: Please check that you've entered and confirmed your password!");
            this.pwd1.focus();
            e.preventDefault();
            return;
        }
        alert("Both username and password are VALID!");
    };

    var myForm = document.getElementById("myForm");
    myForm.addEventListener("submit", checkForm, true);

    // HTML5 form validation

    var supports_input_validity = function()
    {
        var i = document.createElement("input");
        return "setCustomValidity" in i;
    }

    if(supports_input_validity()) {
        var usernameInput = document.getElementById("field_username");
        usernameInput.setCustomValidity(usernameInput.title);

        var pwd1Input = document.getElementById("field_pwd1");
        pwd1Input.setCustomValidity(pwd1Input.title);

        var pwd2Input = document.getElementById("field_pwd2");

        // input key handlers

        usernameInput.addEventListener("keyup", function() {
            usernameInput.setCustomValidity(this.validity.patternMismatch ? usernameInput.title : "");
        }, false);

        pwd1Input.addEventListener("keyup", function() {
            this.setCustomValidity(this.validity.patternMismatch ? pwd1Input.title : "");
            if(this.checkValidity()) {
                pwd2Input.pattern = this.value;
                pwd2Input.setCustomValidity(pwd2Input.title);
            } else {
                pwd2Input.pattern = this.pattern;
                pwd2Input.setCustomValidity("");
            }
        }, false);

        pwd2Input.addEventListener("keyup", function() {
            this.setCustomValidity(this.validity.patternMismatch ? pwd2Input.title : "");
        }, false);

    }

}, false);


*/
function signup_email_check(){
    var username = $("#input_username").val();
    var email = $("#input_email").val();
    var password = $("#field_pwd1").val();
    var confirm_password = $("#field_pwd2").val();
    var textdata = {"username":username,"email":email,"password":password,"confirm_password":confirm_password};
    $.ajax({
        url: "/register",
        type: "POST",
        async: false,
        data: textdata,
        dataType: "json",
        success: function (data) {
            alert(data.data);
        },
        error: function(data){
            return false
        }
    })
 return false
}

function userlogin(){
    var email = $("#login_email").val();
    var password = $("#login_password").val();
    var textdata = {"email":email,"password":password};
    $.ajax({
        url: "/login",
        type: "POST",
        async: false,
        data: textdata,
        dataType: "json",
        success: function (data) {
            if(data.data.page){
                 console.log(data.data.page)
                localStorage.setItem("ResToken",data.data.token)
                window.location.href=data.data.page+'?access_token='+data.data.token;

            }else{
            alert(data.data);
            }
        },
        error: function(){
            console.log("login error");}
    })

}
function forget_password(){
    var email = $("#login_email").val();
    var textdata = {"email":email};
    $.ajax({
        url: "/forgot",
        type: "POST",
        async: false,
        data: textdata,
        dataType: "json",
        success: function (data) {
            console.log(data)
                alert(data.data);
            if(data.token){
                console.log(data.token)
                localStorage.setItem("ResToken",data.token)
            }

        },
        error: function(){
            console.log("login error")}
    })

}