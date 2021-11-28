function login(event)
{
  event.preventDefault();
  var form = $('#login_form');
  var formDataArr = form.serializeArray();
  $.ajax({
    type:'get',
    url: "https://cz4010.joelng.com/login_ajax",
    data: form.serialize(),
    crossDomain: true,
    dataType: "json",
    success: function( response ) {
      if(response.success == 1)
      {
        console.log(formDataArr);
        store_login_data(response.data.userID,formDataArr[1].value);
        hideLoginForm();
      }
      else{
        console.log("failed");
      }
    }

  });
  return false;
}


async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
//var testBtn = document.getElementById("testbtn");
//testBtn.addEventListener('click', setPassword);
async function store_login_data(userID,password)
{
  let userData = {};
  userData["password"] = await sha256(password);
  userData["userID"] = userID;
  try{
    browser.storage.local.set(userData);
  }
  catch(err)
  {
    console.log(err.message);
  }
  
}

function logout()
{
  browser.storage.local.remove(['userID','password']);
  checkLoggedIn();
}
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('sbmt').addEventListener('click', login);
});
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('logout').addEventListener('click', logout);
});

async function checkLoggedIn()
{
  let userID = await browser.storage.local.get("userID");
  let password = await browser.storage.local.get("password");
  if (jQuery.isEmptyObject(userID)  || jQuery.isEmptyObject(password))
  {
    $("#login_form").show();
    $("#logout").hide();
  }
  else
  {
    hideLoginForm(); 
  }

}

function hideLoginForm()
{
    $("#login_form").hide();
    $("#logout").show();    
}
checkLoggedIn();