// game view variables
const IMAGE_PATH = "./asset/image/";
const FIREWORK_PATH = Array.from({length: 8}, (_, i) => IMAGE_PATH+"firework_red"+i+".png");
const fireworks_image = new Image();


class Game{
    constructor(){
        // create objects
        this.npc = new Npc();

        level_button[0].style.border = `3px solid ${DARKGREY}`;
        this.initialize();
        this.addEvent();
    }

    initialize(level=1){
        this.clear_canvas();
        hint_img.style.backgroundImage = "none";
        hint_img.style.backgroundColor = "";
        this.record = {'start': []
                        , 'end': []
                        , 'result': []
                    };
        this.score = 0;
        this.correct = [];
        let topic_random = getRandomUniqueArrayElements(getIntArray(10, 1), 5);
        let ans_random = shuffle([...topic_random]);
        let random_chinese = shuffle([CHINESE[topic_random[0]-1], CHINESE[topic_random[1]-1], CHINESE[topic_random[2]-1], CHINESE[topic_random[3]-1], CHINESE[topic_random[4]-1]]);
        this.topic = [
            {
                "topic": shuffle(getIntArray(5, 1))
                , "ans": shuffle(getIntArray(5, 1))
            }
            , {
                "topic": shuffle(getIntArray(5, 6))
                , "ans": shuffle(getIntArray(5, 6))
                
            }
            , {
                "topic": topic_random
                , "ans": ans_random
                
            }
            , {
                "topic": shuffle(getIntArray(5, 1))
                , "ans": shuffle(getIntArray(5, 1))
                , "chinese": shuffle(['一', '二', '三', '四', '五'])
            }
            , {
                "topic": shuffle(getIntArray(5, 6))
                , "ans": shuffle(getIntArray(5, 6))
                , "chinese": shuffle(['六', '七', '八', '九', '十'])
            }
            , {
                "topic": topic_random
                , "ans": ans_random
                , "chinese": shuffle(random_chinese)
            }
        ];
        this.gestures = [];
        this.numbers = [];
        this.chinese = [];
        this.topic_points = [];
        this.ans_points = [];
        this.lives = [];
        this.topic_point = 0;
        this.ans_point = 0;
        this.startPosition = {x: 0, y: 0};
        this.lineCoordinates = {x: 0, y: 0};
        this.isDrawStart = false;
        this.status = "FAIL";
        this.level = level; //default level
        this.create_game();
    }
    
    create_game() {
        let x = canvas_bg.width - this.npc.width*4.5;
        for (let i = 0; i < 3; i++) {
            this.create_live(x, 10, this.lives);
            x += this.npc.width/2;
        }
        let y = 80;
        for (let i = 0; i < 5; i++) {
            this.create_topic(this.topic[this.level-1].topic[i], y+40);
            this.create_gesture(this.topic[this.level-1].ans[i], y);
            if (this.level > 3){
                this.createChinese(this.topic[this.level-1].chinese[i], y+40);
            }
            y += canvas_bg.height/6;
        }
        this.ready();
    }

    ready(){
        // view of ready to start
        ctx_bg.fillStyle = BLUE;
        ctx_bg.font = H1_FONT_STYLE;
        ctx_bg.fillText(`遊戲玩法：`, 50, 100);
        ctx_bg.fillText(`將數字連上對應的手勢`, 80, 190);
        ctx_bg.fillText(`當錯誤三次後點擊提示可獲得對照表`, 80, 240);
        ctx_bg.fillText(`當過關後可點選下一關`, 80, 290);
        ctx_bg.fillText(`也可自由點選上方數字鍵切換關卡`, 80, 340);
        ctx_bg.fillText(`點擊遊戲紀錄，下載此次的遊玩紀錄`, 80, 390);
        ctx_bg.fillText(`準備好了嗎？點擊遊戲開始！`, canvas_bg.width -550, canvas_bg.height - 100);
    }
    
    addEvent(){
        level_button.forEach(item => {
            item.addEventListener('click', (e) => {
                this.initialize(parseInt(e.target.innerHTML));
                level_button.forEach(item => {
                    item.style.border = 'none';
                })
                item.style.border = `3px solid ${DARKGREY}`;
            });
        })
        hint_btn.addEventListener('click', this.show_ans);
        closeImageBtn.addEventListener('click', this.closeHint);
        overlay.addEventListener('click', (e)=>{
            if (e.target === overlay) {
                overlay.style.direction = 'none';
                this.closeHint();
            }
        });
        startBtn.addEventListener('click', this.start_game); 
        next_level_btn.addEventListener('click', this.nextLevel); 
        restart_btn.addEventListener('click', (e) => {
            revertElementBorder(e, BLACK, 500);
            this.initialize(this.level)});
        
        downloadBtn.addEventListener('click', () => {
            // 設定下載檔案名稱
            const filename = `第 ${this.level} 關遊戲紀錄.txt `;
            let textContent = `第 ${this.level} 關遊戲紀錄：
            `;
            
            for (let i=0; i<this.record.start.length; i++) {
                textContent += `\t\n第 ${i+1} 次點擊從${this.record.start[i]} 到${this.record.end[i]}，結果為 ${this.record.result[i]}`

            }
            // 建立一個 Blob 物件
            const blob = new Blob([textContent], {type: 'text/plain'});
  
            // 建立一個下載連結
            const url = URL.createObjectURL(blob);
  
            // 建立一個 <a> 元素，並設定 href 屬性和 download 屬性
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
  
            // 模擬點擊 <a> 元素，開始下載檔案
            a.click();
  
            // 釋放 URL 物件
            URL.revokeObjectURL(url);
        });
    }
    nextLevel = (e) => {
        if (this.score !== 100){
            return;
        }
        level_button[this.level-1].style.backgroundColor = YELLOW;
        level_button[this.level-1].style.border = 'none';
        revertElementBorder(e, BLACK, 500);
        if (this.level >= 6){
            level_button[0].style.border = `3px solid ${DARKGREY}`;
            this.initialize();
        }
        else{
            level_button[this.level].style.border = `3px solid ${DARKGREY}`;
            this.initialize(this.level+1);
        }
    }

    start_game = (e) => {
        if (this.status !== 'FAIL'){
            return
        }
        this.status = 'ALIVE';
        revertElementBorder(e, BLACK, 500);
        ctx_bg.fillStyle = BLUE;
        ctx_bg.font = H1_FONT_STYLE;
        ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
        ctx_bg.fillText('將數字連上正確的手勢吧！', this.npc.x + this.npc.width+this.npc.width/2, this.npc.height);
        ctx_bg.fillStyle = RED;
        ctx_bg.font = SCORE_FONT_STYLE;
        ctx_bg.fillText(this.score, canvas_bg.width - 80, 55);
        this.draw_bg();
    }

    show_ans = (e) => {
        if (this.lives.length) {
            return
        }
        revertElementBorder(e, BLACK, 500);
        if (overlay.style.display !== 'none'){
            this.closeHint()
        }
        else{
            overlay.style.display = 'block';
            image.src = `./asset/image/hint_${this.level}.png`;
        }
    }

    closeHint = (e) =>{
        overlay.style.display = 'none';
    }

    animate(){
        this.draw_view();
        this.get_result();
        
        requestAnimationFrame(()=>this.animate());
    }

    get_result(){
        if (this.score !== 100) {
            return
        }
        if (this.status != "GAME_WIN"){
            this.clear_canvas("current");
            ctx_stay.fillStyle = RED;
            ctx_stay.font = H1_FONT_STYLE;
            set_off_fireworks();
            ctx_stay.fillText("恭喜過關！", canvas_current.width/3, canvas_current.height / 2);
        }
        this.status = "GAME_WIN";
    }

    draw_bg(){
        this.npc.draw();
        for (let i = 0; i < this.gestures.length; i++){
            this.gestures[i].draw();
            this.numbers[i].draw();
            if (this.level > 3){
                this.chinese[i].draw();
            }
        }
        for (let i = 0; i < this.topic_points.length; i++){
            this.topic_points[i].draw();
            this.ans_points[i].draw();
        }
        this.draw_lives();
    }
    draw_lives(){
        for (let i = 0; i < this.lives.length; i++){
            this.lives[i].draw();
        }
        if (!this.lives.length){
            ctx_bg.fillStyle = RED;
            ctx_bg.font = 30+"px Courier";
            ctx_bg.fillText("↑點提示", canvas_bg.width - this.npc.width*4.5, 35);
            ctx_bg.fillText(" 看答案", canvas_bg.width - this.npc.width*4.5, 65);
        }
    }
    draw_view(){  
        this.getClientOffset = (e) => {
            let {pageX, pageY} = e.touches ? e.touches[0] : e;
            let x = pageX - canvas_current.offsetLeft;
            let y = pageY - canvas_current.offsetTop;
            
            return {
               x,
               y
            } 
        }  
        this.drawLine = () => {
            ctx_current.strokeStyle = BLACK;
            ctx_current.lineWidth = 3;
            ctx_current.beginPath();
            ctx_current.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_current.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_current.stroke();
        }
        
        this.mouseDownListener = (e) => {
            if (hint_img.style.backgroundImage !== 'none'){
                hint_img.style.backgroundImage = 'none';
                hint_img.style.backgroundColor = '';
            }
            this.startPosition = this.getClientOffset(e);
            this.topic_point = this.collide_with_topic_point(this.startPosition);
            if (this.topic_point){
                this.isDrawStart = true;
            }
            else{
                this.clear_canvas("current");
            }
        }
        
        this.mouseMoveListener = (e) => {
            if(!this.isDrawStart) return;
            
            this.lineCoordinates = this.getClientOffset(e);
            this.clear_canvas("current");
            this.drawLine();
            // console.log(this.startPosition.x, this.startPosition.y, this.lineCoordinates.x, this.lineCoordinates.y);
        }
        
        this.mouseupListener = (e) => {
            this.isDrawStart = false;
            this.ans_point = this.collide_with_ans_point(this.lineCoordinates);
            if (!this.topic_point.ans || !this.ans_point.ans) {
                return;
            }
            this.record.start.push(`${this.topic_point.id} ${this.topic_point.ans}`);
            this.record.end.push(`${this.ans_point.id} ${this.ans_point.ans}`);
            if (this.topic_point.ans === this.ans_point.ans){
                document.getElementById('correct').play();
                this.draw_correct_line();
                this.addScore(100/this.ans_points.length);
                ctx_current.fillStyle = GREEN;
                ctx_current.font = HINT_FONT_STYLE;
                ctx_current.fillText("Ｏ", canvas_current.width/2-(HINT_SIZE/2), canvas_current.height / 2+(HINT_SIZE/2));
                this.correct.push(this.ans_point);
                this.record.result.push("Ｏ");
            }
            else {
                document.getElementById('wrong').play();
                this.draw_wrong_line();
                ctx_current.fillStyle = RED;
                ctx_current.font = HINT_FONT_STYLE;
                ctx_current.fillText("Ｘ", canvas_current.width/2-(HINT_SIZE/2), canvas_current.height / 2+(HINT_SIZE/2));
                this.record.result.push("Ｘ");
                if (this.lives){
                    this.lives.pop();
                    this.clear_canvas("bg", canvas_bg.width - this.npc.width*4.5, 10, this.npc.width*2, this.npc.height);
                }
                this.draw_lives();
            }
            this.startPosition = 0;
            this.lineCoordinates = 0;
        }
        
        this.draw_correct_line = () => {
            ctx_stay.strokeStyle = GREEN;
            ctx_stay.lineWidth = 5;
            ctx_stay.beginPath();
            ctx_stay.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_stay.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_stay.stroke();
        }
        this.draw_wrong_line = () => {
            ctx_current.strokeStyle = RED;
            ctx_current.lineWidth = 5;
            ctx_current.beginPath();
            ctx_current.moveTo(this.startPosition.x, this.startPosition.y);
            ctx_current.lineTo(this.lineCoordinates.x, this.lineCoordinates.y);
            ctx_current.stroke();
        }
        canvas_current.addEventListener('mousedown', this.mouseDownListener);
        canvas_current.addEventListener('mousemove', this.mouseMoveListener);
        canvas_current.addEventListener('mouseup', this.mouseupListener);
        canvas_current.addEventListener('touchstart', this.mouseDownListener);
        canvas_current.addEventListener('touchmove', this.mouseMoveListener);
        canvas_current.addEventListener('touchend', this.mouseupListener);
    }
    
    clear_canvas(canvas, x=0, y=0, width=canvas_current.width, height=canvas_current.height) {
        if (canvas === "current"){
            ctx_current.clearRect(x, y, width, height);
        }
        else if (canvas === "stay"){
            ctx_stay.clearRect(x, y, width, height);
            console.log("clear stay");
        }
        else if (canvas === "bg"){
            ctx_bg.clearRect(x, y, width, height);
            console.log("clear bg");
        }
        else {
            ctx_current.clearRect(x, y, width, height);
            ctx_stay.clearRect(x, y, width, height);
            ctx_bg.clearRect(x, y, width, height);
            console.log("clear all");
        }
    }

    addScore(score){
        this.score += score;
        ctx_bg.clearRect(canvas_bg.width - 100, 5, 100, 50);
        ctx_bg.fillStyle = GREEN;
        ctx_bg.font = SCORE_FONT_STYLE;
        ctx_bg.fillText(this.score, canvas_bg.width - SCORE_SIZE*2, 55);
        this.clear_canvas("current");
    }

    collide_with_topic_point(startPosition){
        for (let i = 0; i < this.topic_points.length; i++) {
            let point = this.topic_points[i]
            if (this.collide_with_x(startPosition, point) && this.collide_with_y(startPosition, point)){
                return point;
            }
        }
        return 0;
    }

    collide_with_ans_point(startPosition){
        for (let i = 0; i < this.ans_points.length; i++) {
            let point = this.ans_points[i]
            if (!this.correct.includes(point.ans) && this.collide_with_x(startPosition, point) && this.collide_with_y(startPosition, point)){
                return point;
            }
        }
        return 0;
    }

    collide_with_x(mos_pos, point){
        if (mos_pos.x >= point.x - point.radius && mos_pos.x <= point.x + point.radius){
            return true;
        }
        return false;
    }
    
    collide_with_y(mos_pos, point){
        if (mos_pos.y >= point.y - point.radius && mos_pos.y <= point.y + point.radius){
            return true;
        }
        return false;
    }

    create_gesture(num, y){
        let path = IMAGE_PATH + "gesture_" + num + ".png";
        let width = 90;
        let x = this.level <= 3 ? canvas_bg.width - 160 : canvas_bg.width/2-width/2;
        let distance_point = num >= 6 ? 20 : (this.level !== 3 && this.level !== 6 ? 20 : 65);
        if (num>=6){
            x -= width/2;
            width *= 2;
        }
        let gesture = new Gesture(x, y, width, num, path);
        this.gestures.push(gesture);
        this.create_point(num, "手勢", gesture.x-distance_point, gesture.y+gesture.height/2, this.ans_points);
        if (this.level > 3){
            this.create_point(CHINESE[num-1], "手勢", gesture.x+gesture.width+distance_point, gesture.y+gesture.height/2, this.topic_points);
        }
    }
    create_topic(num, y){
        let x = 50;
        if (num>=10){
            x /= 2;
        }
        y += 40;
        let number = new Number(num, x, y, BLACK, 90, true);
        this.numbers.push(number);
        this.create_point(num, "數字", number.x+number.width*number.size, number.y-number.width/3, this.topic_points);
    }
    createChinese(chi, y){
        let x = canvas_bg.width - 130;
        y += 40;
        let chi_number = new Number(chi, x, y, BLACK, 70, true);
        this.chinese.push(chi_number);
        this.create_point(chi, "國字", chi_number.x-20, chi_number.y-chi_number.width/3, this.ans_points);
    }
    create_ans(ans, x, y, width){
        if (ans>=10){
            x -= width/2;
        }
        let number = new Number(ans, x, y, DARKGREY, width, true);
        number.draw();
    }
    create_point(ans, id, x, y, group){
        let point = new Point(ans, id, x, y);
        group.push(point);
    }
    create_live(x, y, group){
        let live = new Npc(x, y, false);
        group.push(live);
    }
}

function set_off_fireworks(){
    let firework_sound = document.getElementById('firework');
    firework_sound.currentTime = 1.5;
    firework_sound.play();
    fireworkContainer.style.display = 'block';
    showFirework();
    setTimeout(()=>{firework_sound.pause()}, 4000);
    let count = 0;
    while (count < 3000){
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
        fireworksElement.style.left = Math.floor(Math.random() * (CANVAS_WIDTH-width)) + 'px';
        fireworksElement.style.top = Math.floor(Math.random() * (CANVAS_HEIGHT-width*1.2)) + 'px';
        fireworkContainer.appendChild(fireworksElement);
    }
    setTimeout(removeFirework, 1194);
}  

function removeFirework() {
    for (let i = 0; i < 5; i++) {
        fireworkContainer.removeChild(fireworkContainer.children[0]);
	}
  }
  
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

function getIntArray(len, start) {
    return Array.from({length: len}, (_, i) => i+start);
  }

function getRandomUniqueArrayElements(arr, length) {
    const result = [];
    const inputLength = arr.length;
    const selectedIndexes = new Set();
    while (selectedIndexes.size < length) {
        const randomIndex = Math.floor(Math.random() * inputLength);
        if (!selectedIndexes.has(randomIndex)) {
            selectedIndexes.add(randomIndex);
            result.push(arr[randomIndex]);
    }
    }
    return result;
}
  
function shuffle(array){
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  
function revertElementBorder(element, color, time){
    element.target.style.border = `3px solid ${color}`;
        setTimeout(function() {
            element.target.style.border = 'initial';
          }, time);
}