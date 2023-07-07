const allGameIframe = document.querySelectorAll('iframe');

const link = document.getElementById('fractional_connection');

$('.game_view').on('click', function(e) {
    const id = $(this).attr('id');
    localStorage.setItem('title', `一年級多元科技：${$(`#${id}`).text()}`);
    const url = `../../../game_view/?unit=technology&id=${id}`;
    window.location.href = url;
});

$('.game').each(function(index, game){
    const gameId = $(game).attr('id');
    $(game).find('.img').html(`<img src='asset/images/${gameId}.jpg'>`);
});

$(".previousPage").on('click', (e) => {
    hideFrames();
    $(".previousPage").css("display", "none");
    $('.gameBlock').toggle()
})

$(".gameBlock").on('click', function(e) {
    const gameElement = $(e.target).closest('.game');
    const id = gameElement.attr('id');
    if (!id){ return false}
    const classList = gameElement.attr('class').split(' ');
    if (classList.length >= 2){ return false}
    hideFrames(id);
    $('.gameBlock').css({'display': 'none'});
})

function hideFrames(number=0) {
    [...allGameIframe].forEach((item) => {
        item.style.display = "none";
    });
    if (number) {
        $(".previousPage").css("display", "block");
        allGameIframe[number-1].style.display = "block";
    }
}
  