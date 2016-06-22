"use strict";

// когда страница (DOM-дерево) полностью загружена, получаем комментарии с сервера getCommentsRequest()
document.addEventListener("DOMContentLoaded", getCommentsRequest);

// url бэкенд сервера
// var serverUrl = 'https://operun.herokuapp.com/api/';
var serverUrl = 'http://93.88.210.4:8080/api/';

// блок в который будут добавлены загруженные с сервера комментарии
var wrapper = document.getElementById("wrapper");

var comments = [];
var currentId = null;
var updateCommentsProc = false;

// функция получения комментариев с сервера
function getCommentsRequest(){
	wrapper.innerHTML = "Загрузка...";
	var xhr = new XMLHttpRequest();
	xhr.open('GET', serverUrl+'comments', true);//true - асинхронно
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
		  wrapper.innerHTML = "";
		  comments = JSON.parse(xhr.responseText);

		  //добавляем комментарии на страницу
		  addComments(comments);
		}
	}
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
	var html = 
		`<div class="panel panel-default" id="comment-`+comment.id+`">
	      <div class="panel-heading">
	        <div class="row">
	          <div class="col-sm-6">
	            <h3 class="panel-title">`+comment.name+` (`+comment.email+`)</h3>
	          </div>
	          <div class="col-sm-6">
	            <h5 class="panel-title add-date"><span class="admin-edit">`+isEdited(comment.is_edited)+`</span> `+comment.create_time+`</h5>
	          </div>
	        </div>
	      </div>
	      <div class="panel-body" onclick="startEditText('`+comment.id+`')" id="text-`+comment.id+`">`+comment.text+`</div>
	    </div>`
	;
	return html;
}

// функция проверки на изменения комметария администратором
function isEdited(is_edited){
	if(is_edited == 1){
		return "изменен администратором";
	}
	return "";
}

function editCommentTemplate(id, text){
	var html = 
		`<div class="panel-body">
			<textarea class="form-control" id="newText" rows="3" placeholder="newText" >`+text+`</textarea>
			<p>
			<div class="form-inline">
	    		<button class="btn btn-default" id="saveNewTextBtn" onclick="updateCommentsRequest('`+id+`')">Сохранить</button>
	      		<button class="btn btn-default" id="cancelNewTextBtn" onclick="cancelEditText()">Отмена</button>
      		</div>
		</div>`
	;
	return html;
}

function startEditText(id){
	if(updateCommentsProc){return;}
	if(currentId != null){
		cancelEditText( currentId );
	}
	currentId = id;		
	var text = document.getElementById("text-"+currentId);
	var currentEditBlock = document.createElement("div");
	currentEditBlock.innerHTML = editCommentTemplate(currentId, text.innerHTML);
	text.style.display="none";
	text.parentNode.appendChild( currentEditBlock );
}

function cancelEditText(){
	var currentText = document.getElementById("text-"+currentId);
	currentText.style.display="block";
	currentText.parentNode.lastChild.remove();
	
	currentId = null;
}

function saveEditText(id){
	var currentText = document.getElementById("text-"+id);
	var newText = document.getElementById("newText").value;
	// alert("alert: "+updateCommentsRequest(id, newText));
	if( updateCommentsRequest(id, newText) ){
		currentText.innerHTML = newText;
	}
	currentText.style.display="block";
	currentText.parentNode.lastChild.remove();
}

// функция изменения комментария на сервере
function updateCommentsRequest(id){
	disableEditTextBlock();
	updateCommentsProc = true;

	var currentText = document.getElementById("text-"+id);
	var newText = document.getElementById("newText").value;

	var xhr = new XMLHttpRequest();
	var data = JSON.stringify({
  						id: id,
						newText: newText
		});
	console.log(data);
	xhr.open('PUT', serverUrl+'comments', true);//true - асинхронно
	// xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	xhr.send(data);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			var result = JSON.parse( xhr.responseText );
			console.log(result.status);

			if( result.status ){
				currentId = null;
				currentText.innerHTML = newText;
				currentText.style.display="block";
				currentText.parentNode.lastChild.remove();
			}

		  // JSON.parse();
		  // JSON.stringify();
		  // console.log( result[0]['text'] );

		}
		updateCommentsProc = false;
	}
}

function disableEditTextBlock(){
	document.getElementById("newText").disabled = true;
	document.getElementById("saveNewTextBtn").disabled = true;
	document.getElementById("cancelNewTextBtn").disabled = true;
}
function enableEditTextBlock(){
	document.getElementById("newText").disabled = false;
	document.getElementById("saveNewTextBtn").disabled = false;
	document.getElementById("cancelNewTextBtn").disabled = false;
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
