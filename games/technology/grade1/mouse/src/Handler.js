import { Game } from './Game.js';
export { lastBtnHandler, nextBtnHandler, startBtnHandler, recordBtnHandler, hintBtnHandler, game };


// option btn
const LAST_BTN = 'lastBtn'
const START_BTN = 'startBtn'
const NEXT_BTN = 'nextBtn'
const HINT_BTN = 'hintBtn'
const RECORD_BTN = 'recordBtn'
const SUBMIT_BTN = 'submitBtn'


const game = new Game();
// Handlers
class Handler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    handleRequest(request) {
        if (this.nextHandler) {
            this.nextHandler.handleRequest(request);
        }
    }
}

class LastBtnHandler extends Handler {
    handleRequest(request) {
        if (request === LAST_BTN) {
            game.changeLevel(game.level, {isPrevious: true});
        } else {
            super.handleRequest(request);
        }
    }
}

class NextBtnHandler extends Handler {
    handleRequest(request) {
        if (request === NEXT_BTN) {
            game.changeLevel(game.level, {isNext: true});
        } else {
            super.handleRequest(request);
        }
    }
}

class StartBtnHandler extends Handler {
    handleRequest(request) {
        if (request === START_BTN) {
            game.startGame(game.level);
        } else {
            super.handleRequest(request);
        }
    }
}

class RecordBtnHandler extends Handler {
    handleRequest(request) {
        if (request === RECORD_BTN) {
            game.loadRecord();
        } else {
            super.handleRequest(request);
        }
    }
}

class HintBtnHandler extends Handler {
    handleRequest(request) {
        if (request === HINT_BTN) {
            game.toggleHint();
        } else {
            super.handleRequest(request);
        }
    }
}
class SubmitBtnHandler extends Handler {
    handleRequest(request) {
        if (request === SUBMIT_BTN) {
            game.checkAnswer();
        } else {
            super.handleRequest(request);
        }
    }
}

// Set up the chain
const lastBtnHandler = new LastBtnHandler();
const startBtnHandler = new StartBtnHandler();
const nextBtnHandler = new NextBtnHandler();
const recordBtnHandler = new RecordBtnHandler();
const hintBtnHandler = new HintBtnHandler();
const submitBtnHandler = new SubmitBtnHandler();

startBtnHandler
    .setNext(lastBtnHandler)
    .setNext(nextBtnHandler)
    .setNext(recordBtnHandler)
    .setNext(hintBtnHandler)
    .setNext(submitBtnHandler);
