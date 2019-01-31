var table = document.getElementById('colorTable'); 
console.log(table);
var cells = table.getElementsByTagName('td'); 
console.log(cells);
getColor();
const cancelButton = document.getElementById("FontColorCancel");
console.log(cancelButton)
/*window.onbeforeunload = confirmExit;
  function confirmExit()
  {
    return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
  }


function myFunction() {
  return "Write something clever here...";
}*/

function getColor(){
for (var i = 0; i < cells.length; i++)
  (function (e) {
    cells[e].addEventListener("click", function () {
      let clColor = this.className;
	  let selColor = "#"+clColor.substring(1);
	  console.log(selColor);
	  let ccol = document.getElementsByClassName("curcol");
	  console.log(ccol[0]);
	  ccol[0].style.backgroundColor = selColor;
	  document.getElementById("FontColor").value = selColor;
    }, false);
  })(i);
}

cancelButton.addEventListener("click", zzclose);// window.close()); //close windo when click cancel button

function zzclose (){
	window.close();
}