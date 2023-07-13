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
        this.topicExplain = Array(this.levelLimit).fill("拖動圖形比對方格圖，答案是幾平方公分呢？");
        $( ".topic img" ).draggable();
        this.topic = $('.topic').children().eq(this.level - 1);
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        // create game content
        this.answerData = this.gameData[level-1].answer;
        this.topic = this.topArea.find('.topic').children().eq(this.level - 1);
        this.generatorTopicArea();
    }

    generatorTopicArea() {
        $('.topic').children().hide();
        this.topic.show();
        const width = this.gameData[this.level-1].width;
        const height = this.gameData[this.level-1].height;
        this.topic.css({'width': `${40*width}px`, 'height': `${40*height}px`});
    }

    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData);
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer);
    }
    wrongAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.answerData);
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.currentAnswer);
    }

}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('/public/games/16/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: '16' }, '*');
