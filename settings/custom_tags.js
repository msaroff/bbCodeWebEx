
/* Global variables */
var custProm = initialize();

async function initialize () {
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



var ulSort = document.getElementById("listOrder");

var listRef = document.getElementById("listOrder").li;

Save.addEventListener("click", writeTag);

New.addEventListener("click", newJSON);

Delete.addEventListener("click", delTag);

importTags.addEventListener("load", JSONtoVar );

const importButton = document.getElementById("importTagsClick");

const fileButton = document.getElementById('importTags');

const importButtonBBCodeXtra = document.getElementById("BBCodeXtraImport");

const callButtonBBCodeXtra = document.getElementById("BBCodeXtraLoad");
const newTag = document.getElementById("New");

callButtonBBCodeXtra.addEventListener("change", loadBBCodeXtra);

importButtonBBCodeXtra.addEventListener("click", trigImportBBCodeXtra);

importButton.addEventListener("click", tagImport);

fileButton.addEventListener("click", JSONtoVar);



function trigImportBBCodeXtra () {
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

async function procCustBBCXtags (oldCodes){
	customMenu = await custProm;
	let oldTags = oldCodes;
	console.log(JSON.stringify(oldTags).substring(0,300));
	let sortedTags = oldTags.sort(function(a, b){
		return a.name > b.name;
	});
	let toImport = []; //initialize array to be imported.
	New.click(); //click on add new custom tag button
//	let mId = document.getElementById("menuId").value;
	for (i = 1; i < 1000; i++) {// Allows up to 1000 custom tags
	var textNum = i+""; //declare as text
	var textNum = textNum.padStart(3,"0"); //prepend with zeros to make 3 digit number
	if (customMenu.findIndex(p => p.menuId == "bbcwbx.custom."+textNum) == -1) { break;} // if the menu id is not found break, and use this number
	}
	let mId = "bbcwbx.custom." + textNum;
//  let mId = document.getElementById("menuId").value;
	let mParent = "bbcwbx.custom";
//	let mParent = document.getElementById("parentId").value;
	let mTitle = sortedTags[1].value; //title of custom tag
	let mArg = sortedTags[0].value; //argument of custom tag
	console.log(mId,mTitle,mArg,mParent);
//  document.getElementById("menuTitle").focus()
//	document.getElementById('menuTitle').value = "blblblbl";
//	let moo = document.getElementById('menuTitle').value;
//	console.log("moo",moo);
//	document.getElementById("menuTitle").value = customMenu[i].menuTitle;
//	document.getElementById("menuArg").value = mArg;
//	console.log(document.getElementById("menuArg").value);
	let newMenuBCodeXtra = {
    menuId: mId,
    menuTitle: mTitle,
    parentId: mParent,
    menuArg: mArg,
	icons: ""
  }
  console.log(newMenuBCodeXtra);
  customMenu = customMenu.concat(newMenuBCodeXtra);
//  console.log(JSON.stringify(customMenu));

//	document.getElementById("menuArg").value = customMenu[i].menuArg;

/*	for (i = 0; i < Object.keys(sortedTags).length; i++){ // go through the entire array
		if (sortedTags[i].name.includes("custom") && sortedTags[i].name.includes("action")){
			console.log(sortedTags[i].name);
			New.click(); //click on add new custom tag button
			let mTitle = sortedTags[i+1].value; //title of custom tag
			let mArg = sortedTags[i].value; //argument of custom tag
			mArg = mArg.replace(/_clipboard_/ig,'{{clipboard}}'); //change to my notation
			mArg = mArg.replace(/_selection_/ig,'{{selection}}'); //change to my notation
			document.getElementById("menuTitle").value = mTitle;
			document.getElementById("menuArg").value = mArg;
			Save.click(); 
		}
	}	
	return (toImport); */
	browser.storage.local.set({defCust: customMenu}); //store updated tags in local storage
	location.reload(); // reload page, which reloads custom tags from storage

}
/* */
//console.log(ulSort);


Sortable.create(listOrder, {
  group: 'listOrder',
  animation: 100
});





 

async function getMenuClicked (menuId) {
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

async function newJSON() {
	let customMenu = await custProm;
// step through numbers until you find an open id
for (i = 1; i < 1000; i++) {// Allows up to 1000 custom tags
var textNum = i+""; //declare as text
var textNum = textNum.padStart(3,"0"); //prepend with zeros to make 3 digit number
if (customMenu.findIndex(p => p.menuId == "bbcwbx.custom."+textNum) == -1) { break;} // if the menu id is not found break, and use this number
}
console.log(textNum);
document.getElementById("menuId").value = "bbcwbx.custom." + textNum;
document.getElementById("menuTitle").value = "";
document.getElementById("menuArg").value = "";
document.getElementById("parentId").value = "bbcwbx.custom";
}


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

async function JSONtoVar (event) {
	let customMenu = await custProm;
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = JSON.parse(event.target.result);
    //console.log(readValue);
browser.storage.local.set({ defCust: readValue }); //store order of custom tags locally
location.reload(); // reload page, which reloads custom tags from storage
  };
  reader.readAsText(file);
}


// listen for save tag order button
const saveButton = document.getElementById("saveTagOrder");

saveButton.addEventListener("click", saveTagOrd);

async function saveTagOrd () {
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

// listen for export tags button
const exportButton = document.getElementById("exportTags");

exportButton.addEventListener("click", expTag);

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



// ----------------- Internationalization ------------------
// From https://github.com/erosman/HTML-Internationalization
for (let node of document.querySelectorAll('[data-i18n]')) {
  let [text, attr] = node.dataset.i18n.split('|');
  text = chrome.i18n.getMessage(text);
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
}
// ----------------- /Internationalization -----------------
