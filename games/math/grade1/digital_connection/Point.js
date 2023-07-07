class Point {
    constructor(ans, id, x, y){
        this.x = x;
        this.y = y;
        this.id = id;
        this.ans = ans;
        this.radius = 10;
    }
    update(){

    }
    draw(){   
        ctx_bg.beginPath();
        ctx_bg.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx_bg.fill();
        ctx_bg.closePath();
    }
}