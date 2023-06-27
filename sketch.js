const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var engine, world, ground;
var solo, parado;
var cenario;
var torre, torreIMG;

var balas = [];
var barcos = [];

var spriteSheet, barcoDados;
var barcoAnimacao = [];
var spriteSheetQuebrado, barcoDadosQuebrado;
var barcoAnimacaoQuebrado = [];

var splashSheet, splashDados, splashAnimacao=[];
var aguaSom, tiroSom, fundoSom, fimSom
var pontos=0

function preload(){
    //carrega a imagem do cenario
    cenario = loadImage("fundo.gif");

    spriteSheet = loadImage("./boat/boat.png");
    barcoDados = loadJSON("./boat/boat.json");

    spriteSheetQuebrado = loadImage("./boat/brokenBoat.png");
    barcoDadosQuebrado = loadJSON("./boat/brokenBoat.json");

    splashSheet = loadImage("./waterSplash/waterSplash.png");
    splashDados = loadJSON("./waterSplash/waterSplash.json");

    aguaSom = loadSound("agua.mp3")
    tiroSom = loadSound("tiro.mp3")
    fundoSom = loadSound("musicaFundo.mp3")
    fimSom = loadSound("risada.mp3")
}


function setup() {
    canvas = createCanvas(1200, 600);
    engine = Engine.create();
    world = engine.world;

    parado = { isStatic: true };

    solo = Bodies.rectangle(width/2, height-2, width, 2, parado);
    World.add(world, solo);

    var frames = barcoDados.frames;
    for(var i = 0; i < frames.length; i++){
        var pos = frames[i].position;
        var img = spriteSheet.get(pos.x, pos.y, 500,500);
        barcoAnimacao.push(img);
    }
    var frames = barcoDadosQuebrado.frames;
    for(var i = 0; i < frames.length; i++){
        var pos = frames[i].position;
        var img = spriteSheetQuebrado.get(pos.x, pos.y, 500,500);
        barcoAnimacaoQuebrado.push(img);
    }
    var frames = splashDados.frames;
    for(var i = 0; i < frames.length; i++){
        var pos = frames[i].position;
        var img = splashSheet.get(pos.x, pos.y, 500,500);
        splashAnimacao.push(img);
    }
   

    rectMode(CENTER);
    //configura para posicionar as imagens a partir do centro
    imageMode (CENTER);
    //converte o modo de medir o ângulo para GRAU
    angleMode(DEGREES);

    //cria um objeto da classe torre
    torre = new Torre(160,350,150,310)
    

    //cria um objeto da classe canhão
    canhao = new Canhao(160,130)
    bala = new Bala(160,140)
    
    
    
    
}

function draw() {
    Engine.update(engine);
    background("cyan");
    //coloca uma imagem no meio do jogo
    image (cenario, 600, 300,1200,600);
    bala.show();
    //exibe o canhão
    canhao.criar()
    //exibe a torre
    torre.criar();
    
    if (!fundoSom.isPlaying()){
        fundoSom.setVolume(0.1)
        fundoSom.play()
    }

    for(var n = 0; n < barcos.length; n++){
        if(barcos[n] !== undefined && !barcos[n].quebrado){
            var fim = Matter.SAT.collides(barcos[n].body,torre.body)
            if(fim.collided){
                if(!fimSom.isPlaying()){
                    fimSom.setVolume(0.1)
                    fimSom.play()
                }
                gameOver()
            } 

        }

    }
    textSize(20)
    text ("Pontos: "+pontos,20,20)


    //comando que repete código
    for(var i = 0; i < balas.length; i++ ){
        if(balas[i] !== undefined){
            balas[i].show();
            if(balas[i].body.position.y > height-50 ){
                balas[i].afundou = true;
                balas[i].destruir()
            }
            detectarColisao(i);
        }
    }
    
  

    mostrarBarcos();

    fill("green")
    //solo
    rect(solo.position.x, solo.position.y, width, 10);
    
}
//aciona os códigos quando pressiona qualquer tecla
function keyPressed(){
    //checa se a tecla espaço foi pressionada
    if(keyCode==32){
        //criar bala
        bala = new Bala(160,130);
        //atira a bala
        bala.shoot();
        //add a bala na matriz
        balas.push(bala);
    }

}

function mostrarBarcos(){

    //checa se há barcos na matriz
    if(barcos.length > 0){
        //repete comandos
        for(var i = 0; i < barcos.length; i++){
            //checa se o barco existe
            if(barcos[i] !== undefined){
                barcos[i].animar();
                barcos[i].show();

                //definir a velocidade
                Body.setVelocity(barcos[i].body, {x:-2, y:0})
            }
            //checa se último barco da matriz
            //está próximo da torre
            if( barcos[barcos.length-1] == undefined || barcos[barcos.length - 1].body.position.x < 900){
                //cria outro barco
                barco = new Barco(1200,500);
                //add na matriz
                barcos.push(barco)
            }
        }
        
        

    }
    //se não, cria barcos
    else{
        //criar um barco
        barco = new Barco(1200,550)
        //add na matriz
        barcos.push(barco);
    }
}
function detectarColisao(i){
    for(var n = 0; n < barcos.length; n++){
        //checa se a bala e o barco existem
        if(barcos[n] !== undefined && balas[i] !== undefined ){
            //checar se eles colidiram
            var colisao = Matter.SAT.collides(barcos[n].body, balas[i].body);
            //checa se o valor da propriedade collided é true
            if(colisao.collided){
                balas[i].destruir(i);
                barcos[n].destruir(n);
            }
        }
    }
}

function gameOver(){
    swal ({
        title:"Você Perdeu",
        text:"Os piratas invadiram a torre!",
        confirmButtonText:"Clique para jogar novamente",
        imageUrl:"https://media.tenor.com/VGH_AKYkdTQAAAAC/ultrakill-death.gif",
        imageSize:"300x300"
    }, function(isConfirm){
        if(isConfirm){
            location.reload()
        }
    })
}





