class Gesture {
    constructor(x, y, width=100, num, path){
        this.image = new Image();
        this.image.src = path;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 90;
        this.used_frame = 0;
        this.num = num;
        this.chi = CHINESE[num-1];
    }
    update(){

    }
    draw(){       
        ctx_bg.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}