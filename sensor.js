class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5;
        this.rayLength=100;
        this.raySpread=Math.PI/2;

        this.rays=[];

    }
    update(){
       this.#castRays();
        
    }
    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
             // Calculate the angle for each ray using linear interpolation
            const rayAngle = this.car.angle + // this added so that ray moves with the car
            lerp(
                this.raySpread/2,  // Start angle (right-most ray)
                -this.raySpread/2,  // Start angle (left-most ray)
                this.rayCount==1?0.5:i/(this.rayCount-1) // Interpolation factor (evenly distribute rays)
            ) ;
            const start={x:this.car.x, y:this.car.y};
            const end ={
                x:this.car.x-Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start,end]);
        }
    }
    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.stroke();

        }
    }
}