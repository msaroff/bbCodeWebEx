
/* Global variables */
var custProm = initialize();

async function initialize () { // generates tag table when page is (re)loaded
	let {defCust: customMenu}  = await browser.storage.local.get("defCust");
//	console.log(JSON.stringify((customMenu), null, 4).substring(0,200));

    for (i = 0; i < Object.keys(customMenu).length; i++) {
//		console.log(Object.keys(customMenu).length);
//console.log("count",i);
const containerSpan = document.createElement('span');
      containerSpan.classList.add("grid-container");
const menuIdSpan = document.createElement('span');
      menuIdSpan.classList.add("baseSort", "menuIdBody", "hover");
const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add("baseSort", "menuTitleBody", "hover");
const parentIdSpan = document.createElement('span');
      parentIdSpan.classList.add("baseSort", "menuParentIdBody", "hover");
const menuArgSpan = document.createElement('span');
      menuArgSpan.classList.add("baseSort", "menuArgBody", "hover");
    var createLi = document.createElement("li"); 
    createLi.setAttribute('id', customMenu[i].menuId);
    createLi.setAttribute('draggable', true);
    createLi.classList.add("listItem");
    menuIdSpan.appendChild(document.createTextNode(customMenu[i].menuId));
    menuTitleSpan.appendChild(document.createTextNode(customMenu[i].menuTitle));
    parentIdSpan.appendChild(document.createTextNode(customMenu[i].parentId));
    menuArgSpan.appendChild(document.createTextNode(customMenu[i].menuArg));
//console.log(menuIdSpan,menuTitleSpan);
    containerSpan.appendChild(menuIdSpan);
    containerSpan.appendChild(menuTitleSpan);
    containerSpan.appendChild(parentIdSpan);
    containerSpan.appendChild(menuArgSpan);
createLi.appendChild(containerSpan);
  ulSort.appendChild(createLi);
}

for (i = 0; i < customMenu.length; i++) {
let singleRow = customMenu[i];
let singleRowId = customMenu[i].menuId;
//console.log(singleRowId)
document.getElementById(singleRowId).addEventListener('click', () => {getMenuClicked(singleRowId);});
}

		return((await customMenu));
}

/* ------------------------------ Begin variables, constants, and listeners ---------------- */

var ulSort = document.getElementById("listOrder");

var listRef = document.getElementById("listOrder").li;

const importButton = document.getElementById("importTagsClick");

const fileButton = document.getElementById('importTags');

const importButtonBBCodeXtra = document.getElementById("BBCodeXtraImport");

const callButtonBBCodeXtra = document.getElementById("BBCodeXtraLoad");

const newTag = document.getElementById("New");

const appendbbcwbx = document.getElementById("importTagsAppend");

const appendGetFile = document.getElementById("appendTags");

Save.addEventListener("click", writeTag);

New.addEventListener("click", newJSON);

Delete.addEventListener("click", delTag);

callButtonBBCodeXtra.addEventListener("change", loadBBCodeXtra);

importButtonBBCodeXtra.addEventListener("click", trigImportBBCodeXtra);

importButton.addEventListener("click", tagImport);

fileButton.addEventListener("change", importOverwrite);

appendbbcwbx.addEventListener("click",trigAppend);

appendGetFile.addEventListener("change",loadbbcwbx);

const saveButton = document.getElementById("saveTagOrder");

saveButton.addEventListener("click", saveTagOrd);

const exportButton = document.getElementById("exportTags");

exportButton.addEventListener("click", expTag);
/* ------------------------------ End variables, constants, and listeners ---------------- */

/* ------------------------------ Begin load and append, BBCodeXtra Tags ---------------- */
function trigImportBBCodeXtra () { //click button to trigger file input
	callButtonBBCodeXtra.click();
}

function loadBBCodeXtra (event) {
//	let customMenu = await custProm;
  var getfile = event.target.files;
  var file = getfile[0]
  var reader = new FileReader();
//  console.log(getfile,"\n",file,"\n",reader);
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = JSON.parse(event.target.result);
	let forImport = procCustBBCXtags(readValue);
  };
  //console.log(event.target.result);
  reader.readAsText(file);
}

async function procCustBBCXtags (oldCodes){ //Import and append BBCodeXtra Tags
	let customMenu = await custProm;
	let oldTags = await oldCodes;
	let sortedTags = await oldTags.sort(function(a, b){
		return a.name > b.name;
	});
//	console.log(JSON.stringify(sortedTags,null,1));
	for (i = 0; i < Object.keys(await sortedTags).length; i++){ // go through the entire array
		if (await sortedTags[i].name.includes("custom") && await sortedTags[i].name.includes("action")){
	let mId = await generateNewId(customMenu);
	console.log(mId);
	let mParent = "bbcwbx.custom";
	let mTitle = await sortedTags[i+1].value; //title of custom tag
	let mArg = await sortedTags[i].value; //argument of custom tag
	mArg = await mArg.replace(/_clipboard_/ig,'{{clipboard}}'); //change to my notation
	mArg = await mArg.replace(/_selection_/ig,'{{selection}}'); //change to my notation
	let newMenuBCodeXtra = {
    menuId: mId,
    menuTitle: mTitle,
    parentId: mParent,
    menuArg: mArg,
	icons: ""
  }
//  console.log(JSON.stringify(newMenuBCodeXtra));
 // console.log(newMenuBCodeXtra);
  customMenu = await customMenu.concat(newMenuBCodeXtra);
  let moo = await browser.storage.local.set({defCust: customMenu}); //store updated tags in local storage
  console.log(JSON.stringify(customMenu).slice(-200)+"\n\n");
}}
	location.reload(); // reload page, which reloads custom tags from storage
	}
/* ------------------------------ End load and append, BBCodeXtra Tags ---------------- */

/* ------------------------------ Begin load and append, bbCodeWebex Tags ---------------- */
function trigAppend(){ //click button to trigger file input
	appendGetFile.click();
}

function loadbbcwbx (event) {
//	let customMenu = await custProm;
  var getfile = event.target.files;
  var file = getfile[0]
  var reader = new FileReader();
//  console.log(getfile,"\n",file,"\n",reader);
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = JSON.parse(event.target.result);
	let forImport = procCustBBCWBXtags(readValue);
  };
  //console.log(event.target.result);
  reader.readAsText(file);
}

async function procCustBBCWBXtags (oldCodes){  //import and append bbCodeWebex Tags
	let customMenu = await custProm;
	let oldTags = await oldCodes;
//	console.log(JSON.stringify(oldTags,null,1));
	for (i = 0; i < Object.keys(await oldTags).length; i++){ // go through the entire array
	let mId = await generateNewId(customMenu);
	let mParent = "bbcwbx.custom";
	let mTitle = await oldTags[i].menuTitle; //title of custom tag
	let mArg = await oldTags[i].menuArg; //argument of custom tag
	let newMenuBCodeXtra = {
    menuId: mId,
    menuTitle: mTitle,
    parentId: mParent,
    menuArg: mArg,
	icons: ""
  }
//  console.log(JSON.stringify(newMenuBCodeXtra));
 // console.log(newMenuBCodeXtra);
    if (oldTags[i].menuTitle !="" && oldTags[i].menuArg != "") { //filter out an imported garbage file
		customMenu = await customMenu.concat(newMenuBCodeXtra);
		let moo = await browser.storage.local.set({defCust: customMenu}); //store updated tags in local storage
		console.log(JSON.stringify(customMenu).slice(-200)+"\n\n");
	}
}
	location.reload(); // reload page, which reloads custom tags from storage
	}
/* ------------------------------ End load and append, bbCodeWebex Tags ---------------- */

/* ------------------------------ Begin load and OVERWRITE, bbCodeWebex Tags ---------------- */
async function tagImport () {
	let customMenu = await custProm;
/* click on the file input button this is a hack using the submit button 
to click on the file button while maintaining the same appearance as 
the other submit buttons. */
alert("\t\t\t\tWarning:\nThis will overwrite existing custom tags and tag order.");
let confImp = confirm("\tAre you sure you want to proceed?\n     Click OK to proceed, or cancel and then\nbackup your current setup before proceeding.");
if (confImp) {
	importTags.click();
	}
}

async function importOverwrite (event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var readValue = JSON.parse(event.target.result);
    browser.storage.local.set({defCust: readValue}); //store order of custom tags locally
	  location.reload(); // reload page, which reloads custom tags from storage
  };
  reader.readAsText(file);

}

/* ------------------------------ End load and OVERWRITE, bbCodeWebex Tags ---------------- */

/* ------------------------------ Begin tag manipulation and editing ---------------- */
Sortable.create(listOrder, { //uses Sortable library to allow for drag and drop rows
  group: 'listOrder',
  animation: 100
});

async function getMenuClicked (menuId) { //user selection of a menu to edit or delete.
	let customMenu = await custProm;
console.log("Menu ID: ", menuId);
for (i = 0; i < customMenu.length; i++) {
if (menuId == customMenu[i].menuId) {
document.getElementById("menuId").value = customMenu[i].menuId;
document.getElementById("menuTitle").value = customMenu[i].menuTitle;
document.getElementById("menuArg").value = customMenu[i].menuArg;
document.getElementById("parentId").value = customMenu[i].parentId;
}}
}

async function newJSON() { //create new menu item
	let customMenu = await custProm;
document.getElementById("menuId").value = await generateNewId(customMenu);
document.getElementById("menuTitle").value = "";
document.getElementById("menuArg").value = "";
document.getElementById("parentId").value = "bbcwbx.custom";
}

async function saveTagOrd () { // save tag order after dragging and dropping
	let customMenu = await custProm;
let tempSaveSort = [];
let lis = "";
for (i = 0; i < document.getElementById("listOrder").getElementsByTagName("li").length; i++) {
let listMenuId = document.getElementById("listOrder").getElementsByTagName("li")[i].id;
let menuIdx = customMenu.findIndex(p => p.menuId == listMenuId);
lis = lis + menuIdx +" " + listMenuId +"\n";
//tempSaveSort = Object.assign({menuId: customMenu[menuIdx].menuId }, tempSaveSort);
let keyToAdd = {"menuId": customMenu[menuIdx].menuId,
menuTitle: customMenu[menuIdx].menuTitle,
parentId: customMenu[menuIdx].parentId,
menuArg: customMenu[menuIdx].menuArg
};
//console.log(keyToAdd);
tempSaveSort.push(keyToAdd);
//Object.assign(tempSaveSort, keyToAdd);
}
alert(lis);
browser.storage.local.set({defCust: tempSaveSort});; //store order of custom tags locally
location.reload(); // reload page, which reloads custom tags from storage
}

async function writeTag () {// writes new or updated tag to locally stored variable
    let customMenu = await custProm;
currentMenuId = document.getElementById("menuId").value;
currentMenuTitle = document.getElementById("menuTitle").value;
currentMenuArg = document.getElementById("menuArg").value;
currentMenuParentId = document.getElementById("parentId").value;
if (currentMenuId == "") {
alert('Hit the "New" button to create a new tag first.');
} else {
if (currentMenuArg == "" || currentMenuTitle == "") {
alert ("You must enter an argument and title");
} else {
var newMenu = {
    menuId: currentMenuId,
    menuTitle: currentMenuTitle,
    parentId: currentMenuParentId,
    menuArg: currentMenuArg,
	icons: ""
  }
//get the index of the value of currentMenuId in the input box
locationOfRecord = customMenu.findIndex(p => p.menuId == currentMenuId);
console.log(locationOfRecord);
if (locationOfRecord !== -1){ //if a an existing tag replace
customMenu[locationOfRecord] = newMenu;
} else { // if new tag, add to end
customMenu = customMenu.concat(newMenu);
}
browser.storage.local.set({defCust: customMenu}); //store updated tags in local storage
// clear the input boxes after value is saved
document.getElementById("menuId").value = "";
document.getElementById("menuTitle").value = "";
document.getElementById("menuArg").value = "";
document.getElementById("parentId").value = "";
location.reload(); // reload page, which reloads custom tags from storage
}}}

async function delTag (){
	let customMenu = await custProm;
let curId = document.getElementById("menuId").value;
let curTit = document.getElementById("menuTitle").value;
let indId = customMenu.findIndex(p => p.menuId == curId);
if (curId == ""){
alert("Cannot delete empty tag");
} else {
let deleteMe = confirm("Are you sure you want to delete the tag \"" + curTit +"\"?");
//console.log(deleteMe);
if (deleteMe){
console.log(JSON.stringify(customMenu));
removed = customMenu.splice(indId,1);
browser.storage.local.set({defCust: customMenu}); //store updated tags in local storage
}
document.getElementById("menuId").value = ""; // clear out input boxes
document.getElementById("menuTitle").value = "";
document.getElementById("menuArg").value = "";
document.getElementById("parentId").value = "";
location.reload(); // reload page, which reloads custom tags from storage
}
}
/* ------------------------------ End tag manipulation and editing ---------------- */

/* ------------------------------ Begin Export Tags to JSON File ---------------- */
async function expTag () {
	let customMenu = await custProm;
let  expProceed = window.confirm("Save any edits first?\n Any unsaved edits will be lost");
//console.log(expProceed);
if (expProceed) {
let stuffToExportJSON = JSON.stringify(customMenu, null, 2);
let stuffToExportBLOB  = new Blob([stuffToExportJSON], { type: 'application/javascript;charset=utf-8' });
let stuffToExportURL = URL.createObjectURL(stuffToExportBLOB);
let dt = new Date();
let dtlab = dt.toISOString().substring(0,10);
let exportFile = 'bbCode_WebEx_'+dtlab+'.json';
browser.downloads.download({
        url: stuffToExportURL,
        filename: exportFile,
        saveAs: true,
        conflictAction: 'uniquify'
    });
}
}/* ------------------------------ End Export Tags to JSON File ---------------- */


async function generateNewId(customMenu) { //this finds the next available id for a new custom tag
	for (int = 1; int < 1000; int++) {
		var textNum = await int+""; //declare as text
		textNum = await textNum.padStart(3,"0"); //prepend with zeros to make 3 digit number
		if (customMenu.findIndex(p => p.menuId == "bbcwbx.custom."+textNum) == -1) { break;} // if the menu id is not found break, and use this number
	}
	return ("bbcwbx.custom."+await textNum);
}

/* ----------------- Begin Internationalization ------------------
 From https://github.com/erosman/HTML-Internationalization */
for (let node of document.querySelectorAll('[data-i18n]')) {
  let [text, attr] = node.dataset.i18n.split('|');
  text = chrome.i18n.getMessage(text);
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
}
/* ----------------- End Internationalization ----------------- */
