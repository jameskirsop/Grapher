/*
	Grapher.js
	Simple functions for Extending the functionality of Raphael to generate graphs
	Copyright 2013 James Kirsop
	www.jameskirsop.com
	Email Me: james.kirsop@gmail.com
*/
	var ObjColor = net.brehaut.Color;
	var aSeedColors = new Array("#b80043", "#c85437", "#32b9cd", "#b44bb0", "#ffea00", "#b292d3", "#2fd0c8", "#face0a", "#2267dd", "#39c64c", "#ff6600", "#f20733", "#25dacb", "#c23d6e", "#e718e3", "#01feb2", "#4cc33c", "#51d8f0", "#5cdf11", "#00eaff", "#ac21de", "#ff0000", "#33b2cc", "#4330cf");
	var aColors = new Array();
	var sStrokeColor = '#B6B6B6';

	function getColorArray(selection, seedLength){
		seedLength = typeof seedLength !== 'undefined' ? seedLength : 20;
		var tColorArray = new Array();
		switch(selection){
			case 'gradient':
				tColorArray = seedColoursGradient(seedLength);
				break;
			case 'random':
				tColorArray = seedColoursRandom(seedLength);
				break;
			default:
			tColorArray = aSeedColors;
		}
		return tColorArray;
	}

	function seedColoursGradient(seedLength){
		var tColorArray = new Array();
		var oColor = ObjColor(aSeedColors[Math.round(Math.random()*aSeedColors.length-1)]);
		var taColor = oColor.analogousScheme(); //neutralScheme
		for (var i = 0; i <= seedLength; i++) {
			var iRand = Math.round(Math.random()*taColor.length);
			tColorArray.push(taColor[iRand] = "#FFFFFF" ? taColor[1] : taColor[iRand]);
			tempColor = ObjColor(tColorArray[i]);
			taColor = tempColor.analogousScheme();
		};
		return tColorArray;
	}

	function seedColoursRandom(seedLength){
		var tColorArray = new Array();
		var oColor = ObjColor(aSeedColors[Math.round(Math.random()*aSeedColors.length-1)]);
		var taColor = oColor.tetradicScheme();
		for (var i = 0; i <= seedLength; i++) {
			var iRand = Math.round(Math.random()*taColor.length);
			tColorArray.push(taColor[iRand] = "#FFFFFF" ? taColor[1] : taColor[iRand]);
			tempColor = ObjColor(tColorArray[i]);
			if(i % 2 == 0){
				taColor = tempColor.analogousScheme();
			} else {
				taColor = tempColor.tetradicScheme();
			}
		};
		return tColorArray;	
	}

	/*
		drawGraph()
		Takes the following values within an object:
		values: an Array of objects with attributes 'name' and 'values'
		gutter - Integer - How much space (in pixels) is required around the graph to fit the labels in on both the left vertical and bottom horizontal axis
		fill: (optional) Boolean, default false
		curved: (optional) Boolean, default false
		class: (optional) A string to fill the 'class' HTML attribute
		id: (optional) A string to fill the 'id' HTML attribute
	*/
	Raphael.fn.drawGraph = function(options){
		options.fill = (typeof options.fill == 'undefined') ? false : true;
		options.curved = (typeof options.curved == 'undefined') ? false : true;
		var width=(this.width-options.gutter*2);
		var height=(this.height-options.gutter*2);

		this.drawGrid(width,height,options.values.length,5,options.gutter);

		var aValues = [];
		for (var i = 0; i <= options.values.length-1; i++){
			aValues.push(options.values[i].value);
		}
		if(typeof options.maxValue == 'undefined'){
			var maxValue = Math.ceil(Math.max.apply(Math,aValues) / 5) * 5;
		} else {
			var maxValue = options.maxValue;
		}

		var aMinMax = [height+(options.gutter), options.gutter];
		var verticalScale = height/maxValue;
		var pointHorizontalDistance=width/(options.values.length-1);

		/* Horizontal Axis Labels */
		for(var i=0;i<options.values.length;i++){
			var hozLabel = this.text(options.gutter+(width/(options.values.length-1)*(i)), height+15+options.gutter, options.values[i].name);
			hozLabel.attr({"font-size":14});
		}
		/* Vertical Axis Labels */
		for(var i=0;i<=5;i++){
			var vertLabel = this.text(options.gutter/2,(height-i*(height/5))+options.gutter,(i*(maxValue)/5));
			vertLabel.attr({"font-size":14});
		}
	
		/* Move data into array ready for visualising, then generate string to plot graph */
		var ticketNumbersGraph = new Array();
		var plotString = '';
		for(var i=0;i<options.values.length;i++){
			ticketNumbersGraph.push((height-options.values[i].value*verticalScale));
		}
		if(!options.curved){
			for(var i=1;i<options.values.length;i++){
				plotString=plotString+"L"+((pointHorizontalDistance*(i))+options.gutter)+","+(ticketNumbersGraph[i]+options.gutter);
			}
		} else {
			ticketNumbersGraph.push(ticketNumbersGraph[ticketNumbersGraph.length-1]);
			plotString = '';
			var p0 = {x:pointHorizontalDistance*(0)+options.gutter,y:ticketNumbersGraph[0]+options.gutter};
			var p2 = {x:pointHorizontalDistance*(1)+options.gutter, y:ticketNumbersGraph[1]+options.gutter};
			tempAValues = options.values;
			lastPoints = this.findBezierPoints(p0,p0,p2);
			a=options.gutter;
			b=height+options.gutter*2;
			for(var i=1;i<=options.values.length;i++){
				var p0 = {x:pointHorizontalDistance*(i-1)+options.gutter,y:ticketNumbersGraph[i-1]+options.gutter};
				var p1 = {x:pointHorizontalDistance*(i)+options.gutter,y:ticketNumbersGraph[i]+options.gutter};
				var p2 = {x:pointHorizontalDistance*(i+1)+options.gutter,y:ticketNumbersGraph[i+1]+options.gutter};  
				points = this.findBezierPoints(p0,p1,p2);
				a = b =0;
				plotString=plotString + "C"+ lastPoints.c2.x +","+((options.gutter<lastPoints.c2.y==lastPoints.c2.y<height+options.gutter) ? lastPoints.c2.y : this.closest(aMinMax,lastPoints.c2.y))+" "+points.c1.x+","+((options.gutter<points.c1.y==points.c1.y<height+options.gutter) ? points.c1.y : this.closest(aMinMax,points.c1.y))+" "+(pointHorizontalDistance*(i)+options.gutter)+" "+(ticketNumbersGraph[i]+options.gutter);
				lastPoints = points;
			}
		}
		var vector=this.path().attr({"stroke-width":3,"stroke-linejoin":"bevel","stroke":"#3060FC"});
		if(options.fill){
			plotString = plotString + "V"+(parseInt(height+options.gutter)) + "H"+options.gutter+"Z";			
		}
		console.log(plotString);
		if(typeof options.class != 'undefined'){
			vector.node.setAttribute("class",options.class);
		}
		if(typeof options.id != 'undefined'){
			vector.node.setAttribute("id",options.id);
		}
		vector.animate({path:"M"+options.gutter+","+(ticketNumbersGraph[0]+options.gutter)+plotString});
	}

	/* drawPie 
	* Draws segments of a pie for as long as they're available or there's space to place elements in the key.
	*
	* Takes the following values in an options object:
	* radius = How large, in pixels, the radius of the pie chart will be 
	* values = an Array of the objects with the names and values in the order in which they are to be displayed
	*/
	Raphael.fn.drawPie = function(options){
		var widthRatio = 280/this.width;
		var heightRatio = 280/this.height;
		var totalOfValues = 0;
		for (var i = 0; i <= options.values.length-1; i++) {
			totalOfValues = totalOfValues + (options.values[i].value * 1);
		};
		var iOriginX = this.width*0.38;
		var iOriginY = this.height/2;
		var prevDegree = 0;
		var currentValue = 0;
		var otherValue = 0;
		aColors = getColorArray(options.fillColors,options.values.length);
		if(this.width <= this.height){
			var radius = ((this.width-(75*widthRatio))*widthRatio)/2;
		} else {
			var radius = ((this.height-(50*heightRatio))*heightRatio)/2;
		}
		for (var i = 0; i <= options.values.length-1; i++) {
			currentValue = currentValue + (options.values[i].value * 1);
			var thisDegree = (currentValue/totalOfValues) * 360;
			var iLastValue;
			if((i*32)<=radius*2.5){
				this.drawSegment(this,iOriginX,iOriginY,parseFloat(thisDegree).toFixed(2),parseFloat(prevDegree).toFixed(2),radius,i,options.values[i].value);
				this.drawKey(iOriginX,iOriginY,radius,i,i,options.values[i].name,options.values[i].value);
				var prevDegree = (currentValue/totalOfValues) * 360;
				iLastValue = i;
			} else {
				otherValue = otherValue + (options.values[i].value * 1);
				if(i == options.values.length-1){
					this.drawSegment(this,iOriginX,iOriginY,parseFloat(thisDegree).toFixed(2),parseFloat(prevDegree).toFixed(2),radius,iLastValue+1);
					this.drawKey(iOriginX,iOriginY,radius,iLastValue+1,iLastValue+1,"Other",otherValue);
					var prevDegree = (currentValue/totalOfValues) * 360;
				}
				
			}
		};
	}

	/* 
		drawBar
		Draws a bar chart
	*/

	Raphael.fn.drawBarChart = function(options){
		aColors = getColorArray('default',options.values.length);
		if(typeof options.gutter == 'undefined'){
			options.gutter = 20;
		}

		var width=(this.width-options.gutter*2);
		var height=(this.height-options.gutter*2);

		var graphAxis=this.path("M"+options.gutter+","+options.gutter+"V"+(height+options.gutter)+"H"+(width));

		var aValues = [];
		for (var i = 0; i <= options.values.length-1; i++){
			aValues.push(options.values[i].value);
		}
		if(typeof options.maxValue == 'undefined'){
			var maxValue = Math.ceil(Math.max.apply(Math,aValues) / 5) * 5;
		} else {
			var maxValue = options.maxValue;
		}
		var verticalScale = (height/maxValue);

		var barWidth = Math.floor(width/(options.values.length+1+(options.values.length/2)));
		var barSpacing = Math.floor(barWidth/2);

		var barBottom = (height+options.gutter);
		for (var i = 0; i <= options.values.length-1; i++) {
			rect=this.rect((options.gutter+(barSpacing)*(i+1)+(barWidth*i)),(barBottom-(options.values[i].value*verticalScale)),barWidth,options.values[i].value*verticalScale);
			var colorString = (typeof options.values[i].color === 'undefined' ? aColors[i] : options.values[i].color );
			var colorObject = ObjColor(colorString);
			if(typeof options.values[i].color === 'undefined'){
				rect.attr({fill:colorString});
			} else {
				rect.attr({fill:colorString});
			}
			if(options.showLabels == true){
				var text = this.text((options.gutter+(barSpacing)*(i+1)+(barWidth*i))+(barWidth/2),barBottom-(options.values[i].value*verticalScale)-10,options.values[i].name+ " - "+options.values[i].value);
				if (Math.floor(options.values[i].value/maxValue*100) > 80) {
					if(parseFloat(colorObject.getLightness())*10 <= 5){
						text.attr({"fill":"#F3F3F3"});
					}
					text.translate("T0,20").rotate(270).attr({"text-anchor":"end"});
				} else {
					text.rotate(270).attr({"text-anchor":"start"});
				}
				var fontScaled = (barWidth < 15 ? barWidth*0.95 : 15);
				text.attr({"font-size":fontScaled});
			}
			$(rect.node).attr('data-value',options.values[i].value).attr('data-name',options.values[i].name);
			rect.mouseover(function(){
				glow=this.glow({width:5,fill:true,opacity:0,color:"#A2A2A2"});
				if(options.alertInfo){
					alert($(this.node).data('name') + ': '+$(this.node).data('value'));
				}
			});
			rect.mouseout(function(){
				glow.remove();
			})
		}
	}

	/* Math referenced via: http://www.niksula.hut.fi/~hkankaan/Homepages/bezierfast.html */
	Raphael.fn.findBezierPoints = function(p1,p2,p3){
		var dx1 = p1.x - p2.x, dy1 = p1.y - p2.y,
			dx2 = p2.x - p3.x, dy2 = p2.y - p3.y,

		l1 = Math.sqrt(dx1*dx1 + dy1*dy1),
		l2 = Math.sqrt(dx2*dx2 + dy2+dy2),

		m1 = {x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0},
		m2 = {x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0},

		dxm = (m1.x - m2.x),
		dym = (m1.y - m2.y),

		k = l2 / (l1 + l2),
		cm = {x: m2.x + dxm*k, y: m2.y + dym*k},
		tx = p2.x - cm.x, ty = p2.y - cm.y,

		c1 = {x: m1.x + tx, y: m1.y + ty},
		c2 = {x: m2.x + tx, y: m2.y + ty};

		return {c1: c1, c2: c2, l1: Math.floor(l1), l2: Math.floor(l2)};
	}

	Raphael.fn.drawSegment = function(graph,iOriginX,iOriginY,currentDegree,prevDegree,radius,i,value){
		if(currentDegree-prevDegree < 180){
			path=graph.path("M"+iOriginX+" "+iOriginY+"L"
			+(iOriginX+(radius*Math.cos(prevDegree * Math.PI/180)))+" "
			+(iOriginY+(radius*Math.sin(prevDegree * Math.PI/180)))+"A"+radius+" "+radius+" 0 0 1 "
			+(iOriginX+(radius*Math.cos(currentDegree * Math.PI/180)))+" "
			+(iOriginY+(radius*Math.sin(currentDegree * Math.PI/180)))+" L"+iOriginX+" "+iOriginY);
			path.attr({"fill":aColors[i],"stroke":"#C0C0C0","stroke-width":1});
		$(path.node).attr('data-value',value);
		} else {
			drawDegreeHalf = ((+currentDegree - +prevDegree)/2).toFixed(4);
			pathString = "M"+iOriginX+" "+iOriginY+"L";
			for (var a = 1; a <= 2; a++) {
				pathString = pathString+(iOriginX+(radius*Math.cos(prevDegree * Math.PI/180)))+" "
				+(iOriginY+(radius*Math.sin(prevDegree * Math.PI/180)))+"A"+radius+" "+radius+" 0 0 1 "
				+(iOriginX+(radius*Math.cos((+prevDegree + +drawDegreeHalf) * Math.PI/180)))+" "
				+(iOriginY+(radius*Math.sin((+prevDegree + +drawDegreeHalf) * Math.PI/180)));
				prevDegree = +prevDegree + +drawDegreeHalf;
					
			};
			path=graph.path(pathString+" L"+iOriginX+" "+iOriginY);
			path.attr({"fill":aColors[i],"stroke":"#C0C0C0","stroke-width":1});
			$(path.node).attr('data-value',value);
		}
	}

	Raphael.fn.drawKey = function(iOriginX,iOriginY,radius,i,color,label,value){
		var factor = 1;
		var key = this.rect(iOriginX+(radius+30*factor)-20,iOriginY-radius+(21*(i)),10*factor,10*factor,0);
			key.attr({"fill":aColors[color],"stroke-width":0});
			var text = this.text(iOriginX+(radius+30*factor),iOriginY-radius+(21*(i))+5,label+ " - "+value);
			text.attr({"font-size":15*factor,"text-anchor":"start"});
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

Raphael.fn.closest = function(array,num){
  var i=0;
  var minDiff=1000;
  var ans;
  for(i in array){
		var m=Math.abs(num-array[i]);
		if(m<minDiff){ 
		      minDiff=m; 
		      ans=array[i]; 
		}
	}
  return ans;
}
 