var questionText=document.querySelector(".questionText");
var progressString=document.querySelector(".progressDisplay");
var exampleButton=document.querySelector(".responseItem");




function changeText(){
    questionText.textContent="Who?"
}

function checkAnswer(){

}

exampleButton.addEventListener("click",changeText);
