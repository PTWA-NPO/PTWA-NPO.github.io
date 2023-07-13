import * as constant from "../../../game_view/src/constant.js"
import {
    gameModules
    , helpModules
} from "../../../game_view/src/module.js"
import {
    ConnectionGame
} from "../../../game_view/src/templates/GameTemplate.js"


const PRONUNCIATION_MAP = {
    thousand: ['零', '一', '兩', '三', '四', '五', '六', '七', '八', '九'],
    hundred: ['零', '一百', '兩百', '三百', '四百', '五百', '六百', '七百', '八百', '九百'],
    ten: ['零', '一十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'],
    ones: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
}
const UNIT = ['thousand', 'hundred', 'ten', 'ones'];

export class Game extends ConnectionGame {
    constructor(gameData){
        super(gameData);
        this.topicExplain = Array(this.levelLimit).fill('數一數，把積木連讀音連定位板吧！');

        this.leftArea = $('.gameArea .leftArea');
        this.centerArea = $('.gameArea .centerArea');
        this.rightArea = $('.gameArea .rightArea');
    }

    getCorrectLimit(){
        return this.gameData[this.level-1].thousand.length * 2;
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        this.resetQuestions();
        this.createQuestions();
        this.createHint();
        helpModules.reorder(
            this.leftArea
            , this.centerArea
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
        const prefix = dot.closest('.centerArea').length ? '讀音' : dot.closest('.leftArea').length ? '積木' : '定位板';
        return `${prefix} ${value}`;
    }

    resetQuestions() {
        this.leftArea.find('*').remove('img');
        this.centerArea.find('*').filter(':hidden').css('display', '');
        this.rightArea.find('*').filter(':hidden').css('display', '');
    }

    createQuestions() {
        const level = this.level - 1;
        for (let i = 0; i < this.gameData[level].thousand.length; i++) {
            const numerics = this.getNumerics(level, i);
            this.createQuestionElements(numerics, i);
            this.storeQuestionData(numerics, i);
        }
    }

    getNumerics(level, i) {
        return UNIT.map(numeric => {
            const value = helpModules.randomNumber(helpModules.randomNumber(0,2), (this.gameData[level][numeric][i] + 1));
            return {
                'value': value,
                'pronunciation': PRONUNCIATION_MAP[numeric][value]
            };
        });
    }

    createQuestionElements(numerics, i) {
        numerics.forEach((numeric, index) => {
            this.createImg(this.leftArea.find('.contentArea').eq(i), UNIT[index], numeric.value);
            this.setPronunciation(this.centerArea, UNIT[index], numerics, i);
            this.setNumber(this.rightArea, UNIT[index], numerics, i);
        });
    }

    storeQuestionData(numerics, i) {
        const data = parseInt(numerics.map(numeric => numeric.value).join(''));
        const $areas = [
            this.leftArea.find('.questionArea'),
            this.centerArea.find('.questionArea'),
            this.rightArea.find('.answerArea')
        ];
        $areas.forEach(area => area.eq(i).find('.dot').data({'value': `${data}`}));
    }
    
    createImg(unit, imgName, count) {
        if (count < 0){
            unit.css('display', 'none');
            return
        }
        for (let i = 0; i < count; i++) {
            unit.append(this.getImg(imgName));
        }
    }

    setPronunciation(area, unit, numerics, i) {
        let pronunciation = numerics[3].pronunciation;
        let is_hidden = false;
        if (unit === 'hundred') {
            pronunciation = numerics[1].pronunciation;
            if (numerics[0].value+numerics[1].value === 0) {
                is_hidden = true;
            }
        }
        else if (unit === 'ten') {
            pronunciation = numerics[2].pronunciation;
            if (numerics[1].value+numerics[2].value === 0) {
                is_hidden = true;
            }
        }
        else if (unit === 'thousand') {
            pronunciation = numerics[0].pronunciation;
            if (numerics[0].value === 0) {
                is_hidden = true;
            }
        }
        else if (unit === 'ones') {
            if (numerics[3].value === 0) {
                is_hidden = true;
            }
        }
        is_hidden ? area.find(`.${unit}`).eq(i).css('display', 'none') : area.find(`.${unit}`).eq(i).text(pronunciation);
    }

    setNumber(area, unit, numerics, i) {
        let number = numerics[3].value;
        let is_hidden = false;
        if (unit === 'hundred') {
            number = numerics[1].value;
            if (numerics[0].value+numerics[1].value === 0) {
                is_hidden = true;
            }
        }
        else if (unit === 'ten') {
            number = numerics[2].value;
            if (numerics[1].value+numerics[2].value === 0) {
                is_hidden = true;
            }
        }
        else if (unit === 'thousand') {
            number = numerics[0].value;
            if (numerics[0].value === 0) {
                is_hidden = true;
            }
        }
        is_hidden ? area.find(`.${unit}`).eq(i).css('display', 'none') : area.find(`.${unit} .number`).eq(i).text(number);
    }

    getImg(imgName) {
        return $('<img>')
            .attr('src', `./assets/${imgName}.png`)
            .attr('alt', imgName);
    }
      
    createHint() {
        $('.hintContainer .leftArea').html(this.gameArea.find('.leftArea .contentArea').clone());
        $('.hintContainer .centerArea').html(this.gameArea.find('.centerArea .contentArea').clone());
        $('.hintContainer .rightArea').html(this.gameArea.find('.rightArea .contentArea').clone());
    }
}

export default Game;

const gameData = await gameModules.getJson('../less_than_10k_connection/game_config.json');
const gameInstance = new Game(gameData);
window.getGame = function() {
    return gameInstance;
};

parent.postMessage({ type: 'less_than_10k_connection' }, '*');
