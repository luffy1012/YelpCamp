var editBtns = document.querySelectorAll(".comment-edit-btn");

var editForm = document.createElement('form');
editForm.setAttribute('method','POST');
var input = document.createElement('input');
input.setAttribute('type', 'text');
input.setAttribute('class', 'form-control');
input.setAttribute('name','comment');
editForm.appendChild(input);

var editField = document.createElement('div');
editField.setAttribute('class','text');
var paragraph = document.createElement('p');
editField.appendChild(paragraph);

var PREV_VALUE = "";


function createEditForm (event) {
	var edit = editForm.cloneNode(true);
	var inputField = edit.firstElementChild;
  var commentNode = event.currentTarget.previousElementSibling;

  var editBtn = event.currentTarget;
  var deleteBtn = event.currentTarget.nextElementSibling;

  edit.setAttribute("action",editBtn.getAttribute("href"));

  editBtn.style.display = "none";
  deleteBtn.style.display = "none";

  inputField.value = commentNode.firstElementChild.textContent;
  PREV_VALUE = commentNode.firstElementChild.textContent;

	inputField.addEventListener("keypress",function(event){
		if (event.which === 13 && this.value !== ""){
			sendForm(event);
		}
	});

	inputField.addEventListener("blur",createEditField);


	commentNode.parentNode.replaceChild(edit,commentNode);
	inputField.focus();
	inputField.select();

  event.stopPropagation();
}

function sendForm(event){
  var editForm = event.currentTarget.parentNode;
  editForm.submit();
}
function createEditField(event){
  var inputForm = event.currentTarget.parentNode;
  var comment = editField.cloneNode(true);
  var para = comment.firstElementChild;
  para.innerText = PREV_VALUE;


  var editBtn = inputForm.nextElementSibling;
  var deleteBtn = editBtn.nextElementSibling;

  editBtn.style.display = "inline-block";
  deleteBtn.style.display = "inline-block";

  inputForm.parentNode.replaceChild(comment,inputForm)
  event.stopPropagation();

}


for(var i=0;i<editBtns.length;i++){
  editBtns[i].addEventListener("click",createEditForm);
}
