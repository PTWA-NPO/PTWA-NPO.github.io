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
        this.topicExplain = Array(this.levelLimit).fill("多少公斤等於多少公克呢？");
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        // create game content
        this.answerData = this.gameData[level-1].answer;
    }

    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData.join('-'));
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer.join('-'));
    }
    wrongAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData.join('-'));
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer.join('-'));
    }

}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../19/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: '19' }, '*');
