const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;
const background = new Image();
background.src = "./asset/bg001.png"

let numberOfFishes = 3;

let score = 0;
let gameFrame = 0;
ctx.font = "bold 35px Courier";
ctx.fillStyle = 'black';

function startScreen(){
    ctx.fillStyle = "#48807d";
    ctx.drawImage(background, 0,0);
    ctx.fillText('準備好了嗎?', 215, canvas.height/2);
    requestAnimationFrame(startScreen);
}
startScreen();

const startBtn = document.getElementById('startBtn')
startBtn.addEventListener('click', (e) => {
    console.log(e);
    animate();
})


class Fish {
    constructor(){
        this.image = new Image();
        this.image.src = './asset/bee.png';
        this.spriteWidth = 470;
        this.spriteHeight = 375;
        this.width = this.spriteHeight/5;
        this.height = this.spriteHeight/5;
        // wait for fixed
        this.x = Math.floor(Math.random() * 20  - this.width) ;
        this.y = Math.floor(Math.random() * 250 + this.height);
        // this.x = x;
        // this.y = y;
        this.frame = 0;
        this.speedx = Math.floor(Math.random() * 5 + 2) ;
    }
    update(){
        this.x += this.speedx;
        if (this.x > canvas.width)
            this.speedx = 0;
        if (gameFrame % 20 === 0){
            this.frame > 3 ? this.frame = 0 : this.frame++;
        }      
    }
    draw(){       
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, 
            this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
        }
}

let fishArray = [];
for (let i = 0; i < numberOfFishes; i++){
    fishArray.push(new Fish());
    console.log(fishArray.length);
}

class Npc {
    constructor(){
        this.image = new Image();
        this.image.src = './asset/npc.png'
        this.x = 10;
        this.y = 10;
        this.frame = 0;
        this.width = 50;
        this.height = 58;
    }
    update(){

    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

const npc = new Npc();

// function getRandom(min, max){
//     return  Math.floor(Math.random() * max-min) +1;
// }


// class HandleGameTime {
//     constructor(){
//         this.gameTime = 0;
//         this.limitTime = 3000;
//     }
//     update(){
//         this.gameTime
//     }
// }

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, -1, 0);
    ctx.fillText('總共有幾隻蜜蜂呢?', 65, 52);
    npc.draw();
    fishArray.forEach(fish => {
        fish.update();
        fish.draw();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}

function level1 (){
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', function(){
        checkAnswer();
        fishArray.splice(0);
        numberOfFishes = 3;    
        for (let i = 0; i < numberOfFishes; i++){
            fishArray.push(new Fish());
            console.log(fishArray.length);
        }
        console.log(fishArray);
        fishArray.forEach(fish => {
            fish.update();
            fish.draw();
        });
    });
}
level1();

function checkAnswer(){
    document.querySelectorAll('button').forEach(e => {
        let id = e.getAttribute('id');
        e.addEventListener('click', function() {
        console.log( id + ' was clicked!');
        if (id === 'Btn3'){
            document.getElementById('correct').play();
            alert('太棒了!!');
            }
            if (id === "Btn1" || id === "Btn2"|| id === "Btn4"|| id === "Btn5"
            || id === "Btn6"|| id === "Btn7"|| id === "Btn8"|| id === "Btn9"){
                document.getElementById('wrong').play();
            }
        });
    });
}


function level2 (){
    const nextLevelBtn = document.getElementById('nextLevel');
    nextLevelBtn.addEventListener('click', function(){
        fishArray.splice(0);
        numberOfFishes = 5;    
        for (let i = 0; i < numberOfFishes; i++){
            fishArray.push(new Fish());
            console.log(fishArray.length);
        }
        console.log(fishArray);
        fishArray.forEach(fish => {
            fish.update();
            fish.draw();
        
        });
   
    nextLevelBtn.removeEventListener('click', nextLevelBtn, true);
    });
    
}
level2();




