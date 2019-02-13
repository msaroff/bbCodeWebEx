//browser = window.browser;
//colorArg = "{{zzGetColor,\"[color=\",\"]\",\"[/color]\"}}texttoformat{{zzColorEnd}}";
//colorCall = "nocolor";
const importButton = document.getElementById("bbcodeimport");
importButton.addEventListener("click", JSONtoVar);

//var custProm = "";


moop();
function moop(){

	document.getElementById("demo").innerHTML = "<h1>Looking at importing BBCodeXtra Data</h1><br>"+
	"<br><br>Imported JSON:  "+"<br><br><br>"; //+JSONtoVar();
} 


async function JSONtoVar (event) {
//	let customMenu = await custProm;
  var getfile = event.target.files;
  
  var file = getfile[0]
  var reader = new FileReader();
  console.log(getfile,"\n",file,"\n",reader);
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = event.target.result;
    document.getElementById("demo").insertAdjacentHTML('afterend',"<code>"+readValue+"</code>");
//browser.storage.local.set({ defCust: readValue }); //store order of custom tags locally
//location.reload(); // reload page, which reloads custom tags from storage
  };
  //console.log(event.target.result);
  reader.readAsText(file);
 
}
