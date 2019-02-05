browser = window.browser;
colorArg = "{{zzGetColor,\"[color=\",\"]\",\"[/color]\"}}texttoformat{{zzColorEnd}}";
colorCall = "nocolor";
browser.storage.local.set({"pickColor": colorCall});



moop(colorArg);
function moop(colorArg){
	let {pickColor: meep} = browser.storage.local.get("pickColor");
	moo = meep;
	document.getElementById("demo").innerHTML = "<h1>Checking Out Color processing</h1><br>"+colorArg+
	"<br><br>Nocolor Argument:  "+moo+"<br><br><br><br><br><br>"+colorPick(colorArg);
}



colorPick(colorArg);

async function colorPick (colorArg){ //read the color from the popup
	let {pickColor: colorPicked} = await browser.storage.local.get("pickColor");
	if (colorPicked == "nocolor"){ //No color selected, clear color agument
		let colorStartStartIdx = colorArg.indexOf('{{zzGetColor'); 
			let colorStartEndIdx = colorArg.indexOf("}}", colorStartStartIdx) + 2;
		    colorArg = colorArg.substring(0,colorStartStartIdx)+colorArg.substring(colorStartEndIdx);
			let colorEndStartIdx = colorArg.indexOf("{{zzColorEnd");
			let colorEndEndIdx = colorArg.indexOf("}}", colorEndStartIdx) + 2;
		    colorArg = colorArg.substring(0,colorEndStartIdx)+colorPicked.substring(colorEndEndIdx);
		}   else { //Color selected,  process color argument
			let colorStartStartIdx = colorArg.indexOf("{{zzpopup");
			let colorStartEndIdx = colorArg.indexOf("}}", colorStartStartIdx) + 2;
			let colorWork = colorArg.substring(colorStartStartIdx,colorStartEndIdx);
			colorWork = colorWork.substring(colorWork.indexOf(",") + 1); //drop title from popWork
			let startColorTag = colorWork.substring(1, colorWork.indexOf(",")-1); 
			colorWork = colorWork.substring(colorWork.indexOf(",")+2);
			let endColorTag = colorWork.substring(0,colorWork.indexOf(",")-1);
			colorWork = colorWork.substring(colorWork.indexOf(",")+2);
			let finalColorTab = colorWork.substring(0,colorWork.indexOf("\""));;
			colorArg = colorArg.substring(colorStartEndIdx);
			colorArg = colorArg.substring(0,colorArg.indexOf("{{")),
			colorArg = startColorTag+colorPicked+endColorTag+colorArg+finalColorTab;
			console.log(colorArg);
	}	
	return(colorArg) 
}



/* const defMenuURL = browser.runtime.getURL('../data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('../data/customMenuTest.json'); //location of initial tutorial custom menu */


/*
const request = async () => {
 let defmen = await fetch(defMenuURL);
    defaultMenuFromDisk = await defmen.json();
 let custmen = await fetch(custMenuURL);
   customMenuFromDisk = await custmen.json();
console.log(JSON.stringify(customMenuFromDisk)); */

//console.log(Object.keys(localStorage));

/*
defaultMenuFromDisk = JSON.parse(localStorage.getItem('defaultMenu'));
customMenuFromDisk = JSON.parse(localStorage.getItem('customMenu'));
function menuFires (){
	console.log("listener fires");
} */


//browser.storage.onChanged.addListener(menuFires);

/*
async function request() {
browser.storage.local.set({customMenuFromDisk});
var { customMenuFromDisk: cstmnudsk } = await browser.storage.local.get(['customMenuFromDisk']);//, function(result) {
       //var cstmnudsk = result.customMenuFromDisk;   
//		console.log (JSON.stringify(cstmnudsk,null,3));
//		 });
var wtf = await browser.storage.local.get();
console.log(JSON.stringify(wtf,null,2));
}

request();

*/


//console.log(JSON.stringify(moo,null,5));
// ;//,function(result));

//console.log(JSON.stringify(moo,null,5)) ; //customMenuFromDisk.then((result), onError);


	//delete customMenuFromDisk;
	//console.log(customMenuFromDisk);

/*	document.getElementById("demo").innerHTML = "<h1>Default Menu</h1><xmp>" + 
	JSON.stringify(defaultMenuFromDisk,null,2) + 
	"</xmp><h1>Custom Menu</h1><xmp>" + 
	JSON.stringify(customMenuFromDisk,null,3) +
	"</xmp>"; */
//console.log(JSON.stringify(customMenuFromDisk,null,1));
