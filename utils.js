
//The lerp function stands for "linear interpolation." 
//It calculates a value that is a certain percentage between two numbers, A and B. 
//The percentage is determined by the parameter t, which typically ranges from 0 to 1
//A: The start value.
//B: The end value.
//t: The interpolation factor (percentage). This should be between 0 and 1.
function lerp(A,B,t){
    return A+(B-A)*t;
}