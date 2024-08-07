class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5;
        this.rayLength=150;
        this.raySpread=Math.PI/2; // Spread of the rays in radians 

        this.rays=[]; // Array to store the rays
        this.readings=[]; // some values for each ray telling if there is a border

    }
    update(roadBorders){
       this.#castRays(); // call the private method to cast rays
       this.readings=[];
       for(let i=0; i<this.rays.length;i++){
            this.readings.push(
                this.#getReading(this.rays[i],roadBorders)
            );
       }
    }
    // function return the intersections point or null . The format returned is an object containing x,y,offset
    #getReading(ray,roadBorders){
        let touches=[]; //touches: An array of intersection points where each point is an object containing properties  x, y, and offset.

        for(let i=0;i<roadBorders.length;i++){
            const touch= getIntersection(
                ray[0], // start point of the ray
                ray[1], // end point of the ray
                roadBorders[i][0],
                roadBorders[i][1],
            );
            if(touch){
                touches.push(touch);
            }
        }
        if(touches.length==0){
            return null;
        }else{ // it will return x,y and offset (which is the distance between the ray and the border)
            const offsets=touches.map(e=>e.offset); //extracts the offset values from the touches array and creates a new array containing these distances.
            const minOffset=Math.min(...offsets); // Find the smallest offset value in the offsets array (The spread operator (...) is used to pass all elements of the offsets array as individual arguments to the Math.min function.)
            return touches.find(e=>e.offset==minOffset); // Find and return the touch point that has the smallest offset
        }
         
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
            let end = this.rays[i][1]; //The end point of the i-th ray
            if(this.readings[i]){ // if a reading (intersection point ) exists for this ray ,
                end=this.readings[i]; // set the end point to that reading
            }
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
                end.x,
                end.y
            );
            ctx.stroke(); // Render the ray

            
            ctx.beginPath(); // Begin a new path for the ray
            ctx.lineWidth=2; // Set the line width for the ray
            ctx.strokeStyle="black";  // Set the color of the ray

             // Move to the start point of the ray
            ctx.moveTo( 
                this.rays[i][1].x, // x-coordinate of the start point
                this.rays[i][1].y  // y-coordinate of the start point
            );
            // Draw a line to the end point of the ray
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke(); // Render the ray
            

        }
    }
}