
//The lerp function stands for "linear interpolation." 
//It calculates a value that is a certain percentage between two numbers, A and B. 
//The percentage is determined by the parameter t, which typically ranges from 0 to 1
//A: The start value.
//B: The end value.
//t: The interpolation factor (percentage). This should be between 0 and 1.
function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}
//taking of the segments that makes the first polygon1 and comparing them to every segment of the second polygon2
// Function to check if two polygons intersect
 function polysIntersect(poly1, poly2){
    for(let i=0; i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            // Get the intersection point between the current edge of the first polygon and the current edge of the second polygon
            const touch=getIntersection(         // here we compare 2 lines (carhba 3andha 4 lines béch nthabit kol 5at est-ce-que ya3mil intersection m3a left border walla right border)
                poly1[i],                       // Start point of the current edge of the first polygon
                poly1[(i + 1) % poly1.length], // End point of the current edge of the first polygon (using modulo to wrap around to the first vertex)
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if (touch) return true; // if there is a touch point it returns true;
        }
    }
    return false; //indicating the polygons do not intersect
 }
 function getRGBA(value){

    const alpha=Math.abs(value);
    const R=value<0?0 : 255; // if value>0 then it's Red
    const G=R;
    const B=value<0?255: 0; // if value <0 then it's Blue
    return "rgba("+R+","+G+","+B+","+alpha+")"; //Set the color of the line to orange
 }

 function getRandomColor(){
    const hue=290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}