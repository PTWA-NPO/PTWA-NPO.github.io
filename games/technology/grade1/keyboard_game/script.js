var start_game_run = false; // 偵測遊戲是否運行
let keydown_run = true; // 防止一次按很多按鍵
let keydown_random = false; // 調整模式為依序或隨機
let keydown_delay = 3000; // 調整答對後圖片出現的間隔
let zhuyin_list = [49, 81, 65, 90, 50, 87, 83, 88, 69, 68, 67, 82, 70, 86, 53, 84, 71, 66, 89, 72, 78, 85, 74, 77, 56, 73, 75, 188, 57, 79, 76, 190, 48, 80, 186, 191, 189]
var value_list = ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ', 'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ'];


var game_start_bool = false; // 避免重複開始遊戲倒數
var last_keydown_correct = 0; // 記錄前一個答案，避免重覆到一樣的
var keydown_correct = 0; // 記錄答案

var game_status = { //紀錄遊戲狀態，依序為錯誤次數 正確次數 分數 時間
    error_count : 0,
    correct_count : 0,
    score : 0,
    time : 0,
    keydown_time : []
};

var game_status_log = { //紀錄歷史遊戲狀態 依序為錯誤次數 正確次數 得分 模式 時間
    keydown_error : [],
    keydown_correct : [],
    score : [],
    run_model : [], 
    time : [],
    keydown_time : []
};


function init(){
    var RandomBtn = document.getElementById('RandomBtn');
    var btn = document.getElementById('btn');
    var handle_mouse = function(){ // 開始遊戲按鈕
        if(start_game_run == true && !game_start_bool){
            game_status.time = 3;
        }
        else if(!game_start_bool){
            game_start_reciprocal();
        }
    };
    btn.addEventListener('click', handle_mouse);

    let change_random = function(){ // 改變模式按鈕
        if(start_game_run || game_start_bool)
            return;
        keydown_random = !keydown_random;
        if(keydown_random == true){
            var tmp = document.getElementById('Random_text_id');
            tmp.textContent = "注音隨機出現";
        }
        else{
            var tmp = document.getElementById('Random_text_id');
            tmp.textContent = "注音依序出現";
        }
    }
    RandomBtn.addEventListener('click', change_random);
}


function game_start_reciprocal(){
    var count_down = document.getElementById('game_reciprocal');
    var time_id = document.getElementById('time_id');
    var score_id = document.getElementById('score_id');
    var opo_id = document.getElementById('opo');
    game_start_bool = true;
    let w = setInterval('owo', 1000);
    for(let i = 0; i < w + 1; i++){
        clearInterval(i);
    }
    time = [0, 1000, 2000, 3000, 4000, 5000, 6000];
    setTimeout(function(){count_down.textContent = "5"; music_play('reciprocal_5')}, time[0]);
    setTimeout(function(){count_down.textContent = "4"; music_play('reciprocal_4')}, time[1]);
    setTimeout(function(){count_down.textContent = "3"; music_play('reciprocal_3')}, time[2]);
    setTimeout(function(){count_down.textContent = "2"; music_play('reciprocal_2')}, time[3]);
    setTimeout(function(){count_down.textContent = "1"; music_play('reciprocal_1')}, time[4]);
    setTimeout(function(){count_down.textContent = "開始";  music_play('reciprocal_start')}, time[5]);
    setTimeout(function(){count_down.textContent = ""; start_game_run = true;}, time[6]);
    setTimeout(function(){
        keydown_correct = -1;
        keydown_correct = game_id_rand(); 
        if(keydown_random == false){
            game_status.time = 0;
        }
        else{
            game_status.time = parseInt(document.getElementById('gameTime').value);
        }
        game_status.score = 0;         
        time_id.textContent = game_status.time;
        score_id.textContent = game_status.score;

        game_status.error_count = 0;
        game_status.correct_count = 0;
        game_status.keydown_time = [];
        keydown_delay = 3000;
    }, time[6]);
    setTimeout(function(){game_time_reciprocal(); setInterval(game_time_reciprocal, 1000); game_start_bool = false}, 6000);
}

function game_time_reciprocal(){
    if(start_game_run == false)
        return;
    let tmp_id = document.getElementById('time_id');
    if(keydown_random == false){ // 依序模式
        if(game_status.score == 3700){
            start_game_run = false;
            var id = document.getElementById('opo');
            id.textContent = '';
            
            setTimeout(music_play('finish'), 500);
            game_status_log.score.push(game_status.score);
            game_status_log.keydown_correct.push(game_status.correct_count);
            game_status_log.keydown_error.push(game_status.error_count);
            game_status_log.keydown_time.push(game_status.keydown_time);
            game_status_log.time.push(game_status.time);
            game_status_log.run_model.push('依序');
            downloadFile();
        }
        else{
            game_status.time += 1;
            tmp_id.textContent = game_status.time;
        }
    }
    else{ // 隨機模式
        if(game_status.time <= 0){
            start_game_run = false;
            var id = document.getElementById('opo');
            id.textContent = '';

            setTimeout(music_play('finish'), 500);
            game_status_log.score.push(game_status.score);
            game_status_log.keydown_correct.push(game_status.correct_count);
            game_status_log.keydown_error.push(game_status.error_count);
            game_status_log.keydown_time.push(game_status.keydown_time);
            game_status_log.time.push(parseInt(document.getElementById('gameTime').value));
            game_status_log.run_model.push('隨機');
            downloadFile();
        }
        else{
            if(game_status.time == 6) music_play('reciprocal_5');
            else if(game_status.time == 5) music_play('reciprocal_4');
            else if(game_status.time == 4) music_play('reciprocal_3');
            else if(game_status.time == 3) music_play('reciprocal_2');
            else if(game_status.time == 2) music_play('reciprocal_1');
            game_status.time -= 1;
            tmp_id.textContent = game_status.time;
        }
    }
}

function game_id_rand(){
    function getrandom(){
        return Math.floor(Math.random() * (zhuyin_list.length));
    };
    let now_id = 0;
    if(keydown_random == true){
        now_id = getrandom();
    }
    else{
        now_id = (keydown_correct + 1) % zhuyin_list.length;
    }
    let now_value = value_list[now_id];
    let id = document.getElementById('opo');
    id.textContent = now_value;
    return now_id;
}

function game_image(key_code){
    var id = document.getElementById('opo');
    id.textContent = '';
    var img = document.getElementById(`image_${key_code}`);
    img.style.display = "block";
    setTimeout(function(){img.style.display = "none"}, keydown_delay);
}


function music_play(key_code){
    const audio = document.querySelector(`audio[data-key="${key_code}"]`);
    const keyboard_item = document.querySelector(`.keyboard_item[data-key="${key_code}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    audio.play();
}

function keyboard_keydown(e){
    if(start_game_run == true && keydown_run == true){
        const key_code = e.keyCode;
        if(key_code == 17){
            keydown_delay = 0;
        }
        if(!zhuyin_list.includes(key_code)){
            return;
        }
        
        const txt_id = document.getElementById(key_code);
        const keyboard_item = document.querySelector(`.keyboard_item[data-key="keyboard_${key_code}"]`);
        keyboard_item.classList.add('playing');
        setTimeout(function(){
            keyboard_item.classList.remove('playing');
        }, 100);
        keydown_run = false;


        if(key_code == zhuyin_list[keydown_correct]){
            txt_id.classList.add('txt_transition');
            music_play("correct_" + key_code);

            let tmp_id = document.getElementById('score_id') 
            last_keydown_correct = keydown_correct;
            game_status.correct_count += 1;
            game_status.score += 100;
            if(keydown_random == false){
                game_status.keydown_time.push(game_status.time);
            } else{
                game_status.keydown_time.push(parseInt(document.getElementById('gameTime').value - game_status.time));
            }
            tmp_id.textContent = game_status.score; 
            game_image(key_code); 
            setTimeout(function(){
                txt_id.classList.remove('txt_transition'); 
                keydown_run = true            
            }, keydown_delay);
            
            setTimeout(function(){
                while(last_keydown_correct == keydown_correct){
                    keydown_correct = game_id_rand();
                }
            }, keydown_delay);
        }
        else{
            game_status.error_count += 1;
            txt_id.classList.add('error_transition')
            music_play('error');
            setTimeout(function(){
                keydown_run = true
                txt_id.classList.remove('error_transition')
            }, 750);
        }
    }
}

function getScoreLog(){
    let score_txt = "";
    for(let i = 0; i < game_status_log.score.length; i++){
        score_txt = "===========================\n\n";
        score_txt += '第 ' + (i + 1) + ' 次測驗狀況如下：' + '\n' +
                     ' - 遊戲模式：' + game_status_log.run_model[i] + "\n" +   
                     ' - 正確點擊次數：' + game_status_log.keydown_correct[i] + ' 次' + '\n' +
                     ' - 錯誤點擊次數：' + game_status_log.keydown_error[i] + ' 次' + '\n';

        if(game_status_log.run_model[i] === '依序'){ 
            score_txt += ' - 遊戲時間：' + game_status_log.time[i] + ' 秒' + '\n\n';
        }
        else{
            score_txt += ' - 遊戲時間：' + game_status_log.time[i] + ' 秒' + '\n\n';
            score_txt += ' - 遊戲分數：' + game_status_log.score[i] + ' 分' + '\n\n';
        }
        score_txt += '=========================== \n\n';    
        let first = 0;
        for(let j = 0; j < game_status_log.keydown_time[i].length; j++){
            score_txt += `第 ${j+1} 次按下 '${value_list[first++]}' 時間為第 ${game_status_log.keydown_time[i][j]} 秒\n`
        }
        score_txt += '\n\n\n';
    }
    console.log(score_txt);
    return score_txt;
}

function downloadFile() {
    let fileName = "ScoreLog.txt";
    const data = getScoreLog();
    let blob = new Blob([data], {
      type: "application/octet-stream",
    });
    var href = URL.createObjectURL(blob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();
  }


var body = document.body;
body.addEventListener('keydown', keyboard_keydown ,false) //偵測按下按鍵的行為

let downloadBtn = document.querySelector(".downloadBtn");
downloadBtn.addEventListener("click", downloadFile);