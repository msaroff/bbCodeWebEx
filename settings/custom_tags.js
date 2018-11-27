customMenus = JSON.parse(localStorage.getItem('customMenus'));

// id="saveTagOrder"  Save tag order button
document.getElementById('saveTagOrder').addEventListener("click",saveTagOrd);

function saveTagOrd (){
menuOrdTest = "";
for (i = 0; i < customMenus.length; i++) {
menuOrdTest += '\n'+customMenus[i].menuId+"\t"
menuOrdTest += customMenus[i].menuTitle+"\t"
menuOrdTest += customMenus[i].parentId+"\t"
menuOrdTest += customMenus[i].menuArg;
}
//console.log("Menu Order\nMenu ID Menu \tTitle \tParent ID \tMenu Argument"+menuOrdTest);
alert("Menu Order \nMenu ID \t\t\t\Menu Title\t\t\tParent ID\t\tMenu Argument"+menuOrdTest);
}

var tableRef = document.getElementById("customTagTable").id;
var ulSort = document.getElementById("listOrder");
console.log(ulSort);
    for (i = 0; i < Object.keys(customMenus).length; i++) {
    let row = customTagList.insertRow();
    let rowId = customMenus[i].menuId;
    row.setAttribute('id', rowId);
    row.setAttribute('draggable', true);

//console.log("xyzzy ",row);
var addCell = row.insertCell(0);
  var newText  = document.createTextNode(customMenus[i].menuArg)
  addCell.appendChild(newText);
var addCell = row.insertCell(0);
  var newText  = document.createTextNode(customMenus[i].parentId)
  addCell.appendChild(newText);
var addCell = row.insertCell(0);
  var newText  = document.createTextNode(customMenus[i].menuTitle)
  addCell.appendChild(newText);
var addCell = row.insertCell(0);
  var newText  = document.createTextNode(customMenus[i].menuId)
  addCell.appendChild(newText);

const containerDiv = document.createElement('div');
      containerDiv.classList.add("grid-container");
const menuIdDiv = document.createElement('div');
      menuIdDiv.classList.add("grid-item-menuId");
const menuTitleDiv = document.createElement('div');
      menuTitleDiv.classList.add("grid-item-menuTitle");
const parentIdDiv = document.createElement('div');
      parentIdDiv.classList.add("grid-item-parentId");
const menuArgDiv = document.createElement('div');
      menuArgDiv.classList.add("grid-item-menuArg");
    var listId = customMenus[i].menuId + "-lst";
//console.log(menuIdDiv);
    var createLi = document.createElement("li"); 
    createLi.setAttribute('id', listId);
    createLi.setAttribute('draggable', true);
/*
grid-item-menuTitle
grid-item-parentId
grid-item-menuArg
grid-container
*/
    
    menuIdDiv.appendChild(document.createTextNode(customMenus[i].menuId));
    menuTitleDiv.appendChild(document.createTextNode(customMenus[i].menuTitle));
    parentIdDiv.appendChild(document.createTextNode(customMenus[i].parentId));
    menuArgDiv.appendChild(document.createTextNode(customMenus[i].menuArg));
console.log(menuIdDiv,menuTitleDiv);

    containerDiv.appendChild(menuIdDiv);
    containerDiv.appendChild(menuTitleDiv);
    containerDiv.appendChild(parentIdDiv);
    containerDiv.appendChild(menuArgDiv);
    createLi.appendChild(containerDiv);
//console.log(createLi);
 

  ulSort.appendChild(createLi);
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


var tableRef = document.getElementById("customTagList").rows;
//console.log(tableRef[1]);
for (i = 0; i < tableRef.length; i++) {
let singleRow = tableRef[i];
let singleRowId = tableRef[i].id;
singleRow.addEventListener('click', () => {getMenuClicked(singleRowId);});
}
 

