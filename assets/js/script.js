var questionText=document.querySelector(".questionText");
var progressString=document.querySelector(".progessDisplay");
var responseContainer=document.querySelector(".responses");
var quizWindow=document.querySelector(".quizWindow");
var highScoreTable=document.querySelector(".highScoreTable");
var highScoreBlock=document.querySelector(".highScores");
var seeHighScores=document.querySelector(".seeHighScores");
var timerText=document.querySelector(".timerText");

var timeRemaining=15;

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
}

//The actual quiz.
var exQuestion = new MultipleChoiceQuestion("Is Javascript statically typed?",[new RespOption("Yes",false),new RespOption("No",true)]);
var exQuestion2 = new MultipleChoiceQuestion("Which of the following is a valid javascript for loop?",[new RespOption("for(int i=0,i<10,i++){}",false),new RespOption("for(const i=0,i<10,i++){}",false),new RespOption("for(var i=0,i<10,i++){}",true)]);
var exQuestion3 = new MultipleChoiceQuestion("Javascript arrays start at...",[new RespOption("1",false),new RespOption("0",true),new RespOption("NaN",false)]);
var exQuestion4 = new MultipleChoiceQuestion("Are variables case sensitive?",[new RespOption("No",false),new RespOption("Yes",true)]);
var exQuestion5 = new MultipleChoiceQuestion("Which of the following will select an element of class example from the DOM?",[new RespOption("document.querySelector(\"questionText\");",false),new RespOption("document.querySelector(\"#questionText\");",false),new RespOption("document.querySelector(\".questionText\");",true)]);
var exQuiz = new Quiz("This is a test quiz",[exQuestion,exQuestion2,exQuestion3,exQuestion4,exQuestion5]);
buildQuestion(exQuiz,exQuiz.getCurrentQuestion());
updateTime();

//Counts down, ends quiz when time runs out.
function updateTime(){
    var timerInterval = setInterval(function() {
        timeRemaining--;
        timerText.textContent="Time Remaining: "+timeRemaining;
        if (timeRemaining==0){
            clearInterval(timerInterval);
            if(exQuiz.quizActive){
                exQuiz.quizActive=false;
                updateScores(exQuiz.score);
                loadScores();
            }
        }
        if(!exQuiz.quizActive){
            timeRemaining=0;
            clearInterval(timerInterval);
            timerText.textContent="DONE";
        }
    },1000);
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
    }else{
        timeRemaining--;
    }
    if(quiz.incrementQuestionIndex()){
        removeAllChildNodes(responseContainer);
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

//A function to update the local highscores.
function updateScores(newScore){
    var highscores=JSON.parse(localStorage.getItem("highScores"));
    var newEntry=new ScoreItem(initialsInput("Enter your initials to save your score."),newScore);
    if(highscores==null){
        var entryArr=[]
        entryArr.push(newEntry)
        localStorage.setItem("highScores",JSON.stringify(entryArr));
    }else{
        highscores.push(newEntry);
        //sorts highscores by score after adding new entry.
        highscores.sort((a, b) => (a.score > b.score) ? -1 : 1)
        localStorage.setItem("highScores",JSON.stringify(highscores));
    }
}
//A recursive prompt to obtain and validate the user's initials.
function initialsInput(message){
    var lenStr = prompt(message);
    if(lenStr===null || lenStr===""){
    pass
    }else{
        if (lenStr.length>5){
            return initialsInput("Sorry, but you have too many initials. Choose up to 5.")
        }else{
            return lenStr;
        }
        
    }
}
//A function to display the highscores.
function loadScores(){
    quizWindow.setAttribute("style","display:none");
    highScoreBlock.setAttribute("style","display:block");
    removeAllChildNodes(highScoreTable);
    highScoreTable.appendChild(generateTableHeading());
    var highscores=JSON.parse(localStorage.getItem("highScores"));
    if(highscores!=null){
        for (var i=0;i<highscores.length;i++){
        highScoreTable.appendChild(generateTableEntry(highscores[i]));
        }
    }
    
}
function generateTableHeading(){
    var heading=document.createElement("tr");
    var initialLabel=document.createElement("th");
    initialLabel.textContent="INITIALS";
    var scoreLabel=document.createElement("th");
    scoreLabel.textContent="SCORE";
    heading.appendChild(initialLabel);
    heading.appendChild(scoreLabel);
    return heading;
}
function generateTableEntry(scoreObject){
    var item=document.createElement("tr");
    var initialLabel=document.createElement("td");
    initialLabel.textContent=scoreObject.initials;
    var scoreLabel=document.createElement("td");
    scoreLabel.textContent=scoreObject.score;
    item.appendChild(initialLabel);
    item.appendChild(scoreLabel);
    return item;
}
seeHighScores.addEventListener("click",loadScores);
