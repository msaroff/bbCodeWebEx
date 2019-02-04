﻿(function(global) {

    const {
        readFromClipboard,
    } = global.es6lib_dom

    var clickedElement = null;

    document.addEventListener("mousedown", function(event) {
        //right click
        if (event.button == 2) {
            clickedElement = event.target;
        }
    }, true);

    browser.runtime.onMessage.addListener(function(commandString, sendResponse) {
        CommandParse(commandString);
    });
	


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

async function colorPick (colorArg){ //read the color from the popup
	let {pickColor: colorPicked}  = await browser.storage.local.get("pickColor");
	console.log("color picked", await colorPicked);
	return(colorProc(colorArg, await colorPicked)); //process the actual argument
}

function colorProc (colorArg,colorPicked){
	if (colorPicked == "nocolor"){
		//clear color agument
	} else {
		// process color argument
	}	
	return(colorArg)
}

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

        let popUpHere = (popupBefore + popupResp + popupAfter);
		// add stuff to allow '\n\' to creat new line from popup
		popUpHere = popUpHere.replace(/\\\\n/g,'~_~_~n'); // use '\\n' to actually enter '\n\'
		popUpHere = popUpHere.replace(/\\n/g,'\n');
		popUpHere = popUpHere.replace(/~_~_~n/g,'\\n');
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
        let listEndIdx = listArg.indexOf("}}", listStartIdx); // end of list argument in command string
        let listWork = listArg.substring(listStartIdx, listEndIdx);; // extract the portion of the argument that has to do with making the list
        listWork = listWork.substring(11, listWork.length -1 ); //remove the "{{makeList," from the beginning of the argument, and the "}}" from the end.
        let listType = listWork.substring(listWork.lastIndexOf(",") +2, (listWork.length)) // the type of list is after the last comma
		listWhat = listWork.substring(0, listWork.lastIndexOf(",")); // the text to which the list would be applied
		// the replace will only apply to cases where line breaks are inserted through custom user scripts
        let listResult = createList(listWhat, listType); //return the properly formatted list to put into the list argument
        return listArg.substring(0, listStartIdx) + listResult + listArg.substring(listEndIdx +2); //send the parsed list in the back
    }


    async function CommandParse(argString) {
        //       Get Info About Textbox
        // check out document.activeElement
        var selectedTextArea = document.activeElement;
        let TextBoxName = clickedElement.getAttribute('name');
        // some text boxes do not have an id assigned, but they do have a name assigned, if so, use the name
        if (clickedElement.getAttribute('id') == null || clickedElement.getAttribute('id') == "") {
            TextBoxID = TextBoxName;
        } else {
            TextBoxID = clickedElement.getAttribute('id');
        }
        let FocusInfo = document.activeElement;
        let txtcont = document.getElementById(TextBoxID).value; //contents of edit box
        let selstart = clickedElement.selectionStart; // index of selectin start
        let selend = clickedElement.selectionEnd; //index of selection end
        let selcont = sanitize(txtcont.substring(selstart, selend)); // selected text content sanitized
        let firsttext = txtcont.substring(0, selstart); //stuff before the selection
        let lasttext = txtcont.substring(selend); // stuff after the selection
        if (argString.includes("{{clipboard}}")) { // Replace clipboard tag with clipboard contents
            const clipcont = sanitize(await readFromClipboard('text/plain')); //clipboard content sanitized
            argString = argString.replace(/{{clipboard}}/g, clipcont);
        }
        if (argString.includes("{{selection}}")) { // Replace selection tag with selection value 
            argString = argString.replace(/{{selection}}/g, selcont);
        }
        if (argString.includes("{{zzpopup")) { // Invoke popup query function
            argString = popThisUp(argString);
        }
        if (argString.includes("{{makeList")) { // Invoke list creation function
            argString = listMake(argString);
        }
		if (argString.includes("{{zzGetColor")) { // invoke color picker
			argstring = colorPick(argString);
		}
//desanitize and paste element
        clickedElement.value = firsttext + deSanitize(argString) + lasttext;

    }

})(this);

/* this is pretty much a copy of the function from bbCodeXtra by flod (Francesco Lodolo)
which is under an MIT free and open-source software (FOSS) license.
*/

function createList(originalText, listType) {
    var startBlock, endBlock, startItem, endItem, formattedText;

    // Make sure only \n is used as line ending
    originalText = originalText.replace(/[\r|\n|\r\n]/g, '\n');
    // Split lines based on \n
    lines = originalText.split('\n');
    // Ignore empty lines
    lines = lines.filter(function(n) {
        return n !== '';
    });
    switch (listType) {
        case 'bbcode':
            startBlock = '[list]\n';
            startItem = '[*]';
            endItem = '\n';
            endBlock = '[/list]';
            break;
        case 'bbcodeord':
            startBlock = '[list=1]\n';
            startItem = '[*]';
            endItem = '\n';
            endBlock = '[/list]';
            break;
        case 'bbcodeordalf':
            startBlock = '[list=a]\n';
            startItem = '[*]';
            endItem = '\n';
            endBlock = '[/list]';
            break;
        case 'html':
            startBlock = '<ul>\n';
            startItem = '<li>';
            endItem = '</li>\n';
            endBlock = '</ul>';
            break;
        case 'htmlord':
            startBlock = '<ol>\n';
            startItem = '<li>';
            endItem = '</li>\n';
            endBlock = '</ol>';
            break;
        case 'htmlordalf':
            startBlock = '<ol type=a>\n';
            startItem = '<li>';
            endItem = '</li>\n';
            endBlock = '</ol>';
            break;
        case 'markdown':
            startBlock = endBlock = '';
            startItem = '- ';
            endItem = '\n';
            break;
        case 'markdownord':
            startBlock = endBlock = '';
            startItem = '';
            endItem = '\n';
            break;
        default:
            startBlock = '';
            startItem = '';
            endItem = '\n';
            endBlock = '';
            break;
    }

    formattedText = startBlock;
    for (var i = 0; i < lines.length; i++) {
        if (listType == 'markdownord') {
            var linenumber = i + 1;
            formattedText += linenumber + '. ' + lines[i] + endItem;
        } else {
            formattedText += startItem + lines[i] + endItem;
        }
    }
    formattedText += endBlock;
    return formattedText;
}

/*
function showModal(){
	alert("cpicker");
	let popUpMenuURL = browser.runtime.getURL('cpicker/cpicker.html');
	console.log(popUpMenuURL);
//	browser.browserAction.openPopup();
	window.open(popUpMenuURL);
//	 browser.browserAction.openPopup();
//	let ppup = browser.windows.create({
//		 'url': popUpMenuURL,
//		 'type': 'popup',
//	 });
//window.open("'cpicker/cpicker.html'","Color Picker","resizable, scrollbars");
} 

browser.menus.onClicked.addListener(() => {
  browser.browserAction.openPopup();
});
*/