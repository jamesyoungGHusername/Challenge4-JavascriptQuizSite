var questionText=document.querySelector(".questionText");
//console.log(questionText)
var progressString=document.querySelector(".progessDisplay");
//console.log(progressString)
var responseContainer=document.querySelector(".responses");
//localStorage.setItem("highScores",null)
//the ScoreItem class defines how highscore entries must be saved in local storage.
class ScoreItem{
    constructor(initials,score){
        this.initials=initials;
        this.score=score;
    }
}
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
    currentQstIndex=0;
    score=0;
    quizActive=true;
    constructor(title,questions =[]){
        this.title=title;
        this.questions=questions;
    }
    getCurrentQuestion(){
        return this.questions[this.currentQstIndex];
    }
    incrementQuestionIndex(){
        if(this.currentQstIndex<this.questions.length-1 && this.quizActive){
            this.currentQstIndex++;
            return true;
        }else{
            return false;
        }
    }
    decrementQuestionIndex(){
        if(this.currentQstIndex<0 && this.quizActive){
            this.currentQstIndex--;
        }
    }
}
//a function that builds the UI for a given question object.
function buildQuestion(quiz,question){
    changeText(question.text);
    progressString.textContent=(quiz.currentQstIndex+1)+"/"+quiz.questions.length;
    for(var i=0;i<question.answers.length;i++){
       responseContainer.appendChild(buildButton(quiz,question.answers[i]));
    }
}
//a function that constructs and returns a button for the page given a respOption param
function buildButton(quiz,responseOption){
    var testButton=document.createElement("button");
    var text=document.createTextNode(responseOption.text);
    testButton.appendChild(text);
    testButton.classList.add("responseItem");
    testButton.addEventListener("click",() => {checkAndAdvance(quiz,responseOption)})
    return testButton;
}
//a function that checks a given response, updates the game, and advances the quiz.
function checkAndAdvance(quiz,selection){
    if(selection.trueOrFalse){
        quiz.score++;
    }
    if(quiz.incrementQuestionIndex()){
        console.log("Attempted to advance question");
        removeAllChildNodes(responseContainer);
        console.log("New question text: "+quiz.getCurrentQuestion().text);
        buildQuestion(quiz,quiz.getCurrentQuestion());
    }else if (quiz.quizActive){
        quiz.quizActive=false;
        updateScores(quiz.score);
        loadScores();
    }
    
}
//param picked to mimic natural language. Doesn't really matter in javascript but it makes things nice in Swift.
function changeText(to){
    questionText.textContent=to;
}
//A function from javascripttutorial.net to remove all child nodes of a particular DOM element.
function removeAllChildNodes(from) {
    while (from.firstChild) {
        from.removeChild(from.firstChild);
    }
}

//The actual quiz.
var exQuestion = new MultipleChoiceQuestion("Is Javascript statically typed?",[new RespOption("Yes",false),new RespOption("No",true)]);
var exQuestion2 = new MultipleChoiceQuestion("Which of the following is a valid javascript for loop?",[new RespOption("for(int i=0,i<10,i++){}",false),new RespOption("for(const i=0,i<10,i++){}",false),new RespOption("for(var i=0,i<10,i++){}",true)]);
var exQuestion3 = new MultipleChoiceQuestion("Javascript arrays start at...",[new RespOption("1",false),new RespOption("0",true),new RespOption("NaN",false)]);
var exQuestion4 = new MultipleChoiceQuestion("Are variables case sensitive?",[new RespOption("No",false),new RespOption("Yes",true)]);
var exQuestion5 = new MultipleChoiceQuestion("Which of the following will select an element of class example from the DOM?",[new RespOption("document.querySelector(\"questionText\");",false),new RespOption("document.querySelector(\"#questionText\");",false),new RespOption("document.querySelector(\".questionText\");",true)]);
var exQuiz = new Quiz("This is a test quiz",[exQuestion,exQuestion2,exQuestion3,exQuestion4,exQuestion5]);
buildQuestion(exQuiz,exQuiz.getCurrentQuestion());



function updateScores(newScore){
    var highscores=JSON.parse(localStorage.getItem("highScores"));
    var newEntry=new ScoreItem(initialsInput("Enter your initials to save your score."),newScore);
    if(newEntry.initials===null || newEntry.initials===""){
        console.log("no initials entered.");
    }else{
        console.log(highscores);
        if(highscores==null){
            //console.log(newEntry);
            var entryArr=[]
            entryArr.push(newEntry)
            localStorage.setItem("highScores",JSON.stringify(entryArr));
        }else{
            highscores.push(newEntry);
            localStorage.setItem("highScores",JSON.stringify(highscores));
        }
    }
}
//A recursive prompt to obtain and validate the user's initials.
function initialsInput(message){
    var lenStr = prompt(message);
  if(lenStr===null || lenStr===""){
    pass
  }else{
    if (lenStr.length>5){
      initialsInput("Sorry, but you have too many initials. Choose up to 5.")
    }
    return lenStr;
  }
}
function loadScores(){

}
