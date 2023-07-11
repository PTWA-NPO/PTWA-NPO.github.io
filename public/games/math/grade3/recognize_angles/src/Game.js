export {Game}
import {getRandomNumber, reorder, createAngle, createFanShape, createLine} from './function.js'


// state
const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'


// set firework
const firework_sound = $('#win')[0];
const fireworkContainer = $('#firework-container');
const fireworksUrl = '../../../../assets/images/game_images/fireworks.gif';

class Game {
    overlay = $('.overlay');
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
        this.lives = 3;
        this.record = {'Q': []
                      , 'A': []
                      , 'result': []
                      };
        this.topic_explan = {1: `選擇直角、鈍角和銳角`};
        this.winLevelArr = [];
        this.angle = 90;
        drawHint();
    }
    startGame(level) {
        if (this.gameState===GAME_ALIVE){
            return
        }
        if (this.gameState===GAME_WIN){
            this.resetGame();
        }
        if (this.level===0){
            this.levelBtn.children().eq(this.level).addClass('active');
            this.level = 1;
        }
        else {
            this.changeLevel(level);
        }
        $('#nextBtn').removeClass('jumpBtn');
        this.gameState = GAME_ALIVE;
        this.gameRule.css('display', 'none');
        this.getTopic();
        this.setLives(this.lives);
        this.addAngle();
        // reorder($('.game_area .angles'));
    }
    
    checkAnswer(angle) {
        if (this.gameState !== GAME_ALIVE){
            return
        }
        const answer = this.angle > 90 ? "obtuse" : this.angle === 90 ? "right" : "acute"
        this.record.Q.push(this.angle);
        this.record.A.push(angle);
        if (answer === angle){
            this.correctSound.play();
            this.bingoGroph.css('display', 'block');
            this.record.result.push('O');
            setTimeout(()=>{this.bingoGroph.css('display', 'none');}, 500);
            set_off_fireworks();
            this.winLevelArr.push(this.level);
            $('#nextBtn').addClass('jumpBtn');
            this.gameState = GAME_WIN;
        }
        else {
            this.record.result.push('X');
            this.wrongSound.play();
            this.dadaGroph.css('display', 'block');
            setTimeout(()=>{this.dadaGroph.css('display', 'none');}, 500);
            this.winLevelArr.pop(this.level);
            this.levelBtn.children().eq(this.level - 1).removeClass('bingo');
            this.levelBtn.children().eq(this.level - 1).addClass('active');
        }
    }
    
    changeLevel(level=1, {...extra}={}) {
        const defaults = {
            isPrevious: false
            , isNext: false
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
        this.levelBtn.children().eq(this.level - 1).addClass('active');
        this.resetGame();
    }
    
    resetGame(){
        this.gameState = GAME_FILE;
        firework_sound.pause();
        fireworkContainer.css('display', 'none');
        this.levelBtn.children().each((index, child) => {
            const $child = $(child);
            $child.removeClass('active');

            if ($.inArray(index + 1, this.winLevelArr) !== -1) {
                $child.addClass('bingo');
            } else if (index + 1 === this.level) {
                $child.addClass('active');
            }
        })

        this.gameRule.css('display', 'block');
    }
    
    loadRecord() {
        // Set download file name
        const filename = "遊玩紀錄.csv";
        let csvContent = "Times,Question,Answer,Result\n"; // Add CSV headers
    
        let count = 0;
        for (let i = 0; i < this.record.A.length; i++) {
            csvContent += `${i + 1},${this.record.Q[i]},${this.record.A[i]},${this.record.result[i]}\n`;
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
    
    toggleHint(){
        if (this.gameState !== GAME_ALIVE)return
        this.overlay.toggle();
    }
    
    getTopic(){
        $(this.topic).text(this.topic_explan[this.level]);
    }
    
    setLives(lives){
        const count = lives - $('.lives').children().length;
        if (count === 0 || lives < 0) return
        if (count < 0) {
            $('.lives > :last-child').remove();
            return
        }
        for (let i = 0; i <count; i++){
            const livesImg = $('<img>')
            .attr('src', '../../../../assets/images/game_images/lives.svg')
            .attr('alt', 'lives image')
            .attr('width', '60')
            .attr('height', 'auto')
            .css('margin-right', '-30px');
            $('.lives').append(livesImg);
        }
    }
    addAngle() {
        const x = $('.question').width()/2;
        const y = $('.question').height()/2;
        this.angle = getRandomNumber(15, 165, 10);
        const rotationAngle = 0;
        const angleGraphic = createAngle(this.angle, rotationAngle, x, y);
        const fanShape = createFanShape(x, y, 30, 360-this.angle, 0)
        $('.question').html(angleGraphic);
        $('.question').append(fanShape);
    }
}

function drawHint() {
    const right = $(".hintContainer .angles .right");
    const obtuse = $(".hintContainer .angles .obtuse");
    const acute = $(".hintContainer .angles .acute");
    const x = 500/2.5;
    const y = 180-10;
    const angles = [createAngle(90, 0, x, y), createAngle(135, 0, x, y), createAngle(45, 0, x, y)];
    const fanShapes = [createFanShape(x, y, 30, 360-90, 0), createFanShape(x, y, 30, 360-135, 0), createFanShape(x, y, 30, 360-45, 0)]
    const init = {strokeDasharray: "10 3"
                  , stroke: '#bbb'
                  , strokeWidth: 4
                  , x1: x
                  , y1: y
                  , x2: x
                  , y2: 3
                }
    const dashed = [createLine(init), createLine(init)]
    right.html(angles[0]).addClass('right');
    right.append(angles[0][0], angles[0][1],fanShapes[0]);
    obtuse.html(angles[1]).addClass('obtuse');
    obtuse.append(dashed[0], angles[1][0], angles[1][1],fanShapes[1]);
    acute.html(angles[2]).addClass('acute');
    acute.append(dashed[1], angles[2][0], angles[2][1],fanShapes[2]);
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
