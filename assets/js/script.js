var questionText=document.querySelector(".questionText");
var progressString=document.querySelector(".progressDisplay");
var exampleButton=document.querySelector(".responseItem");

//response option class that contains the text to be displayed, and whether or not this is a correct answer.
class RespOption{
    constructor(text,trueOrFalse){
        this.text=text;
        this.trueOrFalse=trueOrFalse;
    }
}

//A question class that holds the text of the question, and an array of possible answers to be displayed.
class MultipleChoiceQuestion{
    constructor(text,answers =[]){
        this.text=text;
        this.answers=answers;
    }
    checkResponse(atIndex) {
        return this.answers[atIndex].trueOrFalse;
    }
}

//A quiz class that contains a title, an array of questions, as well as the methods and variables related to running the quiz.
//As of now this doesn't make any allowances for the fact that javascript is not statically typed. TODO: add checks to ensure validity, or create a QuestionFactory to standardize input.
class Quiz{
    constructor(title,questions =[]){
        this.title=title;
        this.questions=questions;
        this.currentQstIndex=0;
        this.score=0;
        this.quizActive=true;
    }
    getCurrentQuestion(){
        return this.questions[this.currentQstIndex];
    }
    incrementQuestionIndex(){
        if(this.currentQstIndex<this.questions.length-1 && this.quizActive){
            this.currentQstIndex++;
        }
    }
    decrementQuestionIndex(){
        if(this.currentQstIndex<0 && this.quizActive){
            this.currentQstIndex--;
        }
    }
}


function changeText(){
    questionText.textContent="Who?"
}

function checkAnswer(){

}
function addButton(){

}

exampleButton.addEventListener("click",changeText);
