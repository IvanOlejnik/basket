var renderer = PIXI.autoDetectRenderer(800, 560);
document.body.appendChild(renderer.view);
stage = new PIXI.Container();
var stage2 = new PIXI.Container();

PIXI.loader 
    .add("mario", "images/mario.png")
    .add("background", "images/bgst.jpg")
    .add("land", "images/land.jpg")
    .add("rock", "images/rock.png")
    .add("marioClip", "images/marioClip.png")
    .load(setup);
var mario, background, land, rock = [], rect;
var moveR, moveL, moveT = false, moveD=false, jamp = 150, bottom = 450;
var pos, background2, land2, run = 0, marioMove, directionX = true, scenFlag = 0;
var arrRockXY = [[300, false],[450, false],[600, 320],[660, 320]];
var arrRockXYScen2 = [[270, false],[410, 320],[470, 320],[660, false]];
var arrRockXYScen3 = [[270, false],[410, false],[470, false],[660, false]];

function setup() {
    
    mario = new PIXI.Sprite(
        PIXI.loader.resources["mario"].texture
    );
    background = new PIXI.extras.TilingSprite(
        PIXI.loader.resources["background"].texture, 1024, 1024
    );
    land = new PIXI.extras.TilingSprite(
        PIXI.loader.resources["land"].texture, 1024, 110
    ); 
    
    rect = new PIXI.Rectangle(0, 0, 40, 50);
    var textureMove = PIXI.loader.resources["marioClip"].texture;
    textureMove.frame = rect;
    marioMove = new PIXI.Sprite(textureMove);
    
    land.position = {x: 0,y: bottom}
    background.position = {x: 0,y: -200}
    marioMove.position = {x: 150,y: bottom - marioMove.height / 2}
    marioMove.scale.set(1, 1);//размеры
    marioMove.anchor.set(0.5, 0.5);//середина изображения
    
    rock = createRock(arrRockXY, rock);
    
    var style = {
        font : 'bold italic 36px Arial',
        fill : '#F7EDCA',
        stroke : '#4a1850',
        strokeThickness : 5,
        dropShadow : true,
        dropShadowColor : '#000000',
        dropShadowAngle : Math.PI / 6,
        dropShadowDistance : 6,
        wordWrap : true,
        wordWrapWidth : 440
    };

    var richText = new PIXI.Text('You win this game!! Cool!!!',style);
    richText.x = 30;
    richText.y = 180;

    stage2.addChild(richText);
    

    stage.addChild(background);
    stage.addChild(land);
    rock.map(addStage);//arrAdd
    stage.addChild(marioMove);
    
    animationLoop();
}

function runMario() {
    if(moveL || moveR || moveT || moveD){
       run++; 
       if(run == 5){
           run = 0;
           if(rect.x >=45*4) {
               rect.x = 0;
           }
           marioMove.texture.frame = rect;
           rect.x += 45; 
       }
   }
}

function animationLoop() {//главная функция
    requestAnimationFrame(animationLoop);
    
    background.tilePosition.x +=1;
    keyboardСontrol();   
    gravity();
    rock.map(obstruction);
    movements();
    runMario();
    renderer.render(stage);
    sceneSelection();

    
}

function sceneSelection(){
    if(scenFlag == 0){
        if(marioMove.x > 800){
            rock = rockPosition(rock,arrRockXYScen2);
            scenFlag++;
            marioMove.x = 10;
            background.tilePosition.x =0;
        } else {
            rock = rockPosition(rock,arrRockXY);
        }
    }
    if(scenFlag == 1){
        if(marioMove.x > 800){
            rock = rockPosition(rock,arrRockXYScen3);
            scenFlag++;
            marioMove.x = 10;
            background.tilePosition.x =0;
        } 
        if(marioMove.x < 0){
            rock = rockPosition(rock,arrRockXY);
            scenFlag--;
            marioMove.x = 790;
            background.tilePosition.x =0;
        } else {
            rock = rockPosition(rock,arrRockXYScen2);
        }
    }
    if(scenFlag == 2){
        if(marioMove.x > 800){
           scenFlag++;
           background.tilePosition.x =0;
        } 
        if(marioMove.x < 0){
            rock = rockPosition(rock,arrRockXYScen2);
            scenFlag--;
            marioMove.x = 790;
            background.tilePosition.x =0;
        } else {
            rock = rockPosition(rock,arrRockXYScen3);
        }
    }
     if(scenFlag == 3){
         renderer.render(stage2);
     }
}
 
function gravity(){
    if(marioMove.y <= (bottom -  marioMove.height / 2)){
        moveD=true;
    } 
}

function keyboardСontrol(){
    Mousetrap.bind('d', function() {
        moveR = true;
        directionX = true;
    }, 'keydown');
    Mousetrap.bind('d', function() {
        moveR = false;
    }, 'keyup');

    Mousetrap.bind('a', function() {
        moveL = true;
        directionX = false;
    }, 'keydown');
    Mousetrap.bind('a', function() {
        moveL = false;
    }, 'keyup');

    Mousetrap.bind('w', function() { 
        if(moveD == false && moveT == false){
            pos = marioMove.y;
            moveT = true;
        }
    }, 'keydown');
}

function movements(){   
    if(moveR){
        marioMove.x +=6;
    }
    if(moveL){
        marioMove.x -=6;
    }
    if(moveT){
        moveD=false;
        if(marioMove.y <= pos-jamp){
            moveT=false;
            moveD=true;
        } else {
            marioMove.y -=6;
        }  
    }   
    if(moveD){
        if(marioMove.y >= (bottom - marioMove.height / 2)){
            moveD=false;
        } else {
            marioMove.y +=6;
        }   
    }
}

/////////Обработка коллизии/////////////
function obstruction(lett){
    if(hitTestRectangle(marioMove, lett)){
        if( hitIntersectionRectangle(marioMove, lett) ){ 
            if(directionX){          
                moveR=false;
                marioMove.x -=6;
            } else {   
                moveL=false;
                marioMove.x +=6;
            }
        }
        if(hitTopRectangle(marioMove, lett) ){
            moveD=false;
        } else {
            moveD=true;
            moveT=false;
        }
    } 
}
 


