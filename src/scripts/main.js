"use strict";

// когда страница (DOM-дерево) полностью загружена, получаем комментарии с сервера getCommentsRequest()
document.addEventListener("DOMContentLoaded", getCommentsRequest);

// url бэкенд сервера
// var serverUrl = 'https://operun.herokuapp.com/api/';
var serverUrl = 'http://93.88.210.4:8080/api/';

// блок в который будут добавлены загруженные с сервера комментарии
var wrapper = document.getElementById("wrapper");

var comments = [];

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
// function createCommentTemplate(comment){
// 	var html = [
// 		'<div class="panel panel-default" id="comment-'+comment.id+'">',
// 	      '<div class="panel-heading">',
// 	        '<div class="row">',
// 	          '<div class="col-sm-6">',
// 	            '<h3 class="panel-title">'+comment.name+' ('+comment.email+')</h3>',
// 	          '</div>',
// 	          '<div class="col-sm-6">',
// 	            '<h5 class="panel-title add-date"><span class="admin-edit">'+isEdited(comment.is_edited)+'</span> '+comment.create_time+'</h5>',
// 	          '</div>',
// 	        '</div>',
// 	      '</div>',
// 	      '<div class="panel-body" onclick="editText(this)" id="text-'+comment.id+'">'+comment.text+'</div>',
// 	    '</div>',
// 	].join("\n");

// 	return html;
// }

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
			<textarea class="form-control" id="editText" rows="3" placeholder="editText">`+text+`</textarea>
			<p>
			<div class="form-inline">
	    		<button class="btn btn-default" onclick="saveEditText('`+id+`')">Сохранить</button>
	      		<button class="btn btn-default" onclick="cancelEditText('`+id+`')">Отмена</button>
      		</div>
		</div>`
	;
	return html;
}
function cancelEditText(id){
	var text = document.getElementById("text-"+id);
	// var parent = document.getElementById("comment-"+id);
	text.style.display="block";
	text.parentNode.lastChild.remove();
}
function saveEditText(id){
	var text = document.getElementById("text-"+id);
	var editText = document.getElementById("editText").value;
	// text.innerHTML = document.getElementById("editText").value;
	if( updateCommentsRequest(id, editText) ){
		text.innerHTML = editText;
	}
	text.style.display="block";
	text.parentNode.lastChild.remove();
}
function updateCommentsRequest_test(id, editText){
	return true;
}
// функция получения комментариев с сервера
function updateCommentsRequest(id, editText){
	var xhr = new XMLHttpRequest();
	var data = JSON.stringify({
  						id: id,
						editText: editText
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

		  // result = JSON.parse(xhr.responseText);
		  console.log( xhr.responseText );
		  // console.log( JSON.stringify(result) );
		  // console.log( result[0]['text'] );

		}
	}
}
function startEditText(id){
	var text = document.getElementById("text-"+id);
	var currentEditBlock = document.createElement("div");
	currentEditBlock.innerHTML = editCommentTemplate(id, text.innerHTML);

	text.style.display="none";
	text.parentNode.appendChild( currentEditBlock );

	// tooltips[ elem.name ].setAttribute("name", "tooltip");
	// tooltips[ elem.name ].className = "alert";
	// tooltips[ elem.name ].innerHTML = msg;

	// el.style.visibility = "hidden";//visible
	// console.log(el.parentNode.innerHTML);
	// var p = el.parentNode;
	// var elems = document.getElementById("comment-2");//.lastChild.innerHTML;
	// for (var i = elems.childNodes.length - 1; i >= 0; i--) {
	// 	console.log(elems.childNodes[i].tagName);
	// };
	// console.log("editText() el: "+elems.children.length);// 2
	// console.log("editText() el: "+elems.lastElementChild.innerHTML);// text
	// console.log("comment: "+JSON.stringify(comment));
	// var el = document.getElementById("text-2").innerHTML;
	// console.log("comment: "+id);
	// var el = document.getElementById("text-"+id).innerHTML;
	// console.log("editText() el: "+el);
	// console.log("editText() el: "+elems.childNodes[elems.childNodes.length - 2].innerHTML );
	// var elems = document.documentElement.childNodes;
	// elems = Array.prototype.slice.call(elems); // теперь elems - массив

	// elems.forEach(function(elem) {
	//   console.log( elem.tagName ); // HEAD, текст, BODY
	// });
	// child()
	// childNodes.length

	// var el = document.createElement("div");
	// el.innerHTML = "new div";

	// e.appendChild(el);

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