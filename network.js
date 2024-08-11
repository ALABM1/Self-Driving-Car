class NeuralNetwork{
    constructor(neuronCounts){ // neuronCounts is an Array (the number of neurons of each layer)
        this.levels=[]; // Array to hold the layers (levels) of the neural network
        // Loop through the neuronCounts array to create each level (layer) of the network
        for(let i=0; i<neuronCounts.length-1;i++){
            // Create a new Level instance for each layer and push it into the levels array
            this.levels.push(new Level(
                neuronCounts[i],   // number of neurons in the current layer (inputCount)
                neuronCounts[i+1] //  number of neurons in the next layer (outputCount) 
            ));;
        }
    }
   // Static method to perform a forward pass through the entire network
   static feedForward(givenInputs,network) {
    // Process the given inputs through the first layer
    let outputs=Level.feedForward(
        givenInputs,       // Input values to the network
        network.levels[0] // the first layer of the network
    );
    // Process the outputs through each layer
    for(let i=1; i<network.levels.length; i++ ){
        outputs=Level.feedForward(
            outputs,           // outputs from the previous layer
            network.levels[i] // the next layer to process
         );
    }
    return outputs;
   }
}
class Level {
    constructor(inputCount, outputCount){
        this.inputs= new Array(inputCount);
        this.outputs= new Array(outputCount);
        //The bias is added to the weighted sum of inputs before the activation function is applied.
        this.biases= new Array(outputCount);
        //Weights: In a neural network, each connection between neurons has a weight associated with it. The weight determines the strength of the connection and how much influence an input has on the output
        //2D Array: A 2D array is used here because each input neuron in the layer is connected to every output neuron, and each connection has its own weight.
        this.weights=[]; // Initialize empty array
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount); // Each input has an array of weights for each output
        }

        Level.#randomize(this);
    }
    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1; //([0,1]*2)=> [-1,1] we want to have a vlue between -1 and 1
            }
        }
        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        for(let i=0; i<level.inputs.length; i++){
            level.inputs[i]=givenInputs[i]; //the values that comes from the sensors
        }
        for(let i=0;i<level.outputs.length;i++){ //for every output i
            let sum=0;
            for(let j=0; j<level.inputs.length; j++){  // for every input j
                sum+=level.inputs[j] * level.weights[j][i] // input[j]*weight[j][i]  (j input and i output)
            }
            if(sum>level.biases[i]) {// Compare the weighted sum with the bias of this output neuron
                level.outputs[i]=1;  // If the sum is greater than the bias, output is 1 (activated)
            }else{
                level.outputs[i]=0; // Otherwise, output is 0 (not activated)
            }
        }
        return level.outputs;
    }

}