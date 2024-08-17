const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx= carCanvas.getContext("2d");
const networkCtx= networkCanvas.getContext("2d");
const road= new Road(carCanvas.width/2,carCanvas.width*0.9); // Create a new Road object centered on the canvas and occupying 90% of the canvas width

const N =100;
const cars= generateCars(N);

const car = new Car (road.getLaneCenter(1),100, 30,50,"AI"); // Create a new Car object, placing it in the center of the second lane
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2) // create a dummy car for traffic with maxSpeed=2
];
animate(); // Start the animation loop

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}
function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic); // Update the car's position and state
    }
    const bestCar= cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    carCanvas.height=window.innerHeight; // Set the canvas height to the viewport height.
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7); // Translate the canvas vertically so that the car appears at a fixed position on the screen
                                               // This gives the effect of the car moving while the road scrolls by
    //the car's y position appears at a fixed point on the screen, specifically 70% down from the top of the canvas.
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2; // degree of transperency
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true); 



    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;  //(-time) so that the animation goes forward not backward
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate); // Request the next frame to create an animation loop.

}