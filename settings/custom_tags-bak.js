
/* 




//var customTagList = document.getElementById('customTagList');

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


console.log(customMenus);

customTagList.addEventListener("click", function(element){
console.log("lenght: ",rows.length);
zzselection = customTagList.getSelectedItem;
console.log("moo", rows.length);
console.log(element.row);
console.log(zzselection);
}); */

//for (i = 0; i < customTagList.length; i++) {
//console.log("Body Row Clicked: ", customTagList[i].rowIndex );
//}
});


//}
//}

 //get table reference
/*
for (var i = 0; i < customMenus.length; i++) {
    var tr = "<tr>";

// Must not forget the $ sign 
    tr += "<td>" + customMenus[i].menuId + "</td>" +"<td>" + customMenus[i].menuTitle + 
"</td>" +"<td>" + customMenus[i].parentId + "</td>" +"<td>" + 
customMenus[i].menuId + "</td>" +"<td>" + customMenus[i].menuArg + 
"</td>"+"</tr>";

// We add the table row to the table body 
    customTagList.innerHTML += tr;
}

*/
/* How to format a number so that it is always 3 digits:

const str1 = '5';

console.log(str1.padStart(3, '0'));
// expected output: "005"

Do a count from 1 to 1000.

when there is no number of value ##N
execute a break, and return that number for a unique value.


// function to get first available integer for unique menuId
function firstAvailInt (listOfNumbers) {

}

convert text value to number:
Number(x1) 
Number("003") gives us 3
 */
