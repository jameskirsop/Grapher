/*
	By James Kirsop - 2013
	Functions for Extending the functionality of Raphael to generate graphs
*/

	var aColors = new Array("b80043", "c85437", "32b9cd", "b44bb0", "ffea00", "b292d3", "2fd0c8", "face0a", "2267dd", "39c64c", "ff6600", "f20733", "25dacb", "c23d6e", "e718e3", "01feb2", "4cc33c", "51d8f0", "5cdf11", "00eaff", "ac21de", "ff0000", "33b2cc", "4330cf");
	
	Raphael.fn.drawGraph = function(containerWidth,containerHeight,labels,values,gutter){
		var container = this.rect(0,0,containerWidth,containerHeight);
		container.attr({"stroke-width":0});

		var width=(containerWidth-gutter*2);
		var height=(containerHeight-gutter*2);

		this.drawGrid(width,height,values.length,5,gutter);

		var verticalScale = height/Math.max.apply(Math,values);
		var pointHorizontalDistance=width/(values.length-1);

		/* Horizontal Axis Labels */
		for(var i=0;i<values.length;i++){
			var hozLabel = this.text(gutter+(width/(values.length-1)*(i)), height+15+gutter, labels[i]);
			hozLabel.attr({"font-size":14});
		}
		/* Vertical Axis Labels */
		for(var i=0;i<=5;i++){
			var vertLabel = this.text(gutter/2,(height-i*(height/5))+gutter,(i*(Math.max.apply(Math,values))/5));
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

	/* drawPie 
	* Takes the following arguments:
	* containerWidth = Width of the element in number of pixels the pie chart will reside in
	* containerHeight = Height of the element in number of pixels the pie chart will reside in
	* radius = How large, in pixels, the radius of the pie chart will be 
	* values = an Array of the values in the order in which they are to be displayed
	* labels = an Array of labels, that match the order of values in which they are to be assigned to segments of the chart
	*/
	Raphael.fn.drawPie = function(containerWidth, containerHeight, radius, values, labels){
		//var colours = new Array("4D7FFF","19C919","FFC508","7F65C2","FF3A3A","3BD8FF","AF9BFF","19C919","FFC508","7F65C2","FF3A3A","3BD8FF","FF00CC","FFE100","3349B6");
		var colours = aColors;
		var totalOfValues = 0;
		for (var i = 0; i <= values.length-1; i++) {
			totalOfValues = totalOfValues + (values[i] * 1);
		};
		var iOriginX = (containerWidth/2);
		var iOriginY = containerHeight/2;
		var prevDegree = 0;
		var valuesCount = 0;
		var bigBalloon = 0;
		for (var i = 0; i <= values.length-1; i++) {
			var colorIndex = Math.floor(Math.random() * (colours.length - 1 +1) + 0);
			valuesCount = valuesCount + (values[i] * 1);
			var thisDegree = (valuesCount/totalOfValues) * 360;
			path=this.path("M"+iOriginX+" "+iOriginY+"L"
				+(iOriginX+(radius*Math.cos(thisDegree * Math.PI/180)))+" "
				+(iOriginY+(radius*Math.sin(thisDegree * Math.PI/180)))+"A"+radius+" "+radius+" 0 "+bigBalloon+" 0 "
				+(iOriginX+(radius*Math.cos(prevDegree * Math.PI/180)))+" "
				+(iOriginY+(radius*Math.sin(prevDegree * Math.PI/180)))+" L"+iOriginX+" "+iOriginY);
			path.attr({"fill":"#"+colours[i],"stroke":"#C0C0C0","stroke-width":1});
			addX = 0;
			addY = 0;
			if (thisDegree <= 45 || thisDegree >= 315) {
				addX = radius/2;
			} else if (thisDegree >= 135 && thisDegree <= 225) {
				addX = -radius/2;
			};
			if (thisDegree >= 45 && thisDegree <= 135) {
				addY = radius/5;
			} else if (thisDegree >= 250 && thisDegree <= 305) {
				addY = -radius/5;
			};

			//for(var a=1;(a*50)<=containerHeight;a++){
			if((i*35)<=containerHeight){
				var key = this.rect(iOriginX+(radius*1.5)-20,iOriginY-radius+(21*(i))-5,10,10,0);
				key.attr({"fill":colours[i],"stroke-width":0});
				var text = this.text(iOriginX+(radius*1.5),iOriginY-radius+(21*(i)),labels[i]+ " - "+values[i]);
				text.attr({"font-size":15,"text-anchor":"start"});
				var prevDegree = (valuesCount/totalOfValues) * 360;
			}
		};
	}