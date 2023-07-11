export {Game}
import { circleClickEstablish, pearClickEstablish, checkAnswerValue} from './function.js';


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
        this.circleQuesstionRecordL = [];
        this.circleQuesstionRecordR = [];

        this.pearQuesstionRecordL = [];
        this.pearQuesstionRecordR = [];

        this.circleUnit =   '<div class="unit">' +
                                '個圓' +
                            '</div>' ;

        this.pearUnit =   '<div class="unit">' +
                            '盒' +
                        '</div>' ;

        this.integer =  '<div class="value">' +
                            '<p class="Question">1</p>' +
                        '</div>'

        this.value = '<div class="value">' +
                        '<p class="Question">0</p>' +
                        '<p class="Question">0</p>' +
                    '</div>'

        this.pear =     '<div class="questionImg pear">' +
                            '<div class="pearFirstRow">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                            '</div>' +
                            '<div class="pearSecondRow">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                            '</div>' +
                            '<div class="pearThirdRow">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                                '<img src="src/fractionImg/pear.png" class="uncolored">' +
                            '</div>' +
                        '</div>' ;

        this.circle =   '<div class="questionImg circleFraction" >' +
                           '<svg>' +
                                '<path d = "M170.71, 29.29 L100, 100 L100 0 A100 100 45 0,1 170.71, 29.29Z "  class="uncolored"></path>' +

                                '<path d = "M200 100 L100, 100 L170.71, 29.29 A100 100 45 0,1 200 100Z "  class="uncolored"></path>' +

                                '<path d = "M170.71, 170.71 L100, 100 L200, 100 A100 100 45 0,1 170.71, 170.71Z"  class="uncolored"></path>' +

                                '<path d = "M100, 200 L100, 100 L170.71, 170.71 A100 100 45 0,1 100, 200Z"  class="uncolored"></path>' +

                                '<path d = "M29.29, 170.71 L100, 100 L100 200 A100 100 45 0,1 29.29, 170.71Z "  class="uncolored"></path>' +

                                '<path d = "M0 100 L100, 100 L29.29, 170.71 A100 100 45 0,1 0 100Z "  class="uncolored"></path>' +

                                '<path d = "M29.29, 29.29 L100, 100 L0, 100 A100 100 45 0,1 29.29, 29.29Z"  class="uncolored"></path>' +

                                '<path d = "M100, 0 L100, 100 L29.29, 29.29 A100 100 45 0,1 100, 0Z"  class="uncolored"></path>' +
                            '</svg>' +
                        '</div>' ;

        this.gameState = GAME_FILE;
        this.level = 0;
        this.lives = 3;
        this.record = {'q': []
                      , 'a': []
                      , 'result': []
                      };
        this.topic_explan = {1: `遊戲目標`};
        this.winLevelArr = [];
        this.questionLeft = [, '', '', '', '', '']
        this.questionRight = [, '', '', '', '', '']
        this.answer = [, '', '', '', '', '']
        this.nowReply = "";
        this.clickAmount = [0, 0];
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
        this.clickAmount = [0, 0];
        
        $('.firstImgContainer').html('');
        $('.secondImgContainer').html(''); 
        $('.firstValueContainer').html(this.value);
        $('.secondValueContainer').html(this.value);

        if(this.level <= 3){
            let question = $('.value .Question')
            , randomQuestionLeft = Math.floor(Math.random() * 11) + 1
            , randomQuestionRight = Math.floor(Math.random() * 11) + 1;

            randomQuestionLeft = this.questionRepeatJudge(randomQuestionLeft, 'L', 'pear');
            randomQuestionRight = this.questionRepeatJudge(randomQuestionRight, 'L', 'pear');

            this.valueDisplay('pear', 11, randomQuestionLeft, randomQuestionRight, question);

            pearClickEstablish();

            this.answerStorge(randomQuestionLeft, randomQuestionRight);
        }
        else{
            let question = $('.value .Question')
            , randomQuestionLeft = Math.floor(Math.random() * 8) + 1
            , randomQuestionRight = Math.floor(Math.random() * 8) + 1;

            randomQuestionLeft = this.questionRepeatJudge(randomQuestionLeft, 'L', 'circle');
            randomQuestionRight = this.questionRepeatJudge(randomQuestionRight, 'L', 'circle');

            this.valueDisplay('circle', 8, randomQuestionLeft, randomQuestionRight, question);

            circleClickEstablish();

            this.answerStorge(randomQuestionLeft, randomQuestionRight);
        }
    }
    
    checkAnswer() {
        if (this.gameState !== GAME_ALIVE){
            return
        }

        checkAnswerValue();
        // console.log(this.clickAmount[0], this.clickAmount[1]);

        if(this.level <= 3){
            this.record.q.push('(' + this.questionLeft[this.level] + '/11):(' + this.questionRight[this.level] + '/11)');
        }
        else{
            this.record.q.push('(' + this.questionLeft[this.level] + '/8):(' + this.questionRight[this.level] + '/8)');
        }
        if(this.level <= 3){
            this.record.a.push(this.nowReply + ':(' + this.clickAmount[0] + '/11):(' + this.clickAmount[1] + '/11)');
        }
        else{
            this.record.a.push(this.nowReply + ':' + this.clickAmount[0] + '/8):(' + this.clickAmount[1] + '/8)');
        }

        // console.log(this.record.a);

        if (this.nowReply === this.answer[this.level] && this.clickAmount[0] === this.questionLeft[this.level] && this.clickAmount[1] === this.questionRight[this.level]){
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
        $(this.topic).text('分數大小比較(' + this.level + ')');
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

    questionRepeatJudge(value, type, img){
        let temp, count = 0, amount = 0;
        if(img === 'pear'){
            amount = 11;
            if(type === 'L')
                temp = this.pearQuesstionRecordL;
            else
                temp = this.pearQuesstionRecordR;
        }
        else{
            amount = 8;
            if(type === 'L')
                temp = this.circleQuesstionRecordL;
            else
                temp = this.circleQuesstionRecordR;
        }

        while(true){
            count++;
            // console.log(count)
            if($.inArray(value, temp) === -1){
                temp.push(value);
                return value;
            }
            else{
                value = Math.floor(Math.random() * amount) + 1;
            }
            if(count >= 8){
                temp = [];
                count = 0;
                // console.log(temp);
            }
        }
    }

    valueDisplay(type, value, randomQuestionLeft, randomQuestionRight, question){
        let unit;
        if(type === 'circle'){
            unit = this.circleUnit;
            $('.firstImgContainer').html(this.circle);
            $('.secondImgContainer').html(this.circle);  
        }
        else{
            unit = this.pearUnit;
            $('.firstImgContainer').html(this.pear);
            $('.secondImgContainer').html(this.pear);
        }

        $(question[0]).html(randomQuestionLeft);
        $(question[1]).html(value);
        $('.firstValueContainer').html($('.firstValueContainer').html() + unit);
        if(randomQuestionLeft === value){
            $('.firstValueContainer').html(this.integer + unit);
        }
        $(question[2]).html(randomQuestionRight);
        $(question[3]).html(value);
        $('.secondValueContainer').html($('.secondValueContainer').html() + unit);
        if(randomQuestionRight === value){
            $('.secondValueContainer').html(this.integer + unit);
        }
    }

    answerStorge(randomQuestionLeft, randomQuestionRight){
        this.questionLeft[this.level] = randomQuestionLeft;
        this.questionRight[this.level] = randomQuestionRight;
        this.answer[this.level] = randomQuestionLeft > randomQuestionRight ? '>' : randomQuestionLeft === randomQuestionRight ? '=' : '<';
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