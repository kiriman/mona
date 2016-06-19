console.log("main.js is started");

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