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
			  .attr("fill", "#949494")
			  .style("font-size", 10)			  
			  .text(function(d,i) { return roseProvincies[i]; });  

	//Create the explanation of the three little circles
	var svgRose = 	d3.select("#roseLegendCircles").append("svg")
		.attr("width", $("#roseLegendCircles").width())
		.attr("height", $("#roseLegendCircles").height()/3);

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
		.attr("fill", "#949494")
		.style("font-size", 11)
		.text("Geeft aan dat dit de provincie zelf is. Dit stukje is leeg gelaten en het percentage van afgestudeerden dat " +
			  "na 1.5 jaar in dezelfde provincie woont staat in het midden van elke plot")
		.call(wrap, ($("#roseLegendCircles").width() - 60));			  
};//function createRoseLegend

//Draw the legend
createRoseLegend();

