/*  Notebook - 1.0
 *
 *  File: app.js
 *  Author: Paulo Nunes, http://syndicatefx.com
 *  Source: https://github.com/syndicatefx/notebook
 *  License: MIT
 */

// FileSaver.js - https://github.com/eligrey/FileSaver.js
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});


// load everything
if (localStorage.length != '') {
    listNotes();
}
// list notes
function listNotes() {
    for (var i = 0; i < localStorage.length; i++) {
        var noteTitle = localStorage.key(i);
        var list = document.querySelector("#note-list");
        var li = document.createElement("li");
        var link = document.createElement("button");
        var t = document.createTextNode(noteTitle);
        link.value = localStorage.key(i);
        link.appendChild(t);
        li.appendChild(link);
        // add a delete button
        var btn = document.createElement("button");
        btnTxt = document.createTextNode("×");
        btn.value = localStorage.key(i);
        btn.appendChild(btnTxt);
        li.appendChild(btn);
        // add the item to the list
        list.appendChild(li);
        // actions
        link.addEventListener("click", function(){viewNote(this.value)});
        btn.addEventListener("click", function(){trashNote(this)});
    }
}

// create a editor view to write note content
function viewNote(e) {
    var itemKey = e;
    // change list z-index on small screens so the textarea is visible in the viewport
    document.querySelector("aside").style.zIndex = "0";
    // if any editors are open, remove them
    removeTextarea();
    // build a new editor view
    var editor = document.createElement("div");
    editor.className = "editor";
    // add a close button, will only appear on small screens
    var editorClose = document.createElement("button");
    closeTxt = document.createTextNode("Close");
    editorClose.appendChild(closeTxt);
    editor.appendChild(editorClose);
    // the close button removes the editor + resets char counter on small screens
    editorClose.onclick = removeTextarea;
    // add a textarea to editor window and fill with item value, or placeholder if a value does not exists yet
    var text = document.createElement("textarea");
    text.setAttribute("placeholder", "Start writing...");
    text.setAttribute("spellcheck", "false");
    text.value = localStorage.getItem(itemKey);
    editor.appendChild(text);
    document.querySelector("main").appendChild(editor);
    // set focus on textarea and count chars of text
    text.focus();
    document.querySelector(".chars").innerHTML = text.value.length;
    // capture entered text and store it, count chars as we type
    text.addEventListener("keyup", function() {
        localStorage.setItem(itemKey, this.value);
        setTimeout(function() {
            document.querySelector(".chars").innerHTML = text.value.length;
        },0);
    });
    // add a download button inside the footer
    var dlBtn = document.createElement("button");
    var dlBtnTxt = document.createTextNode("Download note");
    dlBtn.className = "dl";
    dlBtn.appendChild(dlBtnTxt);
    document.querySelector("footer > div").appendChild(dlBtn);
    // click dowload button to save note as .txt
    dlBtn.addEventListener("click", function() {
        var blob = new Blob([text.value], {type: "text/plain;charset=utf-8"});
        saveAs(blob, itemKey + ".txt");
    });
}

// on click delete button, remove item from localStorage and remove <li> from list
function trashNote(e) {
    // create a faux "confirm" dialog
    var dialog = document.createElement("div");
    // add alert text
    var dialogText = document.createTextNode("Delete this note?");
    dialog.appendChild(dialogText); 
    // add buttons to confirm user wants to delete nnote
    var yesBtn = document.createElement("button");
    var yesText = document.createTextNode("YES");
    yesBtn.appendChild(yesText);
    dialog.appendChild(yesBtn); 
    var noBtn = document.createElement("button");
    var noText = document.createTextNode("NO");
    noBtn.appendChild(noText);
    dialog.appendChild(noBtn); 
    // display the dialog over the list item
    e.parentNode.appendChild(dialog);
    // event logic for confirmation buttons
    var itemVal = e.value;
    var itemParent = e.parentNode;
    yesBtn.onclick = function(){
        localStorage.removeItem(itemVal);
        itemParent.remove();
        window.setTimeout(function() {
            removeTextarea();
        }, 500);
    };
    noBtn.onclick = function(){
        dialog.remove();
    };
}

// removes editor
function removeTextarea() {
    if(document.querySelector(".editor")) {
        document.querySelector(".editor").remove();
        // add list z-index back on small screens
        document.querySelector("aside").style.zIndex = "2";
        // reset char count to 0
        document.querySelector(".chars").innerHTML = "0";
        // remove dowload button
        document.querySelector(".dl").remove();
    };
};

// Creates a new note
function createNote() {
    var inputValue = document.getElementById("note-title").value;
    if (inputValue === '') {
        //alert("You need to add a Note title!");
    } else {
        localStorage.setItem(inputValue,"");
        document.getElementById("note-list").innerHTML = "";
        listNotes();
        viewNote(inputValue);
    }
    document.getElementById("note-title").value = "";
}

