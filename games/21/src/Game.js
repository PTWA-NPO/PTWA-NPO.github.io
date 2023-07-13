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
        this.topicExplain = Array(this.levelLimit).fill("可以拖曳甜甜圈，來幫助回答問題喔！");
        this.positions = [];
        $('.donuts-img img').each((i,img) => {
            const $img = $(img);
    
            this.positions.push({top: $img.position().top, left: $img.position().left});
    
            $img.draggable();
        });
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        // create game content
        this.answerData = this.gameData[level-1].answer;
        $('.donuts-img img').each((i, img) => {
            var $img = $(img);

            $img.animate(this.positions[i], 0);
        });
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
const gameData = await gameModules.getJson('../21/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: '21' }, '*');
