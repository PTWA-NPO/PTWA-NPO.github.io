// Import all you need module in game
import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    GameFramework
} from "../../../game_view/src/GameFramework.js"

// Export your game
export class Game extends GameFramework {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.topicExplain = this.gameData.map(item => item.topic);
        this.updateIntervalIds = [];
        this.timeLimit = this.gameData[this.level-1].time;
        this.timeCount = this.timeLimit;
        this.score = 0;
        this.balloonPopSound = $('#balloonPop')[0];
        this.balloonApperSound = $('#balloonApper')[0];
        this.chickApperSound = $('#chickApper')[0];
        this.chickCatchSound = $('#chickCatch')[0];
        let lastClickTime = 0;
        $('.level img').click((e) => {
            const currentTime = new Date().getTime();
            const clickInterval = currentTime - lastClickTime;
            lastClickTime = currentTime;
            if (this.gameData[this.level-1].times === 2 && clickInterval > 300) {
                return
            }   
            if (this.level === 1){
                this.balloonPopSound.play();
            }
            else if (this.level === 2){
                this.chickCatchSound.play();
            }
            $(e.target).hide();
            this.updateScore(10);
        });
        $('.gameArea').on("mousemove", (e) => {
            let $cursor = $(".cursor");
            
            let x = this.level === 2 ? e.pageX : e.pageX - $cursor.width() / 2;
            let y = e.pageY - $cursor.height() / 2;

            if (this.level === 1) {
                $cursor.find("img").attr("src", "./assets/target.png");
            } else if (this.level === 2) {
                $cursor.find("img").attr("src", "./assets/farmera.png");
            } else {
                $cursor.hide();
                return;
            }
            
            $cursor.css("transform", `translate(${x}px, ${y}px)`);
            $cursor.show();
        });
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        // create game content
        $(`#level-${level}`).toggle();
        this.updateScore(-this.score);
        this.hideAllImages();
        this.createGameView();
        this.timeLimit = this.gameData[level-1].time;
        this.updateTime(this.timeLimit);
    }

    resetGame(level) {
        super.resetGame(level);
        $(`.level`).hide();
    }
    // The following methods must be overridden
    getGameResult(){
        // juddging
        this.gameState = constant.GAME_WIN;
    }
    correctAnswer(){
        // action
        this.recordObj.appendToRecord(constant.recordItem.QUESTION, this.timeLimit);
        this.recordObj.appendToRecord(constant.recordItem.ANSWER, this.score);
        
        for (let i = 0; i < this.updateIntervalIds.length; i++) {
            clearInterval(this.updateIntervalIds[i]);
        }
    }
    wrongAnswer(){
        // action
    }

    updateScore(score) {
        this.score += score;
        $('.score').text(this.score);
    }

    hideAllImages() {
        $('.level img').hide();
    }
    createGameView() {
        const cdTime = this.getRandomDisplayTime(2000, 5000);
        let audioPlayer = this.balloonApperSound;
        const gameUpdateID = setInterval(() => {
            if (this.level === 2){
                audioPlayer = this.chickApperSound;
            }
            audioPlayer.pause();
            audioPlayer.play();
            this.showRandomImage();
        }, cdTime);
        this.updateIntervalIds.push(gameUpdateID);
    }

    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    showRandomImage() {
        const hiddenImages = $(`#level-${this.level} img:hidden`);
        if (hiddenImages.length === 0 || this.timeCount <= 0) {
          return;
        }
    
        const randomImage = this.getRandomElement(hiddenImages);
        if (this.gameData[this.level-1].times !== 2) {
            this.updateImagePosition(randomImage);
        }
        $(randomImage).fadeIn(500);
    
        setTimeout(() => {
          $(randomImage).fadeOut(500, () => {
            this.showRandomImage();
          });
        }, this.getRandomDisplayTime(4000, 8000));

    }
    
    getRandomDisplayTime(start, end, index) {
        if (typeof index === 'undefined') {
            return Math.floor(Math.random() * (end - start + 1)) + start;
        } else {
            const randomNumber = Math.floor(Math.random() * ((end - start) / index + 1));
            return randomNumber * index + start;
        }
    }
    
    getRandomPosition() {
        const $level = $(`#level-${this.level}`);
        const parentWidth = $level.outerWidth();
        const parentHeight = $level.outerHeight();
        const imageWidth = $('.level img').width();
        const imageHeight = $('.level img').height();
    
        const maxX = parentWidth - imageWidth;
        const maxY = parentHeight - imageHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
    
        return { top: randomY, left: randomX };
    }
    
    updateImagePosition(image) {
        const position = this.getRandomPosition();
        $(image).css({ top: position.top, left: position.left});
    }

    updateTime(time) {
        this.timeCount = time;
        $('.countDown').text(this.timeCount);
        const timeUpdateID = setInterval(() => {
            if (this.timeCount <= 0) {
                this.checkAnswer();
                clearInterval(timeUpdateID);
                return
            }
            this.timeCount -= 1;
            $('.countDown').text(this.timeCount);
        }, 1000);
        this.updateIntervalIds.push(timeUpdateID);
    }
}
export default Game;

// Read game_config.json file
const gameData = await gameModules.getJson('../../games/mouse_click/game_config.json');
// Create game Instance, Must input gameData
const gameInstance = new Game(gameData);
// Post game to game_view
window.getGame = function() {
    return gameInstance;
};

// type must === game filename
parent.postMessage({ type: 'mouse_click' }, '*');
