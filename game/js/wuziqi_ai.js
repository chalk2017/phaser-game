/**
 * 
 */
var wuziqi_ai = function(paramater){
	/*全局变量定义*/
	this.init();
};
wuziqi_ai.prototype = {
		wins:[], //包含棋子矩阵、赢法的数组
		playerWins:[], //玩家每种赢法的连子数
		computerWins:[], //电脑每种赢法的连子数
		count:[], //总的赢法数
		/*初始化函数*/
		init:function(){
			//初始化棋子矩阵、赢法数组
			this.wins=[];
			for(var i=0;i<15;i++){
				this.wins[i] = [];
				for(var j=0;j<15;j++){
					this.wins[i][j]=[];
				}
			}

			this.playerWins=[];//玩家每种赢法的连子数
			this.computerWins=[];//电脑每种赢法的连子数
			this.count=[];//总的赢法数
			//计算统计总的赢法数
			this.computeWinCount();
			//初始化玩家和电脑的连子数
			for(var k=0;k<this.count;k++){
				this.playerWins[k]=0; //玩家每种赢法的连子数，连5子赢
				this.computerWins[k]=0; //电脑每种赢法的连子数，连5子赢
			}
		},
		//计算输赢，统计所有的赢法
		computeWinCount:function(){
			//统计所有的赢法count
			this.count = 0;
			//第一类赢法，左->右 连5子
			for(var i=0;i<15;i++){
				for(var j=0;j<11;j++){
					for(var k=0;k<5;k++){
						//如果连5子，这5子的这种赢法[count]设成true
						this.wins[i][j+k][this.count] = true;
					}
					this.count++;
				}
			}
			//第二类赢法，上->下 连5子
			for(var i=0;i<11;i++){
				for(var j=0;j<15;j++){
					for(var k=0;k<5;k++){
						//如果连5子，这5子的这种赢法[count]设成true
						this.wins[i+k][j][this.count] = true;
					}
					this.count++;
				}
			}
			//第三类赢法，左上->右下 连5子
			for(var i=0;i<11;i++){
				for(var j=0;j<11;j++){
					for(var k=0;k<5;k++){
						//如果连5子，这5子的这种赢法[count]设成true
						this.wins[i+k][j+k][this.count] = true;
					}
					this.count++;
				}
			}
			//第四类赢法，右上->左下 连5子
			for(var i=0;i<11;i++){
				for(var j=14;j>3;j--){
					for(var k=0;k<5;k++){
						//如果连5子，这5子的这种赢法[count]设成true
						this.wins[i+k][j-k][this.count] = true;
					}
					this.count++;
				}
			}
		},
		//落子后，判断是否为赢
		isWin:function(i,j,isPlayer){
			var result = {isOver:false};
			for(var k=0;k<this.count;k++){
				//寻找当前落子位置的那几种赢法
				if(this.wins[i][j][k]){
					//这枚棋子是玩家下的
					if(isPlayer){
						//玩家当前落子位置的连子数增加一枚
						this.playerWins[k]++;
						this.computerWins[k]=-1;
						//如果当前赢法连子数为5，即5子连成一条线，则为赢
						if(this.playerWins[k]==5){
							result.isOver=true;
						}
					//这枚棋子是电脑下的
					}else{
						//电脑当前落子位置的连子数增加一枚
						this.computerWins[k]++;
						this.playerWins[k]=-1;
						//如果当前赢法连子数为5，即5子连成一条线，则为赢
						if(this.computerWins[k]==5){
							result.isOver=true;
						}
					}
				}
			}
			return result;
		},
		//计算机走法
		computerAI:function(chessBoard){
			//初始化落子分数
			var playerScore=[];//玩家在棋盘矩阵中每个位置落子的分数
			var computerScore=[];//电脑在棋盘矩阵中每个位置落子的分数
			var memoryMaxScore=0;//计算每个点的分数，记录最大分数
			var chessPiecesPos={i:0,j:0};//记录最大分数的位置
			for(var i=0;i<15;i++){
				playerScore[i]=[];
				computerScore[i]=[];
				for(var j=0;j<15;j++){
					playerScore[i][j]=0;
					computerScore[i][j]=0;
				}
			}
			//循环判断棋盘的每个落子点
			for(var i=0;i<15;i++){
				for(var j=0;j<15;j++){
					//判断当前点为空点，并没有被占用
					if(chessBoard[i][j]==undefined){
						/*
						 * AI分析：
						 * 	1、当要填入这个点时，需要确认与这个点某个方向上有几个棋子，假如说有3个黑子，再填入一个黑子就能连成4个黑子
						 * 	2、某个方向上，已经连接棋子越多分数越大，电脑就越应该填入这个位置
						 * 	3、不一定会有一种方向，也可能是多个方向，所以这个位置的分数要在各个方向评分中累加
						 * 	4、this.count代表每个位置的所有赢法，所以要用this.wins[i][j][k]==true锁定当前位置的所有赢法
						 * 	5、this.playerWins[k]和this.computerWins[k]是每个赢法的连子数，判断这个来累加分数
						 */
						for(var k=0;k<this.count;k++){
							//锁定与这个点有关的赢法
							if(this.wins[i][j][k]){
								/*
								 * 玩家赢法分数累加：
								 * 玩家这种赢法的连子数==1时，加200分
								 */
								if(this.playerWins[k]==1){
									playerScore[i][j] += 200;
								}else if(this.playerWins[k]==2){
									playerScore[i][j] += 400;
								}else if(this.playerWins[k]==3){
									playerScore[i][j] += 2000;
								}else if(this.playerWins[k]==4){
									playerScore[i][j] += 10000;
								}
								/*
								 * 电脑赢法分数累加：
								 * 因为当前轮到电脑下棋，所以各个分数比玩家高一些，
								 * 而电脑一旦有机会5连时，让电脑5连
								 */
								if(this.computerWins[k]==1){
									computerScore[i][j] += 220;
								}else if(this.computerWins[k]==2){
									computerScore[i][j] += 420;
								}else if(this.computerWins[k]==3){
									computerScore[i][j] += 2100;
								}else if(this.computerWins[k]==4){
									computerScore[i][j] += 20000;
								}
							}
						}
						
						//获取最大分数，记录最大分数的位置
						if(playerScore[i][j] > memoryMaxScore){
							memoryMaxScore = playerScore[i][j];
							chessPiecesPos.i = i;
							chessPiecesPos.j = j;
						}else if(playerScore[i][j] == memoryMaxScore){
							if(computerScore[i][j] > memoryMaxScore){
								memoryMaxScore = computerScore[i][j];
								chessPiecesPos.i = i;
								chessPiecesPos.j = j;
							}
						}
						
						if(computerScore[i][j] > memoryMaxScore){
							memoryMaxScore = computerScore[i][j];
							chessPiecesPos.i = i;
							chessPiecesPos.j = j;
						}else if(computerScore[i][j] == memoryMaxScore){
							if(playerScore[i][j] > memoryMaxScore){
								memoryMaxScore = playerScore[i][j];
								chessPiecesPos.i = i;
								chessPiecesPos.j = j;
							}
						}
					}
				}
			}
			return {
				playerScore:playerScore,
				computerScore:computerScore,
				memoryMaxScore:memoryMaxScore,
				chessPiecesPos:{
					i:chessPiecesPos.i,
					j:chessPiecesPos.j
				}
			};
			
		}
}