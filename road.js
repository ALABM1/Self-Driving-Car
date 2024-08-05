class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;  // Left boundary of the road
        this.right=x+width/2; // Right boundary of the road


        const infinity=1000000; // Define an extremely large number to simulate infinity
        this.top = -infinity;
        this.bottom= infinity;
    }
    // The getLaneCenter method calculates and returns the x-coordinate of the center of a specified lane on the road.
    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount; // Calculate the width of a single lane
        // Math.min(laneIndex, this.laneCount - 1) ensures that if the laneIndex is larger than the number of lanes, it will be capped to the last lane index
        return this.left+ Math.min(laneIndex, this.laneCount-1)*laneWidth+ laneWidth/2;
    }
    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";  // Set the line color to white
        
        for(let i=0;i<=this.laneCount;i++){ 
            // Calculate the x position for each lane line using lerp
            const x=lerp( this.left, this.right, i/this.laneCount);   //calculates the x position for the lane line by interpolating between the left and right boundaries based on the lane index (i) and the total number of lanes (this.laneCount).
            // Draw the lane line
            if(i>0 && i<this.laneCount){
                ctx.setLineDash([20,20]);
             }
            else {
                ctx.setLineDash([])
            }
            ctx.beginPath(); // Begin a new path for the left boundary line
            ctx.moveTo(x,this.top);  // Move to the start of the left boundary line (top)
            ctx.lineTo(x,this.bottom);// Draw a line to the end of the left boundary line (bottom)
            ctx.stroke();   // Render the left boundary line
        }
    }
}
