class Car{
    constructor(x,y,width,height,controlType, maxSpeed=4,color="blue"){
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

        this.useBrain=controlType=="AI";

        if(controlType != "DUMMY"){
            this.sensor= new Sensor(this); // Initialize the sensor for detecting road borders and obstacles
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount,6,4] // Initialize the neural network with the structure: rayCount inputs, 6 hidden neurons, and 4 output neurons
                // we have 5 Ray so we have in the first layer 5 inputs
            )
        }
       
        this.controls= new Controls(controlType);
        this.img=new Image();
        this.img.src= "car.png" 

        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;

        const maskCtx=this.mask.getContext("2d");
        this.img.onload=()=>{
            maskCtx.fillStyle=color;
            maskCtx.rect(0,0,this.width,this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation="destination-atop";
            maskCtx.drawImage(this.img,0,0,this.width,this.height);
        }
    }
    update(roadBorders,traffic){
     
        if(!this.damage){ // if damage is false (the car did not hit the border)
            this.#move();
            this.polygon=this.#createPolygon(); // Update the car's polygon (shape)
            this.damage=this.#assesDamage(roadBorders,traffic); // check if the car did hit the border or not (if it did then the car stop)
           }
        if(this.sensor){
           this.sensor.update(roadBorders,traffic); // Update the sensor readings based on the road borders and traffic
           const offsets=this.sensor.readings.map(
            s=>s==null?0:1-s.offset // Convert sensor readings to offsets for the neural network (0 if no reading, or the inverse of the offset)
            // here is an entire explanation about the usage of offset :
            //In the line s==null?0:1-s.offset, the code checks if there is a valid sensor reading (s):
                //If there is no intersection (s == null), the offset is set to 0, indicating no detected obstacle in that direction.
                //If there is an intersection, the offset is transformed by calculating 1 - s.offset, where s.offset is subtracted from 1 to invert the value. This inversion is done because a higher value should indicate proximity to an obstacle (e.g., 1 - 0.1 = 0.9 for a nearby obstacle).
           )
           const outputs=NeuralNetwork.feedForward(offsets,this.brain); // Pass the offsets through the neural network to get the outputs
        //    console.log(outputs);
           if(this.useBrain){
            this.controls.forward=outputs[0]; // Use the first output neuron to control forward movement
            this.controls.reverse=outputs[3];
            this.controls.left=outputs[1];
            this.controls.right=outputs[2];

        }
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
    draw(ctx,drawSensor=false){
        if(this.sensor && drawSensor==true){ // if there is a sensor and drawSensor is true 
            this.sensor.draw(ctx);
        }
        
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        if(!this.damage){
            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.globalCompositeOperation="multiply";

        }
        
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);

        ctx.restore();
       
    }
}