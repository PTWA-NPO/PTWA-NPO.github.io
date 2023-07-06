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
                    $('.questionIndex').text(`${value}/${gameData[this.level-1].question.length}`)
                }
                target[property] = value;
                return true;
            }
        });
        this.drawingGenerator = new DrawingGenerator();
    }
    
    startGame(level) {
        this.bottomArea.initialize(this.gameData[this.level-1]);
        super.startGame(level);
        // create game content
        this.answerLimit = this.gameData[this.level-1].answer.length;
        this.currentAnswer = [];
        this.combinationLock = $('.combinationLock')
        this.topArea = $('.topArea')
        this.drawingGenerator.remove();
        if (this.gameData[this.level-1].isDraw === 'true') {
            this.drawingGenerator = new DrawingGenerator();
        }
    }
    
    changeTopic(correntQuesionIndex) {
        // If need that can overwrite this function
    }

    compareAnswer() {
        let currentAnswer = [];
        this.result = constant.BINGO;

        $('.answerInput').each((i, answer) => {
            let textValue = isNaN(Number($(answer).text()))?$(answer).text():Number($(answer).text());
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
            <button class="lastAnswer">&lt;</button>
            <div class="answerContainer">
                <div class="answerArea">
                </div>
                <div class="combinationLock">
                    <div class="combinationLockContainer">
                    </div>
                    <button>輸入</button>
                </div>
            </div>
            <h3 class="questionIndex"></h3>
            <button class="nextAnswer">&gt;</button>
        </div>
        `;
        $('.gameArea').append(bottomAreaHTML);
    }
    
    initialize(gameData) {
        $('.answerArea *').remove();
        this.gameQuestion = [...gameData.question];
        this.gameAnswer = [...gameData.answer];
        this.inputLength = gameData.inputLength;
        this.correntQuestion = 1;
        this.currentAnswer = null;
        this.generateAnswerArea().generateCombinationLock();
        this.showQuestion();
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
                    let dataValue = this.gameAnswer.splice(0, 1)[0];

                    dataValue = dataValue || '';
    
                    let newH1 = $('<h1>', {class: 'answerInput', text: '　'});
    
                    newH1.attr({
                        'data-count': dataCount,
                        'data-value': dataValue,
                        'data-isRight': false
                    });
    
                    answerAreaHTML += newH1.prop('outerHTML');
                    
                    parts[i] = parts[i].substring(1);
                }

                answerAreaHTML += '<h1>' + parts[i] + '</h1>';
            }
            $('.answerArea').append(`<div id="q${index}"> ${answerAreaHTML}</div>`);
            $(`#q${index}`).hide()
        });
    
        return this;
    }
    
    generateCombinationLock() {
        const combinationLockContainer = $('.combinationLockContainer');
        combinationLockContainer.empty();
        
        for (let i = 1; i <= this.inputLength; i++) {
            const inputHTML = `
                <div>
                    <input type="number" id="digit${i}" min="0" max="9" value="0" />
                </div>
            `;
            combinationLockContainer.append(inputHTML);
        }
        
        return this;
    }
    
    changeQuestion(options={}) {
        const {isPrevious=false, isNext=false } = options;
        if (isPrevious){
            this.correntQuestion = this.correntQuestion > 1 ? this.correntQuestion - 1 : $('.answerArea').children().length;
        }
        else if (isNext){
            this.correntQuestion = this.correntQuestion < $('.answerArea').children().length ? this.correntQuestion + 1 : 1;
        }
        this.showQuestion();
    }
    
    showQuestion() {
        $('.answerArea > *').hide();

        $('.answerArea > *').eq(this.correntQuestion-1).show();
    }

    handleEvent() {
        const answerInput = $('.answerInput');
        const combinationLock = $('.combinationLock');

        answerInput.each((i,  answer) => {
            $(answer).on('click', () => {
                this.currentAnswer = $(answer);
                combinationLock.toggle();
                if (combinationLock.is(':visible')) {
                    combinationLock.css('display', 'flex');
                }
            });
        });
        
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

        const checkPassword = () => {
            const inputs = $('input[type="number"]');
            let inputsAnswer = "";
            inputs.each((i, ele) => {
                inputsAnswer += $(ele).val();
            })
    
            this.currentAnswer.text(isNaN(Number(inputsAnswer))?inputsAnswer:Number(inputsAnswer));
            combinationLock.toggle();
        }

        const inputs = $("input[type='number']");
        inputs.each(function() {
            $(this).on("wheel mousewheel", handleNumberInput);
        });
        
        $('.combinationLock button').on('pointerdown', checkPassword);
        $('.lastAnswer').on('pointerdown', () => {
            this.changeQuestion({question: this.correntQuestion,isPrevious: true});
        });
        $('.nextAnswer').on('pointerdown', () => {
            this.changeQuestion({question: this.correntQuestion,isNext: true});
        });
    }
}

class DrawingGenerator {
    constructor() {
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

        this.canvas = document.getElementById('drawArea');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 5;
    
        this.drawing = false;
        let offset = $('#drawArea').offset();

        $('#drawArea').mousedown((e) => {
        this.drawing = true;
            this.context.beginPath();
            this.context.moveTo(e.pageX - offset.left, e.pageY - offset.top);
        }).mousemove((e) => {
            if (this.drawing) {
                this.context.lineTo(e.pageX - offset.left, e.pageY - offset.top);
                this.context.stroke();
                $('.cursor').css({
                    left:  e.pageX-10,
                    top:   e.pageY-10
                });
            }
        }).mouseup(() => {
            this.drawing = false;
        }).mouseleave(() => {
            this.drawing = false;
        });
    
        $('.drawingTool').click((e) => {
            if (e.target.id === 'pencil') {
                this.context.globalCompositeOperation = "source-over";
                this.context.lineWidth = 5;
                $('#eraser').removeClass('clicked-bg');
                $('.cursor-eraser').hide();
            }
            else if (e.target.id === 'eraser') {
                this.context.globalCompositeOperation = "destination-out";
                this.context.lineWidth = 20;
                $('#pencil').removeClass('clicked-bg');
                $('.cursor-eraser').show();
            }
            else return
            $(`#${e.target.id}`).toggleClass('clicked-bg');
        });
    }

    remove() {
        $('.drawingTool').remove();
        $('#drawArea').remove();
    }
}