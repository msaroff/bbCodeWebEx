const defMenuURL = browser.runtime.getURL('../data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('../data/customMenuTest.json'); //location of initial tutorial custom menu


/*
const request = async () => {
 let defmen = await fetch(defMenuURL);
    defaultMenuFromDisk = await defmen.json();
 let custmen = await fetch(custMenuURL);
   customMenuFromDisk = await custmen.json();
console.log(JSON.stringify(customMenuFromDisk)); */

//console.log(Object.keys(localStorage));

defaultMenuFromDisk = JSON.parse(localStorage.getItem('defaultMenu'));
customMenuFromDisk = JSON.parse(localStorage.getItem('customMenu'));
function menuFires (){
	console.log("listener fires");
}
browser.storage.onChanged.addListener(menuFires);

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
