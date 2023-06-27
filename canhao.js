class Canhao{
    constructor(x,y){
        //atribuir as props x e y
        this.x = x;
        this.y = y;
        this.angulo = 0;
        //atribuir duas imagens
        this.canoImg = loadImage("canhao.png");
        this.baseImg = loadImage("base.png");
    }

    //método para exibir as imagens
    criar(){
      
        //checa se a pessoa pressionou a seta para
        //esquerda
        if(keyIsDown(LEFT_ARROW) && this.angulo > -50){
            this.angulo--;
        }
        if(keyIsDown(RIGHT_ARROW) && this.angulo < 60){
            this.angulo++;
        }
        //atualizar as configurações
        push ()
        translate (this.x, this.y)
        rotate (this.angulo)
        //exibe a imagem do cano
        image (this.canoImg, 0,0,100, 100);
        //volta para as configurações antigas
        pop ()

        //exibe a imagem da base
        image (this.baseImg, this.x,this.y,200,200);
    }
}