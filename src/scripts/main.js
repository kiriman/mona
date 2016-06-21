"use strict";
// console.log("main.js is started");
document.addEventListener("DOMContentLoaded", init);

// var serverUrl = 'https://operun.herokuapp.com/api/';
var serverUrl = 'http://93.88.210.4:8080/api/';

function init(){
	console.log('init');
	getComments();
}

function getComments(){
	console.log('getComments - start');
	var xhr = new XMLHttpRequest();
	// var data = JSON.stringify({
 //  						q: 'auth',
	// 					login: document.getElementById("login").value,
	// 					password: document.getElementById("password").value
	// 	});
	xhr.open('GET', serverUrl+'comments', true);//true - асинхронно
	// xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	// xhr.send(data);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			console.log('result');
		  // console.log( JSON.stringify(xhr.responseText) );
		  var result = JSON.parse(xhr.responseText);
		  console.log( JSON.stringify(result) );
		  console.log( result[0]['text'] );
		}
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
	// console.log( inputName.value );
	// console.log( inputEmail.value );
	// console.log( inputText.value );
}

function addComment(){

	var title = "Constructing HTML Elements";

	var html = [
	    '<div class="tutorial">',
	        '<h1 class="tutorial-heading">' + title + '<h1>',
	    '</div>'
	].join("\n");
	// html: '<div ...>\n<h1 ...>Constructing HTML Elements<h1>\n</div>'
	var html = [
		'<div class="panel panel-default">',
	      '<div class="panel-heading">',
	        '<div class="row">',
	          '<div class="col-sm-6">',
	            '<h3 class="panel-title">Имя (email@email.com)</h3>',
	          '</div>',
	          '<div class="col-sm-6">',
	            '<h3 class="panel-title add-date"><span class="admin-edit">изменен администратором</span> 19.06.2016</h3>',
	          '</div>',
	        '</div>',
	      '</div>',
	      '<div class="panel-body">',
	        'Текс сообщения Текс сообщения Текс сообщения Текс сообщения',
	        'Текс сообщения Текс сообщения Текс сообщения Текс сообщения',
	        'Текс сообщения Текс сообщения Текс сообщения Текс сообщения',
	      '</div>',
	    '</div>',
	].join("\n");

	var newComment = document.createElement("div");
 	newComment.innerHTML = html;

	var wrapper = document.getElementById("wrapper");
	wrapper.appendChild(newComment);
}
