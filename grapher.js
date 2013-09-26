/*
	Grapher.js
	Simple functions for Extending the functionality of Raphael to generate graphs
	Copyright 2013 James Kirsop
	www.jameskirsop.com
	Email Me: james.kirsop@gmail.com
*/
	var aColors = new Array("b80043", "c85437", "32b9cd", "b44bb0", "ffea00", "b292d3", "2fd0c8", "face0a", "2267dd", "39c64c", "ff6600", "f20733", "25dacb", "c23d6e", "e718e3", "01feb2", "4cc33c", "51d8f0", "5cdf11", "00eaff", "ac21de", "ff0000", "33b2cc", "4330cf");
	var sStrokeColor = '#B6B6B6';

	/*
		drawGraph()
		Takes the following arguments:
		containerWidth -  Integer - The width (in pixels) of the parent canvas
		containerHeight - Integer - The height (in pixels) of the parent canvas
		labels - Array - The text descriptions of each of the values in the 'values' array. 
		values - Array - Required to be numerical values
		gutter - Integer - How much space (in pixels) is required around the graph to fit the labels in on both the left vertical and bottom horizontal axis
	*/
	Raphael.fn.drawGraph = function(containerWidth,containerHeight,labels,values,gutter){
		var container = this.rect(0,0,containerWidth,containerHeight);
		container.attr({"stroke-width":0});

		var width=(containerWidth-gutter*2);
		var height=(containerHeight-gutter*2);

		this.drawGrid(width,height,values.length,5,gutter);

		var maxValue = Math.ceil(Math.max.apply(Math,values) / 5) * 5;
		var verticalScale = height/maxValue;
		var pointHorizontalDistance=width/(values.length-1);

		/* Horizontal Axis Labels */
		for(var i=0;i<values.length;i++){
			var hozLabel = this.text(gutter+(width/(values.length-1)*(i)), height+15+gutter, labels[i]);
			hozLabel.attr({"font-size":14});
		}
		/* Vertical Axis Labels */
		for(var i=0;i<=5;i++){
			var vertLabel = this.text(gutter/2,(height-i*(height/5))+gutter,(i*(maxValue)/5));
			vertLabel.attr({"font-size":14});
		}
	
		/* Move data into array ready for visualising, then generate string to plot graph */
		var ticketNumbersGraph = new Array();
		var plotString = '';
		for(var i=0;i<values.length;i++){
			ticketNumbersGraph.push((height-values[i]*verticalScale));
		}
		for(var i=1;i<values.length;i++){
			plotString=plotString+"L"+((pointHorizontalDistance*(i))+gutter)+","+(ticketNumbersGraph[i]+gutter);
		}
		var vector=this.path().attr({"stroke-width":3,"stroke-linejoin":"bevel","stroke":"#6D69F1"});
		vector.animate({path:"M"+gutter+","+(ticketNumbersGraph[0]+gutter)+plotString});
	}

	/* drawPie 
	* Draws segments of a pie for as long as they're available or there's space to place elements in the key.
	*
	* Takes the following arguments:
	* containerWidth = Width of the element in number of pixels the pie chart will reside in
	* containerHeight = Height of the element in number of pixels the pie chart will reside in
	* radius = How large, in pixels, the radius of the pie chart will be 
	* values = an Array of the values in the order in which they are to be displayed
	* labels = an Array of labels, that match the order of values in which they are to be assigned to segments of the chart
	*/
	Raphael.fn.drawPie = function(containerWidth, containerHeight, radius, values, labels){
		var totalOfValues = 0;
		for (var i = 0; i <= values.length-1; i++) {
			totalOfValues = totalOfValues + (values[i] * 1);
		};
		var iOriginX = containerWidth/2;
		var iOriginY = containerHeight/2;
		var prevDegree = 0;
		var currentValue = 0;
		var otherValue = 0;
		for (var i = 0; i <= values.length-1; i++) {
			currentValue = currentValue + (values[i] * 1);
			var thisDegree = (currentValue/totalOfValues) * 360;
			var iLastValue;
			if((i*35)<=containerHeight){
				this.drawSegment(this,iOriginX,iOriginY,thisDegree,prevDegree,radius,i,values[i]);
				this.drawKey(this,iOriginX,iOriginY,radius,i,i,labels[i],values[i]);
				var prevDegree = (currentValue/totalOfValues) * 360;
				iLastValue = i;
			} else {
				otherValue = otherValue + (values[i] * 1);
				if(i == values.length-1){
					this.drawSegment(this,iOriginX,iOriginY,thisDegree,prevDegree,radius,i);
					this.drawKey(this,iOriginX,iOriginY,radius,iLastValue+1,i,"Other",otherValue);
					var prevDegree = (currentValue/totalOfValues) * 360;
				}
				
			}
		};
	}

	/* 
		drawBar
		Draws a bar chart
	*/

	Raphael.fn.drawBarChart = function(containerWidth, containerHeight, values, labels, gutter){
		var container = this.rect(0,0,containerWidth,containerHeight);
		container.attr({"stroke-width":0});

		var width=(containerWidth-gutter*2);
		var height=(containerHeight-gutter*2);

		var graphAxis=this.path("M"+gutter+","+gutter+"L"+gutter+","+(height)+"H"+(width));

		var maxValue = Math.ceil(Math.max.apply(Math,values) / 5) * 5;
		var verticalScale = Math.floor(height/maxValue);

		var barWidth = Math.floor(width/(values.length+1+(values.length/2)));
		var barSpacing = barWidth/2;

		var barBottom = height;
		for (var i = 0; i <= values.length-1; i++) {
			rect=this.rect(((gutter+barSpacing)*(i+1)),(barBottom-(values[i]*verticalScale)),barWidth,values[i]*verticalScale);
			rect.attr({fill:aColors[i]});
			$(rect.node).attr('data-value',values[i]);
			rect.mouseover(function(){
				glow=this.glow({width:5,fill:true,opacity:0,color:"#000000"});
			});
			rect.mouseout(function(){
				glow.remove();
			})
		}
	}



	Raphael.fn.drawSegment = function(graph,iOriginX,iOriginY,thisDegree,prevDegree,radius,i,value){
		path=graph.path("M"+iOriginX+" "+iOriginY+"L"
			+(iOriginX+(radius*Math.cos(thisDegree * Math.PI/180)))+" "
			+(iOriginY+(radius*Math.sin(thisDegree * Math.PI/180)))+"A"+radius+" "+radius+" 0 0 0 "
			+(iOriginX+(radius*Math.cos(prevDegree * Math.PI/180)))+" "
			+(iOriginY+(radius*Math.sin(prevDegree * Math.PI/180)))+" L"+iOriginX+" "+iOriginY);
		path.attr({"fill":"#"+aColors[i],"stroke":"#C0C0C0","stroke-width":1});
		$(path.node).attr('data-value',value);
	}

	Raphael.fn.drawKey = function(graph, iOriginX, iOriginY,radius,i,color,label,value){
		var key = this.rect(iOriginX+(radius*1.5)-20,iOriginY-radius+(21*(i))-5,10,10,0);
			key.attr({"fill":aColors[color],"stroke-width":0});
			var text = this.text(iOriginX+(radius*1.5),iOriginY-radius+(21*(i)),label+ " - "+value);
			text.attr({"font-size":15,"text-anchor":"start"});
	}

	/* Raphael function to draw a grid for the graph */
	Raphael.fn.drawGrid = function(width,height,cols,rows,gutter){
		var wInterval = width/(cols-1);
		var hInterval = height/rows;
		//Horizontal Bars
		path = this.path().attr("stroke","#818181")
		for(var i=0;i<=rows;i++){
			path=this.path("M"+gutter+","+((i*hInterval)+gutter)+"H"+(width+gutter));
			path.attr("stroke","#818181");
		}
		//Vertical Bars
		for(var i=0;i<=cols;i++){
			path=this.path("M"+((i*wInterval)+gutter)+","+gutter+"V"+(height+gutter));
			path.attr("stroke","#818181");
		}
	}