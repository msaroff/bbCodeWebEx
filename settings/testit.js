const defMenuURL = browser.runtime.getURL('../data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('../data/customMenuTest.json'); //location of initial tutorial custom menu

/*
async function getFromDisk (){
	defmen = await fetch('../data/DefMenu.json');
	jsonFromDisk = await response.json;
	document.getElementById("demo").innerHTML = jsonFromDisk + "<br>" +response;
//	console.log(JSON.stringify(jsonFromDisk));
}

getFromDisk(); */

const request = async () => {
    const defmen = await fetch(defMenuURL);
    const defmenu = await defmen.json();
    const custmen = await fetch(custMenuURL);
    const custmenu = await custmen.json();
	
//    console.log(JSON.stringify(defmenu,null,2));
	document.getElementById("demo").innerHTML = "<h1>Default Menu</h1><pre>" + 
	JSON.stringify(defmenu,null,2) + 
	"</pre><h1>Custom Menu</h1><pre>" + 
	JSON.stringify(custmenu,null,2) +
	"</pre>";
}

request();
