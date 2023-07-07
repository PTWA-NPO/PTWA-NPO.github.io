NPC_PATH = "./asset/image/npc.png";
LIVES_PATH = "../../../../assets/images/game_images/lives.svg";


class Npc {
    constructor(x=10, y=10, is_npc=true){
        this.image = new Image();
        this.image.src = NPC_PATH;
        if (!is_npc){
            this.image.src = LIVES_PATH;
        }
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.width = 50;
        this.height = 58;
    }
    update(){

    }
    draw(){
        ctx_bg.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}
