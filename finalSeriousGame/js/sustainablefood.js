PieceMovement = class {
    horizontalSpeed;
    verticalSpeed;

    constructor(vert){
        this.horizontalSpeed = 3;
        this.verticalSpeed = 100;
    }
}

//adding some comments for git

//create new scene
let gameScene = new Phaser.Scene('Game');
let menuScene = new Phaser.Scene('Menu');
let gameOverScene = new Phaser.Scene('GameOver');
let preloadScene = new Phaser.Scene('Preload');

//keep score
var highScore = 0;
var gameScore = 0;
var direction = 1;

// set configuration
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    scene: [preloadScene, menuScene, gameScene, gameOverScene],
    physics:{
        default: "arcade",
        arcade:{
            debug: false,
            gravity: {y:200}
        }
    }
};
//loads preload scene images
preloadScene.preload = function(){
    this.load.image('phaser', 'assets/phaserimage.png');
    this.load.image('spark', 'assets/particles/blueparticle.png');
}
//creates phaser screen 
preloadScene.create = function(){
    this.background = 111111;
    
    
    var particles = this.add.particles('spark');

    var emitter = particles.createEmitter();

    emitter.setPosition(400, 240);
    emitter.setSpeed(100);
    emitter.setBlendMode(Phaser.BlendModes.ADD);
    this.phaserLogo = this.add.sprite(400, 240, 'phaser');
    this.input.on('pointerdown', () => this.scene.start(menuScene));

}
//menu scene images 
menuScene.preload = function(){
    this.load.image('play', "assets/playbutton.png");
    this.load.image('background', 'assets/bluesky.jpg');
    this.load.image('foodcart', 'assets/foodcart.png');
}


menuScene.create = function() {
    this.background = this.add.sprite(0,0, 'background');
    this.background.setOrigin(0,0);
    this.background.displayHeight = config.height;
    this.background.displayWidth = config.width;
    
    this.gameText = this.add.text(70,15, "Cloudy with a Chance of Climate Change", {fontFamily: '"Fantasy"', fontSize: 40, color: 111111});
    this.foodcart = this.add.sprite(200,250, 'foodcart');
    this.foodcart.setScale(.15);
    this.cart2 = this.add.sprite(600,250, 'foodcart');
    this.cart2.setScale(.15);
    this.playButton = this.add.sprite(400, 220, 'play');
    this.playButton.setScale(.5);
    makeInteractive(this.playButton, function(){
        menuScene.scene.start(gameScene);
    });


    

}

//init scene parameters?
gameScene.init = function() {
    this.playerSpeed = 4.5;
    this.playerScore = 0;
    this.carbonScore = 0;
}

// load all the images 
gameScene.preload = function() {
    this.load.image('cart', 'assets/shoppingtrolley.png');
    this.load.image('cartleft', 'assets/shoppingtrolleyleft.png');
    this.load.image('blue', 'assets/blue.png');
    this.load.image('milk', 'assets/milk.png');
    this.load.image('steak', 'assets/steak2.png');
    this.load.audio('beep', 'assets/beep.wav');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('broccoli', 'assets/broccoli.png');
    //this.load.spritesheet('veggies', 'assets/sprites.png',32,37);
}

var text;
var endGameText = "";
var timedEvent;

gameScene.create = function() {
    //background grass
    this.background = this.add.sprite(0,0, 'blue');
    this.background.setOrigin(0,0);
    this.background.displayHeight = config.height;
    this.background.displayWidth = config.width;

    //player
    this.cart = this.add.sprite(25,440,'cart');
    this.cart.setScale(.18);

    //food

    //enemy
    this.steak = this.add.sprite(700,300,'steak');
    this.steak.setScale(.03);
    this.steak.movement = new PieceMovement(5);
    this.beepSound = this.sound.add('beep');

    this.apple = this.add.sprite(500,600,'apple');
    this.apple.setScale(.1);
    this.apple.movement = new PieceMovement(5);
    
    this.broccoli = this.add.sprite(200,450,'broccoli');
    this.broccoli.setScale(.015);
    this.broccoli.movement = new PieceMovement(5);

    //score
    gameScore = 0;
    this.coinText = this.add.text(20, 15, "0", {fontSize: 20 });
    this.coinText.text = "" + gameScene.playerScore;

    this.carbonText = this.add.text(20, 40, "0", {fontSize: 20 });
    this.carbonText.text = "" + gameScene.carbonScore;

    //this.gameText = this.add.text(250,15, "Green Grocery Challenge ", {fontFamily: '"Serif"', fontSize: 20});

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    //timer
    console.log('create');
    // 2:30 in seconds
    this.initialTime = 30;

    text = this.add.text(650, 15, 'Countdown: ' + formatTime(this.initialTime));

    // Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
};

gameScene.update = function(time, delta) {

    if(this.cursorKeys.right.isDown){
        //this.cart.x += this.playerSpeed;
        direction = 1;
        this.cart.setTexture('cart');
    }
    if(this.cursorKeys.left.isDown){
        //this.cart.x -= this.playerSpeed;
        direction = 2;
        this.cart.setTexture('cartleft');
    }
    if (direction > 1){
        this.cart.x -= this.playerSpeed;
    }else{
        this.cart.x +=this.playerSpeed;
    }
    if(this.cart.x > 800){
        this.cart.x = 0;
    }else if(this.cart.x < 0){
        this.cart.x = 800;
    }
    // check overlap
    let cartBounds = this.cart.getBounds();
    let appleBounds = this.apple.getBounds();
    let foodBounds = this.steak.getBounds();
    let brocBounds = this.broccoli.getBounds();

    
    if(Phaser.Geom.Intersects.RectangleToRectangle(foodBounds,cartBounds)){
        gameScene.playerScore += 3;
        gameScene.carbonScore += 60;
        this.steak.y -= 480;
        this.steak.x = getRndInteger(0,800);
        if(gameScene.playerScore > gameScore){
            gameScore = gameScene.playerScore;
            
        }
        //if carbon score is more than x add a box to the thing (like green yellow red)
        
        gameScene.beepSound.play();
        console.log('ladybug eats!');
        //play a sound
    }
    if(Phaser.Geom.Intersects.RectangleToRectangle(appleBounds,cartBounds)){
        gameScene.playerScore += 1;
        gameScene.carbonScore += .4;
        this.apple.y -= 480;
        this.apple.x = getRndInteger(0,800);
        if(gameScene.playerScore > gameScore){
            gameScore = gameScene.playerScore;
            
        }
        gameScene.beepSound.play();
        
    }
    if(Phaser.Geom.Intersects.RectangleToRectangle(brocBounds,cartBounds)){
        gameScene.playerScore += 1;
        gameScene.carbonScore += .4;
        this.broccoli.y -= 480;
        this.broccoli.x = getRndInteger(0,800);
        if(gameScene.playerScore > gameScore){
            gameScore = gameScene.playerScore; 
        }

        gameScene.beepSound.play();
    }

    //move gamepieces 
    this.steak.y += this.steak.movement.horizontalSpeed;
    if(this.steak.y > 480){
        this.steak.y -= 480;
        this.steak.x = getRndInteger(0,800);
        //also move y position of poison
    
    }
    this.apple.y += this.apple.movement.horizontalSpeed;
    if(this.apple.y > 480){
        this.apple.y -= 480;
        this.apple.x = getRndInteger(0,800);
        //also move y position of poison
    
    }
    this.broccoli.y += this.broccoli.movement.horizontalSpeed;
    if(this.broccoli.y > 480){
        this.broccoli.y -= 480;
        this.broccoli.x = getRndInteger(0,800);
        //also move y position of poison
    
    }

    //display score
    this.coinText.text = "Food energy:" + gameScene.playerScore + "/20";
    this.carbonText.text = "Carbon footprint:" + gameScene.carbonScore;


    if (gameScene.initialTime < 0){
        //change the words to game over, you didn't collect enough food in time, try again
        endGameText = "Game Over... you didn't collect enough food in time"
        gameScene.scene.start(gameOverScene);
    
    }else if(gameScene.playerScore > 19){
        //change the words to you won! you collected enough food to move on
        //display dead cow on screen 
        endGameText = "Level up! ... but at what cost?"
        gameScene.scene.start(gameOverScene);
    }
    }
    



gameScene.restart = function() {
    console.log('ladybug dies and is reborn again');
    gameScene.scene.restart();
}

gameOverScene.preload = function(){
    this.load.image('restart', "assets/restart.png");
    this.load.image('blue', 'assets/blue.png');
    this.load.image('cart', 'assets/cart.png');
    this.load.image('cow', 'assets/cow.png');
    this.load.image('rednot','assets/rednot.png')
    
}

gameOverScene.create = function(){
    this.background = this.add.sprite(0,0, 'blue');
    this.background.setOrigin(0,0);
    this.background.displayHeight = config.height;
    this.background.displayWidth = config.width;

    this.gameOverText = this.add.text(150, 50, endGameText, { fontFamily: '"Roboto Condensed"', fontSize: 40 });
    
    this.playAgainText = this.add.text(300, 100, "try again", { fontFamily: '"Roboto Condensed"', fontSize: 40 });
    this.scoreText = this.add.text(280, 350, "You killed " + Math.floor(Math.floor(gameScene.carbonScore)/180) +" cows ", { fontFamily: '"Roboto Condensed"', fontSize: 40 });
    this.carbonEmissionText = this.add.text(120, 390, "And emitted " + Math.floor(gameScene.carbonScore) +" kg of carbon ", { fontFamily: '"Roboto Condensed"', fontSize: 40 });
    this.cow = this.add.sprite(220, 370, 'cow');
    this.cow.setScale(.08);
    this.rednot = this.add.sprite(625,370,'rednot');
    this.rednot.setScale(.01);
    //this.highScoreText = this.add.text(280, 390, "Carbon footprint:" + carbonScore, { fontFamily: '"Roboto Condensed"', fontSize: 40 });
    this.restartButton = this.add.sprite(380, 250, 'restart');
    this.restartButton.setScale(.5);
    makeOverInteractive(this.restartButton, function(){
        gameOverScene.scene.start(gameScene);
    });

}

// create a new game, pass config
let game = new Phaser.Game(config);


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

//------below this are functions to make the tween-----------

function makeInteractive(item, onClickCallback){
    item.setInteractive();
    item.on('pointerdown', function(pointer){
        onClickCallback();
        resetItemState(item);
        item.onClickTween = menuScene.tweens.add({
            targets: item,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            yoyo: true,
            ease: 'Quad.easeIn',
            onStart: function(){
                item.setScale(1.2, 1.2);
            }
        });
    });
    item.on('pointerover', function(pointer){
        resetItemState(item);
        item.hoverTweenIn = menuScene.tweens.add({
            targets: item,
            scaleX: 1.1,
            scaleY: 1.1,
            alpha: 1,
            duration: 200,
        });
    });
    item.on('pointerout', function(pointer){
        resetItemState(item);
        item.hoverTweenOut = menuScene.tweens.add({
            targets: item,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 200,
            onUpdate: function() {
            }
        });
    });
}

// this is for the gameOverScene tween... 
// I know it should use the above methods but for some reason 
// kept getting errors 

function makeOverInteractive(item, onClickCallback){
    item.setInteractive();
    item.on('pointerdown', function(pointer){
        onClickCallback();
        resetItemState(item);
        item.onClickTween = gameOverScene.tweens.add({
            targets: item,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            yoyo: true,
            ease: 'Quad.easeIn',
            onStart: function(){
                item.setScale(1.1, 1.1);
            }
        });
    });
    item.on('pointerover', function(pointer){
        resetItemState(item);
        item.hoverTweenIn = gameOverScene.tweens.add({
            targets: item,
            scaleX: 1.05,
            scaleY: 1.05,
            alpha: 1,
            duration: 200,
        });
    });
    item.on('pointerout', function(pointer){
        resetItemState(item);
        item.hoverTweenOut = gameOverScene.tweens.add({
            targets: item,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 200,
            onUpdate: function() {
            }
        });
    });
}

function resetItemState(item){
    if(item.hoverTweenOut){
        item.hoverTweenOut.remove();
        
    }
    if(item.onClickTween){
        item.onClickTween.remove();
    }
    if(item.hoverTweenIn){
        item.hoverTweenIn.remove();
        
    }
}

function formatTime(seconds){
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}


function onEvent ()
{
    this.initialTime -= 1; // One second
    text.setText('Countdown: ' + formatTime(this.initialTime));
}




