class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.3;
        this.maxSpeed=3;
        this.friction=0.05; //احتكاك
        this.angle=0;

        this.controls= new Controls();
    }
    update(){
       this.#move();
    
    }
    #move(){
          // If the forward control is active, increase speed by the acceleration value
          if(this.controls.forward){
            this.speed+=this.acceleration;
             // this.y-=2;
        }
         // If the reverse control is active, decrease speed by the acceleration value
        if(this.controls.reverse){
            this.speed-=this.acceleration;
            // this.y+=2;
        }
        // Cap the speed to the maximum speed
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        // Cap the reverse speed to half of the maximum speed
        if(this.speed< -this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }
        // Apply friction to slow down the car when moving forward
        if(this.speed>0){
            this.speed-=this.friction;
        }
        // Apply friction to slow down the car when moving backward
        if(this.speed<0){
            this.speed+=this.friction;
        }
        // If the speed is very low, set it to 0 to stop the car
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        
        
        if(this.speed!=0){
            const flip=this.speed>0?1:-1; //the value of flip is 1 or -1 depending on the speed
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        // Update the car's y position based on the current speed
        this.x-=Math.sin(this.angle)*this.speed; //Math.sin(this.angle) gives the proportion of the speed in the horizontal direction.
        this.y-=Math.cos(this.angle)*this.speed; // Math.cos(this.angle) gives the proportion of the speed in the vertical direction.
        
       
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        
        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore();
    }
}