browser = window.browser;
//colorArg = "{{zzGetColor,\"[color=\",\"]\",\"[/color]\"}}texttoformat{{zzColorEnd}}";
//colorCall = "nocolor";
const importButton = document.getElementById("bbcodeimport");
importButton.addEventListener("click", JSONtoVar);
var custProm = "";
importButton.addEventListener("click", tagImport);

fileButton.addEventListener("click", JSONtoVar);

moop();
function moop(){

	document.getElementById("demo").innerHTML = "<h1>Looking at importing BBCodeXtra Data</h1><br>"+
	"<br><br>Imported JSON:  "+"<br><br><br>"+JSONtoVar();
}

async function tagImport () {
	let customMenu = await custProm;
/* click on the file input button this is a hack using the submit button 
to click on the file button while maintaining the same appearance as 
the other submit buttons. */
alert("\t\t\t\tWarning:\nThis will overwrite existing custom tags and tag order.");
confirm("\tAre you sure you want to proceed?\n     Click OK to proceed, or cancel and then\nbackup your current setup before proceeding.");
importTags.click();
}

async function JSONtoVar (event) {
	let customMenu = await custProm;
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = event.target.result;
//    console.log(readValue);
browser.storage.local.set({ defCust: readValue }); //store order of custom tags locally
location.reload(); // reload page, which reloads custom tags from storage
  };
  reader.readAsText(file);
}
/*
async bbcodeimport (){
	let importedStuff = JSON.parse(await JSONtoVar ());
	return importedStuff;
	
}
*/

