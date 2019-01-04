const defMenuURL = browser.runtime.getURL('../data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('../data/customMenuTest.json'); //location of initial tutorial custom menu



const request = async () => {
    let defmen = await fetch(defMenuURL);
    defaultMenuFromDisk = await defmen.json();
    let custmen = await fetch(custMenuURL);
    customMenuFromDisk = await custmen.json();
	document.getElementById("demo").innerHTML = "<h1>Default Menu</h1><xmp>" + 
	JSON.stringify(defaultMenuFromDisk,null,2) + 
	"</xmp><h1>Custom Menu</h1><xmp>" + 
	JSON.stringify(customMenuFromDisk,null,3) +
	"</xmp>";
}

request();
