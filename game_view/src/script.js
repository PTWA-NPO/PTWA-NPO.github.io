import * as constant from "./constant.js";
import { gameModules } from './module.js';
import { Handler } from './Handler.js';

async function init() {
    const allGameData = await gameModules.getJson('./game_config.json');
    const gameID = getGameID();
    const gameData = allGameData[gameID];
    const gameGrade = gameData.game_grade;
    const gameName = gameData.game_name;

    const levelsArea = $('.levelBtn');
    const optionsArea = $('.optionsBtn');

    const iframeElement = createIframeElement(gameName);
    $('.gameIframe').append(iframeElement);
    updateLevels(gameData, levelsArea);
    $('.context').html(getRule(gameData));
    updateOptions(gameData);

    changeTitle();

    setupEventListeners(gameData, levelsArea, optionsArea);
    setupAnimation();
    setupGameColor(constant.GAME_COLOR[gameGrade-1]);
}

function getGameID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return parseInt(urlParams.get('id')) - 11;
}

function createIframeElement(gameName) {
    return $('<iframe></iframe>', {
        src: `../games/${gameName}/index.html`,
        id: gameName,
        scrolling: 'no'
    });
}

function updateLevels(gameData, levelsArea) {
    const currentLevelCount = levelsArea.children('button').length;
    const targetLevelCount = gameData.game_level;

    if (currentLevelCount > targetLevelCount) {
        levelsArea.children('button:gt(' + (targetLevelCount - 1) + ')').remove();
    } else if (currentLevelCount < targetLevelCount) {
        const newButtons = Array.from(
            { length: targetLevelCount - currentLevelCount },
            (_, i) => $('<button>', {
                id: currentLevelCount + i + 1,
                text: currentLevelCount + i + 1
            })
        );
        levelsArea.append(newButtons);
    }
}

function getRule(gameData) {
    return gameData.game_rule.map(element => `<h1>${element}</h1>`).join('');
}

function updateOptions(gameData) {
    const options = gameData.game_option;
    $('.optionsBtn button').filter((index, element) => {
        return !options.includes($(element).attr('id'));
    }).remove();
}

function changeTitle() {
    const title = localStorage.getItem('title');
    if (title) {
        $('title').text(title);
    }
}

function setupEventListeners(gameData, levelsArea, optionsArea) {
    const gameName = gameData.game_name;
    const gameKind = gameData.game_kind;
    const gameGrade = gameData.game_grade;
    $(window).on('message', handleGameMessage);

    function handleGameMessage(e) {
        const gameRule = $('.gameRule');
        const message = e.originalEvent.data;

        if (message.type === constant.GAME_WIN) {
            $('#nextBtn').addClass("jumpBtn");
        }
        if (message.type !== gameName) {
            return false;
        }
        const gameWindow = $('#' + gameName)[0].contentWindow;
        const game = gameWindow.getGame();

        optionsArea.on('click', 'button', handleOptionsButtonClick);
        levelsArea.on('click', 'button', handleLevelButtonClick);

        const btnHandler = new Handler(game, levelsArea);
        function handleOptionsButtonClick(e) {
            const act = $(this).attr('id');
            if (gameRule.is(':visible')) {
                if (act === constant.optionsBtn.START_BTN || act === constant.optionsBtn.LAST_BTN ||act === constant.optionsBtn.NEXT_BTN) {
                    gameRule.hide();
                    $(`#${constant.optionsBtn.START_BTN}`).text("重新開始");
                }
            }
            btnHandler.handleRequest(act);
        };

        function handleLevelButtonClick(e) {
            const level = parseInt($(this).attr('id'));
            if (!level) {
                return false;
            }
            // TODO Refactor
            if (gameRule.is(':visible')) {
                gameRule.hide();
                $(`#${constant.optionsBtn.START_BTN}`).text("重新開始");
            }
            btnHandler.changeLevel({level: level})
            // levelsArea.children().eq(game.level - 1).removeClass('active');
            // game.winLevelSet.forEach((value) => 
            //     levelsArea.children().eq(value - 1).addClass('win')
            // );
            // $(this).addClass('active');
            // game.changeLevel(level);
        };
    };

    const previousPageBtn = $('.previousPage');
    previousPageBtn.on('click', () => {
        window.location.href = `../games/${gameKind}/grade${gameGrade}/`;
    });
}

function setupAnimation() {
    const jumpBtn = $('.jumpBtn');
    jumpBtn.on('animationiteration', function(e) {
        $(this).css('animation-play-state', 'paused');
        setTimeout(() => {
            $(this).css('animation-play-state', 'running');
        }, 2000);
    });
}

function setupGameColor(color) {
    const bgElement = ['.optionsBtn *']
    const borderElement = ['.previousPage', '.myCanvas', '.gameBtn *']
    const hoverBGElement = ['.previousPage', '.levelBtn *']
    bgElement.forEach((ele) => {
        $(ele).css('background-color', color)
    })
    borderElement.forEach((ele) => {
        $(ele).css('border-color', color);
    })
    
    hoverBGElement.forEach((ele) => {
        const colorStyle = $('<style>');
        colorStyle.text(`
        ${ele}:hover {
            background-color: ${color};
        }
        `);
        $('head').append(colorStyle);
    })
    const colorStyle = $('<style>');
        colorStyle.text(`
        .levelBtn .active {
            background-color: ${color};
        }
        `);
    $('head').append(colorStyle);

}
$(document).ready(init);
