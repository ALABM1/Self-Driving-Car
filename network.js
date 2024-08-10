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

}