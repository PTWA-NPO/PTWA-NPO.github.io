import {getGameConfig, getRandomNumberArr, randomNumber} from './function.js'
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
while (i<gameData.length){
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
        this.gameData = gameData;
        this.gameArea = $('.game_area');
        this.fishArea = $('.fishArea');
        this.startSound = $('#start')[0];
        this.getSound = $('#get')[0];
        this.eatSound = $('#eat')[0];
        this.level = 1;
        this.lives = 3;
        this.record = {'q': []
                        , 'a': []
                        , 'result': []
                      };
        this.winLevelArr = [];
        this.topic_explan = [];
        this.score = 0;
        this.time = $('.time');
        this.addFishIntervalIds = [];
        this.stopCountID = setInterval(()=>{this.countDown()}, 1000);
        $(this.gameData).each((index, value)=>{
            this.topic_explan.push(this.gameData[index].explain)
        })
        this.gameArea.on('mousemove touchmove', (e) => {
            e.preventDefault();
            const player = $('img[data-name="player"]');
            if (this.timeCount <= 0 || player.length === 0) {
                return false;
            }
            // TODO minus btns and head, use offset:
            const mouseX = e.pageX || e.originalEvent.touches[0].pageX;
            const mouseY = e.pageY || e.originalEvent.touches[0].pageY;
            const playerWidth = player.width();
            const playerHeight = player.height();
            const playerLeft = mouseX - playerWidth / 2;
            const playerTop = mouseY - playerHeight - 100;
            const gameAreaWidth = this.gameArea.width();
            const gameAreaHeight = this.gameArea.height();
          
            const checkOutOfBounds = (value, min, max) => {
              return value < min ? min : (value + playerWidth > max ? max - playerWidth : value);
            };
          
            player.css({
              'position': 'absolute',
              'left': checkOutOfBounds(playerLeft, 0, gameAreaWidth),
              'top': checkOutOfBounds(playerTop, 0, gameAreaHeight),
              "width": '80px',
              "height": 'auto'
            });
            const fish1s = $('img[data-name="fish1"]');
            const fish2s = $('img[data-name="fish2"]');
    
            this.checkCollision(player, fish1s, "fish1");
            this.checkCollision(player, fish2s, "fish2");
          });
    }

    startGame(level) {
        if (this.gameState===GAME_ALIVE){
            return
        }
        if (this.gameState===GAME_WIN){
            this.resetGame(level-1);
        }
        $('#nextBtn').removeClass('jumpBtn');
        this.level = level;
        this.levelBtn.children().eq(this.level-1).addClass('active');
        this.gameState = GAME_ALIVE;
        this.getTopic();
        this.score = 0;
        $('.score').text(this.score);
        this.lives = 3;
        this.setLives(this.lives);
        this.timeCount = this.gameData[this.level-1].countDown;
        this.time.text(this.timeCount)
        this.fishArea.html("");
        for (let i = 0; i < this.addFishIntervalIds.length; i++) {
            clearInterval(this.addFishIntervalIds[i]);
        }
        this.addFishIntervalIds = [];
        this.startSound.play();
        this.addFish();
        clearInterval(this.stopCountID);
        this.stopCountID = setInterval(()=>{this.countDown()}, 1000);
    }
    
    checkAnswer() {
        if (this.gameState !== GAME_ALIVE){
            return
        }
        const topic = this.gameData[this.level-1].q;
        const speed = this.gameData[this.level-1].speed;
        this.record.q.push(topic === "eat"? `藍（x${speed}）` : topic === "dodge" ? `紅（x${speed}）` : `藍+紅（x${speed}）`);
        this.record.result.push(this.timeCount);
        this.record.a.push(this.score);
        if (this.lives <= 0){
            this.winLevelArr.pop(this.level);
            this.levelBtn.children().eq(this.level - 1).removeClass('bingo');
            this.levelBtn.children().eq(this.level - 1).addClass('active');
            return
        }
        if (this.timeCount <= 0){
            set_off_fireworks();
            this.winLevelArr.push(this.level);
            this.gameState = GAME_WIN;
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
        this.resetGame(this.level);
    }
    
    resetGame(level){
        this.gameState = GAME_FILE;
        this.levelBtn.children().each((index, child) => {
            const $child = $(child);
            $child.removeClass('active');

            if ($.inArray(index + 1, this.winLevelArr) !== -1) {
                $child.addClass('bingo');
            } else if (index + 1 === this.level) {
                $child.addClass('active');
            }
        })
        this.startGame(level);

    }
    
    countDown() {
        if (this.timeCount <= 0){
            this.checkAnswer();
            this.gameState = GAME_FILE;
            $('#nextBtn').addClass('jumpBtn');
            clearInterval(this.stopCountID);
            return false;
        }
        this.timeCount -= 1;
        this.time.text(this.timeCount);
    }

    checkCollision(player, fishArray, fishName) {
        fishArray.each((index, fish) => {
            const $fish = $(fish);
            const isOverlap = !(
              player.offset().left + player.width() < $fish.offset().left ||
              player.offset().left > $fish.offset().left + $fish.width() ||
              player.offset().top + player.height() < $fish.offset().top ||
              player.offset().top > $fish.offset().top + $fish.height()
            );
            if (!isOverlap) {
                return true;
            }
            if (fishName === "fish1"){
                this.score += 1;
                $fish.remove();
                this.getSound.play();
                $('.score').text(this.score);
                this.addFish()
            }
            if (fishName === "fish2"){
                this.lives -= 1;
                this.setLives(this.lives)
                this.eatSound.play();
                if (this.lives <= 0){
                    this.timeCount = 0;
                }
                this.rebirth()
            }
        });
    }

    rebirth() {
        const player = $('img[data-name="player"]');
        player.attr('data-name', 'die');
        player.css({'display': "none"})

        for(let i = 0; i < 3; i++) {
            player.fadeOut(250).fadeIn(250);
        }
        setTimeout(()=>{
            player.attr('data-name', 'player');
        }, 1500);

    }
    
    addFish() {
        let count = this.fishArea.children().length;
        let isFromLeft = Math.random() < 0.5;
        const limit = this.gameData[this.level-1].fish;
        if (count <= 0) {
            const fish = this.createFish(isFromLeft);
            this.fishArea.append(fish);
            this.swimming(fish, isFromLeft);
            count ++;
        }
        let appearTime = 2000;
        const intervalId = setInterval(() => {
            count = this.fishArea.children().length;
            if (count < limit) {
                isFromLeft = Math.random() < 0.5;
                const fish = this.createFish(isFromLeft);
                this.fishArea.append(fish);
                this.swimming(fish, isFromLeft);
                appearTime = 2000 / this.gameData[this.level-1].speed;
                count ++;
            }
            else{
                clearInterval(this.addFishIntervalIds[0]);
            }
        }, appearTime);
        this.addFishIntervalIds.push(intervalId);
    }
    

    createFish(isFromLeft){
        let imgURL = ["./assets/images/fish1.gif"]
        let fishName = ["fish1"];
        $('.score').css("display", "inline-block")
        if (this.gameData[this.level-1].q === "dodge"){
            imgURL = ["./assets/images/fish2.gif"]
            fishName = ["fish2"];
            $('.score').css("display", "none")
        }
        else if (this.gameData[this.level-1].q === "mix"){
            // TODO rm fish then recreates
            imgURL = Array(4).fill("./assets/images/fish1.gif");
            imgURL.push("./assets/images/fish2.gif")
            fishName = Array(4).fill("fish1");
            fishName.push("fish2");
        }
        const screenWidth = this.fishArea.width();
        const screenHeight = this.fishArea.height();
        const fishElement = $('<img>');
        const fishNumber = randomNumber(0, imgURL.length);
        fishElement.attr('src', imgURL[fishNumber]);
        const imgWidth = randomNumber(80, 150);
        const distance = isFromLeft ? randomNumber(-(imgWidth*2), 0):randomNumber(0, imgWidth*2);
        fishElement
            .css({
                'position': 'absolute',
                'width': `${imgWidth}px`,
                'height': 'auto',
                'left':  isFromLeft ? -imgWidth+distance : screenWidth + imgWidth+distance,
                'top': `${randomNumber(0, screenHeight - imgWidth)}px`,
                'transform': isFromLeft ? 'scaleX(-1)' : 'scaleX(1)'
            })
            .attr({
                'data-speed': this.gameData[this.level-1].speed
                ,'data-name': fishName[fishNumber]
            });
        return fishElement;
    }

    swimming = (fish, isFromLeft) => {
        const screenWidth = this.fishArea.width();
        const screenHeight = this.fishArea.height();
        const imgWidth = fish.width();
        const imgHeight = fish.height();
        const imgTop = fish.offset().top;
        const animateTime = 10000 / fish.data('speed');
        const endX = isFromLeft ? screenWidth : -imgWidth;
    
        fish.animate({
            left: endX,
            top: `${randomNumber(imgTop+screenHeight-imgHeight, imgTop-screenHeight+imgHeight)}px`
        }, animateTime, 'linear', () => {
            fish.remove();
            this.addFish();
        });
    }   

    loadRecord() {
        // Set download file name
        const filename = "遊玩紀錄.csv";
        let csvContent = "Times,主題,分數,時間倒數\n"; // Add CSV headers
    
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
            .attr('src', './assets/images/heart.png')
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
