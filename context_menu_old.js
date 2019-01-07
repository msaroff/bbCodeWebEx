function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}

// Create listener to update the menus when they are changed in the settings pages
browser.storage.onChanged.addListener(invokeDefaultMenus);

// when you are changing menus in settings, first remove the existing menus before regenerating the menu
//	var removing = browser.menus.removeAll();


//read the custom menus from local storage:
customMenus = JSON.parse(localStorage.getItem('customMenus'));

const defMenuURL = browser.runtime.getURL('data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('data/customMenuTest.json'); //location of initial tutorial custom menu

activeMenus = invokeDefaultMenus();

var defaultMenu = [];
var defMenu = [];

function invokeDefaultMenus() { 
	
// set the falue to the defaults, or the saved value if it exists
    let defaultMenus = {
        enablebbCode: true,
        enableHTML: true,
        enableVbulletin: true,
        enableXHTML: true,
        enableMarkDown: true,
        enableCustom: true,
        enableSymbol: false
    };
    if (localStorage.getItem("activeMenus") === null) { //if menu settings not stored, 
        localStorage.setItem('activeMenus',JSON.stringify(defaultMenus)); //store default in local storage
    }
        return JSON.parse(localStorage.getItem('activeMenus')); // load stored values if necessary
}
console.log("localstor1",(localStorage.getItem('defaultMenu')));
fetch(defMenuURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(defaultMenu) {
        defMenu = defaultMenu; //create variable with global scope
        console.log("def",defMenu);
		localStorage.setItem('defaultMenu',JSON.stringify(defMenu));
		generateMenu();
	})


function generateMenu(){
	// when you are changing menus in settings, first remove the existing menus before regenerating the menu
	var removing = browser.menus.removeAll();
	let defaultMenu = JSON.parse(localStorage.getItem('defaultMenu'));
	console.log("gentest",defaultMenu);
        for (i = 0; i < defaultMenu.length; i++) {
            let currentId = defaultMenu[i].menuId;
            let nobbCode = (currentId.substring(0,13) == 'bbcwbx.bbcode') && !activeMenus.enablebbCode;
            let noHTML = (currentId.substring(0,11) == 'bbcwbx.html') && !activeMenus.enableHTML;
            let noVbl = (currentId.substring(0,17) == 'bbcwbx.bbcode.vbl') && !activeMenus.enableVbulletin;
            let noXHTML = (currentId.substring(0,12) == 'bbcwbx.xhtml') && !activeMenus.enableXHTML;
            let noMKDN = (currentId.substring(0,11) == 'bbcwbx.mkdn') && !activeMenus.enableMarkDown; 
            let noCstm = (currentId.substring(0,13) == 'bbcwbx.custom') && !activeMenus.enableCustom;
            let noSym = (currentId.substring(0,19) == 'bbcwbx.sym') && !activeMenus.enableSymbol;
    if (nobbCode) {
            console.log('No bbCode');
        } else if (noHTML) {
            console.log('No HTML');
        } else if (noHTML) {
            console.log('No HTML');
        } else if (noVbl) {
            console.log('No vBulletin');
        } else if (noXHTML) {
            console.log('No XHTML');
        } else if (noMKDN) {
            console.log('No Mark Down');
        } else if (noMKDN) {
            console.log('No Mark Down');
        } else if (noCstm) {
        console.log('No Custom Tags');
        } else if (noSym) {
        console.log('No Symbols');
    } else {
        info = {
            id: defaultMenu[i].menuId,
            title: defaultMenu[i].menuTitle, //eventually this becomes an i18n call
            contexts: ["all"]
        };
        if (defaultMenu[i].menuTitle.includes("i18n")) {
            info.title = browser.i18n.getMessage(defaultMenu[i].menuId); // lookup i18n
        } else {
            info.title = defaultMenu[i].menuTitle; // no i18n, probably custom tag
        }
        if (defaultMenu[i].icons != "") {
            info.icons = defaultMenu[i].icons;
        };
        if (defaultMenu[i].parentId != "") {
            info.parentId = defaultMenu[i].parentId;
        }
        browser.menus.create(info);
    }
    }
}

// load custom menus
fetch(custMenuURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(CustomMenuFromDisk) {
    customMenus = JSON.parse(localStorage.getItem('customMenus'));// get stored custom menus, if any
    if (customMenus == null){ // if there are no stored custom menus
    customMenus = CustomMenuFromDisk; // take the results of the file loaded from disk
    localStorage.setItem('customMenus',JSON.stringify(customMenus)); //and write to local storage
    }
    if (activeMenus.enableCustom) { // process custom tags if custom tags are enabled.
    for (i = 0; i < customMenus.length; i++) {
        custInfo = {
            id: customMenus[i].menuId,
            title: customMenus[i].menuTitle, //eventually this becomes an i18n call
            contexts: ["all"]
        };
        if (customMenus[i].menuTitle.includes("i18n")) {
            custInfo.title = browser.i18n.getMessage(customMenus[i].menuId); // lookup i18n
        } else {
            custInfo.title = customMenus[i].menuTitle; // no i18n, probably custom tag
        }
        if (customMenus[i].icons != "") {
            custInfo.icons = customMenus[i].icons;
        };
        if (customMenus[i].parentId != "") {
            custInfo.parentId = customMenus[i].parentId;
        }
        browser.menus.create(custInfo);
    }
    defMenu = defMenu.concat(customMenus); // add to defMenu for Parsing by listener

}
});

// customMenus = JSON.parse(localStorage.getItem('customMenus')); 
//get stored value of custom menus

browser.menus.onClicked.addListener((info, tab, defaultMenu) => {
    if (info.menuItemId.substring(0, 6) == "bbcwbx") {
        console.log(info.menuItemId);
        for (i = 0; i < defMenu.length; i++) {
            if (info.menuItemId == defMenu[i].menuId) {
                var clickArg = defMenu[i].menuArg;
                browser.tabs.sendMessage(tab.id, clickArg); // send argument to content script for execution
            }
        }
    }
});

