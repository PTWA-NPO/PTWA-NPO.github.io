window.addEventListener('load', function(){
     /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;

    class InputHandler {
        constructor(game){
            this.game = game;
            this.canvasPosition = canvas.getBoundingClientRect();
            this.mousePosition = {x:20, y:20}
            canvas.addEventListener("mousemove", function(event){
                console.log(e)
                this.mousePosition.x = event.x - canvasPosition.left;
                this.mousePosition.y = event.y -canvasPosition.top;
            });
        }
    }

    // const canvasPosition = canvas.getBoundingClientRect();
    // const mousePosition = {
    //     x: 20,
    //     y: 80,
    // }
    // canvas.addEventListener("mousemove", function(event){
    //     console.log(event)
    //     mousePosition.x = event.x - canvasPosition.left;
    //     mousePosition.y = event.y - canvasPosition.top;        
    // });

    class Player {
        constructor(game){
            this.game = game;
            this.image = new Image();
            this.image.src = './asset/player.png';
            this.width = 50;
            this.height = 50;
            this.x = 20;
            this.y = 80;
            this.speedy = 0;
        }
        update(){       
            this.x = mousePosition.x;
            this.y = mousePosition.y;
            if (this.x + 50 > canvas.width)
                this.x = dx;
            if (this.y + this.height > canvas.height)
                this.y = dy;
         
        }
        draw(context){            
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

  

    // class Enemy{

    // }

    // class UI {


    // }

    // class Background {

    // }

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
        }
        update(){
            this.player.update();
            
        }
        draw(context){
            this.player.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    function animate(){
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
}); 