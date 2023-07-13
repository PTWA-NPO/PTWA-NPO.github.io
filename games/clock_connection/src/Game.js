import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    ConnectionGame
} from "../../../game_view/src/templates/GameTemplate.js"


export class Game extends ConnectionGame {
    constructor(gameData){
        super(gameData);
        this.topicExplain = Array(this.levelLimit).fill('時鐘上指針的刻度是幾點幾分呢？');

        this.questionsArr = [
            {
                "hour": helpModules.shuffle(Array.from({length: 11}, (_, i) => i + 1).filter(n => n % 3 !== 0))
                , "minute": helpModules.shuffle(Array.from({length: 60/15}, (_, i) => i*15))
            } 
            , {
                "hour": helpModules.getRandomNumberArr(0, 12, 1, 12)
                , "minute": helpModules.shuffle(Array.from({length: 60/10}, (_, i) => i*10))
            }
            , {
                "hour": helpModules.getRandomNumberArr(0, 12, 1, 12)
                , "minute": helpModules.shuffle(Array.from({length: 60/5}, (_, i) => i * 5))
            }
            , {
                "hour": helpModules.getRandomNumberArr(0, 12, 1, 12)
                , "minute": helpModules.shuffle(Array.from({length: 60}, (_, i) => i))
            }
            , {
                "hour": helpModules.shuffle(Array.from({length: 12}, (_, i) => i+13))
                , "minute": helpModules.shuffle(Array.from({length: 60}, (_, i) => i))
            }
            , {
                "hour": helpModules.getRandomNumberArr(0, 25, 1, 25)
                , "minute": helpModules.shuffle(Array.from({length: 60}, (_, i) => i))
            }
        ]
        
        this.leftArea = $('.gameArea .leftArea');
        this.rightArea = $('.gameArea .rightArea');
    }

    getCorrectLimit(){
        return 4;
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        this.createQuestions();
        this.createHint();
        helpModules.reorder(
            this.leftArea
            , this.rightArea
        );
    }

    creatRecord(recordType, dot){
        const value = dot.data('value');
        if (recordType === constant.recordItem.QUESTION) {
            this.lastQuestion = value;
        }
        else {
            this.lastAnswer = value;
        }
        const prefix = dot.closest('.leftArea').length ? '時鐘' : '電子鐘';
        return `${prefix} ${value}`;
    }

    createQuestions() {
        const level = this.level - 1;
        const hourIndex = helpModules.shuffle(Array.from({length: this.questionsArr[level].hour.length}, (_, index) => index));
        const minuteIndex = helpModules.shuffle(Array.from({length: this.questionsArr[level].minute.length}, (_, index) => index));
        for (let i = 0; i < this.correctLimit; i++) {
            let hour = this.questionsArr[level].hour[hourIndex[i]];
            let minute = this.questionsArr[level].minute[minuteIndex[i]];
            this.setTime(hour, minute, this.leftArea.find('.contentArea').eq(i));
            hour = hour < 10 ? `0${hour}` : hour === 24 ? "00" : hour;
            minute = minute < 10 ? `0${minute}` : minute;
            this.rightArea.find('.contentArea').eq(i).find('.hour').text(hour);
            this.rightArea.find('.contentArea').eq(i).find('.minute').text(minute);
            this.leftArea.find('.questionArea').eq(i).find('.dot').data({'value': `${hour}:${minute}`});
            this.rightArea.find('.answerArea').eq(i).find('.dot').data({'value': `${hour}:${minute}`});
        };
    }

    setTime(hour, minute, targetElement) {
        // 計算指針的角度
        const hoursDegree = ((hour + minute / 60) / 12) * 360;
        const minutesDegree = (minute / 60) * 360;
      
        // 旋轉指針
        targetElement.find('.hour').css('transform', `rotate(${hoursDegree}deg)`);
        targetElement.find('.minute').css('transform', `rotate(${minutesDegree}deg)`);
      }
      
    createHint() {
        $('.hintContainer .leftArea').html(this.gameArea.find('.leftArea .contentArea').clone());
        $('.hintContainer .rightArea').html(this.gameArea.find('.rightArea .contentArea').clone());
    }
}

export default Game;

const gameData = await gameModules.getJson('/public/games/clock_connection/game_config.json');
const gameInstance = new Game(gameData);
window.getGame = function() {
    return gameInstance;
};

parent.postMessage({ type: 'clock_connection' }, '*');
