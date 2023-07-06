// Import all you need module in game
import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    SizeComparison
} from "../../../game_view/src/templates/SizeComparisonTemplate.js"

// Export your game
export class Game extends SizeComparison {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.topicExplain = Array.from({ length: this.gameData.length }, (_, i) => `公分、毫米比大小（${i + 1}）`);
    }

    startGame(level) {
        super.startGame(level);
        // create game content
    }
}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/centimeter_millimeter_ratio_size/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: 'centimeter_millimeter_ratio_size' }, '*');
