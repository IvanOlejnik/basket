function collision(e){
    console.log('test', e);
 
    if( hitIntersectionRectangle(marioMove, e.lett) ){ 
        if(directionX){          
            moveR=false;
            marioMove.x -=6;
        } else {   
            moveL=false;
            marioMove.x +=6;
        }
    }
    if(hitTopRectangle(marioMove, e.lett) ){
        moveD=false;
    } else {
        moveD=true;
        moveT=false;
    }
}


function moveT() {
    moveD=false;
    if(marioMove.y <= pos-jamp){
        moveT=false;
        moveD=true;
    } else {
        marioMove.y -=6;
    } 
}
function moveD() {
    if(marioMove.y >= (bottom - marioMove.height / 2)){
        moveD=false;
    } else {
        marioMove.y +=6;
    }  
}


function hendlerKeyDdown() {
    moveR = true;
    directionX = true;
}
function hendlerKeyDup() {
    if(moveD == false && moveT == false){
        pos = marioMove.y;
        moveT = true;
    }
}
function hendlerKeyAdown() {
    moveL = true;
    directionX = false;
}
function hendlerKeyAup() {
    if(moveD == false && moveT == false){
        pos = marioMove.y;
        moveT = true;
    }
}
function hendlerKeyW() {
    if(moveD == false && moveT == false){
        pos = marioMove.y;
        moveT = true;
    }
}

function nextScen(){
   scenFlag++;
   marioMove.x = 10;
   background.tilePosition.x =0;
}

function pastScen(){
    scenFlag--;
    marioMove.x = 790;
    background.tilePosition.x =0;
}

function thisScen(){
    rock = rockPosition(rock, window['arrRockXYScen' + (scenFlag+1)]);
}

