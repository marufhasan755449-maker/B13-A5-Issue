console.log("my name is maruf")
document.getElementById("Sign-btn").addEventListener("click",function(){
    const inputName = document.getElementById("input-name");
    const UserName = inputName.value;
    
    const inputPin =document.getElementById("input-pin");
    const password = inputPin.value;

    if(UserName==="admin" && password==="admin123"){
        alert("Sign In Success");
        window.location.assign("home.html")
    }
    else{
        alert("Sign In Failed");
        return;
    }
})