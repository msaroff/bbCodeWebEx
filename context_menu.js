function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}

//var defMenu = [];

const defMenuURL = browser.runtime.getURL('data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('data/customMenuTest.json'); //location of initial tutorial custom menu

const activeMenusURL = browser.runtime.getURL('data/activeMenu.json'); //location of initial active menus

const initialize = async () => {
	let {actTemp: activeTemp} = await browser.storage.local.get(['actTemp']);
	if (await activeTemp == null){ //if active menus not yet set, read from JSON
			let tempAct = await fetch(activeMenusURL);
			activeTemp = await tempAct.json();
			browser.storage.local.set({actTemp: activeTemp}); //and save to local storage
	}
//check if custom menus are in local storage, if no, load local JSON and save to local storage
    let {defCust: cstmMenu} = await browser.storage.local.get(['defCust']);
	if (await cstmMenu == null){ // if custom menus are not set, read from JSON
		let tempCust = await fetch(custMenuURL);
	    let defCust = await  tempCust.json();
	browser.storage.local.set({defCust: defCust}); //and save to local storage
	}
// load the default menu settings in JSON and save to browser.storage.local
    let tempDef = await fetch(defMenuURL);
	let defaultMenu = await tempDef.json();
	browser.storage.local.set({defTemp: defaultMenu}); // save to browser.storage
}

  
initialize();

generateMenu();


async function generateMenu () {
	browser.storage.onChanged.removeListener(generateMenu); /* make sure that while initializing
	it is not calling itself again, and again, and again */
	await initialize();

// when you are changing menus in settings, first remove the existing menus before regenerating the menu
	var removing = browser.menus.removeAll();
// load values from local storage
	var { actTemp: activeMenus } = await browser.storage.local.get(['actTemp']);
	var { defCust: customMenu } = await browser.storage.local.get(['defCust']);
	var { defTemp: defaultMenu } = await browser.storage.local.get({defTemp: defaultMenu});
// concatenate default and custom variables to generate menus
	defMenu = defaultMenu.concat(await customMenu);
//	console.log(JSON.stringify(defMenu,null,3));
        for (let i = 0; i < defMenu.length; i++) {
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
		
        browser.menus.create(info);
    }
    }	//console.log("info", JSON.stringify(defMenu,null,2));
	browser.storage.onChanged.addListener(generateMenu); //add listener
	// for changes made to active menus and custom tags
}




browser.menus.onClicked.addListener((info, tab, defaultMenu) => {
    if (info.menuItemId.substring(0, 6) == "bbcwbx") {
        for (let i = 0; i < defMenu.length; i++) {
            if (info.menuItemId == defMenu[i].menuId) {
                var clickArg = defMenu[i].menuArg;
				if (clickArg.includes("{{zzGetColor")){
					browser.windows.create({
						'url': 'popup/popup.html',
						'type': 'popup'
					});
					browser.runtime.onMessage.addListener(meepMoopMop = function(message, sender) {
				    console.log("message received");
					browser.tabs.sendMessage(tab.id, clickArg); // send argument to content script for execution
					browser.runtime.onMessage.removeListener(meepMoopMop);
				});
			        
				 } else {
//                browser.tabs.sendMessage(tab.id, {clickArg}); // send argument to content script for execution
                browser.tabs.sendMessage(tab.id, clickArg, {'frameId': info.frameId}); // send argument to content script for execution
				}
            }
        }
		}});


