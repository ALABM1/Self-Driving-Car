class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5;
        this.rayLength=100;
        this.raySpread=Math.PI/2; // Spread of the rays in radians 

        this.rays=[]; // Array to store the rays

    }
    update(){
       this.#castRays(); // call the private method to cast rays
        
    }
    // Private method to cast rays
    #castRays(){
        this.rays=[]; // initialize an empty array to store the rays
        for(let i=0;i<this.rayCount;i++){
             // Calculate the angle for each ray using linear interpolation
            const rayAngle = this.car.angle + // this added so that ray moves with the car
            lerp(
                this.raySpread/2,  // Start angle (right-most ray)
                -this.raySpread/2,  // End angle (left-most ray)
                this.rayCount==1?0.5:i/(this.rayCount-1) // Interpolation factor (evenly distribute rays)
            ) ;
            // Define the starting point of the ray (the position of the car)
            const start={x:this.car.x, y:this.car.y};
            // Define the ending point of the ray based on its angle and length
            const end ={
                x:this.car.x-Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);
        }
    }
    //now Draw the Rays
    draw(ctx){
        //Loop throw each ray to draw it 
        for(let i=0;i<this.rayCount;i++){
            ctx.beginPath(); // Begin a new path for the ray
            ctx.lineWidth=2; // Set the line width for the ray
            ctx.strokeStyle="yellow";  // Set the color of the ray

             // Move to the start point of the ray
            ctx.moveTo( 
                this.rays[i][0].x, // x-coordinate of the start point
                this.rays[i][0].y  // y-coordinate of the start point
            );
            // Draw a line to the end point of the ray
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();
            

        }
    }
}