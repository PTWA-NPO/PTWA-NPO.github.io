window.addEventListener('load', function(){

    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width = 550;
    CANVAS_HEIGHT = canvas.height = 350;
    const enemiesArray = [];
    let countdown = 15; // 60 secs
    let countdownTimer;
    let gameStart = false;
    let gameMode = 'level1';

    
    const background = new Image();
    background.src = "./asset/background2.png";
    const heartImage = new Image();
    heartImage.src = "./asset/heart2.png";

    const collisionSound = new Audio();
    collisionSound.src = "./asset/plop.wav"
    const collisionSound2 = new Audio();
    collisionSound2.src = "./asset/crunch.ogg"
    const finishSound = new Audio();
    finishSound.src = "./asset/finish.wav"
    const countdownSound = new Audio();
    countdownSound.src = "./asset/countdown4.mp3"

    let score = 0;
    let gameFrame = 0;
    let remainingHearts = 0;

    function drawBackground() {
        ctx.drawImage(background, 0, 0);
    }

    function startScreen() {
        if (!gameStart) {
            drawBackground();
            ctx.fillStyle = "#003D79";
            ctx.font = "bold 30px Courier";
            ctx.fillText('準備好了嗎?', 190, canvas.height / 2);
            requestAnimationFrame(startScreen);
        }
    }
    startScreen();

    const startBtn = document.getElementById('startBtn')
    startBtn.addEventListener('click', () => {
        if (!gameStart) {
            gameStart = true; 
            let countdownBeforeStart = 3;
    
            const countdownBeforeStartInterval = setInterval(() => {
                drawBackground();
                ctx.font = "bold 60px Courier";
                ctx.fillStyle = "#003D79";
                ctx.fillText(countdownBeforeStart, canvas.width / 2 - 20, canvas.height / 2 + 20);
    
                if (countdownBeforeStart >= 1) {
                    countdownSound.play(); 
                }
    
                countdownBeforeStart--;
    
                if (countdownBeforeStart < 0) {
                    clearInterval(countdownBeforeStartInterval);
    
                    countdown = 10;
                    score = 0;
                    gameFrame = 0;
                    remainingHearts = 3;
    
                    // reset count
                    clearInterval(countdownTimer);
                    countdownTimer = setInterval(() => {
                        countdown -= 1;
                        if (countdown <= 0) {
                            clearInterval(countdownTimer);
                            gameStart = false;
                        }
                    }, 1000);
    
                    animate();
                }
            }, 1000);
        }
    });
    
    

    const level1Btn = document.getElementById('level1');
    level1Btn.addEventListener('click', () => {
        if (!gameStart) {
            gameMode = 'level1';
        }
    });

    const level2Btn = document.getElementById('level2');
    level2Btn.addEventListener('click', () => {
        if (!gameStart) {
            gameMode = 'level2';
        }
    });

    const level3Btn = document.getElementById('level3');
    level3Btn.addEventListener('click', () => {
        if (!gameStart) {
            gameMode = 'level3';
        }
    });
    
   
    class Player{
        constructor(){
            this.image = new Image();
            this.image.src = './asset/player.png';
            this.x = 0;
            this.y = 0;
            this.width = 50;
            this.height = 50;
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }

    const player = new Player();

    let canvasPosition = canvas.getBoundingClientRect();
    canvas.addEventListener("mousemove", function(event){
        player.x = event.x - canvasPosition.left;
        player.y = event.y - canvasPosition.top;
        if (player.x + 50 > canvas.width)
            player.x = canvas.width - 50 ;
        if (player.y + player.height > canvas.height)
            player.y = canvas.height - 50;
    })

    class Enemy {
        constructor(gameMode){
            this.image = new Image();
            this.image2 = new Image();
            this.image2.src = './asset/fish2.png';
            if (gameMode === 'level1') {
                this.image.src = './asset/fish1.png';
            } else if (gameMode === 'level2') {
                this.image.src = './asset/fish2.png';
            }
            this.speedx = -3
            this.speedy = 0;
            this.spriteWidth = 840;
            this.spriteHeight = 631;
            this.width = this.spriteWidth / 8;
            this.height = this.spriteHeight / 8;
            this.x = (canvas.width + this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.frame = 0;
            this.angle = 0;
            this.counted = false;        
            this.gameMode = gameMode 

            if (gameMode === 'level3') {
                this.gameMode = Math.random() < 0.5 ? 'level1' : 'level2';
            } 
        }
        update(){
            this.x += this.speedx;
            this.y += Math.sin(this.angle);
            this.angle += 0.1;
            if (this.x + this.width < 0) this.x = canvas.width;
            if (gameFrame % 8 === 0){
                this.frame > 4 ? this.frame = 0 : this.frame++;
            }
     
            const dx = player.x - this.x - 30;
            const dy = player.y - this.y -10;
            const distancce = Math.sqrt(dx * dx + dy * dy);
            if (distancce < player.width/2 + this.width/2 &&
                distancce < player.height/2.2 + this.height/2.2){
                if (!this.counted){
                    this.counted = true;
                    if (this.gameMode === 'level1') {
                        score += 1;
                        collisionSound.play();
                    }
                    if (this.gameMode === 'level2') {
                        remainingHearts -= 1;
                        collisionSound2.play()
                    }
                }
            };
        }
        draw() {
            const imageToDraw = gameMode === 'level2' ? this.image2 : this.image;
            ctx.beginPath();
            ctx.drawImage(imageToDraw, this.frame * this.spriteWidth, 0,
                this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height);
        }
    };

    function handleEnemies() {
        if (gameFrame % 100 == 0) {
            let modesToCreate = [gameMode];
            if (gameMode === 'level3') {
                modesToCreate = ['level1', 'level2'];
            }
    
            for (const mode of modesToCreate) {
                let newEnemy;
                let isOverlapping;
                let retryCount = 0;
    
                // Check overlapping
                do {
                    newEnemy = new Enemy(mode);
                    isOverlapping = false;
    
                    for (let i = 0; i < enemiesArray.length; i++) {
                        const dx = enemiesArray[i].x - newEnemy.x;
                        const dy = enemiesArray[i].y - newEnemy.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < enemiesArray[i].width + newEnemy.width) {
                            isOverlapping = true;
                            break;
                        }
                    }
    
                    retryCount++;
                } while (isOverlapping && retryCount < 10);
                if (!isOverlapping) {
                    enemiesArray.push(newEnemy);
                }
            }
        }
    
        for (let i = 0; i < enemiesArray.length; i++) {
            enemiesArray[i].update();
    
            if (enemiesArray[i].x + 50 < 0) {
                enemiesArray.splice(i, 1);
                i--; 
            }
            else if (enemiesArray[i].counted) {
                enemiesArray.splice(i, 1);
            }
            else {
                enemiesArray[i].draw();
            }
        }
        console.log(enemiesArray.length);
        if (enemiesArray.length > 5) {
            enemiesArray.splice(0);
        }
    };
    

    function drawScoreOrHearts() {
        if (gameMode === 'level1') {
            ctx.font = "30px Verdana";
            ctx.fillText('得分: ' + score, canvas.width - 150, 40);
        }
        if (gameMode === 'level2') {
            for (let i = 0; i < remainingHearts; i++) {
                ctx.drawImage(heartImage, canvas.width - 150 + i * (heartImage.width + 1), 10, heartImage.width, heartImage.height);
            }
        }
        if (gameMode === 'level3') {
            for (let i = 0; i < remainingHearts; i++) {
                ctx.drawImage(heartImage, canvas.width - 150 + i * (heartImage.width + 1), 10, heartImage.width, heartImage.height);
            }
            ctx.font = "30px Verdana";
            ctx.fillText('得分: ' + score, canvas.width - 150, 80);
        }
    };


    function gameOver() {
        finishSound.play();
        ctx.drawImage(background, 0, 0);
        if (gameMode === 'level1') {
            ctx.font = "bold 40px 微軟正黑體";
            ctx.fillStyle = "#FF0000";
            ctx.fillText("遊戲結束", 190, canvas.height / 2 - 40);
            ctx.font = "bold 40px 微軟正黑體";
            ctx.fillStyle = "#003D79";
            ctx.fillText("得分: " + score, 200,  canvas.height / 2 + 10);
        }

        if (gameMode === 'level2') {
            ctx.font = "bold 30px 微軟正黑體";
            ctx.fillStyle = "#003D79";
            ctx.fillText("剩餘秒數: " + countdown, 200, canvas.height / 2 - 40);
            ctx.fillText("剩餘愛心: " + remainingHearts, 200, canvas.height / 2 + 10);
        }
        if (gameMode === 'level3') {
            ctx.font = "bold 30px 微軟正黑體";
            ctx.fillStyle = "#003D79";
            ctx.fillText("得分: " + score, 200, canvas.height / 2 - 20);
            ctx.fillText("剩餘愛心: " + remainingHearts, 200, canvas.height / 2 + 20);
            ctx.fillText("剩餘秒數: " + countdown, 200, canvas.height / 2 + 60);
        }
    };

    function animate() {
        if (countdown > 0 && gameStart == true && remainingHearts > 0) {
            ctx.drawImage(background, 0, 0);
            player.draw();
            handleEnemies();
            drawScoreOrHearts();
            ctx.font = "bold 30px 微軟正黑體";
            ctx.fillText('剩餘時間: ' + countdown, 20, 40);
            gameFrame++;
            requestAnimationFrame(animate); 
        } else {
            gameOver(); 
        }
    };


});