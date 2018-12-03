// Store the currently selected settings using browser.storage.local.

activeMenus = JSON.parse(localStorage.getItem('activeMenus'));

menuLoaded = loadMenus();
console.log(menuLoaded);

console.log(activeMenus);


// above and below listen for the custom tags button and open up custom tags window
document.getElementById('customTagBtn').onclick =
    function() {
        window.open("custom_tags.html","Custom_Tags","resizable, scrollbars");
}

// listen for the menu activation check box button click to save values to local storage
const saveButton = document.getElementById("save-button");

saveButton.addEventListener("click", saveMenus);

function saveMenus () {
console.log(JSON.stringify(activeMenus));
    for (i = 0; i < Object.keys(activeMenus).length; i++) {
        let crntMenu = Object.keys(activeMenus)[i]; //steps through object names
        let crntCheck = crntMenu+"CHK"; //steps through check box names
        let checkVal = document.getElementById(crntCheck).checked; //gives boolean value of check box
activeMenus[crntMenu] = checkVal; //gotta use this notation because I am using a variable for the name.
}
    localStorage.setItem('activeMenus',JSON.stringify(activeMenus)); //store default in local menu
console.log("Menu Settings Saved");
}


// Alter state of vBulletin check box when bbCode checkbox is toggled.
const bbBox = document.getElementById('enablebbCodeCHK');

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





// On clicking the save button, save the currently selected settings.

// const saveButton = document.querySelector("#save-button");
// saveButton.addEventListener("click", storeSettings);


/* list of variable fields for reference (check boxe IDs have "CHK" appended
enablebbCode
enableHTML
enableVbulletin
enableXHTML
enableMarkDown
enableCustom
*/