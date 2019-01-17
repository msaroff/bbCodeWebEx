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

const activeMenusURL = browser.runtime.getURL('data/activeMenu.json'); //location of initial active menus

const initialize = async () => {
// load the default menu settings in JSON and save to browser.storage.local
    localStorage.removeItem('customMenu') // fix error in earlier release
    let tempDef = await fetch(defMenuURL);
    defTemp = await tempDef.json();
	browser.storage.local.set({defTemp});
//check if custom menus are in local storage, if no, load local JSON and save to local storage
if (localStorage.getItem('customMenu') != null){ // if custom menus earlier release exists
	let custDef = JSON.parse(localStorage.getItem('customMenu'));
    defCust = await custDef.json();
	browser.storage.local.set({defCust}); // save to browser.storage
    localStorage.removeItem('customMenu'); // fix error in earlier release
}   else if (await Object.keys(browser.storage.local.get('defCust')) == 0){ //if no custom menus
	let tempCust = await fetch(custMenuURL);
	let defCust = await  tempCust.json();
    browser.storage.local.set({defCust})}
if (localStorage.getItem('activeMenus') != null){ // if active menus earlier release exists
	let tempAct = JSON.parse(localStorage.getItem('activeMenus'));
    let actTemp = await tempAct.json();
	browser.storage.local.set({actTemp}); // save to browser.storage
	console.log(actTemp);
    localStorage.removeItem('activeMenus'); // fix error in earlier release
}   else if (await Object.keys(browser.storage.local.get('actTemp') == 0)){
	let tempAct = await fetch(activeMenusURL);
	let actTemp = await tempAct.json();
	console.log(JSON.stringify(actTemp,null,2));
    browser.storage.local.set({actTemp})}	
	}
  
initialize();

generateMenu();





async function generateMenu () {
// when you are changing menus in settings, first remove the existing menus before regenerating the menu
	var removing = browser.menus.removeAll();
// load values from local storage
	let { actTemp: activeMenus } = await browser.storage.local.get(['actTemp']);
	console.log((await browser.storage.local.get()));
	let { defCust: customMenu } = await browser.storage.local.get(['defCust']);
	let { defTemp: defaultMenu} = await browser.storage.local.get(['defTemp']);
//console.log(JSON.stringify(activeMenus));
//console.log(JSON.stringify(customMenu,null,1));
//console.log(JSON.stringify(defaultMenu,null,1));
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
            let noSym = (currentId.substring(0,10) == 'bbcwbx.sym') && !activeMenus.enableSymbol;
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
//		console.log("info", JSON.stringify(info,null,2));
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

//window.addEventListener("storage", generateMenu, false);
//browser.addEventListener("storage", generateMenu, false);
browser.storage.onChanged.addListener(generateMenu);

//	browser.storage.local.get("browser.local.storage everything:", function(items) {
//    console.log(JSON.stringify(items).length);
//  });
  
//	console.log("Browser Storage end:",browser.storage.local.getBytesInUse({}));
// set the falue to the defaults, or the saved value if it exists
/* if (localStorage.getItem("activeMenus") === null) { //if menu settings not stored, 
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
    } */ 