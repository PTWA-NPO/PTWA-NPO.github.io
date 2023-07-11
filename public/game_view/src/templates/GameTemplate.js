import * as constant from "../constant.js"
import {svgModules} from "../module.js"
import {GameFramework} from "../GameFramework.js"

export class ConnectionGame extends GameFramework {
    constructor(gameData){
        super(gameData);
        this.gameArea = $('.gameArea');
        this.drawingArea = $('.drawingArea');
        this.correctLimit = this.getCorrectLimit();
        this.svgRect = this.drawingArea.length > 0 ? this.drawingArea[0].getBoundingClientRect() : null;
        this.isDrawing = false;
        this.line = $('.line:last')[0];
        this.drawView();
    }

    getCorrectLimit(){
        throw new Error('please return getCorrectLimit');
    }

    drawView() {
        let clickTarget = null;
        const getDotPos = (e, parentName) => {
            let dot = $(e.target).closest(`.${parentName}`).find('.dot');
            if (dot.length === 2) {
                if (parentName === constant.gameHTML.QUESTION_AREA) {
                    dot = $(dot[1]);
                }
            }
            const recordType = parentName === constant.gameHTML.QUESTION_AREA ? constant.recordItem.QUESTION : constant.recordItem.ANSWER;
            const recordData = this.creatRecord(recordType, dot);
            this.recordObj.appendToRecord(recordType, recordData);
            if (e.type === 'touchstart') {
                pointerMoveListener(e);
            }
            const offset = dot.offset();
            const width = dot.width();
            const height = dot.height();
            const x = (offset.left + width / 2);
            const y = (offset.top + height / 2);
            return { x, y };
        }
        const pointerDownListener = (e) => {
            e.preventDefault();
            clickTarget = $(e.target).closest(`.${constant.gameHTML.QUESTION_AREA}`);
            const pos = getDotPos(e, constant.gameHTML.QUESTION_AREA);
            this.lineCoordinateString = `${pos.x},${pos.y}`;
            if ($(this.line).hasClass('wrongLine')){
                $(this.line).removeClass('wrongLine');
            }
            this.line.setAttribute("x1", pos.x);
            this.line.setAttribute("y1", pos.y);
            this.line.setAttribute("x2", pos.x);
            this.line.setAttribute("y2", pos.y);
            this.isDrawing = true;
        }
        
        const pointerMoveListener = (e) => {
            e.preventDefault();
            if (!this.isDrawing) return;
            const { offsetX, offsetY } = e.touches ? e.touches[0] : e;
            this.line.setAttribute("x2", offsetX);
            this.line.setAttribute("y2", offsetY + 5);
        }
    
        const pointerUpListener = (e) => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            if (clickTarget.is($(e.target).closest(`.${constant.gameHTML.ANSWER_AREA}`))) {
                return false;
            }
            const pos = getDotPos(e, constant.gameHTML.ANSWER_AREA);
            this.lineCoordinateString += `,${this.line.getAttribute('x1')},${this.line.getAttribute('y1')}`;
            if (this.lineCoordinates[this.lineCoordinateString]) {
                this.recordObj.removeLast(constant.recordItem.QUESTION);
                this.recordObj.removeLast(constant.recordItem.ANSWER);
                return false;
            }
            this.line.setAttribute("x2", pos.x);
            this.line.setAttribute("y2", pos.y);
            this.checkAnswer(this.lastQuestion, this.lastAnswer);
        };
        this.gameArea.on("pointerdown", (e) => {
            if (checkQuestionArea(e)){
                pointerDownListener(e);
            }
        });
        this.drawingArea.on("pointermove", pointerMoveListener);
        this.gameArea.on("pointerup", (e) => {
            if (checkAnswerArea(e)){
                pointerUpListener(e);
            }
        });
        const checkQuestionArea = (e) => {
            return $(e.target).closest(`.${constant.gameHTML.QUESTION_AREA}`).length > 0;
        };

        const checkAnswerArea = (e) => {
            return $(e.target).closest(`.${constant.gameHTML.ANSWER_AREA}`).length > 0;
        };
    };

    creatRecord(recordType, dot){
        throw new Error('please return creatRecord');
    }

    startGame(level) {
        if (!super.startGame(level)) return false;
        this.line = $(svgModules.getNewLine()).addClass('line')[0];
        this.drawingArea.html($(this.line));
        this.recordObj.initRecord();
        this.lineCoordinates = {};
        this.lineCoordinateString = '';
        this.lastQuestion = '';
        this.lastAnswer = '';
        return true;
    }

    correctAnswer(){
        this.lineCoordinates[this.lineCoordinateString] = true;
        $('.line:last').addClass('correctLine');
        this.line = $(svgModules.getNewLine()).addClass('line')[0];
        this.drawingArea.append($(this.line));
    }

    wrongAnswer(){
        this.setLives(this.lives-1);
        $('.line:last').addClass('wrongLine');
    }

    getGameResult(){
        if ($('.correctLine').length >= this.correctLimit) {
            this.gameState = constant.GAME_WIN;
        }
    }
}