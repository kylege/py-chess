
var COLOR_RED = 1;
var COLOR_BLACK = 2;

/**
 * 初始化在哪个位置
 * @param {int} row   行
 * @param {int} col   列
 * @param {string} name  是哪个棋子，如车或马
 * @param {int} color 哪个颜色，是红棋(1)，还是黑棋(2)
 */
var ChessPiece =function (row, col, name, color){

	this.row = row;
	this.col = col;
	this.name = name;
	this.color = color;
	this.key = 'piece-'+this.name+'-'+this.color+'-'+this.row.toString()+this.col;
	/**
	 * 获取棋子的背景图片地址
	 * @return {string} 
	 */
	this.getImageUrl = function(){
		return static_path+'img/pieces/'+this.name+this.color+'.png';
	}

	/**
	 * 获取第n行n列的具体坐标值
	 * @param  {int} row 
	 * @param  {int} col 
	 * @return {array}     [x,y]
	 */
	this.getCordinate = function(row, col){
		x = col*cell_width + out_width;
		y = row*cell_width + out_width;
		return [x, y];
	}

	/**
	 * 将棋子移到指定格子上
	 * @param  {int} row 哪一行
	 * @param  {int} col 哪一列
	 * @return {bool}     
	 */
	this.moveTo = function(row, col){
		var cord = this.getCordinate(row, col);
		var color = this.color;
		var name = this.name;

		var newkey = 'piece-'+this.name+'-'+this.color+'-'+row.toString()+col;
		d3.select('#'+this.key)
		.transition()
		.attr('x',cord[0]-piece_width/2)
		.attr('y',cord[1]-piece_width/2)
		.attr('width',piece_width)
		.attr('height',piece_width)
		.each("end",function() { 
			d3.select(this).attr('id', newkey);  // 这里id已经变了
		});

		document.getElementById('move-audio').play();

		if (ChessPiece.PiecesMap[row+'-'+col]){
			var org_piece = ChessPiece.PiecesMap[row+'-'+col];
			org_piece._getKilledMove();
		}
		ChessPiece.PiecesMap[row+'-'+col] = this;
		delete ChessPiece.PiecesMap[this.row+'-'+this.col];

		this._drawZoomCross(row, col);
		this.row = row;
		this.col = col;
		this.key = newkey;
	}
	/**
	 * 移除此棋子
	 * @return {bool} 
	 */
	this.remove = function(){
		d3.select('#'+this.key).remove();
		delete ChessPiece.PiecesMap[this.row+'-'+this.col];
	}
	/**
	 * 添加并显示出来
	 */
	this.addAndShow = function(){
		var cord = this.getCordinate(this.row, this.col);
		ChessPiece.PiecesMap[this.row+'-'+this.col] = this;
		chess_gsv.append('svg:image')
	    	.attr('width', piece_width)
	    	.attr('height', piece_width)
	    	.attr('xlink:href', this.getImageUrl())
	    	.attr('x', cord[0]-piece_width/2)
	    	.attr('y', cord[1]-piece_width/2).
	    	attr('id', this.key);
	}
	/**
	 * 放大
	 * @return {bool} 
	 */
	this.zoomIn = function(){
		this._drawZoomCross(this.row, this.col);
	}
	/**
	 * 缩小，恢复正常
	 * @return {bool} 
	 */
	this.zoomOut = function(){
		d3.select('#'+this.key)
		.transition()
		.attr('width',piece_width)
		.attr('height',piece_width);
	}

	/**
	 * 画选中状态的标志
	 * @param  {int} row 
	 * @param  {int} col 
	 * @return {bool}     
	 */
	this._drawZoomCross = function(row, col){
		var cross_len = 10;
		var zoomclass = 'zoom-'+row+'-'+col;
		if((d3.select('#'+zoomclass)[0][0])){
			return;
		}
		var cord = this.getCordinate(row, col);
		var x = cord[0];
		var y = cord[1];
		var lines = [];

		dx = x-piece_width/2;
		dy = y-piece_width/2;
		lines.push([[dx,dy], [dx+cross_len, dy]]);
		lines.push([[dx, dy], [dx, dy+cross_len]]);

		dx = x+piece_width/2;
		dy = y-piece_width/2;
		lines.push([[dx,dy], [dx-cross_len, dy]]);
		lines.push([[dx, dy], [dx, dy+cross_len]]);		

		dx = x-piece_width/2;
		dy = y+piece_width/2;
		lines.push([[dx,dy], [dx, dy-cross_len]]);
		lines.push([[dx, dy], [dx+cross_len, dy]]);		

		dx = x+piece_width/2;
		dy = y+piece_width/2;
		lines.push([[dx,dy], [dx, dy-cross_len]]);
		lines.push([[dx, dy], [dx-cross_len, dy]]);

		if(d3.select('.zoomnode')[0][0]){
			var zoom_group = d3.select('.zoomnode');
		}else{
			var zoom_group = chess_gsv.append('svg:g')
			.attr("class", "zoomnode");
		}

		this._draw_lines(lines, 2, '#4E8DE3', zoom_group, zoomclass);
	}
	/**
	 * 清除所有 选中状态的标志
	 * @return 
	 */
	this._clearZoomCross = function(){
		d3.select('.zoomnode').remove();
	}

    /**
     * 画直线
     * @param  {array} lines 直线坐标数组
     * @return {bool}       
     */
    this._draw_lines = function(lines, line_width, line_color, father_obj, zoom_class){
    	if(!line_width) line_width = 1;
    	if(!line_color) line_color = linecolor;
    	if(!father_obj) father_obj = chess_gsv;

    	for (j=0; j<lines.length; j++){
   			crossi = lines[j]
   			var myLine = father_obj.append("svg:line")
			    .attr("x1", crossi[0][0])
			    .attr("y1", crossi[0][1])
			    .attr("x2", crossi[1][0])
			    .attr("y2", crossi[1][1])
			    .style("stroke", line_color)
			    .style("stroke-width", line_width)
			    .attr('class', 'shape-render')
			    .attr('class', zoom_class);
   		}
    }
    /**
     * 当自己被吃了时的动作，以前是直接消失，现在加点移动效果
     * @return {bool} 
     */
    this._getKilledMove = function(){
    	var toolbar_div = ['#piece_sign_top', '#piece_sign_bottom'];

    	var tbdiv_id = this.color == my_piece_color ? 1 : 0;
    	var tbdiv = toolbar_div[tbdiv_id];
    	var bgimg = this.getImageUrl();
    	var imgobj = d3.select(tbdiv+" img");
    	if (imgobj[0][0]){
	    	d3.select(tbdiv+" img").transition()
	    		.style('opacity', 0)
	    		.duration(1000)
	    		.each("end",function() {
	    			d3.select(this).remove();
	    			d3.select(tbdiv).append('img')
			    		.attr('src', bgimg)
			    		.attr('width', piece_width)
			    		.attr('height', piece_width)
			    		.style('margin-left', '54px')
			    		.style('margin-top', '5px')
	    		})
    	}else{
    		var newimg = d3.select(tbdiv).append('img')
				    		.attr('src', bgimg)
				    		.attr('width', piece_width)
				    		.attr('height', piece_width)
				    		.style('margin-left', '54px')
				    		.style('margin-top', '5px')
				    		.style('opacity', 0)
			newimg.transition()
				.style('opacity', 1)
	    		.duration(1000)
    	}

    	this.remove();
    }   	

}

/**
 * 物理坐标与ChessPiece对象对应关系，key为 行-列
 * @type {Object}
 */
ChessPiece.PiecesMap = {};

/**
 * 当前选中棋子
 * @type {ChessPiece}
 */
ChessPiece.ChoosenPieceKey = null;

