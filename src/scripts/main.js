"use strict";
console.log("main.js is started");
document.addEventListener("DOMContentLoaded", ready);

function ready(){
	getFeedbackData();
}

function getFeedbackData(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'backend/server.php?q=getfeedback');
	xhr.send();
	if (xhr.status != 200) {
	  console.error( xhr.status + ': ' + xhr.statusText );
	} else {
	  console.log( xhr.responseText );
	}
}


function getFormData(){
	var form = document.forms.feedback;
	var inputName = form.elements.inputName;
	var inputEmail = form.elements.inputEmail;
	var inputText = form.elements.inputText;
	var inputFile = form.elements.inputFile;	
}

function preview(){
	console.log("preview is started");	
	
	console.log( inputName.value );
	console.log( inputEmail.value );
	console.log( inputText.value );
}
