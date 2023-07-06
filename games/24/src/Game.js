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
        this.topicExplain = Array(this.levelLimit).fill("拖曳物品用尺量量看長度幫助回答問題吧！");
        this.positions = [];
        this.topic = $(`.topic :nth-child(${this.level})`);
        $('.topic img').each((i,img) => {
            const $img = $(img);
            this.positions.push({top: $img.position().top, left: $img.position().left});
            $img.draggable();
        });
    }

    startGame(level) {
        super.startGame(level);
        // create game content
        this.answerData = this.gameData[level-1].answer;
        $('.topic img').each((i, img) => {
            var $img = $(img);

            $img.animate(this.positions[i], 0);
        });
        this.topic = $(`.topic :nth-child(${this.level})`);
        this.generatorTopicArea();
    }

    generatorTopicArea() {
        $('.topic').children().hide();
        this.topic.show();
        this.changeTopic(1);
    }
    
    changeTopic(correntQuestionIndex) {
        const imgWidthMm = this.gameData[this.level-1].imgSize[correntQuestionIndex-1];
        const imgWidthPercent = (imgWidthMm / 150) * (100-6.5); // 6.5 is distance
        this.topic.css("width", imgWidthPercent + "%");
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
const gameData = await gameModules.getJson('../../games/24/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: '24' }, '*');
