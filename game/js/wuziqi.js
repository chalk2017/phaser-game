
/*
首先要实例化一个Phaser.Game对象，所有的游戏资源都要通过game对象来设置，宽/高=500px
图形画面可选择auto、webgl、canvas，但手机端不支持webgl所以，默认就是Phaser.CANVAS
'phaser-example'是div的id，用于创建canvas并显示游戏
*/
var game = new Phaser.Game(600, 600, Phaser.AUTO, 'wuziqi');
//创建周期函数
var wuziqi = {};
wuziqi.play = function(game){};
wuziqi.play.prototype = {
	line:null,
	graphics:null,
	topX:85,
	topY:121,
	roadWidth:30,
	roadPoints:{x:[],y:[]},
	keyboardCursors:null,
	chessPiecesPos:{x:0,y:0},
	//预加载
	preload:function(){
		//设置背景色，game.stage来设置基本样式
		game.stage.backgroundColor = 'rgba(0,0,0,0.5)';
		/*
		game.scale（就是Phaser.Game.scale）用于设置画布显示的类
		*/
		//显示模式 = Phaser.ScaleManager.SHOW_ALL（画面全部显示，并等比例缩放，用于适应手机屏幕大小显示）
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//设置画布最小最大尺寸，无论设备屏幕大小，总有个最大最小尺寸
		game.scale.setMinMax(300, 300, 600, 600);
		/*
		game.load:加载器，用于把image、sprite、audio加载到游戏队列中
		通过key来从队列中获取资源，如下面的'square'就是key
		*/
		game.load.image('bgImg', 'img/wuziqi_bg.jpg');
		//加载bmp图像文字
		//game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');
		//game.load.image('knightHawks', 'assets/fonts/retroFonts/KNIGHT3.png');
		//加载按钮图片
		//game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
		
	},
	//创建
	create:function(){
		var me = this;
		bgImg = game.add.image(0,0,'bgImg');
		//创建棋盘
		me.drawCheckerboard();
		//初始化棋子容器
		me.chessPiecesAllSpr=me.chessPiecesAllPos=new Array(15);
		for(var i=0;i<15;i++){
			me.chessPiecesAllSpr[i]=me.chessPiecesAllPos[i]=new Array(15);
		}
		me.chessPiecesMemory=[];
		//初始化回合数
		me.roundCount=0;
		//创建键盘输入
		me.keyboardCursors = game.input.keyboard.createCursorKeys();
		//鼠标进入画布时有作用
		game.input.mouse.capture = true;
		//创建AI对象
		me.ai = new wuziqi_ai();
	},
	//循环
	update:function(){
		if (this.keyboardCursors.up.isDown){
			//if (cursors.up.shiftKey){} //键盘按住
		}
		if(game.input.x>this.topX-this.roadWidth/2 &&
			game.input.y>this.topY-this.roadWidth/2 &&
			game.input.x<this.topX+this.roadWidth*14+this.roadWidth/2 &&
			game.input.y<this.topY+this.roadWidth*14+this.roadWidth/2) {
				if (game.input.activePointer.leftButton.isDown){
					this.mouseIsDown = true;
				}
				if (this.mouseIsDown && game.input.activePointer.leftButton.isUp) {
					//获取鼠标点击的位置，计算出所在棋盘的坐标
					this.chessPiecesPos.x = Math.round((game.input.x-this.topX)/this.roadWidth);
					this.chessPiecesPos.y = Math.round((game.input.y-this.topY)/this.roadWidth);
					//判断该位置没有棋子，则填入棋子
					if(this.chessPiecesAllPos[this.chessPiecesPos.x][this.chessPiecesPos.y] === undefined){
						//玩家下棋，绘制棋子
						this.dropPiece(0,this.chessPiecesPos.x,this.chessPiecesPos.y);
						if(this.ai.isWin(this.chessPiecesPos.x,this.chessPiecesPos.y,true).isOver){
							this.mouseIsDown = false;
							alert("玩家赢");
						}else{
							//电脑下棋，计算要下的位置
							var computerAI = this.ai.computerAI(this.chessPiecesAllPos);
							var aiPos = computerAI.chessPiecesPos;
//							this.playerScore = computerAI.playerScore[this.chessPiecesPos.x][this.chessPiecesPos.y];
//							this.computerScore = computerAI.computerScore[this.chessPiecesPos.x][this.chessPiecesPos.y];
//							this.memoryMaxScore = computerAI.memoryMaxScore;
							//电脑下棋，绘制棋子
							this.dropPiece(1,aiPos.i,aiPos.j);
							if(this.ai.isWin(aiPos.i,aiPos.j,false).isOver){
								this.mouseIsDown = false;
								alert("电脑赢");
							}
						}
					}
					this.mouseIsDown = false;
				}
			}
	},
	render:function() {
//  	game.debug.geom(line);
//		game.debug.text("x: "+this.chessPiecesPos.x + "| y: " + this.chessPiecesPos.y,20,20,"#000000");
//		game.debug.text("i: "+this.roadPoints.x[this.chessPiecesPos.x].value + "| j: " +this.roadPoints.y[this.chessPiecesPos.y].value,20,40,"#000000");
//		game.debug.text("playerScore: "+this.playerScore,20,60,"#000000");
//		game.debug.text("computerScore: "+this.computerScore,20,80,"#000000");
//		game.debug.text("memoryMaxScore: "+this.memoryMaxScore,20,100,"#000000");
		
//		game.debug.inputInfo(20,20,"#000000");
	},
	//画线 drawLine({graphics:graphics,lineWidth:1,color:0x00ff00,alpha:1})
	drawLine:function(startX,startY,endX,endY,g){
		//g ->  {graphics,lineWidth,color,alpha}
		g.lineWidth = (!!g.lineWidth)?g.lineWidth:1;
		g.alpha = (!!g.alpha)?g.alpha:1;
		g.color = (!!g.color)?g.color:0x000000;
		g.graphics.lineStyle(g.lineWidth,g.color,g.alpha);
		g.graphics.moveTo(startX,startY);
		g.graphics.lineTo(endX,endY);
	},
	//重写画方块的方法
	drawRect:function(x, y, width, height, g){
		g.lineWidth = (!!g.lineWidth)?g.lineWidth:1;
		g.alpha = (!!g.alpha)?g.alpha:1;
		g.color = (!!g.color)?g.color:0x000000;
		g.graphics.lineStyle(g.lineWidth,g.color,g.alpha);
		g.graphics.drawRect(x,y,width,height);
	},
	//绘制棋盘
	drawCheckerboard:function(){
		var me = this;
//		line = new Phaser.Line(0, 0, 500, 500);
		g = game.add.graphics(0,0);

		me.drawRect(1,1,598,798,{graphics:g,lineWidth:2});
//		this.drawRect(71,81,450,450,{graphics:g});
		//横纵画16条线
		for(var i=0,x=me.topX,y=me.topY;i<15;i++){
			//画竖线
			me.drawLine(x,me.topY,x,me.topY+me.roadWidth*14,{graphics:g});
			//竖线时，横坐标右移，记录横坐标x
			me.roadPoints.x.push({
				value:x,
				text:game.add.text(
					x-me.roadWidth/6, 
					me.topY+me.roadWidth*14+me.roadWidth/3, 
					String(i+1),
					{ font: me.roadWidth/2+"px Arial", fill: "#ffffff", align: "center" })
			});
			x += me.roadWidth;
			//画横线
			me.drawLine(me.topX,y,me.topX+me.roadWidth*14,y,{graphics:g});
			//横线时，纵坐标下移，记录纵坐标y
			me.roadPoints.y.push({
				value:y,
				text:game.add.text(
					((15-i)<10?me.topX-me.roadWidth/2:me.topX-me.roadWidth/1.5)-me.roadWidth/5, 
					y-me.roadWidth/3, 
					String(15-i),
					{ font: me.roadWidth/2+"px Arial", fill: "#ffffff", align: "right" })
			});
			y += me.roadWidth;
			//画行列号
		}
//		me.roadPoints.y[5].text._text; //取该行行号，行号=数组下标+1
	},
	//绘制棋子，创建棋子对象,白子=0 | 黑子=1
	drawChessPieces:function(pieceType){
		var me = this;
		//创建棋子图像
		//circle = new Phaser.Circle(game.world.centerX, 100,64);
		var bmd = game.add.bitmapData(me.roadWidth,me.roadWidth);
		//bmd.ctx 是html5 canvas原生的对象：ctx = Canvas.getContext("2d");
		bmd.ctx.beginPath();
		//arc通过画弧实现画圆，arc(圆心x,圆心y,起始角度,结束角度,false顺时针)
		bmd.ctx.arc(me.roadWidth/2,me.roadWidth/2,me.roadWidth/2-2,0,Math.PI*2,false);
		bmd.ctx.strokeStyle = '#000000';
		bmd.ctx.lineWidth = 2;
		bmd.ctx.stroke();
		if(pieceType===0 || pieceType==='white'){
			bmd.ctx.fillStyle = '#FFFFFF';
			bmd.pieceType = 0;
			bmd.pieceTypeName = 'white';
		}else if(pieceType===1 || pieceType==='black'){
			bmd.ctx.fillStyle = '#000000';
			bmd.pieceType = 1;
			bmd.pieceTypeName = 'black';
		}else{
			bmd.ctx.fillStyle = '#000000';
			bmd.pieceType = 1;
			bmd.pieceTypeName = 'black';
		}
		bmd.ctx.fill();
		return bmd;
	},
	//着棋
	dropPiece:function(pieceType,x,y){
		var me = this;
		if(me.chessPiecesAllPos[x][y] === 0 || me.chessPiecesAllPos[x][y] === 1){
			return false; //位置已被占用
		}
		//绘制棋子
		var bmd = me.drawChessPieces(pieceType);
		//面板上添加棋子
		var sprite = game.add.sprite(me.roadPoints.x[x].value-me.roadWidth/2, me.roadPoints.y[y].value-me.roadWidth/2, bmd);
		sprite.pieceType = bmd.pieceType;
		sprite.pieceTypeName = bmd.pieceTypeName;
		//棋谱上添加棋子
		me.chessPiecesAllPos[x][y] = sprite.pieceType;
		me.chessPiecesAllSpr[x][y] = sprite;
		return sprite;
	}
}


//game.state是一个状态池，给这个状态池添加回调函数，当状态启动时会自动调用函数
game.state.add('play',wuziqi.play);
//启动load状态（相当于调用上面Demo.Load函数）
game.state.start('play');