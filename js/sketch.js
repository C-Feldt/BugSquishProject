/*
  Author:     Calvin W Feldt
  Start Date: 14 January 2022
  Last Edit:  15 January 2022

  Title: BugSquishProject
  Description:  This is a simple game in which the player squishes little space invaders named "Fronks."
  The goal is for the user to click (squish) as many Fronks as possible. An 1800 frame timer is in
  place, which is represented as 30 seconds. The game ends after the timer's countdown ends,
  showing the user their score.
  Purpose: CSC2463 'Bug Squish' Assignment

*/

let fronkSpeed;
let fronkSpeedVariation;
let frameUpdateVariable;
let fronkSize;
let fronkHouse = []
let fronkAmount;
let fronkDeaths = 0;
let previousFronkDeaths;
let totalDeaths = 0;
let gameState = 'start';
let startFrameCount;
let timeRemaining
let round = 1;


// spriteSheet: The Fronk's sprite sheet
// backImage: The background image
function preload() {
  spriteSheet = loadImage("images/FronkSheetAlternate.png");
  backImage = loadImage("images/spaceBG.jpg");
}

//Setup Function
//Application controls and customizations are listed here.
//fronkSpeed: controls Fronk's movement speed (Larger# = faster movement)                                           Default: 1
//fronkSpeedVariation: controls how much each Fronk's speed will vary (Larger# = more variation, 0 = no variation)  Default: 2
//frameUpdateVariable: controls how quickly Fronk's frames will progress. (Larger# = slower animations)             Default: 6
//fronkSize: controls Fronk's size (Larger# = larger Fronk)                                                         Default: 1
//fronkAmount: Amount of Fronks on screen.                                                                          Default: 12
//fronkHouse: Array of Fronk objects.
//fronkStatus: Array of Fronks' status (true = alive; dead = false)
function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);

  fronkSpeed = 1;
  fronkSpeedVariation = 2.5;
  frameUpdateVariable = 6;
  fronkSize = 1;
  fronkAmount = 12;

  for(i = 0; i < fronkAmount; i++){
    fronkHouse[i] = new Fronk(spriteSheet, random(50, 750), random(50, 550), random([1, 2, 3, 4]), random(0, fronkSpeedVariation));
  }
}

//Draw Function
function draw() {
  background(0);
  image(backImage, 400, 300, 800, 600); //Background Image

  //The game's start screen graphics
  if(gameState == 'start'){
    textAlign(CENTER, CENTER);
    fill(255, 255, 0);
    textSize(100);
    textFont('Arial');
    text('FRONKS', 250, 180);
    textSize(20);
    fill(255);
    text('THE INVASION OF THE', 157, 115);
    if(frameCount % 80 <= 40){
      text('CLICK TO BEGIN', 130, 240);
    }
  }

  if(gameState == 'transition'){
    if(frameCount >= startFrameCount + 180){
      gameState = 'playing';
    }
    else {
      transitionNum = int(((startFrameCount + 180 - frameCount) / 60) + 1);
      textAlign(CENTER, CENTER);
      fill(255);
      textSize(100);
      textFont('Arial');
      text(transitionNum, 400, 300);
 
    }
  }
  
  //The game's in-progress graphical procedures
  if(gameState == 'playing'){
    for(i = 0; i < fronkAmount; i++){
      fronkHouse[i].draw();   //Loads the Fronks
    }
    //The game's timer is based off of frames. In hindsight, this is likely not an optimal way to time
    //the game due to FPS differences, however most systems run at 60 FPS standard, thus this should
    //suffice for the time being. I plan to change this to milliseconds in the future.
    if(frameCount >= startFrameCount + 1800){
      gameState = 'end';
    }
    else{   //In-game graphical setup.
      timeRemaining = int((startFrameCount + 1800 - frameCount) / 60);
      textSize(40);
      fill(255, 0, 0);
      text(timeRemaining, 40, 560);
      fill(100, 255, 100);
      textSize(25);
      text('SCORE: ' + totalDeaths, 100, 60);
    }
  }

  //End game screen.
  if(gameState == 'end'){
    round++;
    for(i = 0; i < fronkAmount; i++){
      fronkHouse[i].direction = 5;
      fronkHouse[i].y = 900;
    }
    textSize(50);
    text('YOUR SCORE', 400, 350);
    if(frameCount % 40 <= 30){
      textSize(100);
      text(totalDeaths, 400, 250);
    }
  }

  
  

}

//Procedures for when the mouse is pressed.
function mousePressed() {

  if(gameState == 'start'){   //If on the start-screen, start the game.
    gameState = 'transition';
    startFrameCount = frameCount;
  }
  previousFronkDeaths = fronkDeaths;  //Fronk death administration system.
  fronkDeaths = 0;
  for(i = 0; i < fronkAmount; i++){
    if(fronkHouse[i].kill()){
      for(j = 0; j < fronkAmount; j++){
        fronkHouse[j].fronkSpeed += .1;   //With every death, fronkSpeed increases by .1.
      }
    }
  }
}




class Fronk {

  //Fronk Constructor
  //spriteSheet: the spriteSheet from which Fronk will be animated.
  //startX: this Fronk's starting x coordinate.
  //startY: this Fronk's starting y coordinate.
  //direction: the direction the Fronk will travel.
  //indFronkSpeed: Fronk's movement speed variation (each Fronk will move at a slightly different speed).
  constructor(spriteSheet, startX, startY, direction, indFronkSpeed) {
    this.spriteSheet = spriteSheet;
    this.direction = direction;                   // Moving: 1=DOWN, 2=UP, 3=RIGHT, 4=LEFT, 5 = DEAD
    this.x = startX;
    this.y = startY;
    this.frameLimit = 0;
    this.fronkSpeed = fronkSpeed + indFronkSpeed;
    this.deathFrame;
  }

  //Draw Function
  draw() {
    
    push();
    translate(this.x, this.y);    //Fronks are moved to the updated values at the beginning of the pass.
    scale(fronkSize, fronkSize);  //Fronk size!

    //Sprite Animation
    //The sprite sheet is formatted in 3 columns and about 6 rows, with additional empty rows.
    //Each Fronk phase is formatted to move across the rows by 128 pixels. (Originally 32, upscaled x4 for quality.)
    //Note: The fronk animations for UP and DOWN are intended to bounce back and forth, as seen in the animation.
    if(this.direction == 1){
      image(this.spriteSheet, 0, 0, 64, 64, (32 * 4 * this.frameLimit), 64 * 4, 32 * 4, 32 * 4);
    }
    else if(this.direction == 2){
      image(this.spriteSheet, 0, 0, 64, 64, (32 * 4 * this.frameLimit), 32 * 4, 32 * 4, 32 * 4);
    }
    else if(this.direction == 3){
      image(this.spriteSheet, 0, 0, 64, 64, (32 * 4 * this.frameLimit), 96 * 4, 32 * 4, 32 * 4);
    }
    else if(this.direction == 4){
      image(this.spriteSheet, 0, 0, 64, 64, (32 * 4 * this.frameLimit), 128 * 4, 32 * 4, 32 * 4);
    }
    else{
      image(this.spriteSheet, 0, 0, 64, 64, 0, 160 * 4, 32 * 4, 32 * 4);
    }

    //Frame Update Mechanism
    //For every 'frameUpdateVariable' amount of frames, the sprite frame will update.
    //'frameUpdateVariable' can be changed at the top of the file.
    //The frame selection has been split to accomdate two types of animations.
    if(frameCount % frameUpdateVariable == 0){
      if(this.direction == 1 || this.direction == 2){   //UP and DOWN have 4 frames in their animation.
        this.frameLimit = (this.frameLimit + 1) % 4;    //(Technically 3, but I duplicated frame 2 into the fourth spot.)
      }
      else if(this.direction == 3 || this.direction == 4){
        this.frameLimit = (this.frameLimit + 1) % 2;    //LEFT and RIGHT have 2 frames in their animation.
      }
    }

    //Movement Mechanism
    //For each base "if" statement, there is another nested if/else statement.
    //If the sprite is at its direction's boundary, then it will be turned around.
    //Else, it will move forward at an interval of fronkSpeed.
    if(this.direction == 1){              //If moving UP
      if(this.y <= 50){                       //If past boundary (7 <= 50)
        this.direction = 2;                       //Change direction to DOWN
      }
      else{                                   //Else
        this.y -= this.fronkSpeed;                     //Move UP at fronkSpeed
      }
    }
    else if(this.direction == 2){         //If moving DOWN
      if(this.y >= 550){                      //If past boundary (y >= 550)
        this.direction = 1;                       //Change direction to UP
      }
      else{                                   //Else
        this.y += this.fronkSpeed;                     //Move DOWN at fronkSpeed
      }
    }
    else if(this.direction == 3){         //If moving RIGHT
      if(this.x >= 750){                      //If past boundary (x >= 750)
        this.direction = 4;                       //Change direction to LEFT
      }
      else{                                   //Else
        this.x += this.fronkSpeed;                     //Move RIGHT at fronkSpeed
      }
    }
    else if(this.direction == 4){         //If moving LEFT
      if(this.x <= 50){                       //If past boundary (x >= 50)
        this.direction = 3;                       //Change direction to RIGHT
      }
      else{                                   //Else
        this.x -= this.fronkSpeed;                     //Move LEFT at fronkSpeed
      }
    }
    else{                                             //This is expected to accomodate for DEAD Fronks, though any rogue Directions will come here.
      if(this.deathFrame + 1 == frameCount){
        totalDeaths++;                                //The total score will update on the frame after a Fronk is squished.
      }
      if(this.deathFrame == frameCount - 60){         //After 60 frames, dead Fronks are redeployed to a new spot.
        this.direction = random([1, 2, 3, 4]);        //They are assigned a new, random direction.

        this.x = random(50, 750);                     //They are given new, random coordinates.
        this.y = random(50, 550);
      }
    }

    pop();
  }


  //Kill Behavior
  //This checks for whether a Fronk can be killed.
  //Criteria to be killed: the mouse pressed the Fronk's hitbox; the Fronk is NOT already dead (direction 5)
  kill() {
    if((this.direction != 5 && mouseX > this.x - 24 * fronkSize) && (mouseX < this.x + 24 * fronkSize) && (mouseY > this.y - 24 * fronkSize) && (mouseY < this.y + 24 * fronkSize)){
      this.direction = 5;
      this.deathFrame = frameCount; //The frame the Fronk is killed on, to decide when the Fronk should be redeployed.
      return true;                  //The Fronk has been killed.
    }
    return false;                   //The Fronk was not killed.
  }
}