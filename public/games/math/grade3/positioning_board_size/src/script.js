import {startBtnHandler, game} from './Handler.js';


const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);
const closeHintBtn = $(`.hintContainer .closeHintBtn`);
const jumpBtn = $('.jumpBtn');
const comparisonSymbol = $('.answerDisplay');

levelsArea.on('click', (e) => {
    const level = parseInt(e.target.id);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.on('click', (e) => {
    const act = e.target.id;
    startBtnHandler.handleRequest(act);
})

closeHintBtn.on('click', (e) => {
    $('.overlay').css('display', 'none');
})

jumpBtn.on('animationiteration', ()=>{
    jumpBtn.css('animation-play-state', 'paused');
    setTimeout(()=>{jumpBtn.css('animation-play-state', 'running');}, 2000);
});

comparisonSymbol.on('mousedown', (e) =>{
    let initX = e.clientX, initY = e.clientY;
    console.log(initX, initY);
    if(e.target.className !== 'answerDisplay'){
        $('body').on('mousemove', (event) => {
            //左下角:(374,302) 右上角:(423, 256)
            $('.' + e.target.className).css('transform', 'translate(' 
            + (event.clientX - initX) + 'px,' + (event.clientY - initY) +'px)');
        })

        $('body').on('mouseup', (temp) => {
            let endPositionX = temp.clientX, endPositionY = temp.clientY;
            $('.' + e.target.className).off();
            $('body').off();
            $('.' + e.target.className).css('transform', 'translate(0px, 0px)');
            if((parseInt(endPositionX) >= 370 && parseInt(endPositionX) <= 425) 
            && (parseInt(endPositionY) <= 305 && parseInt(endPositionY) >= 255)){
                game.symbolDisplay(temp.target.className);
            }
        })
    }
})