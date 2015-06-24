///////////////////////////////////////////////////////////////////////////
//////////// State of the State Main Code - Chord Diagram /////////////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
///////////////////////////////////////////////////////////////////////////

var //roseMargin = {left: 100, top: 20, right: 30, bottom: 20},
	//roseWidth = 500 - roseMargin.left - roseMargin.right,
    //roseHeight = 1200 - roseMargin.top - roseMargin.bottom,
	rosePadding = 0,
    roseRadius = 120;

//The data per HBO/MBO	
var roseData = {
	WO: [
		[0,0,0.08,0,0.28,0,0.04,0.04,0.04,0.12,0,0], //Drenthe
		[0.056,0.037,0,0.019,0.204,0.019,0,0.037,0.056,0.056,0,0], //Friesland
		[0.061,0.007,0.082,0.033,0,0.012,0.019,0.135,0.079,0.079,0,0.049], //Groningen
		[0.021,0.021,0.021,0.104,0.104,0.042,0.083,0.042,0,0.104,0,0.062] //Overijssel
		]
};

//The % that stays in each province, for the text in the middle
var roseDiagonal = {
		WO: [0.4,0.519,0.445,0.396]
	};
//Start of in the HBO mode	
var	chosen = "WO",
	roseColors = ["#EFB605", "#E79B01", "#E35B0F", "#DD092D", "#C50046", "#A70A61", "#892E83", "#604BA2", "#2D6AA6", "#089384", "#25AE64", "#7EB852"],
	roseProvincies = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "N. Brabant", "N. Holland", "Overijssel", "Utrecht", "Zeeland", "Z. Holland"];
//Create an SVG for each row in the data
var roseWrapper = d3.select(".dataresource.rose")
				.selectAll(".windRoses")
					.data(roseData[chosen])
				  .enter().append("svg")
					.attr("class", "windRoses")
					.attr("width", (roseRadius*1.2 + rosePadding) * 2)
					.attr("height", (roseRadius*1.2 + rosePadding) * 2)
					.attr("id", function(d,i) {return 'pie'+i;});

//Create a g element per data row (province)				  
var flowers = roseWrapper.append("g")
					.attr("transform", "translate(" + (roseRadius + rosePadding) + "," + (roseRadius + rosePadding) + ")");

//Draw the windroses				
drawRosesWO(roseData, roseDiagonal, roseProvincies, provinciesChosen = ["Drenthe", "Friesland", "Groningen", "Overijssel"], 
			roseRadius, roseColors);

///////////////////////////////////////////////////////////////////////////
//////////////////// Draw legends and explanations ////////////////////////
///////////////////////////////////////////////////////////////////////////

function createRoseLegend() {
	
	//Create the needed height and width of the legend so it will fill,
	//but not overflow the div
	var legendRectSize = 10, //dimensions of the colored square
		legendProvincieWidth = 100, //width of one legend square-text element
		legendProvincieHeight = 20, //height of one legend square-text element
		legendWidth = $("#roseLegendSquares").width(), //the width of the bootstrap div
		legendNumCols = Math.floor(legendWidth / legendProvincieWidth), //what number of columns fits in div
		legendNumRows = Math.ceil(12/legendNumCols),	//what number of rows is needed to place the 12 provinces
		legendHeight = legendNumRows * legendProvincieHeight; //what is the total height needed for the entire legend
					
	//Create container per rect/text pair  
	var legendWrapper = d3.select("#roseLegendSquares").append("svg")
			.attr("width", legendWidth)
			.attr("height", legendHeight);
	
	var legend = legendWrapper.selectAll('.roseLegendSquare')  	
			  .data(roseColors)                              
			  .enter().append('g')   
			  .attr('class', 'roseLegendSquare')                                
			  .attr('width', legendProvincieWidth)
			  .attr('height', legendProvincieHeight)
			  .attr("transform", function(d,i) { return "translate(" + (Math.floor(i/legendNumRows) * 100) + "," + (i%legendNumRows * 20) + ")"; });
	  
		//Append circles to Legend
		legend.append('rect')                                     
			  .attr('width', legendRectSize) 
			  .attr('height', legendRectSize) 			  
			  .attr('transform', 'translate(' + 10 + ',' + 0 + ')') 		  
			  .style('fill', function(d) {return d;});                                  
		//Append text to Legend
		legend.append('text')                                     
			  .attr('transform', 'translate(' + (legendRectSize + 10 + 5) + ',' + (legendRectSize/2) + ')')
			  .style("text-anchor", "start")
			  .attr("dy", ".35em")
			  .attr("fill", "#4F4F4F")
			  .style("font-size", "10px")			  
			  .text(function(d,i) { return roseProvincies[i]; });  

	//Create the explanation of the three little circles
	var svgRose = 	d3.select("#roseLegendCircles").append("svg")
		.attr("width", $("#roseLegendCircles").width())
		.attr("height", $("#roseLegendCircles").height()/(mobileScreen ? 2 : 3));

	svgRose.selectAll(".flowerLegend.circle")
		.data([1,2,3])
		.enter().append("circle")
		.attr("class", "flowerLegend circle")
		.attr("r", function(d) { return d; })
		.style("fill", "#B5B5B5")
		.attr("transform", function(d,i) { 
			return "translate(" + (i * 10 + 10) + ",10)";
		});
	svgRose.append("text")
		.attr("x", 50)
		.attr("y", 10)
		.attr("dy", ".35em")
		.style("text-anchor", "start")
		.attr("fill", "#4F4F4F")
		.style("font-size", "11px")
		.text("Geeft aan dat dit de provincie zelf is. Dit stukje is leeg gelaten en het percentage van afgestudeerden dat " +
			  "na 1.5 jaar in dezelfde provincie woont staat in het midden van elke plot")
		.call(wrap, ($("#roseLegendCircles").width() - 60));			  
};//function createRoseLegend

//Draw the legend
createRoseLegend();

///////////////////////////////////////////////////////////////////////////
///////////////// State of the State - Draw windroses /////////////////////
///////////////////////////////////////////////////////////////////////////

function drawRosesWO(data, diagonal, provincies, provinciesChosen, radius, color) {
	
	var innerRadius = 0.2 * radius;
	
	var color = d3.scale.ordinal()
		.domain([0,1,2,3,4,5,6,7,8,9,10,11])
		.range(color);
		
	var pieScale = d3.scale.linear()
					.domain([0,0.2])
					.range([0,1]);
					
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return 1;})
		.padAngle(.02);

	var arc = d3.svg.arc()
	  .innerRadius(function (d) { 
			if (d.data < 0.005 ) {return 0;}
			else {return innerRadius;}
	  })
	  .outerRadius(function (d) { 
			if (d.data < 0.005 ) {return 0;} 
			else {return (radius - innerRadius) * pieScale(d.data) + innerRadius;}
	  });

	//Add the windroses
	var flowerSlices = flowers.selectAll(".solidArc.slice")
		.data(pie)
	  .enter().append("path")
		.attr("fill", function(d,i) { return color(i); })
		.attr("class", "solidArc slice")
		.attr("stroke", "white")
		.attr("d", arc)
		.each(function(d) { this._current = d; }) // store the initial angles
		.on("mouseover", function (d, i, j) { showRoseTooltip.call(this, d, i, j); })
		.on("mouseout",  function (d) { removeRoseTooltip(); });

	//Add the province texts above	
	flowers.append("text")
		.attr("dy", ".35em")
		.style("font-size", "12px")
		.attr("class", "flower titles")
		.attr("fill", "#6E6E6E")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(0," + (-radius + 20) + ")")
	  .text(function(d,i) { return "... " + provinciesChosen[i]; });

	//Add text in center of flower	
	var flowerText = flowers.append("text")
		.attr("class", "flower value")
		.attr("x", 0)
		.attr("y", -7)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.style("font-size", "12px")
		.text(function(d,i) {return numFormatPercent(diagonal[chosen][i]); });	
	flowers.append("text")
		.attr("class", "flower subValueText")
		.attr("x", 0)
		.attr("y", 6)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.attr("fill", "#949494")
		.style("font-size", "8px")
		.text("verhuist");	
	flowers.append("text")
		.attr("class", "flower subValueText")
		.attr("x", 0)
		.attr("y", 14)
		.attr("text-anchor", "middle")
		.attr("dy", ".35em")
		.attr("fill", "#949494")
		.style("font-size", "8px")
		.text("niet");


	//Draw the three little grey circles per rose
	var roseLocation = [0, 2, 4, 8];
	drawRoseCircle(1, 0.05);
	drawRoseCircle(2, 0.125);
	drawRoseCircle(3, 0.22);
	
	////////////////////////////////////////////////////////////
	////////////////// Button Activity /////////////////////////
	////////////////////////////////////////////////////////////

	/* Activate the buttons and link to data sets */
	d3.selectAll(".roseButton").on("click", updateRoses);

	////////////////////////////////////////////////////////////
	////////////////// Button Activity /////////////////////////
	////////////////////////////////////////////////////////////

	//Hide the tooltip when the mouse moves away
	function removeRoseTooltip () {
	  $('.popover').each(function() {
		$(this).remove();
	  }); 
	}
	//Show the tooltip on the hovered over slice
	function showRoseTooltip (d, i, j) {
	  $(this).popover({
		placement: 'auto top',
		container: '.dataresource.rose',
		trigger: 'manual',
		html : true,
		content: function() { 
		  return "<span style='font-size: 11px;'><span style='color: #00A1DE; font-weight: bold;'>" + numFormatPercentDec(d.data) + "</span>" + 
		  " verhuist van " + provincies[roseLocation[j]] + " naar <span style='color: #00A1DE; font-weight: bold;'>" + provincies[i] + "</span></span>"; }
	  });
	  $(this).popover('show')
	}

	//Function to draw little circles at the location that is the province itself
	function drawRoseCircle(radiusCirle, extra) {
		flowers.append("circle")
			.attr("class", "flower circle")
			.attr("r", radiusCirle)
			.style("fill", "#B5B5B5")
			.attr("transform", function(d,i) { 
				d.angle = Math.PI*2/24 * (2*roseLocation[i]+1);
				return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
				+ "translate(" + (innerRadius + (extra*radius)) + ",0)"
			});
	}//drawRoseCircle
	
	//Update the roses
	function updateRoses() {
		chosen = d3.select(this).attr("value");
		
		//Update the data 
		//Taken from: http://stackoverflow.com/questions/25911019/d3-multiple-pie-chart-updates
		for(x in data[chosen]) {
			var npath = d3.select("#pie"+x).selectAll("path").data(pie(data[chosen][x]))
			npath.transition().duration(1000).attrTween("d", arcTween); // redraw the arcs
		}//for
		
		//Update the text in the middle
		flowers.selectAll(".flower.value")
			.text(function(d,i,j) {return numFormatPercent(diagonal[chosen][j]); })
	}//drawRoseCircle

	// Store the displayed angles in _current.
	// Then, interpolate from _current to the new angles.
	// During the transition, _current is updated in-place by d3.interpolate.
	function arcTween(a) {
	  var i = d3.interpolate(this._current, a);
	  this._current = i(0);
	  return function(t) {
		return arc(i(t));
	  };
	}	
}; //function drawRoses

