//browser = window.browser;
//colorArg = "{{zzGetColor,\"[color=\",\"]\",\"[/color]\"}}texttoformat{{zzColorEnd}}";
//colorCall = "nocolor";
const importButton = document.getElementById("bbcodeimport");
importButton.addEventListener("change", JSONtoVar);

//var custProm = "";





async function JSONtoVar (event) {
//	let customMenu = await custProm;
  var getfile = event.target.files;
  
  var file = getfile[0]
  var reader = new FileReader();
//  console.log(getfile,"\n",file,"\n",reader);
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = event.target.result;
    document.getElementById("loaded").innerHTML = "<xmp>"+readValue+"</xmp>";
	document.getElementById("processed").innerHTML = "processedxyzzy";
//browser.storage.local.set({ defCust: readValue }); //store order of custom tags locally
//location.reload(); // reload page, which reloads custom tags from storage
  };
  //console.log(event.target.result);
  reader.readAsText(file);
 
}
