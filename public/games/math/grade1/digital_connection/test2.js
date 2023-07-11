// import Phaser from "Phaser";
const IMAGE_PATH = "./asset/image/";
let BLACK = "#000000";
let WHITE = "#ffffff";
let BLUE = "#48807d";
let GREEN = "#008800";
let RED = "#ff0000";
let WIDTH = 900;
let HEIGHT = 600;

let score = 0;
let scoreText;
let gestures = shuffle([0, 1, 2, 4, 5]);
let numbers = shuffle([1, 2, 3, 4, 5]);
let config = {
    type: Phaser.AUTO
    , width: WIDTH
    , height: HEIGHT
    , physics: {
        default: 'arcade'
        , arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload
        , create: create
        , update: update
    }
};

let game = new Phaser.Game(config);

function preload(){
    this.load.spritesheet('red', IMAGE_PATH + 'redshot.png'
        , { frameWidth: 42, frameHeight: 64 }
    );
    this.load.spritesheet('blue', IMAGE_PATH + 'blueshot.png'
        , { frameWidth: 42, frameHeight: 64 }
    );
    this.load.spritesheet('violet', IMAGE_PATH + 'violetshot.png'
        , { frameWidth: 42, frameHeight: 64 }
    );
    this.load.spritesheet('yellow', IMAGE_PATH + 'yellowshot.png'
        , { frameWidth: 42, frameHeight: 64 }
    );
    this.load.spritesheet('npc', IMAGE_PATH + 'bee.png'
        , { frameWidth: 470, frameHeight: 375 }
    );
    this.load.spritesheet('gesture', IMAGE_PATH + 'gestures.png'
        , { frameWidth: 642, frameHeight: 724 }
    );
}

function create(){
    this.cameras.main.setBackgroundColor(WHITE);
    // 設定相機邊框的顏色和寬度
    this.cameras.main.borderColor = BLUE; // 設定為黑色
    this.cameras.main.borderWidth = 10; // 設定邊框寬度為 10 像素
    this.cameras.main.setPosition(10, 10); // 將相機位置向右下方移動 10 像素
    this.cameras.main.setSize(WIDTH-20, HEIGHT-20); // 將相機大小設定為 880x580，忽略邊框的寬度
    scoreText = this.add.text(WIDTH-100, 20, '0', {font: '60px Courier', fill: RED, fontWeight: 'bold'});
    
    npc = this.add.sprite(60, 50, 'npc');
    npc.setScale(0.2, 0.2);

    this.add.text(npc.x+npc.displayWidth/2 + 10, npc.getCenter().y, '將數字連上正確的手勢吧！', {font: '35px Courier', fill: BLUE});
    yellowGroup = this.add.group({
        key: 'yellow'
        , repeat: getRandomNumber(0, 2)
        , setXY: { x: 200, y:200
            , stepX: getRandomNumber(70, 70*3, 30)
            , stepY: getRandomNumber(70, 70*3, 30)
        }
    });

    let numberGroup = this.add.group();
    for (let i = 0; i <= 5; i++) {
        let number = this.add.text(100, 130 - 30 + i * 90, numbers[i], {font: '60px Courier', fill: BLACK, fontWeight: 'bold'});
        numberGroup.add(number);
      }
    numberChildren = numberGroup.getChildren();
    let gestureGroup = this.add.group({
        key: 'gesture',
        repeat: 4,
        setXY: { x: 700, y: 130, stepY: 90 }
    });
    let gesturesChildren = gestureGroup.getChildren();
    for (let i=0; i < gesturesChildren.length; i++){
        gesturesChildren[i].setFrame(gestures[i]);
        gesturesChildren[i].setScale(0.1, 0.1);
    }

    let numberDotGroup = this.add.group();
    let gestureDotGroup = this.add.group();
    for (let i = 0; i < 5; i++) {
        let numberDot = this.add.graphics(0, 0);
        numberDot.fillStyle(BLACK);
        let numberChildBound = numberChildren[i].getBounds()
        numberDot.fillCircle(
            numberChildBound.centerX + 50
            , numberChildBound.centerY
            , 10);
        numberDotGroup.add(numberDot);
        let gestureDot = this.add.graphics(0, 0);
        gestureDot.fillStyle(BLACK);
        gestureDot.fillCircle(
            gesturesChildren[i].x - 50
            , gesturesChildren[i].y, 10);
        gestureDotGroup.add(gestureDot);
    }

    let graphics = this.add.graphics();
    graphics.lineStyle(4, BLACK, 1);
    let isDrawing = false;

    gestureGroup.getChildren().forEach(function(child) {
    child.setInteractive({ hitArea: child.getBounds() });
    });
        
    this.input.on('pointerdown', (pointer, gameObject) => {
        if (gameObject && gameObject.parentContainer === gestureGroup) {
            // 組中的物件被點擊
            console.log('Clicked on dot', dot);
            graphics.beginPath();
            graphics.moveTo(pointer.x, pointer.y);
            isDrawing = true;
        }
    });
      
    this.input.on('pointermove', function (pointer) {
        if (!isDrawing) {return;}
        graphics.lineTo(pointer.x, pointer.y);
        graphics.strokePath();
    });

    this.input.on('pointerup', function (pointer) {
        isDrawing = false;
    });

    this.anims.create({
        key: 'npc'
        , frames: this.anims.generateFrameNumbers('npc', { start: 0, end: 5 })
        , frameRate: 10
        , repeat: -1
    });

    this.anims.create({
        key: 'red'
        , frames: this.anims.generateFrameNumbers('red', { start: 0, end: 7 })
        , frameRate: 10
        , repeat: getIntArray(3, 1)
    });
    this.anims.create({
        key: 'blue'
        , frames: this.anims.generateFrameNumbers('blue', { start: 0, end: 7 })
        , frameRate: 10
        , repeat: getIntArray(3, 1)
    });
    this.anims.create({
        key: 'violet'
        , frames: this.anims.generateFrameNumbers('violet', { start: 0, end: 7 })
        , frameRate: 10
        , repeat: getIntArray(3, 1)
    });
    this.anims.create({
        key: 'yellow'
        , frames: this.anims.generateFrameNumbers('yellow', { start: 0, end: 7 })
        , frameRate: 10
        , repeat: getIntArray(3, 1)
    });
}

function update(){
    npc.anims.play('npc', true);

}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

function getIntArray(len, start) {
return Array.from({length: len}, (_, i) => i+start);
}

function getRandomNumber(start, end, index = 0) {
    // 若 index 為 0，則直接回傳 start 與 end 之間的隨機整數
    if (index === 0) {
      return Math.floor(Math.random() * (end - start + 1)) + start;
    }
    
    // 計算可選擇的數字總數
    const range = Math.floor((end - start) / index) + 1;
    // 選擇一個數字
    const randomIndex = Math.floor(Math.random() * range);
    // 回傳選擇的數字
    return start + randomIndex * index;
  }
  
function shuffle(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  