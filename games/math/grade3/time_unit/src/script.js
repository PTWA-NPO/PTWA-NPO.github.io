import {startBtnHandler, game} from './Handler.js';


const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);
const closeHintBtn = $(`.hintContainer .closeHintBtn`);
const closeRightAnsBtn = $(`.RightAnsSection .closeRightAnsBtn`);
const closeCalculateCanvasBtn = $(`.calculate-canvas .closeCalculateCanvasBtn`);
const jumpBtn = $('.jumpBtn');
const answerArea = $(`.game_area .answer`);
const calculatecanvasBtn = $(`.calculate-canvas-btn`);

levelsArea.on('click', (e) => {
    const level = parseInt(e.target.textContent);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.on('click', (e) => {
    const act = e.target.id;
    startBtnHandler.handleRequest(act);
});

closeHintBtn.on('click', (e) => {
    game.toggleHint();
});

closeRightAnsBtn.on('click',(e) => {
    game.toggleRightAns();
    game.SetshowAnsState('HIDE');
});

closeCalculateCanvasBtn.on('click',(e)=>{
    game.toggleCalculateCanvas();
});

jumpBtn.on('animationiteration', ()=>{
    jumpBtn.css('animation-play-state', 'paused');
    setTimeout(()=>{jumpBtn.css('animation-play-state', 'running');}, 2000);
});

calculatecanvasBtn.on('click',(e)=>{
    game.showCanvas(game.level);
    game.setupCanvas();
});

answerArea.on('click', (e) => {
    const answer = e.target.classList.value;
    if (answer !== "answer"){
        game.checkAnswer(answer);
    }
})