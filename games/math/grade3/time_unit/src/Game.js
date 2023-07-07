import {getGameConfig} from './function.js'
export {Game}


// state
const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'

// set firework
const firework_sound = $('#win')[0];
const fireworkContainer = $('#firework-container');
const fireworksUrl = './assets/images/fireworks.gif';
const gameData = await getGameConfig();
let i = 1;
while (i<Object.keys(gameData.gameData).length){
    i++;
    const level = document.querySelector('.level').cloneNode(true);
    level.textContent = i;
    document.querySelector('.levelBtn').appendChild(level);
}
AddAnimationGrayRect();
AddQuestion();
initCalculateCanvas();
//init the calculate canvas
const canvas = $('#calculate-section')[0];
canvas.width = 800;
canvas.height = 600;

class Game {
    gameRule = $('.gameRule');
    topic = $('.topic');
    levelBtn = $('.levelBtn');
    bingoGroph = $('#bingo');
    dadaGroph = $('#dada');
    correctSound = $('#correct')[0];
    wrongSound = $('#wrong')[0];
    levelLimit = this.levelBtn.children().length;
    constructor(){
        this.gameState = GAME_FILE;
        this.level = 0;
        this.lives = 0;
        this.record = {'question': []
                      , 'answer': []
                      , 'result': []
                      };
        // this.topic_explan = [];
        // $.each(gameData.gameData, (key, value) => {
        //     this.topic_explan.push(value.question);
        // });
        this.winLevelArr = new Set();
    }
    SetshowAnsState(state){
        this.showAnsState = state;
    }
    startGame(level) {
        if (this.level===0){
            this.levelBtn.children().eq(this.level).addClass('active');
            this.level = 1;
            UpdateAnswer(level);
        }
        else {
            this.changeLevel(level);
        }
        this.resetGame();
        this.lives = 3;
        this.setLives(this.lives,this.level);
        this.gameState = GAME_ALIVE;
        this.gameRule.css('display', 'none');
        $('#startBtn').text("重新開始");
        $('.game_area').css('display','flex');
        // $('.calculus-canvas').css('display','flex');
}
    
    checkAnswer(answer) {
        if (this.gameState !== GAME_ALIVE){
            return;
        }
        const right_answer = gameData.gameData[this.level].answer;
        const levelInfo = gameData.gameData[this.level];

        this.record.question.push(levelInfo.question);
        this.record.answer.push(levelInfo.options[answer]);

        if (answer === right_answer){
            this.correctSound.play();
            this.bingoGroph.css('display', 'block');
            this.record.result.push('O');
            //待修正
            $(`.${answer}`).addClass('greenWord');
            setTimeout(()=>{this.bingoGroph.css('display', 'none');}, 500);
            set_off_fireworks();
            this.winLevelArr.add(this.level);
            $('#nextBtn').addClass('jumpBtn');
            this.gameState = GAME_WIN;
        }
        else {
            this.record.result.push('X');
            this.wrongSound.play();
            this.dadaGroph.css('display', 'block');
            //待修正
            $(`.${answer}`).addClass('redWord');
            this.lives -= 1;
            this.setLives(this.lives,this.level);
            setTimeout(()=>{
            this.dadaGroph.css('display', 'none');}, 500);
            this.winLevelArr.delete(this.level);
            this.levelBtn.children().eq(this.level - 1).removeClass('bingo');
            this.levelBtn.children().eq(this.level - 1).addClass('active');
        }
    }
    
    
    changeLevel(level=1, {...extra}={}) {
        const defaults = {
            isPrevious: false,
            isNext: false
        };
        const settings = { ...defaults, ...extra };
        if (settings.isPrevious){
            level -= 1;
            if (level <= 0){
                level = this.levelLimit;
            }
        }
        else if (settings.isNext){
            level += 1;
            if (level > this.levelLimit){
                level = 1;
            }
        }
        this.level = level;
        this.resetGame();
        this.LevelTranslationControl(this.level);
        UpdateAnswer(this.level);
    }
    
    resetGame(){
        // this.gameState = GAME_FILE;
        $('#nextBtn').removeClass('jumpBtn');
        this.gameState = GAME_ALIVE;
        firework_sound.pause();
        fireworkContainer.css('display', 'none');
        this.winLevelArr.forEach((level)=>{
            this.levelBtn.children().eq(level-1).addClass('bingo');
        });
        this.levelBtn.children().each((index, child) => {
            const $child = $(child);
            $child.removeClass('active');
        });
        //待修正
        $(`.answer *`).removeClass('redWord greenWord');
        this.levelBtn.children().eq(this.level-1).addClass('active');
        //this.getTopic();
        this.lives = 3;
        this.setLives(this.lives,this.level);

        //set canvas
        //this.setupCanvas();

    }
    
    loadRecord() {
        // Set download file name
        const filename = "遊玩紀錄.csv";
        let csvContent = "Times,Question,Answer,Result\n"; // Add CSV headers
    
        let count = 0;
        for (let i = 0; i < this.record.answer.length; i++) {
            csvContent += `${i + 1},${this.record.question[i]},${this.record.answer[i]},${this.record.result[i]}\n`;
            if (this.record.result[i] === "O") count++;
        }
        csvContent += `\nCorrectRate,${(count / this.record.result.length) * 100}%\n`;
    
        csvContent = '\ufeff'+csvContent; // 添加 BOM
        
        // Create a Blob object
        const blob = new Blob([csvContent], { type: "text/csv" });
    
        // Create a download link
        const url = URL.createObjectURL(blob);
    
        // Create an <a> element and set href and download attributes
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
    
        // Simulate clicking the <a> element to start the download
        a.click();
    
        // Release the URL object
        URL.revokeObjectURL(url);
    }

    // toggleHint(){
    //     if (this.gameState !== GAME_ALIVE) return;    
    //     $('.overlay').toggle();
    // }

    toggleRightAns(){
        $('.RightAnsOverlay').toggle();
    }
    
    getTopic(){
        $(this.topic).text(this.topic_explan[this.level-1]);
    }
    
    setLives(lives,level){
        const count = lives - $('.lives').children().length;
        if (count === 0 || lives < 0) return;
        if (count < 0) {
            if(lives===0) this.showExplaination(level);
            $('.lives > :last-child').remove();
            return
        }
        for (let i = 0; i <count; i++){
            const livesImg = $('<img>')
            .attr('src', './assets/images/lives.svg')
            .attr('alt', 'lives image')
            .attr('width', '25')
            .attr('height', 'auto')
            .css('margin-right', '2px');
            $('.lives').append(livesImg);
        }
        
    }
    showExplaination(level){
        $('.horizontal-form').text(gameData.gameData[level].explaination_horizontal);
        let question = gameData.gameData[level].question;
        let answer = gameData.gameData[level].options[gameData.gameData[level].answer];
    
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        //作法：用一個4*4表格來顯示直式

        // clear table 
        $('#conversion-table tr:nth-child(1) td:nth-child(2)').empty();
        $('#conversion-table tr:nth-child(2) td:nth-child(3)').empty();
        $('#conversion-table tr:nth-child(2) td:nth-child(4)').empty();
        $('#conversion-table tr:nth-child(3) td:nth-child(2)').empty();
        $('#conversion-table tr:nth-child(4) td:nth-child(2)').empty();

    
        // 判斷題目類型
        if(answer.includes("秒")){ //題型為分鐘轉小時
            if(question.includes("秒")){ 
                //題目格式是x分鐘y秒
                let minutes = parseInt(question.split("分鐘")[0]);
                console.log(minutes);
                let seconds = parseInt(question.split("分鐘")[1].split("秒")[0]);
                console.log(seconds);
                $('#conversion-table tr:nth-child(1) td:nth-child(1)').text('60');
                $('#conversion-table tr:nth-child(2) td:nth-child(2)').text(minutes);
                $('#conversion-table tr:nth-child(4) td:nth-child(1)').text(minutes * 60);
                
                $('#conversion-table tr:nth-child(1) td:nth-child(2)').text(minutes * 60);
                $('#conversion-table tr:nth-child(2) td:nth-child(3)').text('+');
                $('#conversion-table tr:nth-child(2) td:nth-child(4)').text(seconds);
                $('#conversion-table tr:nth-child(3) td:nth-child(2)').text('————————');
                $('#conversion-table tr:nth-child(4) td:nth-child(2)').text(minutes * 60 + seconds);

            }else{
                //題目格式為x分鐘
                let minutes = parseInt(question.split("分鐘")[0]);
    
                $('#conversion-table tr:nth-child(1) td:nth-child(1)').text('60');
                $('#conversion-table tr:nth-child(2) td:nth-child(2)').text(minutes);
                $('#conversion-table tr:nth-child(4) td:nth-child(1)').text(60 * minutes);
            }
        }else{  //題型為小時轉分鐘
            if(question.includes("分鐘")){
                //題目格式是x小時y分鐘
                let hours = parseInt(question.split("小時")[0]);
                let minutes = parseInt(question.split("小時")[1].split("分鐘")[0]);
    
                $('#conversion-table tr:nth-child(1) td:nth-child(1)').text('60');
                $('#conversion-table tr:nth-child(2) td:nth-child(2)').text(hours);
                $('#conversion-table tr:nth-child(4) td:nth-child(1)').text(hours * 60);

                $('#conversion-table tr:nth-child(1) td:nth-child(2)').text(hours * 60);
                $('#conversion-table tr:nth-child(2) td:nth-child(3)').text('+');
                $('#conversion-table tr:nth-child(2) td:nth-child(4)').text(minutes);
                $('#conversion-table tr:nth-child(3) td:nth-child(2)').text('————————');
                $('#conversion-table tr:nth-child(4) td:nth-child(2)').text(hours * 60 + minutes);
                
            }else{
                //題目格式是x小時
                let hours = parseInt(question.split("小時")[0]);
    
                $('#conversion-table tr:nth-child(1) td:nth-child(1)').text('60');
                $('#conversion-table tr:nth-child(2) td:nth-child(2)').text(hours);
                $('#conversion-table tr:nth-child(4) td:nth-child(1)').text(60 * hours);
            }
        }
        this.toggleRightAns();
    }

    LevelTranslationControl(DestinationLevel){
        const DestinationLevel_X = (DestinationLevel-1) * 800;
        $('.question-container, .fill_blank_top, .fill_blank_down').each(function () {
            $(this).css({
                'transition': 'transform 1.5s ease',
                'transform': 'translateX(' + -DestinationLevel_X + 'px)'
            });
        });
    }
    // createCanvasElement(level){
    //     $('.calculate-canvas').toggle();
    //     $('.Calculus-section-question').remove();
    //     $('#calculate-section').addClass('pen-cursor');
    //     const QuestionText = gameData.gameData[level].question; 
    //     const QuestionElement = $('<p>').attr('class','Calculus-section-question').text('題目：' + QuestionText);
    //     $('.calculate-canvas').append(QuestionElement);
    // }
    showCanvas(level){
        $('.calculate-canvas').toggle();
        $('#calculate-section').addClass('pen-cursor');
        $('.Calculus-section-question').remove();
        const QuestionText = gameData.gameData[level].question; 
        const QuestionElement = $('<p>').attr('class','Calculus-section-question').text('題目：' + QuestionText);
        $('.calculate-canvas').append(QuestionElement);

    }
    setupCanvas(){
        //設定按鈕控制
        $('.startWriting').on('click',()=>{
            isEraserActive = false;
            $('.showmode').text("正在書寫模式");
            $('#calculate-section').removeClass('eraser-cursor');
            $('#calculate-section').addClass('pen-cursor');
        });
    
        $('.startErasing').on('click',()=>{
            isEraserActive = true;
            $('.showmode').text("正在擦布模式");
            $('#calculate-section').removeClass('pen-cursor');
            $('#calculate-section').addClass('eraser-cursor');
        });
    
        const canvas = $('#calculate-section')[0];
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'black';
    
        let x1 = 0;
        let y1 = 0;
        let x2 = 0;
        let y2 = 0;
    
        const hasTouchEvent = 'ontouchstart' in window ? true : false;
        const downEvent = hasTouchEvent ? 'ontouchstart' : 'mousedown';
        const moveEvent = hasTouchEvent ? 'ontouchmove' : 'mousemove';
        const upEvent = hasTouchEvent ? 'touchend' : 'mouseup';
        let isMouseActive = false;
        let isEraserActive = false;
    
        $('.BlackColor').on('click',()=>{ctx.strokeStyle = 'black';});
        $('.BlueColor').on('click',()=>{ctx.strokeStyle = 'blue';});
        $('.RedColor').on('click',()=>{ctx.strokeStyle = 'red';});
    
        $('.clearAll').on('click',()=>{
            ctx.clearRect(0,0,canvas.width,canvas.height);
        });
    
        $(canvas).on(downEvent, function(e){
            isMouseActive = true;
            x1 = e.offsetX;
            y1 = e.offsetY+16;
    
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        });

        $(canvas).on(moveEvent, function(e){
            if(!isMouseActive){
                return;
            }
            x2 = e.offsetX;
            y2 = e.offsetY+32;
            if(isEraserActive){
                ctx.clearRect(x2-10,y2-10,20,20);
            }else{
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();    
                x1 = x2;
                y1 = y2;
            }
        });
    
        canvas.addEventListener(upEvent, function(e){
            isMouseActive = false;
        });
    }

    toggleCalculateCanvas(){
        $('.calculate-canvas').toggle();
    }
    
}


function set_off_fireworks(){
    firework_sound.currentTime = 1.5;
    firework_sound.play();
    fireworkContainer.css('display', 'block');
    showFirework();
    setTimeout(()=>{firework_sound.pause()}, 2500);
    let count = 0;
    while (count < 2300){
        let milliseconds =  Math.floor(Math.random() * (800 - 400 + 1)) + 400;
        count += milliseconds;
        setTimeout(showFirework, count)
    }
    setTimeout(() => {
        fireworkContainer.css('display', 'none');
    }, count)
} 

function showFirework() {
    for (let i = 0; i < 5; i++) {
        let width = 100 * (Math.random()*2.5);
        const fireworksElement = $('<img>');
        fireworksElement.attr('src', fireworksUrl);
        fireworksElement.css({
            'position': 'absolute',
            'width': `${width}px`,
            'height': 'auto',
            'left': Math.floor(Math.random() * (fireworkContainer.width() - width)) + 'px',
            'top': Math.floor(Math.random() * (fireworkContainer.height() - width * 1.5)) + 'px'
        });
        fireworkContainer.append(fireworksElement);
    }
    setTimeout(removeFirework, 1194);
}  

function removeFirework() {
    for (let i = 0; i < 5; i++) {
        fireworkContainer.children().first().remove();
    }
}

function AddAnimationGrayRect(){
    const interval = 35;
    const totalWidth = 4800;
    const numGrayRects = totalWidth / interval;
    for(let i = 0; i < numGrayRects; i++){
        const grayrect = SetGrayRectAttribute(interval);
        $('.fill_blank_down,.fill_blank_top').append(grayrect);
    }
}

function SetGrayRectAttribute(interval){
    const grayRectWidth = 10;
    const grayRectHeight = 20;
    const grayrectElement = $('<div>');
    grayrectElement.addClass('gray-rect');
    grayrectElement.css({
        width: grayRectWidth + 'px',
        height: grayRectHeight + 'px',
        backgroundColor: '#808080',
        marginRight: interval - grayRectWidth + 'px',
    });
    return grayrectElement;
}

function AddQuestion(){
    const questionkeys = Object.keys(gameData.gameData);
    questionkeys.forEach((key,index)=>{
        const question = gameData.gameData[key].question;
        const questionElement = $('<div>',{
            css: {left: (index * 800 + 400) + 'px',position: 'absolute'},
            // css:{'transform': 'translateX(' + (index * 800 + 400) + 'px)'},
            text:question,
        });
        questionElement.addClass('question');
        $('.question-container').append(questionElement);
    });
}

function UpdateAnswer(level){
    //const OptionsNum = Object.keys(gameData.gameData[level].options).length;
    //const OptionsKeys = Object.keys(gameData.gameData[level].options);
    const OptionsValues = Object.values(gameData.gameData[level].options);
    $('.a').text(OptionsValues[0]);
    $('.b').text(OptionsValues[1]);
    $('.c').text(OptionsValues[2]);
    // for(let i=0; i < OptionsNum; i++){
    //     const className = OptionsKeys[i];
    //     $(className).empty();
    //     $(className).text(OptionsValues[i]);
    // }
}

function initCalculateCanvas(){
    const penElement = $('<img>').attr({
        'class': 'startWriting animate-pen',
            'src' : 'assets/images/pen.png',
            'alt' : 'startWriting'
    });
    const eraserElement = $('<img>').attr({
        'class': 'startErasing animate-eraser',
            'src' : 'assets/images/eraser.png',
            'alt' : 'startErasing'
    });
    const modeElement = $('<p>').attr({'class': 'showmode'}).text("正在書寫模式");
    const clearallElement = $('<button>').attr({'class': 'clearAll animate-clearAllBtn'}).text("清空畫布");
    const BlackColorElement = $('<div>').attr('class','BlackColor');
    const BlueColorElement = $('<div>').attr('class','BlueColor');
    const RedColorElement = $('<div>').attr('class','RedColor');
    const FormHintElement = $('<p>').attr('class','FormHint').text("公式：1小時=60分鐘/1分鐘=60秒");
    $('.calculate-canvas').append(penElement);
    $('.calculate-canvas').append(eraserElement);
    $('.calculate-canvas').append(clearallElement);
    $('.calculate-canvas').append(modeElement);
    $('.calculate-canvas').append(BlackColorElement);
    $('.calculate-canvas').append(BlueColorElement);
    $('.calculate-canvas').append(RedColorElement);
    $('.calculate-canvas').append(FormHintElement);
}

