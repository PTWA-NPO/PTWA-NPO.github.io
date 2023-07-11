export { circleClickEstablish, pearClickEstablish, checkAnswerValue}
import { game } from './Handler.js';

function circleClickEstablish(){
    $('.circleFraction svg').on('click', (e) => {
        // console.log(e.clientX, e.clientY);
        if($(e.target).attr('class') === 'uncolored'){
            if((e.clientX >= 69 && e.clientX <= 269) && (e.clientY >= 147 && e.clientY <= 347)){
                if(Math.sqrt((e.clientX - 169) ** 2 + (e.clientY - 247) ** 2) <= 100){
                    $(e.target).css('fill', '#dc0073');
                    $(e.target).attr('class', 'colored');
                    }
                }
            else{
                if(Math.sqrt((e.clientX - 634) ** 2 + (e.clientY - 247) ** 2) <= 100){
                    $(e.target).css('fill', '#dc0073');
                    $(e.target).attr('class', 'colored');
                    }
                }
            }
        else{
            if((e.clientX >= 69 && e.clientX <= 269) && (e.clientY >= 147 && e.clientY <= 347)){
                if(Math.sqrt((e.clientX - 169) ** 2 + (e.clientY - 247) ** 2) <= 100){
                    // console.log(Math.sqrt((e.clientX - 169) ** 2 + (e.clientY - 247) ** 2));
                    $(e.target).css('fill', '#8e8e9c');
                    $(e.target).attr('class', 'uncolored');
                }
            }
            else{
                if(Math.sqrt((e.clientX - 634) ** 2 + (e.clientY - 247) ** 2) <= 100){
                    $(e.target).css('fill', '#8e8e9c');
                    $(e.target).attr('class', 'uncolored');
                    }
                }
            }
    })
}

function pearClickEstablish(){
    $('.pear img').on('click', (e) => {
        if($(e.target).attr('class') === 'uncolored'){
            $(e.target).attr('src', 'src/fractionImg/pearColor.png');
            $(e.target).attr('class', 'colored');
        }
        else{
            $(e.target).attr('src', 'src/fractionImg/pear.png');
            $(e.target).attr('class', 'uncolored');
        }
    })
}

function checkAnswerValue(){
    if(game.level > 3){
        game.clickAmount[0] = $('.firstImgContainer svg .colored').length;
        game.clickAmount[1] = $('.secondImgContainer svg .colored').length;
    }
    else{
        game.clickAmount[0] = $('.firstImgContainer .questionImg .colored').length;
        game.clickAmount[1] = $('.secondImgContainer .questionImg .colored').length;
    }
}