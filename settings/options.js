// Store the currently selected settings using browser.storage.local.

activeMenus = JSON.parse(localStorage.getItem('activeMenus'));
console.log("length of active menus: "+Object.keys(activeMenus).length);
console.log(activeMenus);
//console.log(JSON.stringify(activeMenus));

menuLoaded = loadMenus();
console.log(menuLoaded);


// above and below listen for the custom tags button and open up custom tags window
document.getElementById('customTagBtn').onclick =
    function() {
        window.open("custom_tags.html","Custom_Tags","resizable, scrollbars");
}

// listen for the menu activation check box button click to save values
document.getElementById('save-button').onclick =
    function() {
        console.log("nothing here yet");
}

// Alter state of vBulletin check box when bbCode checkbox is toggled.
const bbBox = document.getElementById('enablebbCodeCHK')

bbBox.addEventListener('change', (event) => {
  if (event.target.checked) {
      document.getElementById("enableVbulletinCHK").disabled = false;
      document.getElementById("enableVbulletinCHK").checked = false;
  } else {
      document.getElementById("enableVbulletinCHK").disabled = true;
      document.getElementById("enableVbulletinCHK").checked = false;
  }
})


// Read stored menu settings and set checkboxes


function loadMenus() {
    for (i = 0; i < Object.keys(activeMenus).length; i++) {
        let crntMenu = Object.keys(activeMenus)[i]; //steps through object names
        let crntCheck = crntMenu+"CHK"; //steps through check box names
        let checkVal = Object.values(activeMenus)[i]; //gives boolean value of check box
            document.getElementById(crntCheck).checked = checkVal; // checks boxes as per loaded values
}
return "Menu Settings Loaded";
}


/*
localStorage.clear();
//console.log(localStorage.getItem("enablebbCode"));
//localStorage.setItem("enablebbCode", false);
//console.log(localStorage.getItem("enablebbCode"));
const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
//console.log(defaultMenus);
//moo = JSON.stringify(defaultMenus);
//console.log("moo: "+moo);
//console.log("moo: "+defaultMenus.enablebbCode);


//console.log(checkboxes);
    document.getElementById("enablebbCode").checked = true;

function storeSettings() {

  function getTypes() {
    let dataTypes = [];
    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
console.log(checkboxes);
    for (let item of checkboxes) {
      if (item.checked) {
        dataTypes.push(item.getAttribute("data-type"));
      }
    }
    return dataTypes;
  }
}

const dataTypes = getTypes();

console.log(getTypes);

console.log("moo");
/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.

function updateUI(restoredSettings) {

  const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
  for (let item of checkboxes) {
    if (restoredSettings.dataTypes.indexOf(item.getAttribute("data-type")) != -1) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  }
}
function onError(e) {
  console.error(e);
}




On opening the options page, fetch stored settings and update the UI with them.

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);


On clicking the save button, save the currently selected settings.

const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
*/

/* list of variable fields for reference (check boxe IDs have "CHK" appended
enablebbCode
enableHTML
enableVbulletin
enableXHTML
enableMarkDown
enableCustom
*/