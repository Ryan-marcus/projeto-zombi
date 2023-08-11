var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup,bulletGroup;

var score = 0;
var life = 3;
var bullets = 70;

var heart1, heart2, heart3

var gameState = "fight"

var lose, winning, explosionSound;


function preload(){
  heart1Img = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");
  shooterImg = loadImage("assets/shooter_1.png");
  shooter_shooting = loadImage("assets/shooter_2.png");
  zombieImg = loadImage("assets/z.png");
  bgImg = loadImage("assets/bg.jpg");
  explosionSound = loadSound("assets/explosion.mp3");
  lose = loadSound("assets/lose.mp3");
  winning = loadSound("assets/win.mp3");
  

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adicionando a imagem de fundo
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20);
  bg.addImage(bgImg);
  bg.scale=2.7

  //spriteJogador
  player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
  player.addImage(shooterImg);
  player.scale=2;
  player.debug=true;
  player.setCollider("rectangle",0,0,70,70);

  //spritevidas
  heart1 = createSprite(displayWidth-150,40,20,20);
  heart1.visible=false;
  heart1.addImage("heart1",heart1Img);
  heart1.scale=0.3;

  heart2 = createSprite(displayWidth-100,40,20,20);
   heart2.visible=false;
  heart2.addImage("heart2",heart2Img);
  heart2.scale=0.3;

  heart3 = createSprite(displayWidth-150,40,20,20);
  heart3.addImage("heart3",heart3Img);
  heart3.scale=0.3;
    //criando grupos de zumbis e balas
    bulletGroup=new Group();
    zombieGroup=new Group();


}

function draw() {
  background(0); 
  if (gameState=="fight") {
    //trocando imagens da vida
    if (life==3) {
      heart1.visible=false;
      heart2.visible=false;
      heart3.visible=true;
    }
    if (life==2) {
      heart1.visible=false;
      heart2.visible=true;
      heart3.visible=false;
    }
    if (life==1) {
      heart1.visible=true;
      heart2.visible=false;
      heart3.visible=false;
    }
    //finalizar jogo quando as vidas forem igual a 0
    if (life==0) {
      gameState="lost";
    }
    //ir para o "won" se a pontuação for 100
    if (score==100) {
      gameState="won"
      winning.play();
      winning.setVolume=0.5;
    }
    //movendo o jogador para cima e para cima e para baixo
    if (keyDown("UP_ARROW")||touches.length>0) {
      player.y -=30;
    }
    if (keyDown("DOWN_ARROW")||touches.length>0) {
      player.y +=30;
    }
    //atirar e mudar imagen com a tecla espaço
    if (keyWentDown("space")) {
      bullet = createSprite(displayWidth-1150,player.y-30,20,10);
      bullet.velocityX=20;
      bulletGroup.add(bullet);
      player.depth=bullet.depth;
      player.depth=player.depth+2;
      player.addImage(shooter_shooting);
      bullets=bullets-1;
      explosionSound.play();
      explosionSound.setVolume(0.3);
    }
    else if (keyWentUp("space")) {
      player.addImage(shooterImg);
    }
     //gameState bullet quando o jogador ficar sem bala
     if (bullets==0) {
      gameState = "bullet";
      lose.play();
      lose.setVolume(0.5);
     }
     //destruir o zumbi e almentar a pontuação
     if (zombieGroup.isTouching(bulletGroup)) {
      for (var i = 0; i<zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(bulletGroup)) {
          zombieGroup[i].destroy();
          bulletGroup.destroyEach();
          explosionSound.play();
          explosionSound.setVolume(0.3);
          score+=5;
        }
        
      }
     }
     //reduzir a vida e o zombi quando o jogador tocar nele
     if (zombieGroup.isTouching(player)) {
      for (var i = 0; i<zombieGroup.length; i++) {
        if (zombieGroup[i].isTouching(player)) {
          zombieGroup[i].destroy();
          life-=1;
        }
        
      }
     }
     enemy();
  }
drawSprites();

//exibindo a pontuação e as vidas e balas restantes
textSize(20)
  fill("black")
text("Balas = " + bullets,displayWidth -1200,displayHeight/2-280)
text("Pontuação = " + score,displayWidth -1200,displayHeight/2-250)
text("Vidas = " + life,displayWidth -1200,displayHeight/2-310)

//destrua o zumbi e o jogador e exiba uma mensagem em gameState "lost"
if(gameState == "lost"){
  textSize(80);
  fill("red");
  text("Você perdeu!!!",400,400);
  zombieGroup.destroy();
  player.destroy();
  

}

//destrua o zumbi e o jogador e exiba uma mensagem em gameState "won"
else if(gameState == "won"){
  textSize(80);
  fill("green");
  text("Você ganhou!!!",400,400);
  zombieGroup.destroy();
  player.destroy();
  

}

//destrua o zumbi, o jogador e as balas e exiba uma mensagem no gameState "bullet"
else if(gameState == "bullet"){
  textSize(80);
  fill("red");
  text("Você não tem mais balas!!!",300,400);
  zombieGroup.destroy();
  player.destroy();
  bulletGroup.destroyEach();

}

}


//criando função para gerar zumbis
function enemy(){
  if (frameCount%30==0) {
    zombie = createSprite(random(500,1100),random(100,500),40,40);
    zombie.addImage(zombieImg);
    zombie.scale=0.5;
    zombie.velocityX=-10;
    zombie.debug=true;
    zombie.setCollider("rectangle",0,0,300,300);
    zombie.lifeTime=800;
    zombieGroup.add(zombie);
  }

}
