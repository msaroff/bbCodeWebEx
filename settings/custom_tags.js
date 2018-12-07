customMenus = JSON.parse(localStorage.getItem('customMenus'));

var ulSort = document.getElementById("listOrder");
var listRef = document.getElementById("listOrder").li;

//console.log(ulSort);
    for (i = 0; i < Object.keys(customMenus).length; i++) {

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
    createLi.setAttribute('id', customMenus[i].menuId);
    createLi.setAttribute('draggable', true);
    createLi.classList.add("listItem");
    menuIdSpan.appendChild(document.createTextNode(customMenus[i].menuId));
    menuTitleSpan.appendChild(document.createTextNode(customMenus[i].menuTitle));
    parentIdSpan.appendChild(document.createTextNode(customMenus[i].parentId));
    menuArgSpan.appendChild(document.createTextNode(customMenus[i].menuArg));
//console.log(menuIdSpan,menuTitleSpan);
    containerSpan.appendChild(menuIdSpan);
    containerSpan.appendChild(menuTitleSpan);
    containerSpan.appendChild(parentIdSpan);
    containerSpan.appendChild(menuArgSpan);
createLi.appendChild(containerSpan);
  ulSort.appendChild(createLi);
}




for (i = 0; i < customMenus.length; i++) {
let singleRow = customMenus[i];
let singleRowId = customMenus[i].menuId;
//console.log(singleRowId)
document.getElementById(singleRowId).addEventListener('click', () => {getMenuClicked(singleRowId);});
}


 

function getMenuClicked (menuId) {
console.log("Menu ID: ", menuId);
for (i = 0; i < customMenus.length; i++) {
if (menuId == customMenus[i].menuId) {
document.getElementById("menuId").value = customMenus[i].menuId;
document.getElementById("menuTitle").value = customMenus[i].menuTitle;
document.getElementById("menuArg").value = customMenus[i].menuArg;
document.getElementById("parentId").value = customMenus[i].parentId;
}}
}

const saveTag = Save.addEventListener("click", writeTag);

const newMenu = New.addEventListener("click", newJSON);

const toVar = importTags.addEventListener("load", JSONtoVar );

const importButton = document.getElementById("importTagsClick");

const fileButton = document.getElementById('importTags')

importButton.addEventListener("click", tagImport);

fileButton.addEventListener("click", JSONtoVar);

function newJSON() {
// Extract all menu IDs and put into a string matrix titleList
titleList = "";
for (i = 0; i < Object.keys(customMenus).length; i++) {
titleList = titleList + customMenus[i].menuId+"\n";
}
for (i = 1; i < 1000; i++) {// Allows up to 1000 custom tags
var textNum = i+"";
var textNum = textNum.padStart(3,"0");
if (!titleList.includes(textNum)) { break;}
}
console.log(textNum);
document.getElementById("menuId").value = "bbcwbx.custom." + textNum;
document.getElementById("menuTitle").value = "";
document.getElementById("menuArg").value = "";
document.getElementById("parentId").value = "bbcwbx.custom";
}


function tagImport () {
/* click on the file input button this is a hack using the submit button 
to click on the file button while maintaining the same appearance as 
the other submit buttons. */
alert("\t\t\t\tWarning:\nThis will overwrite existing custom tags and tag order.");
confirm("\tAre you sure you want to proceed?\n     Click OK to proceed, or cancel and then\nbackup your current setup before proceeding.");
importTags.click();
}

function JSONtoVar (event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = event.target.result;
//    console.log(readValue);
localStorage.setItem('customMenus',readValue); //store order of custom tags locally
location.reload(); // reload page, which reloads custom tags from storage
  };
  reader.readAsText(file);
}


// listen for save tag order button
const saveButton = document.getElementById("saveTagOrder");

saveButton.addEventListener("click", saveTagOrd);

function saveTagOrd () {
let tempSaveSort = [];
let lis = "";
for (i = 0; i < document.getElementById("listOrder").getElementsByTagName("li").length; i++) {
let listMenuId = document.getElementById("listOrder").getElementsByTagName("li")[i].id;
let menuIdx = customMenus.findIndex(p => p.menuId == listMenuId);
lis = lis + menuIdx +" " + listMenuId +"\n";
//tempSaveSort = Object.assign({menuId: customMenus[menuIdx].menuId }, tempSaveSort);
let keyToAdd = {"menuId": customMenus[menuIdx].menuId,
menuTitle: customMenus[menuIdx].menuTitle,
parentId: customMenus[menuIdx].parentId,
menuArg: customMenus[menuIdx].menuArg
};
//console.log(keyToAdd);
tempSaveSort.push(keyToAdd);
//Object.assign(tempSaveSort, keyToAdd);
}
alert(lis);
//console.log(JSON.stringify(customMenus));
console.log(JSON.stringify(tempSaveSort));
localStorage.setItem('customMenus',JSON.stringify(tempSaveSort)); //store order of custom tags locally
//customMenus = JSON.parse(localStorage.getItem('customMenus')); //reread custom tags from local storage
location.reload(); // reload page, which reloads custom tags from storage
}

// listen for export tags button
const exportButton = document.getElementById("exportTags");

exportButton.addEventListener("click", expTag);

function expTag () {
let  expProceed = window.confirm("Save any edits first?\n Any unsaved edits will be lost");
console.log(expProceed);
if (expProceed) {
let stuffToExportJSON = JSON.stringify(customMenus, null, 2);
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

function writeTag () {// writes new or updated tag to disk
currentMenuId = document.getElementById("menuId").value;
currentMenuTitle = document.getElementById("menuTitle").value;
currentMenuArg = document.getElementById("menuArg").value;
currentMenuParentId = document.getElementById("parentId").value;

let newMenu = {
    menuId: currentMenuId,
    menuTitle: currentMenuTitle,
    parentId: currentMenuParentId,
    menuArg: currentMenuArg
  }
console.log(newMenu);
let stuff2Add = customMenus.concat(newMenu);
localStorage.setItem('customMenus',JSON.stringify(stuff2Add)); //store updated tags in local storage
location.reload(); // reload page, which reloads custom tags from storage

}

// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================
// =======================================================================================================================

// code by Friso NL - frisog at gmail .com

// events to create according to: http://www.html5rocks.com/en/tutorials/dnd/basics/
//
// dragstart
// drag
// dragenter
// dragleave
// dragover
// drop
// dragend
// Code found at https://codereview.stackexchange.com/questions/127271/javascript-drag-and-drop-sortable-list
// https://codereview.stackexchange.com/users/104390/friso-nl
// author: Friso Gouwetor 



var listItems = document.querySelectorAll('.listItem');




var dragSrcEl = null;

function handleDragStart(e) {
  this.className += " dragStartClass";
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  e.dataTransfer.setDragClass("dataTransferClass");
//just added
  e.target.style.border = "5px solid #ffffff";

}

function handleDragOver(e) {
  // if (e.preventDefault) { not needed according to my question and anwers on : http://stackoverflow.com/questions/36920665/why-if-statement-with-e-preventdefault-drag-and-drop-javascript
  e.preventDefault();
  // }
  e.dataTransfer.dropEffect = 'move'; // sets cursor
  return false;

}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {

  var listItems = document.querySelectorAll('.listItem');
  e.stopPropagation(); // stops the browser from redirecting.
  dragSrcOrderId = parseInt(dragSrcEl.getAttribute("order-id"));
  dragTargetOrderId = parseInt(this.getAttribute("order-id"));
  var tempThis = this;


  // Don't do anything if dropping the same column we're dragging.
  // and
  // check if only one difference and then do not execute
  // && ((Math.abs(dragSrcOrderId - dragTargetOrderId)) != 1)
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    var tempThis = this;

    function makeNewOrderIds(tempThis) {
      // check if up or down movement

      dragSrcEl.setAttribute("order-id", dragTargetOrderId);
      tempThis.setAttribute("order-id", dragTargetOrderId);

      //  find divs between old and new location and set new ids - different in up or down movement (if else)
      if (dragSrcOrderId < dragTargetOrderId) {
        for (i = dragSrcOrderId + 1; i < dragTargetOrderId; i++) {
          listItems[i].setAttribute("order-id", i - 1);
          // set new id src
          dragSrcEl.setAttribute("order-id", dragTargetOrderId - 1);
        }
      } else {
        for (i = dragTargetOrderId; i < dragSrcOrderId; i++) {
          listItems[i].setAttribute("order-id", i + 1);
          // set new id src
          dragSrcEl.setAttribute("order-id", dragTargetOrderId);

        }
      }

    };
    makeNewOrderIds(tempThis);


    dragSrcEl.classList.remove("dragStartClass");

    reOrder(listItems);




  } else {

    dragSrcEl.classList.remove("dragStartClass");
    return false;

  }

};

function handleDragEnd(e) {

  for (i = 0; i < listItems.length; i++) {
    listItem = listItems[i];
    listItem.classList.remove('over');
  }
  dragSrcEl.classList.remove("dragStartClass");
  e.target.style.border = "none";


}



for (i = 0; i < listItems.length; i++) {
  listItem = listItems[i];


  listItem.setAttribute("order-id", i);



  listItem.addEventListener('dragstart', handleDragStart, false)
  listItem.addEventListener('dragenter', handleDragEnter, false)
  listItem.addEventListener('dragover', handleDragOver, false)
  listItem.addEventListener('dragleave', handleDragLeave, false)
  listItem.addEventListener('drop', handleDrop, false)
  listItem.addEventListener('dragend', handleDragEnd, false)
}

function reOrder(listItems) {


  var tempListItems = listItems;
  tempListItems = Array.prototype.slice.call(tempListItems, 0);

  tempListItems.sort(function(a, b) {
    return a.getAttribute("order-id") - b.getAttribute("order-id");
  });



  var parent = document.getElementById('listOrder');
  parent.innerHTML = "";

  for (var i = 0, l = tempListItems.length; i < l; i++) {
    parent.appendChild(tempListItems[i]);
  }
};

