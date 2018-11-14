// Store the currently selected settings using browser.storage.local.

activeMenus = JSON.parse(localStorage.getItem('activeMenus'));
console.log("moo "+activeMenus.enablebbCode);
/*

console.log(Object.keys(defaultMenus).length);// number of elements in object

for (i = 0; i < Object.keys(defaultMenus).length; i++) {
let crntMenu = Object.keys(defaultMenus)[i]; //steps through name
}


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
*/
const dataTypes = getTypes();

console.log(getTypes);

console.log("moo");
/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
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

/*


On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
On clicking the save button, save the currently selected settings.
*/
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);