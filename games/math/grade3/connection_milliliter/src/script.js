const gameData = await getGameConfig();
let i = 1;
while (i<Object.keys(gameData.gameData).length){
    i++;
    const level = document.querySelector('.level').cloneNode(true);
    level.textContent = i;
    document.querySelector('.levelBtn').appendChild(level);
}

const GAME_FILE = 'FILE'
const GAME_ALIVE = 'ALIVE'
const GAME_WIN = 'WIN'
const LAST_BTN = 'lastBtn'
const START_BTN = 'startBtn'
const NEXT_BTN = 'nextBtn'
const HINT_BTN = 'hintBtn'
const RECORD_BTN = 'recordBtn'
const myCanvas = document.querySelector(".myCanvas");
const gameArea = document.querySelector(".game_area");
const canvas = [...document.querySelectorAll(`canvas`)];
const svg = document.querySelector(".drawingArea");
let line = svg.querySelector(".line");
const overlay = document.querySelector('.overlay');
const hint = document.querySelector('.hintContainer');
const closeHint = document.querySelector('.closeHintBtn');
const milliliterHint = hint.querySelector('.milliliterHint')
const literHint = hint.querySelector('.literHint')
const gameBtn = [...document.querySelectorAll(`.gameBtn *`)];
const gameRule = document.querySelector('.gameRule');
const topic = document.querySelector('.topic');
const levelLimit = document.querySelector('.levelBtn').children.length;
const leftContainer = document.querySelector('.left');
const rightContainer = document.querySelector('.right');
const milliliterContainer = document.querySelector('.milliliter_container');
const litersContainer = document.querySelector('.right>.water_container');
i = 0;
while (i<3){
    const clonedMilliliterContainer = milliliterContainer.cloneNode(true);
    const clonedLitersContainer = litersContainer.cloneNode(true);
    leftContainer.appendChild(clonedMilliliterContainer);
    rightContainer.appendChild(clonedLitersContainer);
    i++;
}
const leftWater = [...document.querySelectorAll(`.left .milliliter_container .water_container .water`)];
const rightWater = [...document.querySelectorAll(`.right .water_container .water`)];
const milliliterDotsContener = document.querySelector(`.milliliterDots`);
const literDotsContener = document.querySelector(`.literDots`);
const milliliterDots = [...document.querySelectorAll(`.milliliterDots .circle`)];
const literDots = [...document.querySelectorAll(`.literDots .circle`)];
const allDots = [...milliliterDots, ...literDots];
const firework_sound = document.getElementById('win');
const fireworkContainer = document.querySelector('#firework-container');
const fireworksUrl = '../../../../assets/images/game_images/fireworks.gif';
let level = 0, lives = 3;
let act = '', start = '', end = '';
let gameState = GAME_FILE;
let winLevelArr = [];
let correctAnswer = new Set();
let topic_explan = `毫升／公升連連看`;
let liters, milliliters = [];
let drawing = false;
let record = {'start': []
              , 'end': []
              , 'result': []
             };

async function getGameConfig() {
    return fetch('./game_config.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((jsonData) => {
            const gameData = jsonData;
            return gameData;
        })
        .catch((error) => {
            console.error('Error fetching JSON file:', error);
        });
}


gameBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
        let className = e.target.parentElement.classList.value;
        if (className.includes(`levelBtn`)){
            level = parseInt(e.target.textContent);
            changeLevel();
        }
        else{
            act = e.target.id;
            if (act === LAST_BTN){
                backLevel();
            }
            else if (act === NEXT_BTN){
                goLevel();
            }
            else if (act === START_BTN){
                startGame();
            }
            else if (act === RECORD_BTN){
                loadRecord();
            }
            else if (act === HINT_BTN){
                showHint();
            }
        }
    });
});

function backLevel() {
    if (level<=1) {
        level = levelLimit;
    }
    else {
        level -= 1;
    }
    changeLevel();
}

function goLevel() {
    if (level>=levelLimit) {
        level = 1;
    }
    else {
        level += 1;
    }
    changeLevel();
}

function startGame() {
    if (gameState===GAME_ALIVE){
        return
    }
    if (gameState===GAME_WIN){
        resetGame();
    }
    if (level===0){
        level = 1;
        $(gameBtn[0]).addClass('active');
    }
    $('#nextBtn').removeClass('jumpBtn');
    gameState = GAME_ALIVE;
    gameRule.style.display = 'none';
    getTopic();
    setLives(lives);
    record = {'start': []
              , 'end': []
              , 'result': []
             };
    correctAnswer = new Set();
    line = svg.querySelector(".line");
    liters = gameData.gameData[level];
    milliliters = [];
    shuffle([...liters]).forEach((item, index) =>{
        if (item > 1000){
            milliliters.push(1000);
            milliliters.push(item-1000);
        }
        else{
            milliliters.push(0);
            milliliters.push(item);
        }
        $(milliliterDots[index]).addClass(`${item}`);
    })
    for (let i=0; i<liters.length; i++) {
        const liter = liters[i];
        rightWater[i].style.height = `${((liter)/ 2000)*100}%`;
        $(literDots[i]).addClass(`${liter}`)
        leftWater[i].style.height = `${((milliliters[i])/ 1000)*100}%`;
        leftWater[leftWater.length - (i+1)].style.height = `${((milliliters[leftWater.length - (i+1)])/ 1000)*100}%`;
    }
    createHint();
}

function drawView() {
    const yStart = 65;
    const mouseDownListener = (event) => {
        event.preventDefault();
        start = event.target.classList[1];
        record.start.push(start);
        const {pageX, pageY} = event.touches ? event.touches[0] : event;
        if (line.className.baseVal.includes('wrongLine')){
            $(line).removeClass('wrongLine');
        }
        line.setAttribute("x1", pageX);
        line.setAttribute("y1", pageY-yStart);
        line.setAttribute("x2", pageX);
        line.setAttribute("y2", pageY-yStart);
        drawing = true;
    }
    
    const mouseMoveListener = (event) => {
        event.preventDefault();
        if (!drawing) return;
        const {pageX, pageY} = event.touches ? event.touches[0] : event;
        line.setAttribute("x2", pageX);
        line.setAttribute("y2", pageY-yStart);
    }

    const mouseupListener = (event) => {
        if (!drawing) return;
        drawing = false;
        end = event.target.classList[1];
        
        checkAnswer();
        record.end.push(end);
    }
    milliliterDotsContener.addEventListener("mousedown", (e) => {
        if (milliliterDots.includes(e.target)){
            mouseDownListener(e);
        }
    });
    milliliterDotsContener.addEventListener("touchstart", (e) => {
        if (milliliterDots.includes(e.target)){
            mouseDownListener(e);
        }
    });
    gameArea.addEventListener("mousemove", mouseMoveListener);
    gameArea.addEventListener("touchmove", (e) => {
        mouseMoveListener(e);
    });
    literDotsContener.addEventListener("mouseup", (e) => {
        if (literDots.includes(e.target)){
            mouseupListener(e);
        }
    });
    literDotsContener.addEventListener("touchend", (e) => {
        if (literDots.includes(e.target)){
            mouseupListener(e);
        }
        
    });
};

function checkAnswer() {
    if (gameState !== GAME_ALIVE){
        return
    }
    if (start === end){
        document.getElementById('correct').play();
        document.getElementById('bingo').style.display = 'block';
        record.result.push('O');
        $(line).addClass('correctLine');
        $(line).removeClass('line');
        createLine();
        record.result.forEach((item, index)=>{
            if (item === 'O'){
                correctAnswer.add(record.start[index]);
            }
        })
        line = svg.querySelector(".line");
        setTimeout(()=>{document.getElementById('bingo').style.display = 'none';}, 500);
        if (correctAnswer.size === liters.length){
            gameState = GAME_WIN;
            $('#nextBtn').addClass('jumpBtn');
            set_off_fireworks();
            winLevelArr.push(level);
        }
    }
    else {
        record.result.push('X');
        document.getElementById('wrong').play();
        document.getElementById('dada').style.display = 'block';
        $(line).addClass('wrongLine');
        lives -= 1;
        setLives(lives)
        setTimeout(()=>{document.getElementById('dada').style.display = 'none';}, 500);
        $(gameBtn[level-1]).removeClass('bingo');
        winLevelArr.pop(level);
        $(gameBtn[level-1]).addClass('active');
    }
}

function changeLevel() {
    if (level === 1){
    }
    else if (level === 2){
    }
    else if (level === 3){
    }
    else if (level === 4){
    }
    else if (level === 5){
    }
    resetGame();
}

function resetGame(){
    gameState = GAME_FILE;
    firework_sound.pause();
    fireworkContainer.style.display = 'none';
    gameBtn.forEach((item, index)=>{
        $(item).removeClass('active');
        if ($.inArray(index+1, winLevelArr) !== -1) {
            $(item).addClass('bingo');
        }
        else if (index+1 === level){
            $(item).addClass('active');
        }
    })
    gameRule.style.display = 'block'
    $('.literDots .circle').removeClass().addClass('circle');
    $('.milliliterDots .circle').removeClass().addClass('circle');
    $('svg line').removeClass().addClass('line');
    $('svg line').each((index, line)=>{
        line.setAttribute('x1', '0');
        line.setAttribute('y1', '0');
        line.setAttribute('x2', '0');
        line.setAttribute('y2', '0');
    })
    lives = 3;
}
function loadRecord() {
    // Set download file name
    const filename = "遊玩紀錄.csv";
    let csvContent = "Times,毫升,公升,結果\n"; // Add CSV headers

    let count = 0;
    for (let i = 0; i < record.start.length; i++) {
        csvContent += `${i + 1},${record.start[i]},${record.end[i]/1000},${record.result[i]}\n`;
        if (record.result[i] === "O") count++;
    }
    csvContent += `\nCorrectRate,${(count / record.result.length) * 100}%\n`;
    
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
function showHint(){
    if (lives > 0)return
    if (overlay.style.display === 'block'){
        overlay.style.display = 'none';
        
    }
    else{
        overlay.style.display = 'block';
    }
}

function getTopic(){
    topic.textContent = `${topic_explan}（${level}）`;
}

function createLine(){
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '0');
    line.setAttribute('y2', '0');
    $(line).addClass('line');
    $(svg).append(line);
}
function setLives(lives){
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
function set_off_fireworks(){
    if (gameState !== GAME_WIN){
        return
    }
    firework_sound.currentTime = 1.5;
    firework_sound.play();
    fireworkContainer.style.display = 'block';
    showFirework();
    setTimeout(()=>{firework_sound.pause()}, 2500);
    let count = 0;
    while (count < 2300 && gameState === GAME_WIN){
        let milliseconds =  Math.floor(Math.random() * (800 - 400 + 1)) + 400;
        count += milliseconds;
        setTimeout(showFirework, count)
    }
    setTimeout(() => {
        fireworkContainer.style.display = 'none';
    }, count)
} 

function showFirework() {
    for (let i = 0; i < 5; i++) {
        let width = 100 * (Math.random()*2.5);
        const fireworksElement = document.createElement('img');
        fireworksElement.src = fireworksUrl;
        fireworksElement.style.position = 'absolute';
        fireworksElement.style.width = `${width}px`;
        fireworksElement.style.height = 'auto';
        fireworksElement.style.left = Math.floor(Math.random() * (fireworkContainer.clientWidth-width)) + 'px';
        fireworksElement.style.top = Math.floor(Math.random() * (fireworkContainer.clientHeight-width*1.5)) + 'px';
        fireworkContainer.appendChild(fireworksElement);
    }
    setTimeout(removeFirework, 1194);
}  

function removeFirework() {
    for (let i = 0; i < 5; i++) {
        fireworkContainer.removeChild(fireworkContainer.children[0]);
	}
}

function getRandomNumber(start, end, tolerance, times=1) {
    let result = new Set();
    while(result.size < times) {
        const range = Math.ceil((end - start) / tolerance);
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * (range + 1));
        } while (start + randomIndex * tolerance === 0)
        if (times === 1){
            return start + randomIndex * tolerance;
        }
        const number = start + randomIndex * tolerance;
        result.add(number)
    }
    return [...result]
  }

  function shuffle(originArray){
    // Fisher-Yates shuffle algorithm
    let array = [...originArray]
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  
closeHint.addEventListener('click', showHint);
drawView();
// hint

function createHint() {
    const allMilliliterContainer = document.querySelectorAll('.left>.milliliter_container');
    const allLiterContainer = document.querySelectorAll('.right>.water_container');
    
    $('.milliliterHint .milliliter_container').remove();
    $('.literHint .water_container').remove();
    for (let i=0; i<allLiterContainer.length; i++) {
        milliliterHint.appendChild(allMilliliterContainer[i].cloneNode(true));
        literHint.appendChild(allLiterContainer[i].cloneNode(true));
    }   
    
    const milliliterHintWaterCount = [...milliliterHint.querySelectorAll(`.water_container .milliliter`)]
    const literHintWaterCount = [...literHint.querySelectorAll(`.water_container .liters`)]
    
    for (let i=0; i<liters.length; i++) {
        const mililiter = milliliterDots[i].classList[1];
        const liter = literDots[i].classList[1];
        if (mililiter > 1000){
            milliliterHintWaterCount[i*2].textContent = 1000;
            milliliterHintWaterCount[i*2+1].textContent = mililiter-1000;
        }
        else{
            milliliterHintWaterCount[i*2].textContent = 0;
            milliliterHintWaterCount[i*2+1].textContent = mililiter;
        }
        literHintWaterCount[i].textContent = liter;
    }
}
  