"use strict";

// когда страница (DOM-дерево) полностью загружена, получаем комментарии с сервера getCommentsRequest()
document.addEventListener("DOMContentLoaded", getCommentsRequest);

// бэкенд сервер url:
// var SERVER_URL = 'https://operun.herokuapp.com/';
var SERVER_URL = 'http://93.88.210.4:8080/';

// блок в который будут добавлены загруженные с сервера комментарии
var wrapper = document.getElementById("wrapper");

var comments = [];
var currentId = null;
var updateCommentsProc = false;
var user = {
	login: getCookie("userName") || "",
	isadmin: false,
	session_id: ""
}
var COMPARE_TYPE = "create_type";

showHideAuthForm(user.login);

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


// функция получения комментариев с сервера
function getCommentsRequest(){
	wrapper.innerHTML = "Загрузка...";
	// var xhr = new XMLHttpRequest();
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;//поддержка ie8-9
	var xhr = new XHR();
	xhr.withCredentials = true;
	xhr.open('GET', SERVER_URL+'api/comments', true);//true - асинхронно
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			var response = JSON.parse(xhr.responseText);

			if(response.status){
				user.login = response.login;
				if(!user.login){showHideAuthForm("");}
				user.isadmin = response.isadmin;
				comments = JSON.parse(response.data);

				//добавляем комментарии на страницу
				renderAllComments(comments, response.isadmin);
			}		  
		}
	}
}

// функция добавления комментариев
function renderAllComments(comments){
	wrapper.innerHTML = "";
	for (var i = comments.length - 1; i >= 0; i--) {

		// создаем html-блок комментария по шаблону
		var newComment = document.createElement("div");
		newComment.className = "panel panel-default";
		newComment.setAttribute("id", "comment-"+comments[i]['id']);
		var commentTemplate = createCommentTemplate(comments[i]);
	 	newComment.innerHTML = commentTemplate;

	 	// добавляем картинку (миниатюру), если есть
	 	if(comments[i]['image'] != null){
	 		var thumb = document.createElement("img");
	 		thumb.className = "media-object";
	 		thumb.src = SERVER_URL+"uploads/"+comments[i]['image']+"_min";
	 		// var thumb = createThumbTemplate(comments[i]);
	 		newComment.getElementsByTagName("a")[0].appendChild(thumb);
	 		newComment.getElementsByTagName("a")[0].parentNode.classList.add("border");
	 	}

	 	// создаем футер html-блока по шаблону (кнопки принять/отклонить)
	 	if(user.isadmin){
	 		var newFooter = document.createElement("div");
	 		newFooter.className = "panel-footer text-right";
	 		newFooter.setAttribute("id", "footer-"+comments[i]['id']);
	 		var footerTemplate = createFooterTemplate(comments[i]);
	 		newFooter.innerHTML = footerTemplate;
	 		newComment.appendChild(newFooter);
	 	}

	 	// добавляем созданый html-блок с комментарием на страницу
		wrapper.appendChild(newComment);
	};
}
// function createThumbTemplate(comment){
// 	var html =
// 	`
// 	<img class="media-object thumbnail-min" src="`+SERVER_URL+`uploads/`+comment.image+`">
// 	`;
// 	return html;
// }
function createFooterTemplate(comment){
	var html =
	 `
		<div class="btn-group" data-toggle="buttons" >
		  <label class="btn btn-default btn-xs `+ismoderatedBtnClass(comment.is_moderated, 1)+`" onclick="changeModerateState(`+comment.id+`, 1)" >
		    <input type="radio" name="options-`+comment.id+`" id="option1-`+comment.id+`" > принять
		  </label>
		  <label class="btn btn-default btn-xs `+ismoderatedBtnClass(comment.is_moderated, 2)+`" onclick="changeModerateState(`+comment.id+`, 0)">
		    <input type="radio" name="options-`+comment.id+`" id="option2-`+comment.id+`" > отклонить
		  </label>
		</div>`
	;
	return html;
}
// функция создания html-блока комментария
function createCommentTemplate(comment){
	var html = 
		 `<div class="panel-heading">
	        <div class="row">
	          <div class="col-sm-6">
	            <h3 class="panel-title"><b>`+comment.name+`</b> (`+comment.email+`)</h3>
	          </div>
	          <div class="col-sm-6">
	            <h5 class="panel-title add-date"><span class="admin-edit" id="isedited-`+comment.id+`">`+isEdited(comment.is_edited)+`</span> `+comment.create_time+`</h5>
	          </div>
	        </div>
	      </div>
	      <div class="panel-body" >
	      
	      	  <div class="media">
		        <pre class="media-body" onclick="startEditText('`+comment.id+`')" id="text-`+comment.id+`">`+comment.text+`</pre>
		        <div class="media-right media-top thumbnail-min">
		          <a href="#" onclick="openImageModal('`+comment.id+`')" data-toggle="modal" data-target="#modalImage">
		            
		          </a>
		        </div>
		      </div>

	      </div>
	      `
	;
	return html;
}

function openImageModal(id){
	var img = document.createElement("img");
	img.className = "thumbnail-full";
	// img.src = document.getElementById("comment-"+id).getElementsByTagName("img")[0].src;
	var img_path = document.getElementById("comment-"+id).getElementsByTagName("img")[0].src;
	img.src = img_path.split("_")[0];

	var modalImageBlock = document.getElementById("modalImageBlock");
	while (modalImageBlock.firstChild) {
	    modalImageBlock.removeChild(modalImageBlock.firstChild);
	}
	modalImageBlock.appendChild(img);
	// $('#modalImage').modal();
}

// функция проверки на изменения комметария администратором
function isEdited(is_edited){
	if(is_edited == 1){
		return "изменен администратором";
	}
	return "";
}
function footerComment(){
	if(user.isadmin){
		return "block";
	}
	return "none";
}
function ismoderatedBtnClass(is_moderated, option){
	if(is_moderated == 1 && option == 1){
		return "active";
	}
	if(is_moderated == 0 && option == 2){
		return "active";
	}
	return "";
}
function ismoderatedBtnCheck(is_moderated, option){
	if(is_moderated == 1 && option == 1){
		return "checked=true";
	}
	if(is_moderated == 0 && option == 2){
		return "checked=true";
	}
	return "";
}
function changeModerateState(id, is_moderated){
	// var xhr = new XMLHttpRequest();
	var data = JSON.stringify({
  						id: id,
						is_moderated: is_moderated
		});
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;//поддержка ie8-9
	var xhr = new XHR();
	xhr.withCredentials = true;
	xhr.open('PUT', SERVER_URL+'api/moderate', true);//true - асинхронно
	xhr.send(data);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			var result = JSON.parse( xhr.responseText );
			// console.log(result.status);

			if( result.status ){
				// console.log("changed");
			}
		}
		// updateCommentsProc = false;
	}
	
	// if(document.getElementById('option1-'+id).checked){
	// 	console.log("check:1");
	// }else{
	// 	console.log("check:2");
	// }
	// if(document.getElementById('option2-'+id).checked){
	// 	console.log("check:2");
	// }
	// console.log("id: "+ id);
	// console.log( document.querySelector('input[name="options-'+id+'"]:checked').id );
}

function editCommentTemplate(id, text){
	var html = 
		`<div class="panel-body">
			<textarea class="form-control" id="newText" rows="3" placeholder="Текст" >`+text+`</textarea>
			<p>
			<div class="form-inline" style="text-align: right;">
	    		<button class="btn btn-default" id="saveNewTextBtn" onclick="updateCommentsRequest('`+id+`')">Сохранить</button>
	      		<button class="btn btn-default" id="cancelNewTextBtn" onclick="cancelEditText()">Отмена</button>
      		</div>
		</div>`
	;
	return html;
}

function startEditText(id){
	if(!user.isadmin){return;}
	if(id === "preview"){return;}
	if(updateCommentsProc){return;}
	if(currentId != null){
		cancelEditText( currentId );
	}
	currentId = id;		
	
	var text = document.getElementById("text-"+currentId);
	text.parentNode.parentNode.style.display="none";//hide current text (<div class="panel-body">)
	
	var currentEditBlock = document.createElement("div");
	currentEditBlock.innerHTML = editCommentTemplate(currentId, text.innerHTML);
	text.parentNode.parentNode.parentNode.lastChild.style.display="none";// hide footer (<div class="panel-footer">)
	text.parentNode.parentNode.parentNode.appendChild( currentEditBlock );//add edit textarea
	
	// text.style.display="none";//hide current text
	// text.parentNode.lastChild.style.display="none";// hide footer
	// text.parentNode.appendChild( currentEditBlock );//add edit textarea
	// text.parentNode.insertBefore(currentEditBlock, text.parentNode.children[0]);
}

function cancelEditText(){
	var currentText = document.getElementById("text-"+currentId);
	currentText.parentNode.parentNode.style.display="block";
	currentText.parentNode.parentNode.parentNode.lastChild.remove();
	currentText.parentNode.parentNode.parentNode.lastChild.style.display="block";
	
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

	var data = JSON.stringify({
  						id: id,
						newText: newText
		});
	// var xhr = new XMLHttpRequest();
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;//поддержка ie8-9
	var xhr = new XHR();
	xhr.withCredentials = true;
	xhr.open('PUT', SERVER_URL+'api/comments', true);//true - асинхронно
	xhr.send(data);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			var result = JSON.parse( xhr.responseText );
			// console.log(result.status);

			if( result.status ){
				document.getElementById("isedited-"+currentId).innerHTML = "изменен администратором...";
				currentId = null;
				currentText.innerHTML = newText;
				currentText.parentNode.parentNode.style.display="block";
				currentText.parentNode.parentNode.parentNode.lastChild.remove();
				currentText.parentNode.parentNode.parentNode.lastChild.style.display="block";
			}
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
	var comment = {
		name: form.elements.inputName.value,
		email: form.elements.inputEmail.value,
		text: form.elements.inputText.value,
		inputFile: form.elements.inputFile.value
	}
	return comment;
}
// функция очистки данных в форме обратной связи
function clearFormData(){
	var form = document.forms.feedback;
	form.elements.inputName.value = "";
	form.elements.inputEmail.value = "";
	form.elements.inputText.value = "";
	form.elements.inputFile.value = "";
}

// создаем preview html-блок используя шаблоны
function preview(){
	if(!validate()){return;}

	document.getElementById("formGroupBtn").parentNode.className = "col-sm-12";
	var comment = getFormData();
	comment.id = "preview";
	comment.create_time = new Date().toLocaleString("ru")

	var preveiwComment = document.createElement("div");
	preveiwComment.className = "panel panel-default";
	preveiwComment.setAttribute("id", "comment-preview");
	var commentTemplate = createCommentTemplate(comment);
 	preveiwComment.innerHTML = commentTemplate;

 	// добавляем preview html-блок с комментарием на страницу
	document.getElementById("preview").appendChild(preveiwComment);

	// добавляем в preview картинку (если есть)
	if(document.forms.feedback.inputFile.files[0] != undefined){
		var thumb = document.createElement("img");
 		thumb.className = "media-object";
 		thumb.src = document.getElementById("inputImage").src;
 		preveiwComment.getElementsByTagName("a")[0].appendChild(thumb);
 		preveiwComment.getElementsByTagName("a")[0].parentNode.classList.add("border");
	}

	//скрываем форму вода комментария
	document.getElementById("form-feedback").style.display = "none";
	document.getElementById("previewBtn").style.display = "none";
	document.getElementById("cancelPreviewBtn").style.display = "inline";
}

function cancelPreview(){
	if(document.getElementById("comment-preview")){	
		document.getElementById("formGroupBtn").parentNode.className = "col-sm-8";

		document.getElementById("form-feedback").style.display = "block";
		document.getElementById("comment-preview").remove();
		document.getElementById("previewBtn").style.display = "inline";
		document.getElementById("cancelPreviewBtn").style.display = "none";
	}

}

// Добавляем комментарий на сервер
function addCommentRequest(){
	if(!validate()){return;}
	document.getElementById("addCommentBtn").disabled = true;
	updateCommentsProc = true;
	
	//
	var file = document.forms.feedback.inputFile.files[0];
	//

	var comment = getFormData();
	// var data = JSON.stringify(comment);
	// var xhr = new XMLHttpRequest();
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;//поддержка ie8-9
	var xhr = new XHR();
	xhr.withCredentials = true;
	//
	xhr.upload.onprogress = function(event) {
		// console.log(event.loaded + ' / ' + event.total);
	}
	//
	xhr.open('POST', SERVER_URL+'api/comment', true);
	var formData = new FormData();
		formData.append("image_file", file);	
		formData.append("name", comment.name);
		formData.append("email", comment.email);
		formData.append("text", comment.text);
	xhr.send(formData);
	// xhr.open('POST', SERVER_URL+'api/comment', true);//true - асинхронно
	//// xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	// xhr.send(data);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			// console.log(xhr.responseText);
			var result = JSON.parse( xhr.responseText );
			// console.log("result: "+result.status);

			if( result.status ){
				//выводим info-block сообщение об успешном добавлении комментария
				document.getElementById("successInfoBlock").style.display = "block";
				//очищаем форму обратнойсвязи
				clearFormData();
				//удаляем html-блок preview (если есть)
				cancelPreview();
				//удаляем картинку прикрепленную к форме обратной связи (если есть картинке)
				cancelImage();
				//если админ, то выведем только что отправленный комментарий
				if(user.isadmin){getCommentsRequest();}
			}
		}

		document.getElementById("addCommentBtn").disabled = false;
		updateCommentsProc = false;
	}
}

// функция получения данных из формы авторизации
function getSigninFormData(){
	var form = document.forms.signin;
	var credential = {
		login: form.elements.inputSigninLogin.value,
		password: form.elements.inputSigninPassword.value
	}
	return credential;
}
function signIn(){
	var credential = getSigninFormData();
	var data = JSON.stringify(credential);
	// var xhr = new XMLHttpRequest();
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;//поддержка ie8-9
	var xhr = new XHR();
	xhr.withCredentials = true;
	xhr.open('POST', SERVER_URL+'api/signin', true);
	xhr.send(data);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			var result = JSON.parse( xhr.responseText );
			if( result.status ){
				user.login = result.login;
				user.session_id = result.session_id;
				document.cookie = "userName="+user.login;
				showHideAuthForm(user.login);
				getCommentsRequest();
			}else{
				alert("Неверный Логин или Пароль !");
			}
		}
	}
}
function signOut(){
	document.cookie = "userName=";
	// var xhr = new XMLHttpRequest();
	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;//поддержка ie8-9
	var xhr = new XHR();
	xhr.withCredentials = true;
	xhr.open('GET', SERVER_URL+'api/signout', true);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4){//отправка данных завершена
			return;
		}
		if (xhr.status != 200) {
		  console.error( xhr.status + ': ' + xhr.statusText );
		} else {
			var result = JSON.parse( xhr.responseText );

			if( result.status ){
				
				user.login = "";
				user.session_id = "";
				document.cookie = "userName=";

				showHideAuthForm(user.login);
				getCommentsRequest();
			}else{
				alert("Ошибка.");
			}
		}
	}
}

function showHideAuthForm(userName){
	if(userName != ""){
		//show form
		document.getElementById("userLogin").innerHTML = user.login;
		document.getElementById("form-signin").style.display = "none";
		document.getElementById("form-signout").style.display = "block";
	}else{
		//hide form
		document.getElementById("userLogin").innerHTML = user.login;
		document.getElementById("form-signin").style.display = "block";
		document.getElementById("form-signout").style.display = "none";
	}
}

/*
	Validate
*/
function removeErrorClass(el){
	el.parentNode.parentNode.className = "form-group";
}
function removeAllErrorClass(){
	var elements = document.forms.feedback.getElementsByClassName("form-group");
	for (var i = elements.length - 1; i >= 0; i--) {
		elements[i].className = "form-group";
	};
}
// validate() валидация полей ввода 
function validate(){
	removeAllErrorClass();

	var check = [];
		check['status'] = true;

	var regex_name = /[a-zа-яё]+/i;
	var regex_email = /\S+@\S+\.\S+/;

	var comment = getFormData();
	
	//валидация name
	if(regex_name.exec(comment.name) == null){
		let el = document.getElementById("inputName");
		el.parentNode.parentNode.classList.add("has-error");
		el.addEventListener("click", function(){removeErrorClass(el)});
		check['status'] = false;
	}
	//валидация email
	if(regex_email.exec(comment.email) == null){
		let el = document.getElementById("inputEmail");
		el.parentNode.parentNode.classList.add("has-error");
		el.addEventListener("click", function(){removeErrorClass(el)});
		check['status'] = false;
	}
	//валидация на пустое сообщение (на пробелы)
	if(comment.text.replace(/\s/g,'')==''){
		let el = document.getElementById("inputText");
		el.parentNode.parentNode.classList.add("has-error");
		el.addEventListener("click", function(){removeErrorClass(el)});
		check['status'] = false;
	}

	if(check['status']){
		return true;
	}	
	return false;
}


/*
	Upload Image (320x240 .jpg .phg .gif)
*/

function getFile(){
	document.getElementById('inputFile').click();
}

// добавляем слушатель событий на элемент id == "inputFile",
// когда пользователь выбрал файл, проиcходит его автоматическая загрузка через функцию upload()
document.getElementById("inputFile").addEventListener("change", function(event) {
    var file = document.forms.feedback.inputFile.files[0];
    // console.log("file: "+file);
    // // uploadImage(file);

    document.getElementById("inputImagePlaceholder").style.display = "none";
	document.getElementById("cancelImageBtn").style.display = "inline";
	document.getElementById("inputImage").style.display = "inline";
	// inputImage.title = selectedFile.name;

	var selectedFile = event.target.files[0];
	var img = document.getElementById("inputImage");
	
	var reader = new FileReader();
	reader.onload = function(event) {
		img.src = event.target.result;

		// var MAX_WIDTH = 128;
		// var MAX_HEIGHT = 96;
		// var width = img.width;
		// var height = img.height;
		 
		// if (width > height) {
		//   if (width > MAX_WIDTH) {
		//     height *= MAX_WIDTH / width;
		//     width = MAX_WIDTH;
		//   }
		// } else {
		//   if (height > MAX_HEIGHT) {
		//     width *= MAX_HEIGHT / height;
		//     height = MAX_HEIGHT;
		//   }
		// }
		// console.log("width: "+width+", height: "+height);
		// img.width = width;
		// img.height = height;
				
		// var c = document.getElementById("myCanvas");
	 //    c.width = width;
	 //    c.height = height;
	 //    var ctx = c.getContext("2d");
	 //    ctx.drawImage(img, 0, 0, width, height);
	 //    var dataurl = c.toDataURL("image/png");
	 //    document.getElementById("inputImage").src = dataurl;
	};

	reader.readAsDataURL(selectedFile);
}, false);


function cancelImage(){
	document.getElementById("inputFile").value = "";

	document.getElementById("inputImagePlaceholder").style.display = "table-cell";
	document.getElementById("cancelImageBtn").style.display = "none";
	document.getElementById("inputImage").style.display = "none";

	document.getElementById("inputImage").src = "";
}

// function uploadImage(file){
// function uploadImage(){
// 	var file = document.forms.feedback.inputFile.files[0];

// 	var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;//поддержка ie8-9
// 	var xhr = new XHR();
// 	xhr.upload.onprogress = function(event) {
// 		console.log(event.loaded + ' / ' + event.total);
// 	}
// 	xhr.open("POST", SERVER_URL+"api/upload", true);
// 	var formData = new FormData();
// 		formData.append("myfile", file);	
// 	xhr.send(formData);
// 	xhr.onreadystatechange = function() {
// 		if (xhr.readyState != 4){
// 			return;
// 		}
// 		if (xhr.status != 200) {
// 		  console.log( xhr.status + ': ' + xhr.statusText );
// 		} else {
// 			try {
// 		    	var response = JSON.parse(xhr.responseText);
// 		    	console.error("response.status: "+response.status);
// 		    	if(response.status){
// 		    		// showPhoto(file.name);
// 		    	}
// 			} catch (e) {
// 		    	console.error( "Некорректный ответ " + e.message );
// 			}
// 		}
// 	}
// }

/*
	Sort Order
*/
function sortComments(el){
	// console.log("______start_______");
	COMPARE_TYPE = getCompareType(el);
	// console.log("getCompareType: "+getCompareType(el));
	// вывести до
	// for(var i = 0; i < comments.length; i++) {
	//   console.log(comments[i].id+": "+comments[i][COMPARE_TYPE]);
	// }

	var chevron = document.getElementById("chevron");
	if(el.id == chevron.parentNode.id){
		if(chevron.className == "glyphicon glyphicon-chevron-up"){
			chevron.className = "glyphicon glyphicon-chevron-down";
			comments.sort(compareUp);
		}else{
			chevron.className = "glyphicon glyphicon-chevron-up";
			comments.sort(compareDown);
		}
	}else{
		chevron.remove();
		var chevron = document.createElement('span');
		chevron.className = "glyphicon glyphicon-chevron-down";
		chevron.setAttribute("id", "chevron");
		el.appendChild(chevron);
		comments.sort(compareUp);		
	}


	// console.log("sorting...");
	// comments.sort(compareUp);
	// comments.sort(compareDown);

	// вывести после
	// for(var i = 0; i < comments.length; i++) {
	//   console.log(comments[i].id+": "+comments[i][COMPARE_TYPE]); // Вовочка Маша Вася
	// }
	// console.log("______end_______");

	renderAllComments(comments);
}
function getCompareType(el){
	var type = "";
	if(el.id == "colName"){
		type = "name";
	}
	if(el.id == "colEmail"){
		type = "email";
	}
	if(el.id == "colDate"){
		type = "create_time";
	}
	return type;
}
// Функция сравнения UP
function compareUp(a, b) {
  if (a[COMPARE_TYPE] > b[COMPARE_TYPE]) {
    return 1;
  }
  if (a[COMPARE_TYPE] < b[COMPARE_TYPE]) {
    return -1;
  }
  return 0;
}
// Функция сравнения DOWN
function compareDown(b, a) {
  if (a[COMPARE_TYPE] > b[COMPARE_TYPE]) {
    return 1;
  }
  if (a[COMPARE_TYPE] < b[COMPARE_TYPE]) {
    return -1;
  }
  return 0;
}
