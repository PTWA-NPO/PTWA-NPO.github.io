const BASE_IMG_URL = 'assets/images/grade_btn/';
const OTHER_IMAGES = ['mand', 'math', 'tech'];

$('.link-block').on('click', function() {
    let targetMenu = $(this).data('target');
    $('.collapse').not(targetMenu).collapse('hide');
});

function changeImage(id) {
    const $image = $(`#${id}`);
    const imgSrc = $image.attr('src');
    const newSrc = imgSrc.includes('_after') ? `${BASE_IMG_URL}${id}.png` : `${BASE_IMG_URL}${id}_after.png`;
    
    $image.attr('src', newSrc);
    resetOriginImage(OTHER_IMAGES.filter(image => image !== id));
}

function resetOriginImage(ids) {
    ids.forEach(id => $(`#${id}`).attr('src', `${BASE_IMG_URL}${id}.png`));
}
