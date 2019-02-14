//browser = window.browser;
//colorArg = "{{zzGetColor,\"[color=\",\"]\",\"[/color]\"}}texttoformat{{zzColorEnd}}";
//colorCall = "nocolor";
const importButton = document.getElementById("bbcodeimport");
const callButton = document.getElementById("bbcodeimportclick");
importButton.addEventListener("change", loadBBCodeXtra);
callButton.addEventListener("click", trigImport);

//var custProm = "";





function loadBBCodeXtra (event) {
//	let customMenu = await custProm;
  var getfile = event.target.files;
  
  var file = getfile[0]
  var reader = new FileReader();
//  console.log(getfile,"\n",file,"\n",reader);
  reader.onload = function(event) {
    // The file's text will be printed here
    let readValue = event.target.result;
    document.getElementById("loaded").innerHTML = "<xmp>"+readValue.substring(0,100)+"</xmp>";
	let forImport = procCustBBCXtags(readValue);
	document.getElementById("processed").innerHTML = "<xmp>"+JSON.stringify(forImport,null,4)+"</xmp>";
//browser.storage.local.set({ defCust: readValue }); //store order of custom tags locally
//location.reload(); // reload page, which reloads custom tags from storage
  };
  //console.log(event.target.result);
  reader.readAsText(file);
 
}

function procCustBBCXtags (oldCodes){
	let oldTags = JSON.parse(oldCodes);
	console.log(JSON.stringify(oldTags,null,2).substring(0,100));
	let sortedTags = oldTags.sort(function(a, b){
		return a.name > b.name;
	});
	let toImport = []; //initialize array to be imported.
	console.log(JSON.stringify(sortedTags,null,2).substring(0,100));
	for (i = 0; i < Object.keys(sortedTags).length; i++){ // go through the entire array
		if (sortedTags[i].name.includes("custom") && sortedTags[i].name.includes("action")){
//			console.log(sortedTags[i].name);
			let impObject = {menuTitle: sortedTags[i+1].value, menuArg: sortedTags[i].value};
			toImport.push(impObject);
		}
	}
		
	
	return (toImport);
}

async function trigImport () {
	importButton.click();
}