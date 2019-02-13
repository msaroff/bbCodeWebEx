browser = window.browser;
//colorArg = "{{zzGetColor,\"[color=\",\"]\",\"[/color]\"}}texttoformat{{zzColorEnd}}";
//colorCall = "nocolor";
const importButton = document.getElementById("bbcodeimport");
importButton.addEventListener("click", JSONtoVar);
const toVar = bbcodeimport.addEventListener("load", JSONtoVar );

moop();
function moop(){

	document.getElementById("demo").innerHTML = "<h1>Looking at importing BBCodeXtra Data</h1><br>"+
	"<br><br>Imported JSON:  "+"<br><br><br>"+JSONtoVar();
}


async function JSONtoVar (event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = event.target.result;
//    console.log(readValue);
location.reload(); // reload page, which reloads custom tags from storage
  };
  reader.readAsText(file);
  return await reader
}
/*
async bbcodeimport (){
	let importedStuff = JSON.parse(await JSONtoVar ());
	return importedStuff;
	
}
*/

