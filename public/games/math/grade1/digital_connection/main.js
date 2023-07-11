let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 600;
let BLACK = "#000000";
let BLUE = "#48807d";
let GREEN = "#008800";
let RED = "#ff0000";
let DARKGREY = "#282828";
let WHITE = "#ffffff";
let YELLOW = "#FFFF00";
let PURPLE = "#800080";
let H1_FONT_STYLE = "bold 40px Courier";
let HINT_SIZE = 200;
let HINT_FONT_STYLE = `bold ${HINT_SIZE}px Courier`;
let SCORE_SIZE = 50;
let SCORE_FONT_STYLE = `bold ${SCORE_SIZE}px Courier`;

const fireworksUrl = '../../../../assets/images/game_images/fireworks.gif';

const canvas_bg = document.getElementById('canvas1');
const ctx_bg = canvas_bg.getContext('2d');
const canvas_stay = document.getElementById('canvas2');
const ctx_stay = canvas_stay.getContext('2d');
const canvas_current = document.getElementById('canvas3');
const ctx_current = canvas_current.getContext('2d');
ctx_current.fillStyle = BLACK;

const startBtn = document.getElementById('startBtn');
const next_level_btn = document.getElementById('nextLevel');
const restart_btn = document.getElementById('restart');
const hint_btn = document.getElementById('hint');
const level_button = [...document.querySelectorAll('.chooseBtn')];
const hint_img = document.querySelector('.hint');
const fireworkContainer = document.querySelector('#firework-container');
const downloadBtn = document.getElementById('downloadBtn');
const closeImageBtn = document.getElementById('close-image-btn');
const overlay = document.getElementById('overlay');
const image = document.getElementById('image');
const imageContainer = document.getElementById('image-container');

canvas_bg.width = CANVAS_WIDTH;
canvas_bg.height = CANVAS_HEIGHT;
canvas_stay.width = CANVAS_WIDTH;
canvas_stay.height = CANVAS_HEIGHT;
canvas_current.width = CANVAS_WIDTH;
canvas_current.height = CANVAS_HEIGHT;

let CHINESE = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

let digital_connection = new Game()

digital_connection.animate();