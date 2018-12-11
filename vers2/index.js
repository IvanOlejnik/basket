var renderer = PIXI.autoDetectRenderer(800, 560);
document.body.appendChild(renderer.view);
stage = new PIXI.Container();
var stage2 = new PIXI.Container();
var evn = new EventEmitter();
//var events = require('events');
//var eventEmitt = new events.EventEmitter();

PIXI.loader 
    .add("mario", "images/mario.png")
    .add("background", "images/bgst.jpg")
    .add("land", "images/land.jpg")
    .add("rock", "images/rock.png")
    .add("marioClip", "images/marioClip2.png")
    .load(setup);
eventsList();
var mario, background, land, rock = [], rect;
var moveR, moveL, moveT = false, moveD=false, jamp = 150, bottom = 450, pos, background2, land2, run = 0, marioMove, directionX = true, scenFlag = 0;
var arrRockXYScen1 = [[300, false],[450, false],[600, 320],[660, 320]];
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
    
    rock = createRock(arrRockXYScen1, rock);
    
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
        if(marioMove.x > 800) evn.emit('nextScen');
        if( (marioMove.x >= 0) && (marioMove.x <= 800) )  evn.emit('thisScen');
    }
    if(scenFlag == 1){
        if(marioMove.x > 800) evn.emit('nextScen');
        if(marioMove.x < 0) evn.emit('pastScen'); 
        if( (marioMove.x >= 0) && (marioMove.x <= 800) )  evn.emit('thisScen');
    }
    if(scenFlag == 2){
        if(marioMove.x > 800) evn.emit('nextScen');
        if(marioMove.x < 0) evn.emit('pastScen'); 
        if( (marioMove.x >= 0) && (marioMove.x <= 800) )  evn.emit('thisScen');
    }
    if(scenFlag == 3) renderer.render(stage2);
}

function gravity(){
    if(marioMove.y <= (bottom -  marioMove.height / 2)){
        moveD=true;//тоже можно событие гравитация сделать, вызывать его здесь, и в обработчик эту одну строчку поместить, но нужно ли?
    } 
}

function keyboardСontrol(){
    Mousetrap.bind('d', hendlerKeyDdown, 'keydown');//это тоже евент, в npm пакете Mousetrap, есть зависимость event...,
    // тоесть это такое же событие которое я мог бы создать вручную как например с колизией, но более автоматически делается Mousetrap, и обработчик есть, поместил его к другим обработчикам.
    Mousetrap.bind('d', (() => moveR = false), 'keyup');//одна строчка решил сразу написать код а не переносить в отдельную функцию обработки.
    Mousetrap.bind('a', hendlerKeyAdown, 'keydown');
    Mousetrap.bind('a', (() => moveL = false), 'keyup');
    Mousetrap.bind('w', hendlerKeyW, 'keydown');
}

function movements(){   
    if(moveR) marioMove.x +=6;//тоже можно создать событие, но не вижу смысла на одну строчку.       
    if(moveL) marioMove.x -=6;
    if(moveT) evn.emit('changeMoveT');  
    if(moveD) evn.emit('changeMoveD');
}

/////////Обработка коллизии/////////////
function obstruction(lett){
    if(hitTestRectangle(marioMove, lett)){ 
        evn.emit('collisionHeppend', { lett: lett });
    } 
}

function runMario() {
    if(moveL || moveR || moveT || moveD){
       run++; 
       if(run == 7){
           run = 0;
           if(rect.x >=45*4) {
               rect.x = 0;
           }
           marioMove.texture.frame = rect;
           rect.x += 45; 
       }
   }
}

function eventsList(){
    evn.on('collisionHeppend', collision);
    evn.on('changeMoveD', moveD);
    evn.on('changeMoveT', moveT);
    //еще 4 события через Mousetrap
    //и еще можно 3 добавить но не стал делать т.к. там одна строчка кода в них.
    evn.on('nextScen', nextScen);
    evn.on('pastScen', pastScen);
    evn.on('thisScen', thisScen);
}
 


