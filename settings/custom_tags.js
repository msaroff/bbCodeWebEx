customMenus = JSON.parse(localStorage.getItem('customMenus'));


//function myFunction() {
var tableRef = document.getElementById("customTagTable").id;
    for (i = 0; i < Object.keys(customMenus).length; i++) {
    let row = customTagList.insertRow();
    let rowId = customMenus[i].menuId;
    row.setAttribute('id', rowId);
//    row.setAttribute('data-href', 'https://duckduckgo.com');
//    row.setAttribute('class', 'clickable');
//    row.setAttribute('onclick','getClicked(rowID)');
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
 

