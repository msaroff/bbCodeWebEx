function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}


activeMenus = invokeDefaultMenus();
/* console.log("enablebbCode: "+ activeMenus.enablebbCode+"\n"+"enableHTML: "+ activeMenus.enableHTML+
"\n"+"enableVbulletin: "+ activeMenus.enableVbulletin+"\n"+"enableXHTML: "+ 
activeMenus.enableXHTML+"\n"+"enableMarkDown: "+ activeMenus.enableMarkDown+"\n"+
"enableCustom: "+ activeMenus.enableCustom+"\n"+"enableSymbol: "+ activeMenus.enableSymbol);
*/

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
    if (localStorage.getItem("activeMenus") === null) { //if menu settings not stored, 
        localStorage.setItem('activeMenus',JSON.stringify(defaultMenus)); //store default in local menu
}
        return JSON.parse(localStorage.getItem('activeMenus'));
}

customMenusTestURL = browser.runtime.getURL('data/customMenuTest.json');
console.log("customMenusTestURL = ",customMenusTestURL);

fetch(customMenusTestURL)
    .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
localStorage.setItem('customMenus', JSON.stringify(myJson));
    console.log("custom menu saved");
  });

/*
function invokeCustomMenus() {
};
    if (localStorage.getItem("customMenus") === null) { //if menu settings not stored, 
        localStorage.setItem('customMenus',JSON.stringify(customMenusTest)); //store test case in custom menu
} // eventually, it will store an empty object
        return JSON.parse(localStorage.getItem('customMenus'));
}
*/

const defMenuURL = browser.runtime.getURL('data/DefMenu.json');

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

