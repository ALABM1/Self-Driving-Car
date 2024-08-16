class Visualizer{
    // This method draws the entire neural network on the canvas
    static drawNetwork(ctx,network){
        const margin=50;
        const letf=margin;
        const top=margin;
        const width= ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;

        Visualizer.drawLevel(ctx,network.levels[0],
            letf,top,
            width,height
        );
    }
    //The method drawLevel is called to draw  levels (layers) of the network. Currently, it’s set up to visualize only the first level.
    static drawLevel(ctx,level,left,top,width,height){
        // Calculate the right and bottom boundaries of the drawing area
        const right= left+width;
        const bottom= top+height;

        const {inputs,outputs,weights,biases}=level;
         //The section of code you shared is responsible for drawing the connections (lines) :
        ////////////////////////////////////////////////////
        for(let i=0;i<inputs.length;i++){ //Loop throw each input neuron
            for(let j=0;j<outputs.length;j++){ //Loop throw each output neuron
                ctx.beginPath(); // start a new path for drawing
                //move the drawing cursor to the position of the input neuron (at the bottom)
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs,i,left,right), //calcultae the x-coordinate of the input neuron "i", ensuring it's evenly spaced
                    bottom // set the y-coordinate to the bottom of the layer (where inputs are drawn)
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs,j,left,right),// calculate the x-coordinate of the output neuron "j"
                    top // set y-coordinate to the top of the layer (where outputs are drawn)
                );
                ctx.lineWidth=2; //Set the width of the line to 2 pixels
                const value=weights[i][j];
                const alpha=Math.abs(value);
                const R=value<0?0 : 255; // if value>0 then it's Red
                const G=R;
                const B=value<0?255: 0; // if value <0 then it's Blue
                ctx.strokeStyle="rgba("+R+","+G+","+B+","+alpha+")"; //Set the color of the line to orange
                ctx.stroke(); // Draw the line connecting the input to the output neurons
                

            }
        }
        ////////////////////////////////////////////////////
        //now we draw the neuron (inputs and outputs layers)
        const nodeRadius=18; // Set the radius of each neuron (node) to 18 pixels
        // Loop through each input neuron in the level
        for(let i=0;i<inputs.length;i++){
            // Calculate the x position for each node, evenly spaced across the width
            const x=lerp(
                left, // The left boundary of the drawing area
                right, // The right boundary of the drawing area
                inputs.length==1?0.5 : i/(inputs.length-1) // Center if there's one input, otherwise distribute evenly
            );
            // Begin drawing the neuron (node) as a circle

            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);  // Draw a circle at (x, bottom) with the specified radius
            ctx.fillStyle="black", // Set the fill color of the neuron to white
            ctx.fill(); // Fill the circle with the white color
            
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);  // Draw a circle at (x, bottom) with the specified radius
            ctx.fillStyle="white", // Set the fill color of the neuron to white
            ctx.fill(); // Fill the circle with the white color

            
        }
        
        for(let i=0;i<level.outputs.length;i++){
            // Calculate the x position for each node, evenly spaced across the width
            const x=lerp(
                left, // The left boundary of the drawing area
                right, // The right boundary of the drawing area
                outputs.length==1?0.5 : i/(level.outputs.length-1) // Center if there's one input, otherwise distribute evenly
            );
            // Begin drawing the neuron (node) as a circle
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);  // Draw a circle at (x, bottom) with the specified radius
            ctx.fillStyle="black", // Set the fill color of the neuron to white
            ctx.fill(); // Fill the circle with the white color

            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);  // Draw a circle at (x, bottom) with the specified radius
            ctx.fillStyle="white", // Set the fill color of the neuron to white
            ctx.fill(); // Fill the circle with the white color

            //Draw the biases
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
       
    }
    static #getNodeX(nodes,index,left,right){
        return lerp(
            left,
            right,
            nodes.length==1?0.5: index/(nodes.length-1)
        );
    }
}