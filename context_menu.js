function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}

var defMenu = [];

const defMenuURL = browser.runtime.getURL('data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('data/customMenuTest.json'); //location of initial tutorial custom menu

const initialize = async () => {
// load the default menu settings in JSONn and save to local storage
    let tempDef = await fetch(defMenuURL);
//	console.log(tempDef);
    defTemp = await tempDef.json();
//	console.log(JSON.stringify(defTemp,null,3));
	localStorage.setItem('defaultMenu',JSON.stringify(defTemp))
//check if custom menus are in local storage, if no, load local JSON and save to local storage
if (localStorage.getItem('customMenu') == null){
    let custDef = await fetch(custMenuURL);
    defCust = await custDef.json();
    localStorage.setItem('customMenu',JSON.stringify(defCust));
}
// set the falue to the defaults, or the saved value if it exists
if (localStorage.getItem("activeMenus") === null) { //if menu settings not stored, 
    activeMenus = {
        enablebbCode: true,
        enableHTML: true,
        enableVbulletin: true,
        enableXHTML: true,
        enableMarkDown: true,
        enableCustom: true,
        enableSymbol: false
    };
    localStorage.setItem('activeMenus',JSON.stringify(activeMenus)); //store default in local storage
    } 
generateMenu();
}

initialize();


function generateMenu () {
// when you are changing menus in settings, first remove the existing menus before regenerating the menu
	var removing = browser.menus.removeAll();
// load values from local storage
	let activeMenus = JSON.parse(localStorage.getItem("activeMenus"));
	let defaultMenu = JSON.parse(localStorage.getItem('defaultMenu'));
	let customMenu = JSON.parse(localStorage.getItem('customMenu'));
//console.log(JSON.stringify(customMenu,null,2));
// concatenate default and custom variables to generate menus
	defMenu = defaultMenu.concat(customMenu);
//	console.log(JSON.stringify(defMenu,null,3));
        for (i = 0; i < defMenu.length; i++) {
            let currentId = defMenu[i].menuId;
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
                id: defMenu[i].menuId,
                title: defMenu[i].menuTitle, //eventually this becomes an i18n call
                contexts: ["all"]
            };
            if (defMenu[i].menuTitle.includes("i18n")) {
                info.title = browser.i18n.getMessage(defMenu[i].menuId); // lookup i18n
            } else {
                info.title = defMenu[i].menuTitle; // no i18n, probably custom tag
            }
            if (defMenu[i].icons != "") {
                info.icons = defMenu[i].icons;
            };
            if (defMenu[i].parentId != "") {
                info.parentId = defMenu[i].parentId;
            }
        browser.menus.create(info);
    }
    }	
}

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

window.addEventListener("storage", generateMenu, false);
//browser.addEventListener("storage", generateMenu, false);
//browser.storage.onChanged.addListener(generateMenu);