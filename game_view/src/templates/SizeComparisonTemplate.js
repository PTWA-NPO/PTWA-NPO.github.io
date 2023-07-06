import * as constant from "../constant.js"
import {gameModules, helpModules} from "../module.js"
import {GameFramework} from "../GameFramework.js"

// Export your game
export class SizeComparison extends GameFramework {
    constructor(gameData){
        super(gameData);
        this.QuestionIndex = 0;
        this.CreateGameArea = new gameAreaGenerator;
        this.MyAnswer = "";
        this.Answer = "";
        //Create drag system
        $(".DraggingItem").on("mousedown", (DraggingItem) => {
            let initX = DraggingItem.clientX, initY = DraggingItem.clientY;

            $('body').on('mousemove', (event) => {
                $(DraggingItem.target).css('transform', 'translate(' 
                + (event.clientX - initX) + 'px,' + (event.clientY - initY) +'px)');
            })

            $('body').on('mouseup', (temp) => {
                let endPositionX = temp.clientX, endPositionY = temp.clientY;

                //Reset DraggingItem
                $(DraggingItem.target).css('transform', 'translate(0px, 0px)');

                let targetElement = document.elementFromPoint(endPositionX, endPositionY);

                $('body').off();

                //Placement Judgment
                if($(targetElement).hasClass("compareDetect")){
                    this.SetSymbol($(DraggingItem.target));
                }
            })
        })
    }

    startGame(level) {
        if(!super.startGame(level)) return false;
        this.MyAnswer = "";
        this.Answer = "";
        this.createQuestions(this.gameData, level);
    }
    

    resetGame(level){
        super.resetGame(level);
        $(".compare h1").text("");
    }

    // The following methods must be overridden
    correctAnswer(){
        //record
        this.SetRecord();
    }

    wrongAnswer(){
        this.setLives(this.lives-1);
        //record
        this.SetRecord();
    }

    SetRecord(){
        let QuestionRecord = 
            this.gameData[this.level - 1].QuestionAnswer[this.QuestionIndex].questionLeft
            + this.Answer
            + this.gameData[this.level - 1].QuestionAnswer[this.QuestionIndex].questionRight;

        let AnswerRecord = 
            this.gameData[this.level - 1].QuestionAnswer[this.QuestionIndex].questionLeft
            + this.MyAnswer
            + this.gameData[this.level - 1].QuestionAnswer[this.QuestionIndex].questionRight;

        AnswerRecord = AnswerRecord.replace(/\n/g, "");
        QuestionRecord = QuestionRecord.replace(/\n/g, "");

        this.recordObj.appendToRecord(constant.recordItem.QUESTION, QuestionRecord);
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, AnswerRecord);
    }

    getGameResult(){
        if(this.result === constant.BINGO)
            this.gameState = constant.GAME_WIN;
        else{
            $(".compare h1").text("");
            this.gameState = constant.GAME_ALIVE;
        }
    }

    createQuestions(gameData, level){
        this.QuestionIndex = helpModules.randomNumber(0, 4);
        $(".firstValueContainer .Question").text(gameData[level-1].QuestionAnswer[this.QuestionIndex].questionLeft);
        $(".secondValueContainer .Question").text(gameData[level-1].QuestionAnswer[this.QuestionIndex].questionRight);
        this.Answer = gameData[level-1].QuestionAnswer[this.QuestionIndex].answer;
    }

    SetSymbol(DraggingItem){
        if(DraggingItem.hasClass("moreThan")){
            $(".compare h1").text(">");
            this.MyAnswer = '>';
        }
        
        else if(DraggingItem.hasClass("lessThan")){
            $(".compare h1").text("<");
            this.MyAnswer = '<';
        }
        
        else if(DraggingItem.hasClass("equal")){
            $(".compare h1").text("=");
            this.MyAnswer = '=';
        }

        else
            return;
    }

    compareAnswer(){
        this.result = this.Answer === this.MyAnswer ? constant.BINGO : constant.DADA;
    }

}

class gameAreaGenerator {
    constructor(gameData) {
        $('.gameArea').html("");
        const questionDisplayHTML = `
        <div class="questionDisplay">
            <div class="firstValueContainer">
                <p class="Question">NaN</p>
            </div>

            <div class="compare compareDetect">
                <h1 class="compareDetect"></h1>
            </div>

            <div class="secondValueContainer">
                <p class="Question">NaN</p>
            </div>
        </div>
        `;

        const answerDisplayHTML = `
        <div class="answerDisplay">
            <div class="moreThan DraggingItem">
                >
            </div>

            <div class="lessThan DraggingItem">
                <
            </div>

            <div class="equal DraggingItem">
                =
            </div>
        </div>
        `;
        $('.gameArea').append(questionDisplayHTML);
        $('.gameArea').append(answerDisplayHTML);
    }
}