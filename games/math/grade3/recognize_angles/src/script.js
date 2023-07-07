import {startBtnHandler, game} from './Handler.js';


const levelsArea = $(`.levelBtn`);
const optionsArea = $(`.optionsBtn`);
const anglesArea = $(`.game_area .angles`);
const closeHintBtn = $(`.hintContainer .closeHintBtn`);

levelsArea.on('click', (e) => {
    const level = parseInt(e.target.id);
    $(e.target).addClass('active');
    game.changeLevel(level);
})

optionsArea.on('click', (e) => {
    const act = e.target.id;
    startBtnHandler.handleRequest(act);
})

anglesArea.on('click', (e) => {
    const angle = e.target.classList.value;
    if (angle !== "angles"){
        game.checkAnswer(angle);
    }
})

closeHintBtn.on('click', (e) => {
    game.toggleHint();
})
