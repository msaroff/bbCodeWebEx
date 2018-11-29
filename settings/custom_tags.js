customMenus = JSON.parse(localStorage.getItem('customMenus'));

var ulSort = document.getElementById("listOrder");
var listRef = document.getElementById("listOrder").li;

//console.log(ulSort);
    for (i = 0; i < Object.keys(customMenus).length; i++) {

const containerSpan = document.createElement('span');
      containerSpan.classList.add("grid-container");
const menuIdSpan = document.createElement('span');
      menuIdSpan.classList.add("baseSort", "menuIdBody");
const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add("baseSort", "menuTitleBody");
const parentIdSpan = document.createElement('span');
      parentIdSpan.classList.add("baseSort", "menuParentIdBody");
const menuArgSpan = document.createElement('span');
      menuArgSpan.classList.add("baseSort", "menuArgBody");
    var createLi = document.createElement("li"); 
    createLi.setAttribute('id', customMenus[i].menuId);
    createLi.setAttribute('draggable', true);
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
console.log(singleRowId)
document.getElementById(singleRowId).addEventListener('click', () => {getMenuClicked(singleRowId);});
}


/*
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
alert("Menu Order \nMenu ID \t\t\t\Menu Title\t\t\tParent ID\t\tMenu Argument"+menuOrdTest);
}

*/



function customTagClicked (wotClicked){
alert(wotClicked);
}

/*
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
*/
 

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