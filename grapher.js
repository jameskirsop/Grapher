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
	*/
	Raphael.fn.drawGraph = function(options){

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
		for(var i=1;i<options.values.length;i++){
			plotString=plotString+"L"+((pointHorizontalDistance*(i))+options.gutter)+","+(ticketNumbersGraph[i]+options.gutter);
		}
		var vector=this.path().attr({"stroke-width":3,"stroke-linejoin":"bevel","stroke":"#6D69F1"});
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
		var iOriginX = this.width*0.4;
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
				this.drawKey(this,iOriginX,iOriginY,radius,i,i,options.values[i].name,options.values[i].value);
				var prevDegree = (currentValue/totalOfValues) * 360;
				iLastValue = i;
			} else {
				otherValue = otherValue + (options.values[i].value * 1);
				if(i == options.values.length-1){
					this.drawSegment(this,iOriginX,iOriginY,parseFloat(thisDegree).toFixed(2),parseFloat(prevDegree).toFixed(2),radius,iLastValue+1);
					this.drawKey(this,iOriginX,iOriginY,radius,iLastValue+1,iLastValue+1,"Other",otherValue);
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

		var graphAxis=this.path("M"+options.gutter+","+options.gutter+"L"+options.gutter+","+(height)+"H"+(width));

		var aValues = [];
		for (var i = 0; i <= options.values.length-1; i++){
			aValues.push(options.values[i].value);
		}
		if(typeof options.maxValue == 'undefined'){
			var maxValue = Math.ceil(Math.max.apply(Math,aValues) / 5) * 5;
		} else {
			var maxValue = options.maxValue;
		}
		var verticalScale = Math.floor(height/maxValue);

		var barWidth = Math.floor(width/(options.values.length+1+(options.values.length/2)));
		var barSpacing = Math.floor(barWidth/2);

		var barBottom = height;
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

	Raphael.fn.drawKey = function(graph, iOriginX, iOriginY,radius,i,color,label,value){
		var key = this.rect(iOriginX+(radius*1.4)-20,iOriginY-radius+(21*(i)),10,10,0);
			key.attr({"fill":aColors[color],"stroke-width":0});
			var text = this.text(iOriginX+(radius*1.4),iOriginY-radius+(21*(i))+5,label+ " - "+value);
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