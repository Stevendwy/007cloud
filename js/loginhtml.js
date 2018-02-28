/*
* @Author: steven
* @Date:   2017-09-08 11:32:37
* @Last Modified by:   steven
* @Last Modified time: 2017-09-11 10:03:56
*/

   var local = ["vipname","vippassnum"]
   var _username = localStorage.getItem(local[0]) || $('#username').attr("value")
   var  _password = localStorage.getItem(local[1]) || $('#password').attr("value")  
	   $('#username').attr("value",_username) 
	   $('#password').attr("value",_password) 
	   if (localStorage.getItem(local[0])!=undefined) {
	   	$(".checkbox").prop("checked",true)
	   }else{
	   	$(".checkbox").prop("checked",false)
	   }
   $('#username').bind('input propertychange', function() {  
        _username = $('#username').attr("value")  
    });

   $('#password').bind('input propertychange', function() {  
        _password = $('#password').attr("value") 
    });

	function login() {
	    // var _username = document.getElementById('username').value
	    // var _password = document.getElementById('password').value
	    
	    if(_username.length < 1) {
	        alert('输入用户名')
	        return
	    }
	    if(_password.length < 1) {
	        alert('输入密码')
	        return
	    }
	    let  _urls = "http://192.168.10.111:81/login"
	    	_urls = "/login"
	    let _objs = {
	        username: _username,
	        password: _password
	    }
		
		let _remembernum = $(".checkbox").prop("checked")
	    if (_remembernum) {
	    	localStorage.setItem(local[0],_username)
	    	localStorage.setItem(local[1],_password)
	    }
	    	   
	    postAjax(_urls, _objs, function(res) {
	        location.href = "/"
	    })
	}

	//忘记密码 或者 立即登录
	function change (type){
		if (type=="tofwd") {
			$(".LoginContainer").css('display', 'none');
			$(".FindPwd").css('display', 'flex');
		}else{
			$(".LoginContainer").css('display', 'flex');
			$(".FindPwd").css('display', 'none');
		}
	}

	

	function sendnum(t){ 
		let phonenum = $('#phonenum').attr("value")
		if (phonenum.length != 11) {
			alert("请输入正确手机号")
		}else{
			$(".send-showworld").css('display', 'none');
		    $(".send-shownum").css('display', 'inline-block');

		    for(i=1;i<=t;i++) { 
		        window.setTimeout("update_p(" + i + "," + t + ")", i * 1000); 
		    } 
			let _url = "/changepwd_sms"
			let _obj = {
				phone: phonenum
			}
			postAjax(_url, _obj, function(res) {
		        alert("验证码已发送到您手机！")
		    })

		}
	} 
	 
	function update_p(num,t) { 
	    if(num == t) { 
	    	$(".send-showworld").css('display', 'inline-block');
			$(".send-shownum").css('display', 'none');
	    }else { 
	        let printnr = t - num; 
	        let printnrnum = printnr + "s"
	        $(".send-shownum").text(printnrnum)
	    } 
	}

	function submit(){
		let phonenum = $('#phonenum').attr("value")
		let sentnum = $("#sentnum").attr("value")
		let newpassword = $('#newpassword').attr("value")
		if (phonenum.length!=11 ) {
			alert("请输入正确手机号")
		}else if(sentnum.length <1){
			alert("请输入验证码")
		}else if(newpassword.length<1){
			alert("请输入新密码")
		}else{

			let _url = "/changepwd"
			let _obj = {
				phone: phonenum,
				sms_code: sentnum,
				password: newpassword
			}
			postAjax(_url, _obj, function(res) {
		        location.href = "/"
		    })
		}		
	}































// 
