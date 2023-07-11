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
addQuestion();
initCalculateCanvas();
//init the calculate canvas
setupCanvas();

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
        this.liveState = false;
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
            updateAnswer(level);
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
        updateAnswer(this.level);
    }
    
    resetGame(){
        // this.gameState = GAME_FILE;
        $('#nextBtn').removeClass('jumpBtn');
        this.gameState = GAME_ALIVE;
        this.liveState = false;
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
            if(lives===0) this.showExplaination(level),this.liveState = true;
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
    
        //作法：用一個4*4表格來顯示直式
        //表格的初始狀態有第一個直式的橫線和乘號（已寫在HTML）

        // 初始化 清空表格
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
                let seconds = parseInt(question.split("分鐘")[1].split("秒")[0]);
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
        const DestinationLevel_Y = (DestinationLevel-1) * 720;
        $('.question-container').each(function () {
            $(this).css({
                'transition': 'transform 1.5s ease',
                'transform': 'translateY(' + -DestinationLevel_Y + 'px)'
            });
        });
    }

    showCanvas(level){
        $('.calculate-canvas').toggle();
        $('#calculate-section').css({'cursor': "url('assets/images/pen_cursor.png') , auto"});
        $('.calculus-section-question').remove();
        const QuestionText = gameData.gameData[level].question; 
        const QuestionElement = $('<p>').attr('class','calculus-section-question').text('題目：' + QuestionText).css({
            'position': 'absolute',
            'top': '30px',
            'left': '50px',
            'font-size': '30px'
        });
        
        $('.calculate-canvas').append(QuestionElement);

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


function addQuestion(){
    const questionkeys = Object.keys(gameData.gameData);
    questionkeys.forEach((key,index)=>{
        const question = gameData.gameData[key].question;
        const questionElement = $('<div>',{
            css: {top: (index * 720 + 180) + 'px',position: 'absolute'},
            text:question,
        });
        questionElement.addClass('question');
        $('.question-container').append(questionElement);
    });
}

function updateAnswer(level){
    const optionValues = Object.values(gameData.gameData[level].options);
    const optionNames = ['a','b','c'];
    optionNames.forEach((optionName,index) => {
        $(`.${optionName}`).text(optionValues[index]);
    });
}

function initCalculateCanvas(){
    
    //初始化畫布
    const calculateCanvas = $('.calculate-canvas');
    const calculateCanvasBtn = $('.calculate-canvas-btn');
    const calculateCanvasImg = $('.calculate-canvas-btn img');
    const calculateSection = $('#calculate-section');
    calculateCanvas.css({
        'position': 'relative',
        'display': 'none',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        'z-index': '9999',
    });
    calculateCanvasBtn.css({
        'width': 'auto',
        'height': '25px',
        'padding-left': '15px',
        'padding-right': '15px',
        'padding-top': '5px',
        'padding-bottom': '5px',
        'border': 'solid 2px #71a2ab',
        'background-color': '#fff',
        'position': 'absolute',
        'top': '1%',
        'left': '2%',
        'border-radius': '5px',
        'z-index': '100',
        'margin': '0',
        'cursor': 'pointer',
    });
    calculateCanvasImg.css({
        'width': '20px',
        'height': '20px',
        'padding-right': '10px',
        'text-align': 'center',
        'margin': 'auto',
    });
    calculateSection.css({
        'display': 'flex',
        'justify-content': 'space-evenly',
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)',
        'background-color': 'rgba(255, 255, 255, 1)',
        'border': '5px solid #b3e6e5',
        'border-radius': '6px',
        'width': '100%',
        'height': '100%',
        'overflow': 'hidden',
    });

    //創造畫布中元素 並設定CSS屬性
    const penElement = $('<img>').attr({
        'class': 'startWriting',
            'src' : 'assets/images/pen.png',
            'alt' : 'startWriting'
    }).css({
        'position': 'absolute',
        'top': '10px',
        'left': '60px',
        'height': '30px',
        'width': '30px',
        'cursor': 'pointer'
    });

    const eraserElement = $('<img>').attr({
        'class': 'startErasing animate-eraser',
            'src' : 'assets/images/eraser.png',
            'alt' : 'startErasing'
    }).css({
        'position': 'absolute',
        'top': '10px',
        'left': '110px',
        'height': '30px',
        'width': '30px',
        'cursor': 'pointer',
    });

    const clearallElement = $('<button>').attr({'class': 'clearAll'}).text("清空畫布").css({
        'position': 'absolute',
        'top': '12px',
        'left': '170px',
        'border-radius': '5px',
        'cursor': 'pointer',
        'letter-spacing': '1px',
        'padding-left': '10px',
        'padding-right': '10px',
        'border': 'solid 2px #02bbdc'
    });

    const modeElement = $('<p>').attr({'class': 'showmode'}).text("正在書寫模式");
    modeElement.css({
        'font-size': '20px',
        'font-weight': '500',
        'position': 'absolute',
        'top': '10px',
        'left': '270px',
        'margin': '0',
    });

    const blackColorElement = $('<div>').attr('class','BlackColor');
    const blueColorElement = $('<div>').attr('class','BlueColor');
    const redColorElement = $('<div>').attr('class','RedColor');
    [blackColorElement,blueColorElement,redColorElement].forEach(function(element){
        element.css({
            'position': 'absolute',
            'top': '10px',
            'left': '410px',
            'background-color': '#000',
            'width': '25px',
            'height': '25px',
            'border-radius': '100%',
            'cursor': 'pointer'
        })
    });
    blackColorElement.css({
        'background-color': 'red',
        'left': '490px',
    });
    blueColorElement.css({
        'background-color': 'blue',
        'left': '450px',
    });

    const formHintElement = $('<p>').attr('class','formHint').text("公式：1小時=60分鐘/1分鐘=60秒");
    formHintElement.css({
        'position': 'absolute',
        'top': '30px',
        'left': '300px',
        'font-size': '30px',
    });


    //加入:hover的功能
    [penElement,eraserElement,clearallElement,blackColorElement,blueColorElement,redColorElement,calculateCanvasBtn].forEach(function(element){
        element.css({
            'transition': 'transform 0.3s ease',
        }).hover(
            function() {
                $(this).css('transform', 'translateY(-5px)');
            }, 
            function() {
                $(this).css('transform', '');
            }
        )
    });

    //將元素加進HTML中
    $('.calculate-canvas').append(penElement);
    $('.calculate-canvas').append(eraserElement);
    $('.calculate-canvas').append(clearallElement);
    $('.calculate-canvas').append(modeElement);
    $('.calculate-canvas').append(blackColorElement);
    $('.calculate-canvas').append(blueColorElement);
    $('.calculate-canvas').append(redColorElement);
    $('.calculate-canvas').append(formHintElement);
}

function setupCanvas(){
    
    const canvas = $('#calculate-section')[0];
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    ctx.strokeStyle = 'black';

    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    //判斷是滑鼠還是觸控
    const hasTouchEvent = 'ontouchstart' in window ? true : false;
    const downEvent = hasTouchEvent ? 'ontouchstart' : 'mousedown';
    const moveEvent = hasTouchEvent ? 'ontouchmove' : 'mousemove';
    const upEvent = hasTouchEvent ? 'touchend' : 'mouseup';
    let isMouseActive = false;
    let isEraserActive = false;

    $('.calculate-canvas').on('click', '.startWriting', () => {
        isEraserActive = false;
        $('.showmode').text("正在書寫模式");
        $('#calculate-section').css({'cursor': "url('assets/images/pen_cursor.png') , auto"});
    });
    
    $('.calculate-canvas').on('click', '.startErasing', () => {
        isEraserActive = true;
        $('.showmode').text("正在擦布模式");
        $('#calculate-section').css({'cursor': "url('assets/images/eraser_cursor.png') , auto"});
    });
    
    $('.calculate-canvas').on('click', '.BlackColor', () => {
        ctx.strokeStyle = 'black';
    });
    
    $('.calculate-canvas').on('click', '.BlueColor', () => {
        ctx.strokeStyle = 'blue';
    });
    
    $('.calculate-canvas').on('click', '.RedColor', () => {
        ctx.strokeStyle = 'red';
    });
    
    $('.calculate-canvas').on('click', '.clearAll', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    

    $(canvas).on(downEvent, function(e){
        isMouseActive = true;
        x1 = e.offsetX;
        y1 = e.offsetY+32;

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
