function onCreated() {
    if (browser.runtime.lastError) {
        console.log('Error: ${browser.runtime.lastError}');
    } else {
        console.log("Item created successfully");
    }
}

//read the custom menus from local storage:
customMenus = JSON.parse(localStorage.getItem('customMenus'));

// sanitize selections and clipboard contents so that they do not get executed as commands
// will put the string, "_~_~", in between each "{{", "}}", and "##" so they will not be parsed
function sanitize (sanitized) {
   sanitized  = sanitized.replace(/{{/g,"{_~_~{");
   sanitized  = sanitized.replace(/}}/g,"}_~_~}");
   sanitized  = sanitized.replace(/##/g,"#_~_~#");
return sanitized;
}

// return selections and clipboard contents back to original values.
function deSanitize (deSanitized) {
   deSanitized  = deSanitized.replace(/{_~_~{/g,"{{");
   deSanitized  = deSanitized.replace(/}_~_~}/g,"}}");
   deSanitized  = deSanitized.replace(/#_~_~#/g,"##");
return deSanitized;
}

/*
Popup has the format of {{zzppopup,title,unique text string to change,text before, text after}}
text before and text after omitted if empty answer given. (use double quotes"" if not used)
Use unique text so that we can set order of dialogue boxes independent of the order of 
Argument.

So, quote paste is: {{zzpopup,i18n.INS_AUTHOR,zzzquote,=","}}][quote]zzquote{{clipboard}}][/quote]
This will give [quote]CLIPBOARD[/QUOTE] if no author given and [quote="AUTHOR"] CLIPBOARD[/QUOTE]
if author given.
and url wizard is 
{{zzpopup,i18n.URLCOMPOSTO_STEP1,zzTitle,"",""}}{{zzpopup,i18n.URLCOMPOSTO_STEP2,zzURL,"",""}}[url=zzURL]zzTitle[/url]
It will prompt for title, and then for url, and the result will be
[url=URL]TITLE[/url]
This will generate as many popup dialogues as you would want.
*/
    function popThisUp(popArg) {
    while (popArg.includes("zzpopup")) { // cycle through multiple popups until done
        let popStartIdx = popArg.indexOf("{{zzpopup"); // start of popup argument in commend string

        let popEndIdx = popArg.indexOf("}}", popStartIdx) + 2; // end of popup argument in command string
        let popWork = popArg.substring(popStartIdx, popEndIdx); // extract the portion of the argument that has to do with making the popup
        popWork = popWork.substring(10, popWork.length - 2); //remove the "{{zzpopup," from the beginning of  argument, and "}}" from the end.
        let popTitle = popWork.substring(0, popWork.indexOf(",")); // popup title, possibly including i18n localization tag
            if (popTitle.includes("i18n")) { //if there is a localization tag
                popTitle = browser.i18n.getMessage(popTitle.substring(5));  // replace with i18n value
            }
        let popToReplaceStart = popWork.indexOf("##"); //start index of string to replace
        let popToReplaceEnd = popWork.indexOf("##",popToReplaceStart + 1); //end index of string to replace.
        var textToReplace = popWork.substring(popToReplaceStart,popToReplaceEnd +2);
        popWork = popWork.substring(popWork.indexOf(",") + 1) //drop title from popWork
        popWork = popWork.substring(popWork.indexOf(",") + 1) //drop string to be replaced from popWork
        popupBefore = popWork.substring(0, popWork.indexOf(",")) //text to be added before entered text
        popupAfter = popWork.substring(popWork.lastIndexOf(",")+1) //text to be added before entered text
        let popupResp = prompt(popTitle);
        if (popupResp === null || popupResp === "") { // if the prompt is left blank, produce empty response
            popupResp = "";
            popupBefore = "";
            popupAfter = "";
        }

        let popUpHere = popupBefore + popupResp + popupAfter;
        popArg = popArg.substring(0, popStartIdx) + popArg.substring(popEndIdx); //string it together with popup removed
        popArg = popArg.replace(new RegExp(textToReplace,"g"),popUpHere); //replace hashtag with word prompt results
}
//add in whatever you got from  the dialog box
        return popArg;
    }
    
/*
List has the format of {{makeList,thing to make into list,type of list}}
*/
function listMake (listArg) {
    let listStartIdx = listArg.indexOf("{{makeList"); // start of list argument in commend string
    console.log(listStartIdx);
    let listEndIdx = listArg.indexOf("}}", listStartIdx); // end of list argument in command string
    console.log(listEndIdx);
    let listWork = listArg.substring(listStartIdx, listEndIdx);; // extract the portion of the argument that has to do with making the list
    console.log(listWork);
    listWork = listWork.substring(10, listWork.length -1 ); //remove the "{{makeList," from the beginning of the argument, and the "}}" from the end.
    console.log(listWork);
    let listType = listWork.substring(listWork.lastIndexOf(",") +2, (listWork.length)) // the type of list is after the last comma
    console.log(listType);
    listWhat = listWork.substring(0, listWork.lastIndexOf(",")).replace(/\\n/g,'\n'); // the text to which the list would be attached
    // the replace will only apply to cases where line breaks are inserted through custom user scripts
    let listResult = createList(listWhat, listType); //return the properly formatted list to put into the list argument
    return listArg.substring(0, listStartIdx) + listResult + listArg.substring(listEndIdx +2); //send the parsed list in the back
}


const defMenuURL = browser.runtime.getURL('data/DefMenu.json'); // location of default menu storage

const custMenuURL = browser.runtime.getURL('data/customMenuTest.json'); //location of initial tutorial custom menu

const initialize = async () => {
// load the default menu settings in JSONn and save to local storage
    localStorage.setItem('defaultMenu',await fetch(defMenuURL));
//check if custom menus are in local storage, if no, load local JSON and save to local storage
if (localStorage.getItem('customMenus') == null){
    localStorage.setItem('customMenus',await fetch(custMenuURL));
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
    localStorage.setItem('activeMenus',JSON.stringify(defaultMenus)); //store default in local storage
    } 
}
generateMenu();
}

initialize();

browser.storage.onChanged.addListener(generateMenu);