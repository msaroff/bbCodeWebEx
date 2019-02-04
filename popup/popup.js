localStorage.setItem("pickColor", "nocolor"); // save localStorage to noselection state
console.log(localStorage.getItem("pickColor"));
window.selColor = "nocolor"; //initialize global variable for selected color

window.addEventListener("unload", function(event) { //when the window is closed
	let sending = browser.runtime.sendMessage({
		message: "color set done"
	});
	console.log("message sent");
	});

// nocolor means that no color has peen picked.  It will be replaced by a user selection  

const table = document.getElementById('colorTable'); 
//console.log(table);
const cells = table.getElementsByTagName('td'); 
//console.log(cells);
getColor();
const cancelButton = document.getElementById("FontColorCancel");
const okButton = document.getElementById("FontColorOk");
//console.log(cancelButton)
/*window.onbeforeunload = confirmExit;
  function confirmExit()
  {
    return "You have attempted to leave this page.  If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
  }


function myFunction() {
  return "Write something clever here...";
}*/

function getColor(){
for (let i = 0; i < cells.length; i++)
  (function (e) {
    cells[e].addEventListener("click", function () {
      let clColor = this.className;
	  selColor = "#"+clColor.substring(1);
	  console.log(selColor);
	  let ccol = document.getElementsByClassName("curcol");
	  console.log(ccol[0]);
	  ccol[0].style.backgroundColor = selColor;
	  document.getElementById("FontColor").value = selColor;
    }, false);
  })(i);
}

cancelButton.addEventListener("click", zzclose); // close window when click cancel button
okButton.addEventListener("click", savePick); // Save selected color and close window when click OK

function savePick (){
	localStorage.setItem("pickColor", selColor); 
	zzclose ();
}

function zzclose (){
	window.close();
}