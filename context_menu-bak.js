function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}


activeMenus = invokeDefaultMenus()
console.log("Active Menus Set to: "+ activeMenus);

function invokeDefaultMenus() {
let defaultMenus = {
        enablebbCode: true,
        enableHTML: true,
        enableVbulletin: true,
        enableXHTML: true,
        enableMarkDown: true,
        enableCustom: true,
        enableSymbol: false
};
    if (browser.localStorage.getitem(activeMenus) == null) { //if menu settings not stored, use to default & save to local storage
        console.log('No stored menu')
        console.log("Active Menus: "+activeMenus);
        broswer.localstorage.setitem(activMenus,JSON.Stringify(defaultMenus));
    return (defaultMenus);
} else { //if local storage for menu, get values
    console.log("loaded existing values");
    return(JSON.Parse(browser.localStorage.getitem(activeMenus)));
}


const defMenuURL = chrome.runtime.getURL('data/DefMenu.json');

var defaultMenu = [];

fetch(defMenuURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(defaultMenu) {
        window.defMenu = defaultMenu; //create variable with global scope
        for (i = 0; i < defaultMenu.length; i++) {
            info = {
                id: defaultMenu[i].menuId,
                title: defaultMenu[i].menuTitle, //eventually this becomes an i18n call
                contexts: ["all"]
            };
            if (defaultMenu[i].menuTitle.includes("i18n")) {
                info.title = browser.i18n.getMessage(defaultMenu[i].menuId);  // lookup i18n
            } else {
                info.title = defaultMenu[i].menuTitle;  // no i18n, probably custom tag
            }
            if (defaultMenu[i].icons != "") {
                info.icons = defaultMenu[i].icons;
            };
            if (defaultMenu[i].parentId != "") {
                info.parentId = defaultMenu[i].parentId;
            }
            browser.menus.create(
                info
            );
        }
    })

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

