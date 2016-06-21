"use strict";
// console.log("main.js is started");
document.addEventListener("DOMContentLoaded", ready);

var serverUrl = 'https://operun.herokuapp.com/';
// var serverUrl = 'http://93.88.210.4:8080/';

function ready(){
	console.log('ready');
	getComments();
}

function getComments(){
	console.log('getComments - start');
	var xhr = new XMLHttpRequest();
	// xhr.open('GET', serverUrl+'api/comments');
	xhr.open('GET', 'https://operun.herokuapp.com/api/comments');
	xhr.send();
	if (xhr.status != 200) {
	  console.error( xhr.status + ': ' + xhr.statusText );
	} else {
	  console.log( xhr.responseText );
	}
	console.log('getComments - stop');
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
