window.addEventListener('load', function(){  
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    CANVAS_WIDTH = canvas.width = 800;
    CANVAS_HEIGHT = canvas.height = 400;
    const numberOfEnemies = 5;
    const enemiesArray = [];

    const background = new Image();
    background.src = "./asset/background2.png";
    
   

    let gameFrame = 0;
    // const gameStart = false;
    // function gameStart(){
    //     gameInterval = setInterval(gameRoutine, 1000)
    // }
    

    class Player{
        constructor(){
            this.image = new Image();
            this.image.src = './asset/player.png';
            this.x = 0;
            this.y = 0;
            this.width = 50;
            this.height = 50;
        }
        // update(){
        //     const dx = this.x - mouse.x;
        //     const dy = this.y - mouse.y;
        //     if (mouse.x + this.width >= canvas.width){
        //         this.x == dx;
        //     }
        //     if (mouse.y != this.y){
        //         this.y -= dy/30;
        //     }
        // }
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

    class Fish1 {
        constructor(){
            this.image = new Image();
            this.image.src = './asset/testframe.png';
            this.speedx = Math.random() *  -4;
            this.speedy = 0;
            this.spriteWidth = 840;
            this.spriteHeight = 631;
            this.width = this.spriteWidth / 8;
            this.height = this.spriteHeight / 8;
            this.x = (canvas.width + this.width);
            this.y = Math.random() * (canvas.height - this.height);
            this.frame = 0;
            this.angle = 0;        
        }
        update(){
            this.x += this.speedx;
            this.y += Math.sin(this.angle);
            this.angle += 0.1;
            //this.y += this.speedy;
            if (this.x + this.width < 0) this.x = canvas.width;
            if (gameFrame % 8 === 0){
                this.frame > 4 ? this.frame = 0 : this.frame++;
            }
            
        }
        draw(){
            ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, 
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
        }
    };

    for (let i = 0; i < numberOfEnemies; i++){
        enemiesArray.push(new Fish1());
    };

    function animate(){
        //ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
       
        ctx.drawImage(background, 0, 0);  
        player.draw();
        enemiesArray.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });
        gameFrame ++;
        requestAnimationFrame(animate);
    };
    animate();  
});
 
 
 