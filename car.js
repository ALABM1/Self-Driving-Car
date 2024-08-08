class Car{
    constructor(x,y,width,height,controlType, maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.3;
        this.maxSpeed=maxSpeed;
        this.friction=0.05; //احتكاك
        this.angle=0;
        this.damage=false;
        if(controlType != "DUMMY"){
            this.sensor= new Sensor(this);
        }
       
        this.controls= new Controls(controlType);
    }
    update(roadBorders,traffic){
     
        if(!this.damage){ // if damage is false (the car did not hit the border)
            this.#move();
            this.polygon=this.#createPolygon();
            this.damage=this.#assesDamage(roadBorders,traffic); // check if the car did hit the border or not (if it did then the car stop)
           }
        if(this.sensor){
           this.sensor.update(roadBorders,traffic);
        }
      
    }
    //check if the car's polygon intersects with any of the road borders
    #assesDamage(roadBorders,traffic){
        // Loop through each road border
        for(let i=0;i<roadBorders.length;i++){
            //check if the car's polygon interrsects with the current road border
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true; //indicating  damage
            }
        }
         // Loop through each traffic cars
         for(let i=0;i<traffic.length;i++){
            //check if the car's polygon interrsects with the cars of traffic
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true; //indicating  that the main car hit the car of traffic
            }
        }
        return false; //indicating no damage
        
    }
    #createPolygon(){
        const points=[]; // empty array to store the points of the polygon
        const rad =Math.hypot(this.width,this.height)/2; // Calculate the radius of the bounding circle for the car
        const alpha=Math.atan2(this.width,this.height);  // Calculate the angle for the corners of the car relative to its center
        // Calculate the four corners of the car's polygon representation
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad 
        })
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad 
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad 
        })
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad 
        })
        
        return points;
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
                this.angle+=0.02*flip;
            }
            if(this.controls.right){
                this.angle-=0.02*flip;
            }
        }

        // Update the car's y position based on the current speed
        this.x-=Math.sin(this.angle)*this.speed; //Math.sin(this.angle) gives the proportion of the speed in the horizontal direction.
        this.y-=Math.cos(this.angle)*this.speed; // Math.cos(this.angle) gives the proportion of the speed in the vertical direction.
        
       
    }
    draw(ctx){
        
        ctx.save();
        if(this.damage){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle="black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y); // Move to the first point of the polygon
        for(let i=1; i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);  // Draw lines to each subsequent point of the polygon
        }
        ctx.fill(); // Fill the polygon to render the car
        // ctx.restore();
        if(this.sensor){ // if there is a sensor
            this.sensor.draw(ctx);
        }
    }
}