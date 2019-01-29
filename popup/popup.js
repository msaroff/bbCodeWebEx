var table = document.getElementById('colorTable'); 
console.log(table);
var cells = table.getElementsByTagName('td'); 
console.log(cells);
getColor();

function getColor(){
for (var i = 0; i < cells.length; i++)
  (function (e) {
    cells[e].addEventListener("click", function () {
      console.log(this.className.substring(1));
    }, false);
  })(i);
}