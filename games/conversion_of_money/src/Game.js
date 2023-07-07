// Import all you need module in game
import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    CombinationLockTemplate
} from "../../../game_view/src/templates/CombinationLockTemplate.js"


// Export your game
export class Game extends CombinationLockTemplate {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.topicExplain = Array(this.levelLimit).fill("點數錢幣，進行換算，並填入答案");
        this.banknote = $('.banknote');
        this.coin = $('.coin');
    }
    
    startGame(level) {
        if (!super.startGame(level)) return false;
        // create game content
        this.answerData = this.gameData[level-1].answer;
        this.questionData = this.gameData[level-1].question;
        this.generatorTopicArea();
    }

    generatorTopicArea() {
        this.banknote.empty();
        this.coin.empty();
    
        this.answerData.forEach((num, index) => {
            for(let i = 0; i < num && index < this.questionData.length-1; i++){
                const img = $('<img>', {
                    src: `./assets/images/${index}.png`
                });
            const div = $('<div>').append(img);
            
            // 將 div 添加到 this.topArea
            if (index < 2) {
                this.banknote.append(div);
            }
            else {
                this.coin.append(div);
            }
            }
        });
    }

    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData.map(Number).join('-'));
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer.map(Number).join('-'));
    }
    wrongAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData.map(Number).join('-'));
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer.map(Number).join('-'));
    }

}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/conversion_of_money/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: 'conversion_of_money' }, '*');
