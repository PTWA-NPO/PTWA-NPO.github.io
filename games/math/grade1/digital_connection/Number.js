class Number {
    constructor(text, x, y, color, width=100, is_bold=false){
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = text>=10 ? 1.5 : 1;
        this.color = color;
        this.width = width
        this.style = width + "px Courier";
        this.font = is_bold ? "bold "+ this.style : this.style;
    }
    update(){

    }
    draw(){ 
        ctx_bg.font = this.font;
        ctx_bg.fillStyle = this.color;
        ctx_bg.fillText(this.text, this.x, this.y);      
    }
}