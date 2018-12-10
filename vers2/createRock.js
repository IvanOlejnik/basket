function createRock(arr, rock){
    rock = createRockSprite(arr.length);
    rock.map(anchorCentr);//arrAdd
    //rock = rockPosition(rock,arr);
    
    return rock;
}

function createRockSprite(col){
    var arr = [];
    for(i=0; i<col; i++){
        arr[i] = new PIXI.extras.TilingSprite(
            PIXI.loader.resources["rock"].texture, 64, 64
        );
    }
    
    return arr;
}

function rockPosition(rock, arr){
    for(i=0; i<rock.length; i++){
        if(arr[i]){
            rock[i].position = {
               x: arr[i][0],
               y: arr[i][1] == false ? (bottom - rock[i].height / 2) : arr[i][1]
            } 
        } else {
            rock[i].position = {
               x: -100,
               y: -100
            } 
        }  
    }
    
    return rock;
}