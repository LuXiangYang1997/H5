var interfaceUrl = 'https://tsmarsss.bqj.cn'; //测试环境
//var interfaceUrl = 'https://svip.bqj.cn'; //正式环境
var btnFlag = true;

$(function () {
    //登录状态
    try {
        //app打开
        Tag.postMessage('');   
        // $("#appshow").attr("style","display:block")
        // $("#appshow").attr("style","height: 0.64rem")
        // $("#otherShow").attr("style","display:none") 
        $("#otherShow").remove() 
        // $("#otherShow").attr("style","height:1.06rem")                 
    }
    catch(err) { 
        //浏览器打开
        // $("#appshow").attr("style","display:none")
        $("#appshow").remove() 
        // $("#otherShow").attr("style","display:block")  
        // $("#appshow").attr("style","height: 0.64rem")  
        // $("#otherShow").attr("style","height:1.06rem")      
        if(Cookies.get("userInfo")){
            let name = JSON.parse(Cookies.get("userInfo")).name;
            $("#userAccount").html(name)
            $(".user-p").attr("style","display:block")
            $(".no-p").attr("style","display:none")
        }
    }
    //调用app方法
    try{
        $("#giveUrl").click(function(){
            inviteRegister.postMessage("");
        })
    }
    catch(err){
        console.log("app邀请他人注册")
    }

    try{
        $("#giveGift").click(function(){
            receiveGift.postMessage("");
        })
    }
    catch(err){
        console.log("app领取注册礼包")
    }

    //登录校验    
    $('#submitlogin').click(function () {
        let phoneLogin = $('#phoneLogin').val();
        if(!checkPhoneNum(phoneLogin)){
            toast("请输入正确的手机号")
            return false
        }
        let passwordOne = $('#passwordOne').val();
        // if(!checkPasswordNum(passwordOne)){
        //     toast("请输入8-20位字母加数字组合")
        //     return false
        // }
        if(btnFlag){
            btnFlag = false;
            loginActivity(phoneLogin,passwordOne)
        }
    })
    //校验注册
    $('#mainBtn').click(function () {
        let phoneNum = $('#phoneNum').val();
        if(!checkPhoneNum(phoneNum)){
            toast("请输入正确的手机号")
            return false
        }
        let codeNum = $('#codeNum').val();
        if(codeNum.length<=0){
            toast("请输入验证码")
            return false
        }
        let passwordTwo = $('#passwordTwo').val();
        if(!checkPasswordNum(passwordTwo)){
            toast("请输入8-20位字母加数字组合")
            return false
        }
        if(btnFlag){
            btnFlag = false;
            submitActivity(phoneNum,codeNum,passwordTwo)
        }
    })
    //切换注册密码显示
    $('#showImg').click(function () {
        let pass_type = $('#passwordTwo').attr('type');
        if (pass_type === 'password' ){
            $('#passwordTwo').attr('type', 'text');
            $('#showImg').attr('src','images/open.png')
        } else {
            $('#passwordTwo').attr('type', 'password');
            $('#showImg').attr('src','images/guan.png')
        }
    })
    //切换登录密码显示
    $('#selectImg').click(function () {
        let pass_type = $('#passwordOne').attr('type');
        if (pass_type === 'password' ){
            $('#passwordOne').attr('type', 'text');
            $('#selectImg').attr('src','images/open.png')
        } else {
            $('#passwordOne').attr('type', 'password');
            $('#selectImg').attr('src','images/guan.png')
        }
    })
    //校验手机号是否注册过
    $("#sendCode").click(function(){
        let phoneNum = $('#phoneNum').val();
        if(!checkPhoneNum(phoneNum)){
            toast("请输入正确的手机号")
            return false
        }
        $.ajax({
            url: interfaceUrl + '/front/register/accountCheck',
            type: "GET",
            dataType: "json",
            data: {username: phoneNum},
            success:function (res) {
                if(res.result=='true'){
                    toast('该手机号已注册');
                }
                else{
                    sendPhoneCode()
                }
            },
            error: function () {
                toast('活动太火爆，请刷新后重试~');
            }
        })
    })
    //去浏览器下载
    $("#gobower").click(function(){
        //判断是否是微信浏览器的函数
        //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
        var ua = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            $("#happyModal").attr("style","display:none")
            $("#browserModal").attr("style","display:block")
        }else{
           console.log("普通浏览器")
        }
  
       
    })
})
//登录
function loginActivity(phoneLogin,passwordOne) {
    let dataVal = {
        username: phoneLogin,
        password:passwordOne
    };
    $.ajax({
        url: interfaceUrl + '/front/login',
        type: "GET",
        dataType: "json",
        data: dataVal,
        xhrFields: {
　　　　　　withCredentials: true
　　　　},
        success:function (res) {
            if(res.code == 200){
                $("#bigModal").hide();
                $("#userAccount").html(res.register.name)
                $(".user-p").attr("style","display:block")
                $(".no-p").attr("style","display:none")
                Cookies.set("userInfo", JSON.stringify(res.register), { expires: 7 });                
            }
            else{
                toast(res.message)
            }
            btnFlag = true;
        },
        error: function () {
            btnFlag = true;
            toast('活动太火爆，请刷新后重试~');
        }
    })
}

//发送验证码
function sendPhoneCode() {
    let n = 60;
    let codeVal = {
        mobile:$('#phoneNum').val(),
        type:'mars_sms_verifi_code'
    }
    $.ajax({
        url: interfaceUrl + '/front/sms/verifyCode/registerCode',
        type: "POST",
        dataType: "json",
        data: codeVal,
        xhrFields: {
            withCredentials: true
        },
        success:function (res) {
            if(res.code == 200){
                $('.count_down_btn').hide();
                $('.count_down_show').css({
                    display:'inline-block'
                })
                var timer = setInterval(function() {
                    n--;
                    $('.count_down_show').text(n);
                    if (n == 0) {
                        clearInterval(timer);
                        n = 60;
                        $('.count_down_btn').css({
                            display:'inline-block'
                        });
                        $('.count_down_show').hide();
                        $('.count_down_show').text(n);
                    };
                }, 1000);
            }
            else{
                toast(res.message)
            }
        },
        error: function () {
            toast('活动太火爆，请刷新后重试~');
        }
    })
}

//注册新用户
function submitActivity(phoneNum,codeNum,passwordTwo) {
    let requestData = {
        mobilePhone: phoneNum,
        password:passwordTwo,
        verifyCode:codeNum,
        type:'mars_sms_verifi_code'
    };
    $.ajax({
        url: interfaceUrl + '/front/register/registerMain',
        type: "POST",
        dataType: "json",
        data: requestData,
        xhrFields: {
            withCredentials: true
        },
        success:function (res) {
            if(res.code == 200){
                toast('注册成功,请登录');
                $("#resigter").attr("style","display:none")
                $("#login").attr("style","display:block")
                $("#modalLader").attr("style","height:3.33rem")
            }
            else{
                toast(res.message)
            }
            btnFlag = true;
        },
        error: function () {
            btnFlag = true;
            toast('活动太火爆，请刷新后重试~');
        }
    })
}

//立即登录
function showLoginModal(){
    $("#bigModal").attr("style","display:block")
}

//退出登录
function logout(){
    $.ajax({
        url: interfaceUrl + '/front/logout',
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success:function (res) {
            if(res.code == 200){
                $("#userAccount").html("")
                $(".user-p").attr("style","display:none")
                $(".no-p").attr("style","display:block")
                Cookies.remove('userInfo');
            }
            else{
                toast(res.message)
            }
        },
        error: function () {
            toast('活动太火爆，请刷新后重试~');
        }
    })
}

//关闭登录注册模态框
function closeModal(){
    $("#bigModal").hide()
    goLogin()
}

//去登陆
function goLogin(){
    $("#resigter").attr("style","display:none")
    $("#login").attr("style","display:block")
    $("#modalLader").attr("style","height:3.33rem")
}

//去注册
function goRegister(){
    $("#resigter").attr("style","display:block")
    $("#login").attr("style","display:none")
    $("#modalLader").attr("style","height:3.96rem")
}

//邀请好友注册
function inviteFriend(){
    let userInfo = Cookies.get("userInfo")?JSON.parse(Cookies.get("userInfo")):'';
    if(userInfo.length == 0){
        $("#bigModal").attr("style","display:block")
        return false;
    }
    window.location.href="share.html"
}

//获得分享的唯一标识
function receiveGift(){
    let userInfo = Cookies.get("userInfo")?JSON.parse(Cookies.get("userInfo")):'';
    if(userInfo.length == 0){
        $("#bigModal").attr("style","display:block")
        return false;
    }
    $.ajax({
        url: interfaceUrl + '/front/evidence/activity/getEvidenceActivityUrl',
        type: "GET",
        xhrFields: {
            withCredentials: true
        },                   
        success:function (res) {
            if(res.code=='200'){                          
                let code = res.evidenceActivityUrl
                let n1 = code.length;
                let n2 = code.indexOf("=");//取得=号的位置
                let id = code.substr(n2 + 1, n1 - n2);//从=号后面的内容
                console.log(id)
                possessGift(id)
            }else{
                toast(res.message)
            }
        },
        error: function () {
            toast('活动太火爆，请刷新后重试~');
        }
    })
}

//领取礼包
function possessGift(code){
    $.ajax({
        url: interfaceUrl + '/front/evidence/activity/getEvidenceActivityGift',
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        data:{invitationQr:code},                    
        success:function (res) {
            if(res.code=='202'){
                $("#sorryModal").attr("style","display:block")
            }else if(res.code=='200'){
                $("#happyModal").attr("style","display:block")                
            }else{
                toast(res.message)
            }
        },
        error: function () {
            toast('活动太火爆，请刷新后重试~');
        }
    })
}

//邀请他人注册
function golink(){
    $("#sorryModal").attr("style","display:none")
    window.location.href="share.html"
}

/********************检查手机号*****************/
function checkPhoneNum (phonevalue) {
    if(phonevalue.length != 11){
        return false;
    }
    var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (phoneReg.test(phonevalue)) {
        return true
    } else {
        return false
    }
}
/********************检查密码*****************/
function checkPasswordNum (passwordvalue) {
    if(passwordvalue.length <=0){
        return false;
    }
    var passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
    if (passwordReg.test(passwordvalue)) {
        return true
    } else {
        return false
    }
}

/********************************获取网址问号后的参数**********************/
function GetQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}