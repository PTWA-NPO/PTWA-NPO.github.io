import * as constant from "./constant.js";

export class Handler {
    constructor(game, levelArea) {
        this.game = game;
        this.levelArea = levelArea;
        this.handlers = this.initializeHandlers();
    }

    initializeHandlers() {
        return {
            [constant.optionsBtn.LAST_BTN]: this.changeLevel.bind(this,{ isPrevious: true }),
            [constant.optionsBtn.START_BTN]: this.startGame.bind(this),
            [constant.optionsBtn.NEXT_BTN]: this.changeLevel.bind(this, { isNext: true }),
            [constant.optionsBtn.HINT_BTN]: this.game.toggleHint.bind(this.game),
            [constant.optionsBtn.RECORD_BTN]: this.game.recordObj.loadRecord.bind(this.game.recordObj),
            [constant.optionsBtn.SUBMIT_BTN]: this.game.checkAnswer.bind(this.game),
        };
    }

    handleRequest(request) {
        const handler = this.handlers[request];
        if (handler) handler();
    }

    changeLevel(options) {
        // TODO only start game can change game level
        if (this.game.gameState === constant.GAME_ALIVE) return;
        this.changeActiveLevel();
        this.game.changeLevel(options);
        this.updateButtonAndLevelStyle();
    }

    startGame() {
        this.game.startGame(this.game.level);
        this.updateButtonAndLevelStyle();
    }

    updateButtonAndLevelStyle() {
        this.updateLevelClasses();
        this.removeNextButtonJumpStyle();
    }

    removeNextButtonJumpStyle() {
        $(`#${constant.optionsBtn.NEXT_BTN}`).removeClass("jumpBtn");
    }

    updateLevelClasses() {
        this.updateWinLevels();
        this.updateActiveLevel();
    }

    updateWinLevels() {
        for (const value of this.game.winLevelSet) {
            this.levelArea.children().eq(value - 1).addClass("win");
        }
    }

    updateActiveLevel() {
        this.levelArea.children().eq(this.game.level - 1).addClass("active").removeClass("win");
    }

    changeActiveLevel() {
        this.levelArea.children().eq(this.game.level - 1).removeClass("active");
    }
}
