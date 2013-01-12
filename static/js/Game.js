var container = $('#container');
var chess_gsv = d3.select('#chess-grid').append('svg:svg')
					.attr('width', 460).attr('height', 510);
//棋盘边界margin
var out_width = 30;
// 每个格子多宽
var cell_width = 50;
var row_count = 9;
var col_count = 8;
// 棋子大小
var piece_width = 42;

var is_waiting = false;

/**
 * 获取当前坐标属于棋盘中的第几行几列
 * @param  {} pos 
 * @return {}     
 */
function getGridRowCol(pos){
    var cursorx = pos[0];
    var cursory = pos[1];
    var start_col = Math.floor((cursorx-out_width) / cell_width);
    var start_row = Math.floor((cursory-out_width) / cell_width);
    if (((cursorx-out_width) % cell_width) > (cell_width/2)) {
        start_col++;
    }
    if (((cursory-out_width) % cell_width) > (cell_width/2)) {
        start_row++;
    }
    if(start_row < 0 ) start_row = 0;
    if(start_col < 0) start_col = 0;
    if(start_row > row_count) start_row = row_count;
    if(start_col > col_count) start_col = col_count;
    return [start_row, start_col]
}

/**
 * 获取鼠标当前在棋盘里面的相对坐标
 * @param  {} e 
 * @return {}   
 */
function getCurPosition(e) {  
    var x, y; 
    if (e.pageX != undefined && e.pageY != undefined) {  
      x = e.pageX;
      y = e.pageY; 
    } else {  
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }  
    x -= chess_gsv[0][0].offsetLeft;
    y -= chess_gsv[0][0].offsetTop;
    return [x, y];
} 
/**
 * 选中棋子
 * @param  {event} e 
 * @return {bool}   
 */
function gameClickHandler(e){
	if(is_waiting){
        return false;
    }
	var pos = getCurPosition(e);
	var rowcol = getGridRowCol(pos);
    var row = rowcol[0];
    var col = rowcol[1];
    console.log(row+'-'+col);
    // 如果之前有选中的，且和现在不同位置，则视为走棋
    if(ChessPiece.ChoosenPieceKey 
    	&& ( ChessPiece.ChoosenPieceKey.row != row || ChessPiece.ChoosenPieceKey.col != col )){
    	piece = ChessPiece.ChoosenPieceKey;
    	piece.moveTo(row, col);
    	piece.zoomOut();
    	ChessPiece.ChoosenPieceKey = null;
    }else
    // 如果之前有选中的，且和现在相同位置，则视为取消选择
    if(ChessPiece.ChoosenPieceKey && ChessPiece.ChoosenPieceKey.row == row 
    	&& ChessPiece.ChoosenPieceKey.col == col ){ 
    	ChessPiece.PiecesMap[row+'-'+col].zoomOut();
    	ChessPiece.ChoosenPieceKey = null;
    }else
    // 之前没有选中的，如果现在选择有棋子且是自己的颜色，则选中它
    if(!ChessPiece.ChoosenPieceKey){
    	if (ChessPiece.PiecesMap[row+'-'+col] ) {  // 有棋子
    		var curp = ChessPiece.PiecesMap[row+'-'+col];
    		if(curp.color == my_piece_color){
    			curp._clearZoomCross();
	    		curp.zoomIn();
	    		ChessPiece.ChoosenPieceKey = curp;
    		}
    	}
    }
}

$(function() {

    var chess_grid = new ChessGrid();
    chess_grid.drawAllGrid();

    var my_piece_pos = [
    	[6,0,'bing'],
    	[6,2, 'bing'],
    	[6,4, 'bing'],
    	[6,6, 'bing'],
    	[6,8, 'bing'],
    	[7,1,'pao'],
    	[7,7,'pao'],
    	[9,0,'che'],
    	[9,1,'ma'],
    	[9,2,'xiang'],
    	[9,3,'shi'],
    	[9,4,'king'],
    	[9,5,'shi'],
    	[9,6,'xiang'],
    	[9,7,'ma'],
    	[9,8,'che'],
    ];
    for (i=0; i<my_piece_pos.length; i++){
    	var info = my_piece_pos[i];
   		var	piess = new ChessPiece(info[0], info[1], info[2], my_piece_color);
   		piess.addAndShow();
    }

    var his_piece_pos = [
    	[0,0,'che'],
    	[0,1,'ma'],
    	[0,2,'xiang'],
    	[0,3,'shi'],
    	[0,4,'king'],
    	[0,5,'shi'],
    	[0,6,'xiang'],
    	[0,7,'ma'],
    	[0,8,'che'],
    	[2,1,'pao'],
    	[2,7,'pao'],
    	[3,0,'bing'],
    	[3,2,'bing'],
    	[3,4,'bing'],
    	[3,6,'bing'],
    	[3,8,'bing'],
    ];
    for (i=0; i<his_piece_pos.length; i++){
    	var info = his_piece_pos[i];
   		var	piess = new ChessPiece(info[0], info[1], info[2], his_piece_color);
   		piess.addAndShow();
    }
    chess_gsv[0][0].addEventListener("click", gameClickHandler, false);
});