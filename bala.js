class Bala{
    constructor(x,y){
        this.body = Bodies.circle(x,y,15, {isStatic:true});
        //add no mundo
        World.add(world, this.body);
        this.imagem = loadImage("bala.png");
        this.trajetoria = [];
        this.animacao = [this.imagem];
        this.afundou = false;
        this.r = 15;
        this.speed = 0;
    }

    shoot(){
        tiroSom.setVolume(0.1)
        tiroSom.play()
        var angulo = canhao.angulo - 28;
        //converter para radiano
        angulo *= Math.PI/180;
        var v = p5.Vector.fromAngle(angulo);
        //converter para grau
        v.mult(90/Math.PI);
        Body.setStatic(this.body, false)
        Body.setVelocity(this.body, {x:v.x, y:v.y})
    }

    destruir(i){
        if(this.afundou){
            if(!aguaSom.isPlaying()){
                aguaSom.setVolume (0.1)
                aguaSom.play()
            }
        
            this.animacao = splashAnimacao;
            this.r = 60;
        }
        Body.setVelocity(this.body, {x:0, y:0})
        setTimeout(()=>{
            World.remove(world, balas[i].body);
            //tira da matriz
            delete balas[i]            
        }, 1500)

    }

    show(){
        var pos = this.body.position;
        var i = floor(this.speed % this.animacao.length)
        image (this.animacao[i], pos.x, pos.y, this.r*2,this.r*2)

        //checa se a bala está em movimento
        if(this.body.velocity.x >0 && pos.x > 300){
            var posicao = [pos.x, pos.y];
            this.trajetoria.push(posicao);
        }

        for(var i = 0; i < this.trajetoria.length; i++){
            image (this.imagem, this.trajetoria[i][0],this.trajetoria[i][1], 5,5 )
        }

    }
}