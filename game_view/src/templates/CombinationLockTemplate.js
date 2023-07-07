import * as constant from "../constant.js"
import {gameModules} from "../module.js"
import {GameFramework} from "../GameFramework.js"

// Export your game
export class CombinationLockTemplate extends GameFramework {
    constructor(gameData){
        super(gameData);
        // Initialise game object
        this.bottomArea = new Proxy(new BottomAreaGenerator(), {
            set: (target, property, value) => {
                // Check if the changed property is 'correntQuestion'
                if (property === 'correntQuestion') {
                    this.changeTopic(value);
                }
                target[property] = value;
                return true;
            }
        });
        this.drawingGenerator = new DrawingGenerator();
    }
    
    startGame(level) {
        if (!super.startGame(level)) return false;
        const levelIndex = level -1;
        this.bottomArea.initialize(this.gameData[levelIndex]);
        super.startGame(levelIndex);
        // create game content
        this.answerLimit = this.gameData[levelIndex].answer.length;
        if (this.gameData[levelIndex].isRandom) {
            this.answerLimit = this.gameData[levelIndex].answer[this.bottomArea.correntQuestion].length;
        } else {
            this.answerLimit = this.gameData[levelIndex].answer.length;
        }
        this.currentAnswer = [];
        this.topArea = $('.topArea')
        this.drawingGenerator.remove();
        if (this.gameData[levelIndex].isDraw === 'true') {
            this.drawingGenerator = new DrawingGenerator();
        }
        return true;
    }
    
    changeTopic(correntQuesionIndex) {
        // If need that can overwrite this function
    }

    compareAnswer() {
        let currentAnswer = [];
        this.result = constant.BINGO;

        $('.answerInput').each((i, answer) => {
            let textValue = isNaN(Number($(answer).val()))?$(answer).val():Number($(answer).val());
            let dataValue = isNaN(Number($(answer).attr('data-value')))?$(answer).attr('data-value'):Number($(answer).attr('data-value'));
            let result = false;

            if (textValue === dataValue) {
                result = true;
                $(answer).removeClass('redWord');                
                $(answer).addClass('greenWord');
            }
            else {
                this.result = constant.DADA;
                $(answer).removeClass('greenWord');
                $(answer).addClass('redWord');
            }
            currentAnswer.push(textValue);
            $(answer).attr('data-isRight', result);
        });
        this.currentAnswer = currentAnswer;
    }
    

    // The following methods must be overridden
    getGameResult(){
        // juddging
        const incorrectElements = $('.answerInput').filter((i, answer) => {
            return $(answer).attr('data-isRight') === 'true';
        });
          
        if (incorrectElements.length >= this.answerLimit) {
            this.gameState = constant.GAME_WIN;
        }
    }
    correctAnswer(){
        // action
        throw new Error('please define correctAnswer');
    }
    wrongAnswer(){
        // action
        throw new Error('please define wrongAnswer');
    }
}

class BottomAreaGenerator {
    constructor() {
        const bottomAreaHTML = `
        <div class="bottomArea">
            <div class="answerContainer">
                <div class="answerArea">
                </div>
            </div>
            <h3 class="questionIndex"></h3>
        </div>
        `;
        $('.gameArea').append(bottomAreaHTML);
    }
    
    initialize(gameData) {
        $('.answerArea *').remove();

        if (gameData.isRandom) {
            const index = Math.floor(Math.random() * gameData.question.length);
            this.gameQuestion = [...gameData.question[index]];
            this.gameAnswer = [...gameData.answer[index]];
            this.correntQuestion = index;
          } else {
            this.gameQuestion = [...gameData.question];
            this.gameAnswer = [...gameData.answer];
            this.correntQuestion = 1;
          }
        this.currentAnswer = null;
        this.generateAnswerArea();
        this.handleEvent();
    }

    generateAnswerArea() {
        this.gameQuestion.forEach((str, index) => {
            let answerAreaHTML = '';
            let parts = str.split('&');
            
            for(let i = 0; i < parts.length; i++){
                let dataCount = Number(parts[i][0]);
                dataCount = isNaN(dataCount) ? 0 : dataCount;
                if(dataCount){
                    
                    for (let j = 0; j < dataCount; j++) {
                        let dataValue = this.gameAnswer.splice(0, 1)[0];
                        dataValue = dataValue || '';
                        const newH1 = $('<input>', {class: 'answerInput', text: '0', type:'number', min: "0", max: "9", value: "0", id: `digit${j}`});
                        newH1.attr({
                            'data-value': dataValue,
                            'data-isRight': false
                        });
                        answerAreaHTML += `
                            <div class="combinationLock">
                                <button class="decrementButton">-</button>
                                ${newH1.prop('outerHTML')}
                                <button class="incrementButton">+</button>
                            </div>
                        `;
                    }
    
                    parts[i] = parts[i].substring(1);
                }

                answerAreaHTML += '<h1>' + parts[i] + '</h1>';
            }
            $('.answerArea').append(`<div id="q${index}"> ${answerAreaHTML}</div>`);
        });
    
        return this;
    }
    
    handleEvent() {
        const handleNumberInput = (e) => {
            e.preventDefault();
            const input = e.target;
            const step = parseFloat(input.step) || 1;
            const value = parseFloat(input.value) || 0;
            const deltaY = e.originalEvent.deltaY || -e.originalEvent.wheelDelta;
            if (deltaY < 0) {
                input.value = Math.min(input.max, value + step);
            } else {
                input.value = Math.max(input.min, value - step);
            }
        }

        const combinationLocks = $(".combinationLock");
        combinationLocks.each((i, combinationLock) => {
            const $combinationLock = $(combinationLock);
            const $input = $combinationLock.find('input');
            $input.on("wheel mousewheel", handleNumberInput);
            const incrementButton = $combinationLock.find(".incrementButton");
            const decrementButton = $combinationLock.find(".decrementButton");
            
            const increment = function() {
                const value = +$input.val();
                $input.val(parseInt(Math.min(value + 1, 9)));
            };
            
            const decrement = function() {
                const value = +$input.val();
                $input.val(parseInt(Math.max(value-1, 0)));
            };
            
            incrementButton.on('click', increment);
            decrementButton.on('click', decrement);
        });
    }
}

class DrawingGenerator {
    constructor() {
        this.setupHTML();
        this.initializeAttributes();
        this.resizeCanvas();
        this.bindEventHandlers();
    }

    setupHTML() {
        const drawingTool = `
            <div class="cursor cursor-eraser"></div>
            <div class="drawingTool">
                <button id="pencil" class="icon clicked-bg">畫筆</button>
                <button id="eraser" class="icon">橡皮擦</button>
            </div>
        `
        $('.gameArea').prepend(drawingTool);
        $('.topArea').prepend(`<canvas id="drawArea"></canvas>`);
        $('.cursor-eraser').hide();
    }

    initializeAttributes() {
        this.topArea = document.querySelector('.topArea');
        this.drawArea = document.getElementById('drawArea');
        this.context = this.drawArea.getContext('2d');
        this.updateCanvasSize();
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 5;
        this.drawing = false;
    }

    updateCanvasSize() {
        this.drawArea.style.width = this.topArea.offsetWidth + 'px';
        this.drawArea.style.height = this.topArea.offsetHeight + 'px';
        this.drawArea.width = this.topArea.offsetWidth;
        this.drawArea.height = this.topArea.offsetHeight;
    }
        
    getAdjustedCoordinates(e) {
        this.offset = this.drawArea.getBoundingClientRect();
        const marginTop = parseInt(window.getComputedStyle(this.topArea).getPropertyValue('margin-top'));
        const {pageX, pageY} = e.touches ? e.touches[0] : e;
        const drawX = pageX - this.offset.left - this.topArea.offsetLeft;
        const drawY = pageY - this.offset.top - this.topArea.offsetTop + marginTop;
        return { drawX, drawY };
    }

    bindEventHandlers() {
        $('#drawArea').on('pointerdown touchstart', (e) => {
            e.preventDefault();
            this.drawing = true;
            this.context.beginPath();
            const { drawX, drawY } = this.getAdjustedCoordinates(e);
            this.context.moveTo(drawX, drawY);
        }).on('pointermove', (e) => {
            if (this.drawing) {
                const { drawX, drawY } = this.getAdjustedCoordinates(e);
                this.context.lineTo(drawX, drawY);
                this.context.stroke();
                $('.cursor').css({
                    left:  drawX-10,
                    top:   drawY-10+70
                });
            }
        }).on('pointerup', () => {
            this.drawing = false;
        }).on('pointerleave', () => {
            this.drawing = false;
        });
    
        $('.drawingTool').click((e) => {
            if (e.target.id === 'pencil') {
                this.switchTool("source-over", 5, 'eraser', false);
            }
            else if (e.target.id === 'eraser') {
                this.switchTool("destination-out", 20, 'pencil', true);
            }
            else return
            $(`#${e.target.id}`).toggleClass('clicked-bg');
        });
    }

    switchTool(operation, lineWidth, otherTool, eraserVisible) {
        this.context.globalCompositeOperation = operation;
        this.context.lineWidth = lineWidth;
        $(`#${otherTool}`).removeClass('clicked-bg');
        $('.cursor-eraser').toggle(eraserVisible);
    }

    resizeCanvas() {
        const adjustDrawAreaSize = () => {
            this.updateCanvasSize();
            this.context.lineWidth = 5;
        }
        const resizeObserver = new ResizeObserver(adjustDrawAreaSize);
        resizeObserver.observe(this.topArea);
    }

    remove() {
        $('.cursor').remove();
        $('.drawingTool').remove();
        $('#drawArea').remove();
    }
}
