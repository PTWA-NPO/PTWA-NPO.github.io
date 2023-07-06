export {Game}


// state
const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'

// set firework
const firework_sound = $('#win')[0];
const fireworkContainer = $('#firework-container');
const fireworksUrl = '../../../../assets/images/game_images/fireworks.gif';

class Game {
    gameRule = $('.gameRule');
    topic = $('.topic');
    levelBtn = $('.levelBtn'); //O
    bingoGroph = $('#bingo');
    dadaGroph = $('#dada');
    correctSound = $('#correct')[0];
    wrongSound = $('#wrong')[0];
    levelLimit = this.levelBtn.children().length;
    constructor(){ //初始化 O
        this.gameState = GAME_FILE;
        this.level = 0;
        this.lives = 3;
        this.record = {'q': []
                      , 'a': []
                      , 'result': []
                      };
        this.topic_explan = {1: `遊戲目標`};
        this.winLevelArr = [];
        this.questionLeft = [, '3020 毫升(mL)', '1 公升(L)', '17 毫升(mL)', '1600 毫升(mL)', '4 公升(L)']
        this.questionRight = [, '3 公斤(L)<br>200 毫升(mL)', '100 毫升(mL)', '17 個一公升(L)', '1 公升(L)<br>60 毫升(mL)', '4000 毫升(mL)']
        this.answer = [, '<', '>', '<', '>', '=']
        this.nowReply = "";
    }
    startGame(level) { 
        this.hideSymbol('');
        $('.compare').html('');
        if (this.gameState===GAME_ALIVE){
            return
        }
        if (this.gameState===GAME_WIN){
            this.resetGame();
        }
        if (this.level===0){
            this.levelBtn.children().eq(this.level).addClass('active'); //eq(n)就是搜尋children第n + 1個位置
            this.level = 1;
        }
        else {
            this.changeLevel(level);
        }
        $('#nextBtn').removeClass('jumpBtn');
        this.gameState = GAME_ALIVE;
        this.gameRule.css('display', 'none');
        this.getTopic();
        this.lives = 3;
        this.setLives(this.lives);

        let Question = $('.Question'), valueL = this.questionLeft[this.level], valueR = this.questionRight[this.level];
        
        Question.each(() => {
            $(Question[0]).html(valueL);
            $(Question[1]).html(valueR);
        })
    }
    
    checkAnswer() {
        if (this.gameState !== GAME_ALIVE){
            return
        }
        this.record.q.push(this.questionLeft[this.level] + ':' + this.questionRight[this.level]);
        this.record.a.push(this.nowReply);
        if (this.nowReply === this.answer[this.level]){
            this.correctSound.play();
            this.bingoGroph.css('display', 'block');
            this.record.result.push('O');
            setTimeout(()=>{this.bingoGroph.css('display', 'none');}, 500);
            set_off_fireworks();
            this.winLevelArr[this.level - 1] = this.level;
            $('#nextBtn').addClass('jumpBtn');
            this.gameState = GAME_WIN;
        }
        else {
            $('.compare').html("");
            this.hideSymbol('');
            this.record.result.push('X');
            this.wrongSound.play();
            this.dadaGroph.css('display', 'block');
            this.lives -= 1;
            this.setLives(this.lives)
            setTimeout(()=>{
            this.dadaGroph.css('display', 'none');}, 500);
            this.winLevelArr[this.level - 1] = -1;
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
        if (this.gameState !== GAME_ALIVE)return
        $('.overlay').css('display', 'block');
    }
    
    getTopic(){
        $(this.topic).text('毫升、公升比大小(' + this.level + ')');
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

    symbolDisplay(symbol){
        if(symbol === "moreThan"){
            $('.compare').html('<h1> > </h1>');
            this.hideSymbol('.moreThan');
            this.nowReply = '>';
        }
        
        else if(symbol === "lessThan"){
            $('.compare').html('<h1> < </h1>');
            this.hideSymbol('.lessThan');
            this.nowReply = '<';
        }
        
        else if(symbol === "equal"){
            $('.compare').html('<h1> = </h1>');
            this.hideSymbol('.equal');
            this.nowReply = '=';
        }
        
        else
            return;

    }

    hideSymbol(name){
        $('.equal').css('display', 'block');
        $('.lessThan').css('display', 'block');
        $('.moreThan').css('display', 'block');
        $(name).css('display', 'none');
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