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
        this.topicExplain = Array.from({ length: this.gameData.length }, (_, i) => `公克、公斤比大小（${i + 1}）`);
    }
}

export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('/public/games/kg_grams_board_size/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: 'kg_grams_board_size' }, '*');
