var score = 0;
var scoreText;
var line;
var config = {
    type: Phaser.AUTO
    , width: 800
    , height: 600
    , physics: {
        default: 'arcade'
        , arcade: {
            gravity: { y: 300 }
            , debug: false
        }
    },
    scene: {
        preload: preload
        , create: create
        , update: update
    }
};

var game = new Phaser.Game(config);

function preload(){
    this.load.spritesheet('dude','asset/image/bee.png'
        , { frameWidth: 470, frameHeight: 375 }
    );
    this.load.spritesheet('yellow', 'asset/image/yellowshot.png'
        , { frameWidth:42, frameHeight: 64 }
    );
}

function create(){
    player = this.add.sprite(80, 120, 'dude');
    player.setScale(0.2, 0.2);
    yellows = this.add.group({
        key: 'yellow',
        repeat: 4,
        setXY: { x: 75, y: 100, stepY: 70 }
    });
    
    this.anims.create({
        key: 'npc'
        , frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 })
        , frameRate: 10
    });
    this.anims.create({
        key: 'yellow'
        , frames: this.anims.generateFrameNumbers('yellow', { start: 0, end: 7 })
        , frameRate: 10
        , repeat: 1
    });

    line = this.add.graphics();
    line.lineStyle(4, 0xffffff, 1);
    line.moveTo(0, 0);
    line.lineTo(100, 100);
}

function update(){
    player.anims.play('npc', true);
    yellows.children.iterate(function (child) {
        child.anims.play('yellow', true);
    });
}