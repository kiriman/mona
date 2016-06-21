"use strict";

// когда страница (DOM-дерево) полностью загружена, получаем комментарии с сервера getComments()
document.addEventListener("DOMContentLoaded", getComments);

// url бэкенд сервера
// var serverUrl = 'https://operun.herokuapp.com/api/';
var serverUrl = 'http://93.88.210.4:8080/api/';

// блок в который будут добавлены загруженные с сервера комментарии
var wrapper = document.getElementById("wrapper");

var comments = [];

// функция получения комментариев с сервера
function getComments(){
	wrapper.innerHTML = "Загрузка...";
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
		  wrapper.innerHTML = "";
		  // console.log( JSON.stringify(xhr.responseText) );
		  comments = JSON.parse(xhr.responseText);
		  // console.log( JSON.stringify(result) );
		  // console.log( result[0]['text'] );

		  //добавляем комментарии на страницу
		  addComments(comments);
		}
	}
	console.log('getComments - stop');
}

// функция добавления комментариев
function addComments(comments){
	for (var i = comments.length - 1; i >= 0; i--) {
		// создаем html-блок комментария по шаблону
		var commentTemplate = createCommentTemplate(comments[i]);

		var newComment = document.createElement("div");
	 	newComment.innerHTML = commentTemplate;

	 	// добавлякм созданый html-блок с комментарием на страницу
		wrapper.appendChild(newComment);
	};
}

// функция создания html-блока комментария
function createCommentTemplate(comment){
	var html = [
		'<div class="panel panel-default" id="comment-'+comment.id+'">',
	      '<div class="panel-heading">',
	        '<div class="row">',
	          '<div class="col-sm-6">',
	            '<h3 class="panel-title">'+comment.name+' ('+comment.email+')</h3>',
	          '</div>',
	          '<div class="col-sm-6">',
	            '<h5 class="panel-title add-date"><span class="admin-edit">'+isEdited(comment.is_edited)+'</span> '+comment.create_time+'</h5>',
	          '</div>',
	        '</div>',
	      '</div>',
	      '<div class="panel-body" onclick="editText(this)" id="text-'+comment.id+'">'+comment.text+'</div>',
	    '</div>',
	].join("\n");

	return html;
}
// функция проверки на изменения комметария администратором
function isEdited(is_edited){
	if(is_edited == 1){
		return "изменен администратором";
	}
	return "";
}

function editText(e){
	var value = document.getElementById("comment-2").lastChild.innerHTML;
	// var value = document.getElementById("text-2").innerHTML;
	console.log("editText() value: "+e.innerHTML);

	var el = document.createElement("div");
	el.innerHTML = "new div";

	e.appendChild(el);

	//worked: e.innerHTML -> 'This my second comment'
	// e.innerHTML = "kuku";
}

// функция получения данных из формы обратной связи
function getFormData(){
	var form = document.forms.feedback;
	var inputName = form.elements.inputName;
	var inputEmail = form.elements.inputEmail;
	var inputText = form.elements.inputText;
	var inputFile = form.elements.inputFile;	
}

// function preview(){
// 	console.log("preview is started");	
	// console.log( inputName.value );
	// console.log( inputEmail.value );
	// console.log( inputText.value );
// }

function tmpF(){
	console.log("tmpF");
	console.log( document.getElementById("ku").innerHTML );
}


///////////////////////
// http://jsfiddle.net/Z7R5n/
// var nodeList = Array.prototype.slice.call( document.getElementById('myULelement').children ),
//     liRef = document.getElementsByClassName('match')[0];

// console.log( nodeList.indexOf( liRef ) );