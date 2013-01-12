

var ChessMove = function(row1,col1,row2,col2){

	this.row1 = row1;
	this.row2 = row2;
	this.col1 = col1;
	this.col2 = col2;

	/**
	 * 决定该棋移动是否合规则，总调用
	 * @return {bool} 
	 */
	this.canMove = function(){
		var ret = this._canMove_eat();
		if (!ret){
			return false;
		}
		var key = this.row1+'-'+this.col1;
		var piece = ChessPiece.PiecesMap[key];
		var funstr = 'this._canMove_'+piece.name+'();';
		var ret = eval(funstr);
		return ret;
	}

	/**
	 * 不能吃自己
	 * @return {bool} 
	 */
	this._canMove_eat = function(){
		var key = this.row2+'-'+this.col2;
		if(!ChessPiece.PiecesMap[key]) return true;
		var chessp2 = ChessPiece.PiecesMap[key];
		var chessp1 = ChessPiece.PiecesMap[this.row1+'-'+this.col1];
		if(chessp1.color == chessp2.color) return false;
		return true;
	}
	/**
	 * 炮
	 * @return {bool} 
	 */
	this._canMove_pao = function(){
		if (this.row1 != this.row2 && this.col1 != this.col2){
			return false;
		}
		var total = 0;  //中间隔了几个人

		if(this.row1 == this.row2){
			var start = this.col1 > this.col2 ? this.col2 : this.col1;
			var end = this.col1 > this.col2 ? this.col1 : this.col2;
			for (i=start+1; i<end; i++){
				var ikey = this.row1+'-'+i
				if(ChessPiece.PiecesMap[ikey]) total++;
			}
		}else if(this.col1 == this.col2){
			var start = this.row1 > this.row2 ? this.row2 : this.row1;
			var end = this.row1 > this.row2 ? this.row1 : this.row2;
			
			for (i=start+1; i<end; i++){
				var ikey = i+'-'+this.col1
				if(ChessPiece.PiecesMap[ikey]) total++;
			}
		}
		if (total > 1) return false;

		var key = this.row2+'-'+this.col2;
		if(total == 1 && !ChessPiece.PiecesMap[key]) return false;   // 不能打空火炮
		if(total == 0 && ChessPiece.PiecesMap[key]) return false;
		return true;

	}
	/**
	 * 兵
	 * @return {bool} 
	 */
	this._canMove_bing = function(){
		if (this.row2 > this.row1) return false;
		if(Math.abs(this.row1-this.row2) > 1 || Math.abs(this.col1-this.col2) > 1) return false;
		if(Math.abs(this.row1-this.row2) == 1 && Math.abs(this.col1-this.col2) == 1) return false;
		if(this.row1 > 4 && this.col2-this.col1 !=0 ) return false;
		return true;
	}
	/**
	 * 将
	 * @return {bool} 
	 */
	this._canMove_king = function(){
		if(this.col2 <3 || this.col2 > 5) return false;
		if(this.row2 < 7 ) return false;
		var abs1 = Math.abs(this.row1-this.row2);
		var abs2 = Math.abs(this.col1-this.col2);
		if(abs1 == 1 && abs2 == 0) return true;
		if(abs1 == 0 && abs2 == 1) return true;
		return false;
	}
	/**
	 * 士
	 * @return {bool} 
	 */
	this._canMove_shi = function(){
		if(!Math.abs(this.row1-this.row2) == 1 
			|| !Math.abs(this.col1-this.col2) == 1 ){
			return false;
		}
		if(this.col2 <3 || this.col2 > 5) return false;
		if(this.row2 < 7 ) return false;
		return true;
	}
	/**
	 * 象
	 * @return {bool} 
	 */
	this._canMove_xiang = function(){
		if(Math.abs(this.row1-this.row2) != 2 
				|| Math.abs(this.col1-this.col2) != 2 ){
				return false;
			}
		if(this.row2 < 5) return false;  //相不能过河
		var r0 = (this.row1+this.row2)/2;
		var c0 = (this.col1+this.col2)/2;
		var ikey = r0+'-'+c0
		if(ChessPiece.PiecesMap[ikey]) return false;
		return true;		
	}
	/**
	 * 马
	 * @return {bool} 
	 */
	this._canMove_ma = function(){
		var abs1 = Math.abs(this.row1-this.row2);
		var abs2 = Math.abs(this.col1-this.col2);
		if(abs1>2 || abs2>2) return false;
		if(abs1 == 1 && abs2 != 2) return false;
		if(abs1 == 2 && abs2 != 1) return false;
		// 马角判断
		var jiaokey = '';
		if(abs1 == 2 && this.row2<this.row1){ // 向上走
			jiaokey = (this.row1-1)+'-'+this.col1;
		}else if(abs1 == 2 && this.row2>this.row1) { // 向下走
			jiaokey = (this.row1+1)+'-'+this.col1;
		}else if(abs2 == 2 && this.col2>this.col1) { // 向右
			jiaokey = this.row1+'-'+(this.col1+1);
		}else{
			jiaokey = this.row1+'-'+(this.col1-1);
		}
		if(ChessPiece.PiecesMap[jiaokey]) return false;
		return true;
	}
	/**
	 * 车
	 * @return {bool} 
	 */
	this._canMove_che = function(){
		if (this.row1 != this.row2 && this.col1 != this.col2){
			return false;
		}
		if(this.row1 == this.row2){
			var start = this.col1 > this.col2 ? this.col2 : this.col1;
			var end = this.col1 > this.col2 ? this.col1 : this.col2;
			var total = 0;
			for (i=start+1; i<end; i++){
				var ikey = this.row1+'-'+i
				if(ChessPiece.PiecesMap[ikey]) total++;
			}
			if(total == 0){
				return true;
			}else{
				return false;
			}
		}
		if(this.col1 == this.col2){
			var start = this.row1 > this.row2 ? this.row2 : this.row1;
			var end = this.row1 > this.row2 ? this.row1 : this.row2;
			var total = 0;
			for (i=start+1; i<end; i++){
				var ikey = i+'-'+this.col1
				if(ChessPiece.PiecesMap[ikey]) total++;
			}
			if(total == 0){
				return true;
			}else{
				return false;
			}
		}
		return false;
	}

	/**
	 * 获取要走的棋子是什么棋
	 * @return {[string]} [棋子名称]
	 */
	this._getChessName = function(){
		var key = this.row1+'-'+this.col1;
		if(!ChessPiece.PiecesMap[key]) return '';
		var chessp = ChessPiece.PiecesMap[key];
		return chessp.name;
	}


}
