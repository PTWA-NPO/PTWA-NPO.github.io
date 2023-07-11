import {getGameConfig} from './function.js'
export {Game}


// state
const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'

// set firework
const firework_sound = $('#win')[0];
const fireworkContainer = $('#firework-container');
const fireworksUrl = '../../../../assets/images/game_images/fireworks.gif';
const gameData = await getGameConfig();
let i = 1;
while (i<Object.keys(gameData.gameData).length){
    i++;
    const level = document.querySelector('.level').cloneNode(true);
    level.textContent = i;
    document.querySelector('.levelBtn').appendChild(level);
}
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
        this.record = {'q': []
                      , 'a': []
                      , 'result': []
                      };
        this.topic_explan = [];
        $.each(gameData.gameData, (key, value) => {
            this.topic_explan.push(value.q);
        });
        this.winLevelArr = new Set();
    }
    startGame(level) {
        if (this.level===0){
            this.levelBtn.children().eq(this.level).addClass('active');
            this.level = 1;
        }
        else {
            this.changeLevel(level);
        }
        this.resetGame();
        this.gameState = GAME_ALIVE;
        this.gameRule.css('display', 'none');
        $('#startBtn').text("重新開始");
}
    
    checkAnswer(answer) {
        if (this.gameState !== GAME_ALIVE){
            return
        }
        const question = gameData.gameData[this.level].a;
        this.record.q.push(gameData.gameData[this.level].q.replace("（公克）、（公斤）？", question=='gram'? " 公克。":" 公斤。"));
        this.record.a.push(answer);
        if (question === answer){
            this.correctSound.play();
            this.bingoGroph.css('display', 'block');
            this.record.result.push('O');
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
            $(`.${answer}`).addClass('redWord');
            // this.lives -= 1;
            // setLives(this.lives)
            setTimeout(()=>{
            this.dadaGroph.css('display', 'none');}, 500);
            this.winLevelArr.delete(this.level);
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
        this.resetGame();
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
        $(`.answer *`).removeClass('redWord greenWord');
        this.levelBtn.children().eq(this.level-1).addClass('active');
        // this.gameRule.css('display', 'block');
        this.getTopic();
        // this.lives = 3;
        // this.setLives(this.lives);
        $('.question').html(`<img src='./assets/images/${this.level}.png'></img>`)
        $('.topic').each(function() {
            const text = $(this).html();
            const newText = text.replace(/(\d+)/g, '<span class="redWord">$1</span>');
            $(this).html(newText);
        });
    }
    
    loadRecord() {
        // Set download file name
        const filename = "遊玩紀錄.csv";
        let csvContent = "Times,Question,Answer,Result\n"; // Add CSV headers
    
        let count = 0;
        for (let i = 0; i < this.record.a.length; i++) {
            csvContent += `${i + 1},${this.record.q[i]},${this.record.a[i]},${this.record.result[i]}\n`;
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
        if (this.lives > 0)return
        overlay.toggle();
    }
    
    getTopic(){
        $(this.topic).text(this.topic_explan[this.level-1]);
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
