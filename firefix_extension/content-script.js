function autoFill()
{
  var inputs = document.getElementsByTagName("input");
  for (var i=0; i<inputs.length; i++) {
    if (inputs[i].name.toLowerCase() === "password" || inputs[i].name.toLowerCase() === "username"||
      inputs[i].name.toLowerCase() === "pass" || inputs[i].name.toLowerCase() === "email") {
      injectIcon(inputs[i]);
    }
  }
}

function injectIcon(input) {
  input.injected = true;
  input.style.backgroundRepeat = "no-repeat";
  input.style.backgroundAttachment = "scroll";
  input.style.backgroundSize = "16px 16px";
  input.style.backgroundPosition = "calc(100% - 4px) 50%";
  input.style.backgroundImage = "url('" + browser.runtime.getURL("icons/onepass.png") + "')";
  input.addEventListener("click", openPopup);
}
let popup_menu = null;
let popup_target = null;
let matchItems = [];
function setupPopup() {

  // Remove old instances of the popup menu
  let old = document.querySelector(".passff_popup_menu");
  if (old) old.parentNode.removeChild(old);

  // Setup new instance
  popup_menu = document.createElement("iframe");
  popup_menu.setAttribute("src",
  browser.runtime.getURL("content/content-popup.html"));
  popup_menu.classList.add("passff_popup_menu");
  console.log("itemMatches" + matchItems);
  popup_menu.addEventListener("load", function () {
    let doc = popup_menu.contentDocument;
    
    let popup_div = doc.getElementsByTagName("div")[0];
    console.log("length: " + matchItems.length);
    if (matchItems.length === 0) {
      let alert_el = doc.createElement("div");
      alert_el.classList.add("alert");
      alert_el.textContent = ('You do not have any passwords saved');
      popup_div.innerHTML = "";
      popup_div.appendChild(alert_el);
    }
    matchItems.forEach(item => {
      let entry = document.createElement("div");
      entry.classList.add("entry");
      entry.pass = item.password;
      entry.user = item.userName;
      entry.innerHTML = `
          <button class="key"><span></span></button>   
      `;
       let button = entry.querySelector(".key span");
      button.textContent = item.userName + " : " + item.password;
      button.parentNode.title = item.userName;
      button.parentNode.addEventListener("click", function (e) {
        onPopupFillClick(e);
      });
      button = entry.querySelector(".fill");
      popup_div.appendChild(entry);
    });
  }, true);
  popup_menu.style.display = "none";
  document.body.appendChild(popup_menu);
}
function openPopup(target) {
  target = target.target;
  if(resetPopup(target)) return;
  popup_target = target;

  //remove this popup when user clicks somewhere else on the page
  document.addEventListener("click", function f(e) {
    if (getPopupEntryItem(e.target) !== null || isMouseOverIcon(e)) return;
    document.removeEventListener("click", f);
    resetPopup(target);
  });

  // position popup relative to input field
  let rect = target.getBoundingClientRect();
  let popup_width = window.getComputedStyle(popup_menu).width;
  popup_width = parseInt(popup_width.substring(0,popup_width.length-2), 10);
  let scrollright = window.scrollX - popup_width;
  popup_menu.style.top      = (window.scrollY + rect.bottom + 1) + "px";
  popup_menu.style.left     = (scrollright + rect.right - 2) + "px";
  popup_menu.style.display  = "block";

  // get the largest z-index value and position ourselves above it
  let z = Math.max(1, ...[...document.querySelectorAll('body *')]
    .filter(e => ["static",""].indexOf(e) === -1)
    .map(e => parseInt(window.getComputedStyle(e).zIndex, 10))
    .filter(e => e>0));
  popup_menu.style.zIndex = "" + z;
}
function getPopupEntryItem(target) {
  let entry = target.parentElement;
  while (entry && !entry.classList.contains("passff_entry")) {
    entry = entry.parentElement;
  }
  if (!entry) return null;
  return entry.passff_item;
}

function onPopupFillClick(e) {
  let pass = getPopupPassword(e.target);
  let user = getPopupUsername(e.target);
  popup_target.focus();
  resetPopup(popup_target);
  let activeElement = getActiveElement();
  if(activeElement.name == "password" || activeElement.name == "pass")
  {
    activeElement.value = pass;
  }
  else if(activeElement.name == "username" || activeElement.name == "email")
  {
    activeElement.value = user;

  }
}


function getPopupPassword(target) {
  let entry = target.parentElement;
  while (entry && !entry.classList.contains("entry")) {
    entry = entry.parentElement;
  }
  if (!entry) return null;
  return entry.pass;
}
function getPopupUsername(target) {
  let entry = target.parentElement;
  while (entry && !entry.classList.contains("entry")) {
    entry = entry.parentElement;
  }
  if (!entry) return null;
  return entry.user;
}
function isMouseOverIcon(e) {
  if (typeof e.target.injected === "undefined") return false;
  let bcrect = e.target.getBoundingClientRect();
  let leftLimit = bcrect.left + bcrect.width - 22;
  return e.clientX > leftLimit;
}
function resetPopup(target) {
  // return true if resetted popup_menu belonged to target
  let result = (target === popup_target);
  //if (popup_target !== null) resetIcon(popup_target);
  if (result) popup_target = null;
  if (popup_menu === null) setupPopup();
  popup_menu.style.display = "none";
  return result;
}
function reqListener () {
  console.log("response: " + this.responseText);
  try{
    var json_arr = JSON.parse(JSON.parse(this.responseText).data);
    matchItems = [];
    json_arr.forEach(item => {
      matchItems.push(item.fields);
    });
  }
  catch(error)
  {

  }
  setupPopup();
}
function getActiveElement(doc, depth) {
  depth = depth || 0;
  doc = doc || window.document;
  if (typeof doc.activeElement.contentDocument !== "undefined") {
    if (depth > 5) {
      return false;
    }
    return getActiveElement(doc.activeElement.contentDocument, depth++);
  } else {
    return doc.activeElement;
  }
  return false;
}

async function getAccountData()
{
  let userID = await browser.storage.local.get("userID");
  let password = await browser.storage.local.get("password");
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "https://cz4010.joelng.com/get_accounts?userID="+userID.userID+"&password_hash="+password.password);
  oReq.send();
}
autoFill();

getAccountData();