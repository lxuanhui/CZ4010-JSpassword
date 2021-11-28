const spinner = document.getElementById('spinner');
var tablebody = document.getElementById("table-body-box");
const csrf = getCookie('csrftoken');
let accountsDictArray = [];



$(function() {
    document.getElementById("generate_secure_password").addEventListener("click", function() {
        var randomstring = Math.random().toString(36).slice(-10);
        var Password = {
 
  _pattern : /[a-zA-Z0-9_\-\+\.]/,
  
  
  _getRandomByte : function()
  {
    // http://caniuse.com/#feat=getrandomvalues
    if(window.crypto && window.crypto.getRandomValues) 
    {
      var result = new Uint8Array(1);
      window.crypto.getRandomValues(result);
      return result[0];
    }
    else if(window.msCrypto && window.msCrypto.getRandomValues) 
    {
      var result = new Uint8Array(1);
      window.msCrypto.getRandomValues(result);
      return result[0];
    }
    else
    {
      return Math.floor(Math.random() * 256);
    }
  },
  
  generate : function(length)
  {
    return Array.apply(null, {'length': length})
      .map(function()
      {
        var result;
        while(true) 
        {
          result = String.fromCharCode(this._getRandomByte());
          if(this._pattern.test(result))
          {
            return result;
          }
        }        
      }, this)
      .join('');  
  }    
    
};

        $("#id_password").val(Password.generate(14));
    }); 
});
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');
    console.log(csrftoken);
    
    //Ajax call
    function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    // function hideText() {
    //     var x = document.getElementById("passwordhide");
    //     if (x.style.display === "none") {
    //       x.style.display = "block";
    //     } else {
    //       x.style.display = "none";
    //     }
    //   }
    function toggleElementMask(element){
        //Regex to find *
        let reg = /^\*+$/g;
        //If all * we are masked
        let isMasked = element.innerText.match(reg);
        if(!isMasked) {
          //Store the original text
          element.dataset.original = element.innerText;
          //Replace the contente with the same amount of *
          element.innerText = "*".repeat(element.innerText.length);
        }else{
          //Restore the text
          element.innerText = element.dataset.original;
        }
      }
      
$.ajax({
    type:'GET',
    url: '/data-json/',
    success: function(response){   
        
        const data = JSON.parse(response.data)
        
        
        data.forEach(element => {
            
            let pk = element.pk
            let user = element.fields.user
            let password = element.fields.password
            let userName = element.fields.userName
            const accountsDict = {pk:pk, user:user, password:password, userName:userName }
            // console.log(accountsDict)
            
            accountsDictArray.push(accountsDict);
           // setTimeout(() => {console.log(accountsDictArray)}, 3000)
            
            tablebody.innerHTML += `
                <tr id = 'account-row'>
                    <td>${element.fields.userName}</td>
                    <td>
                        <div id='${element.pk}' class='masked'>
                            <p>${element.fields.password}</p>
                        </div> 
                    </td>
                    <td>
                        <a href="#${element.pk}" class="toggleMask">Hide/Show password</a>
                    <td>
                    <form action = "/delete_account"
                        method = "post" id = 'form1'>
                        <input type="hidden" name="csrfmiddlewaretoken" value=${csrf}>
                        <button type = "submit"  name = 'element_id'
                        value = ${element.fields.userName}  class = "btn btn-primary btn-sm">
                        Delete</button>
                    </form>
                    </td>

                </tr>
                `
           //Click event handler
        $(".toggleMask").on("click", function(e){
            e.preventDefault();
            toggleElementMask($($(this).attr("href"))[0]);
        })
            
            
        });
         //Mask on page load
         $(".masked").each(function(){
            toggleElementMask(this);
        });
        
        
        

        
        spinner.classList.add('not-visible')
        // accountsDictArray.forEach((account)=>{
        //     console.log(account.pk)
        // })
    },
    error: function(error){
        console.log(error);
        
    },
})
setTimeout(function(){ accountsDictArray.forEach((account)=>{
    console.log(account.pk)
}); }, 3000);
setTimeout(function(){ $.ajax({
                
    type: "POST",
    url: "/dashboard/",
    headers: {
        'X-CSRFToken': getCookie('csrftoken')
    },
    data: JSON.stringify({
        //'csrfmiddlewaretoken': csrftoken,
        'accountsDictArray' : accountsDictArray,
    }),
    
    success: function (data) {
        console.log("it worked!");
        
    },
    error: function (data) {
        console.log("it didnt work");
    }
}); }, 3000);







