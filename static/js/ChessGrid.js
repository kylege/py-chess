var ChessGrid = function() {

    var all_width = col_count*cell_width + 2*out_width;
    var all_height = row_count*cell_width + 2*out_width;
    var linecolor = 'rgb(0,0,0)';
    var bgcolor = '#DCEAF4';
    /**
     * 初始化画所有棋盘
     * @return {} 
     */
    this.drawAllGrid = function(){
    	this.drawRect();
    	this.drawLines();
    	this.drawCross();
    	this.drawSigns();
    }

    /**
     * 画最外面的两个矩形
     * @return {bool} 
     */
    this.drawRect = function(){

	    var gdata_out_margin = 24;
	    var gdata_out = [[gdata_out_margin,gdata_out_margin], 
	    	[all_width-gdata_out_margin,gdata_out_margin], 
	    	[all_width-gdata_out_margin, all_height-gdata_out_margin], 
	    	[gdata_out_margin,all_height-gdata_out_margin]];
	    var gdata_in = [
	    	[out_width,out_width], 
	    	[all_width-out_width,out_width], 
	    	[all_width-out_width, all_height-out_width], 
	    	[out_width,all_height-out_width]
	    ];

	    var line = d3.svg.line()
	                    .x(function(d) { return d[0]; })
	                    .y(function(d) { return d[1]; })
	                    .interpolate('linear');

	    //最外围的那个框
	    chess_gsv.data(gdata_out)  
	        .append('svg:path')
	        .attr('d', line(gdata_out) + 'Z')
	        .style('stroke-width', 2)
	        .style('stroke', linecolor)
	        .style('fill', bgcolor)
	        .attr('class', 'shape-render');

	    //次外围的那个框
	    chess_gsv.data(gdata_in)  
	        .append('svg:path')
	        .attr('d', line(gdata_in) + 'Z')
	        .style('stroke-width', 1)
	        .style('stroke', linecolor)
	        .style('fill', bgcolor)
	        .attr('class', 'shape-render');
    };
    
    /**
     * 画格子线
     * @return {bool} 
     */
    this.drawLines = function(){

	    //画竖线
	    for (i=1; i<col_count; i++){
	    	var myLine = chess_gsv.append("svg:line")
			    .attr("x1", i*cell_width+out_width)
			    .attr("y1", 0+out_width)
			    .attr("x2", i*cell_width+out_width)
			    .attr("y2", 4*cell_width+out_width)
			    .style("stroke", linecolor)
			    .style("stroke-width", 1)
			    .attr('class', 'shape-render');

			var myLine = chess_gsv.append("svg:line")
			    .attr("x1", i*cell_width+out_width)
			    .attr("y1", 5*cell_width+out_width)
			    .attr("x2", i*cell_width+out_width)
			    .attr("y2", all_height-out_width)
			    .style("stroke", linecolor)
			    .style("stroke-width", 1)
			    .attr('class', 'shape-render');
	    }
	    //画横线
	    for (i=1; i<row_count; i++){
			var myLine = chess_gsv.append("svg:line")
			    .attr("x1", out_width)
			    .attr("y1", i*cell_width+out_width)
			    .attr("x2", all_width-out_width)
			    .attr("y2", i*cell_width+out_width)
			    .style("stroke", linecolor)
			    .style("stroke-width", 1)
			    .attr('class', 'shape-render');
	    }
	};
	/**
	 * 画叉
	 * @return {} 
	 */
	this.drawCross = function(){
	    //四个叉
	    var cross_cords = [
	    	[[3*cell_width+out_width, out_width], [5*cell_width+out_width, 2*cell_width+out_width]],
	    	[[5*cell_width+out_width, out_width], [3*cell_width+out_width, 2*cell_width+out_width]],
	    	[[3*cell_width+out_width, 7*cell_width+out_width], [5*cell_width+out_width, all_height-out_width]],
	    	[[5*cell_width+out_width, 7*cell_width+out_width], [3*cell_width+out_width, all_height-out_width]]
	    ];
	    for (i=0; i<cross_cords.length; i++){
	    	crossi = cross_cords[i]
	    	var myLine = chess_gsv.append("svg:line")
			    .attr("x1", crossi[0][0])
			    .attr("y1", crossi[0][1])
			    .attr("x2", crossi[1][0])
			    .attr("y2", crossi[1][1])
			    .style("stroke", linecolor)
			    .style("stroke-width", 1)
			    .attr('class', 'shape-render');
	    }
	};
    
    /**
     * 画炮与兵位置的指示标志
     * @return {} 
     */
    this.drawSigns = function(){

	    //两个交叉指示
	    var two_cross_cords = [
		    [out_width, 3*cell_width+out_width], 
		    [out_width, 6*cell_width+out_width],
		    [all_width-out_width, 3*cell_width+out_width],
		    [all_width-out_width, 6*cell_width+out_width]
	   ];
	   for (i=0; i<two_cross_cords.length; i++){
	   		var x = two_cross_cords[i][0]
	   		var y = two_cross_cords[i][1]
	   		if (i <= 1){
	   			this._draw_signs_left(x,y);
	   		}else{
	   			this._draw_signs_right(x,y);
	   		}
	   }

	   //四个交叉指示
	   var four_cross_cords = [
	   		[cell_width+out_width, 2*cell_width+out_width],
	   		[7*cell_width+out_width, 2*cell_width+out_width],
	   		[2*cell_width+out_width, 3*cell_width+out_width],
	   		[4*cell_width+out_width, 3*cell_width+out_width],
	   		[6*cell_width+out_width, 3*cell_width+out_width],

	   		[2*cell_width+out_width, 6*cell_width+out_width],
	   		[4*cell_width+out_width, 6*cell_width+out_width],
	   		[6*cell_width+out_width, 6*cell_width+out_width],
	   		[cell_width+out_width, 7*cell_width+out_width],
	   		[7*cell_width+out_width, 7*cell_width+out_width],
	   ];
	   for (i=0; i<four_cross_cords.length; i++){
	   		var x = four_cross_cords[i][0]
	   		var y = four_cross_cords[i][1]
	   		this._draw_signs_left(x,y);
	   		this._draw_signs_right(x,y);
	   	}
    }

    /**
     * 画直线
     * @param  {array} lines 直线坐标数组
     * @return {bool}       
     */
    this._draw_lines = function(lines, line_width, line_color, father_obj){
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
			    .attr('class', 'shape-render');
   		}
    }    

	/**
     * 画左边开的十字交叉指示
     * @param  {int} x x
     * @param  {int} y y
     * @return {bool}   
     */
    this._draw_signs_left = function(x, y){
    	var margin = 6;
   		var linelen = 12;
   		var lns = [
   			[ [x+margin, y-margin], [x+margin, y-margin-linelen] ],
   			[ [x+margin, y-margin], [x+margin+linelen, y-margin] ],
   			[ [x+margin, y+margin], [x+margin, y+margin+linelen] ],
   			[ [x+margin, y+margin], [x+margin+linelen, y+margin] ]
   		];
   		this._draw_lines(lns);
    }
    /**
     * 画右边开的十字交叉指示
     * @param  {int} x 
     * @param  {int} y 
     * @return {bool}   
     */
    this._draw_signs_right = function(x,y){
    	var margin = 6;
   		var linelen = 12;
   		var lns = [
	   			[ [x-margin, y-margin], [x-margin, y-margin-linelen] ],
	   			[ [x-margin, y-margin], [x-margin-linelen, y-margin] ],
	   			[ [x-margin, y+margin], [x-margin, y+margin+linelen] ],
	   			[ [x-margin, y+margin], [x-margin-linelen, y+margin] ]
	   	];
	   	this._draw_lines(lns);
    }    

};