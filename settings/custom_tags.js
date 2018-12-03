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


/*
// id="saveTagOrder"  Save tag order button
document.getElementById('saveTagOrder').addEventListener("click",saveTagOrd);

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


// listen for save tag order button
const saveButton = document.getElementById("saveTagOrder");

saveButton.addEventListener("click", saveTagOrd);

function saveTagOrd () {
let tempSaveSort = {};
let lis = "";
for (i = 0; i < document.getElementById("listOrder").getElementsByTagName("li").length; i++) {
let listMenuId = document.getElementById("listOrder").getElementsByTagName("li")[i].id;
let menuIdx = customMenus.findIndex(p => p.menuId == listMenuId);
lis = lis + menuIdx +" " + listMenuId +"\n";
}
alert(lis);
}

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