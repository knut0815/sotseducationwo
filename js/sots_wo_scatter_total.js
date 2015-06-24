///////////////////////////////////////////////////////////////////////////
/////// State of the State - Onderwijs Main Code - Scatter plots //////////
///////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
///////////////////////////////////////////////////////////////////////////

var scatterMargin = {left: 50, top: 50, right: 20, bottom: 50},
	scatterWidth = Math.min($(".dataresource.scatterWO").width(),700) - scatterMargin.left - scatterMargin.right,
	scatterHeight = scatterWidth*2/3,
	scatterLegendMargin = {left: 0, top: 30, right: 0, bottom: 10},
	scatterLegendWidth = $(".dataresource.scatterLegend").width() - scatterLegendMargin.left - scatterLegendMargin.right,
	scatterLegendHeight = 310;

//Create and SVG for each element
var svgScatterWO = d3.select(".dataresource.scatterWO").append("svg")
			.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
			.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

var svgScatterLegend = d3.select(".dataresource.scatterLegend").append("svg")
			.attr("width", (scatterLegendWidth + scatterLegendMargin.left + scatterLegendMargin.right))
			.attr("height", (scatterLegendHeight + scatterLegendMargin.top + scatterLegendMargin.bottom));			

//Create and g element for each SVG			
var scatterWO = svgScatterWO.append("g").attr("class", "chartWO")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
		
var scatterLegend = svgScatterLegend.append("g").attr("class", "legendWrapper")
				.attr("transform", "translate(" + (scatterLegendWidth/2 + scatterLegendMargin.left) + "," + (scatterLegendMargin.top) +")");

						
///////////////////////////////////////////////////////////////////////////
/////////////////// Scatterplot specific functions ////////////////////////
///////////////////////////////////////////////////////////////////////////

function createScatterLegend() {
	
	var legendRectSize = 20, //dimensions of the colored square
		legendSectorHeight = 25,
		legendMaxWidth = 125; //maximum size that the longest element will be - to center content
					
	//Create container for all rectangles and text 
	var sectorLegendWrapper = scatterLegend.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + 0 + "," + 0 +")");
		  
	//Create container per rect/text pair  
	var sectorLegend = sectorLegendWrapper.selectAll('.scatterLegendSquare')  	
			  .data(sectorColor.range())                              
			  .enter().append('g')   
			  .attr('class', 'scatterLegendSquare') 
			  .attr('width', scatterLegendWidth)
			  .attr('height', legendSectorHeight)
			  .attr("transform", function(d,i) { return "translate(" + 0 + "," + (i * legendSectorHeight) + ")"; })
			  .style("cursor", "pointer")
			  .on("mouseover", sectorSelect(0.02))
			  .on("mouseout", sectorSelect(0.5))
			  .on("click", sectorClick);
	 
	//Non visible white rectangle behind square and text for better UX
	sectorLegend.append('rect')                                     
		  .attr('width', legendMaxWidth) 
		  .attr('height', legendSectorHeight) 			  
		  .attr('transform', 'translate(' + (-legendMaxWidth/2) + ',' + 0 + ')') 		  
		  .style('fill', "white");
	//Append small squares to Legend
	sectorLegend.append('rect')                                     
		  .attr('width', legendRectSize) 
		  .attr('height', legendRectSize) 			  
		  .attr('transform', 'translate(' + (-legendMaxWidth/2) + ',' + 0 + ')') 		  
		  .style('fill', function(d) {return d;});                                 
	//Append text to Legend
	sectorLegend.append('text')                                     
		  .attr('transform', 'translate(' + (-legendMaxWidth/2 + 25) + ',' + (legendRectSize/2) + ')')
		  .attr("class", "legendText")
		  .style("text-anchor", "start")
		  .attr("dy", ".30em")
		  //.attr("fill", "#949494")
		  .style("font-size", "11px")			  
		  .text(function(d,i) { return sectorColor.domain()[i]; });  

	//Create g element for bubble size legend
	var bubbleSizeLegend = scatterLegend.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + 50 + "," + (8*legendSectorHeight + 60) +")");
	//Draw the bubble size legend
	bubbleLegend(bubbleSizeLegend, rScale, legendSizes = [10, 40, 100], legendName = "Aantal respondenten");		

	//Create a wrapper for the circle legend				
	var legendCircle = scatterLegend.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + -50 + "," + (8*legendSectorHeight + 60) +")");
	
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + 0 + "," + -14 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text("Elke cirkel is een opleiding")
		.call(wrap, 90);
	legendCircle.append("circle")
        .attr('r', rScale(100))
        .attr('class',"legendCircle")
        .attr('cx', 0)
        .attr('cy', (50-rScale(100)))
		
}//function createScatterLegend				

///////////////////////////////////////////////////////////////////////////
///////////////////// Click functions for legend //////////////////////////
///////////////////////////////////////////////////////////////////////////

//Reset the click event when the user clicks anywhere but the legend
d3.select(".scatterOnderwijs").on("click", resetClick);

//Function to show only the circles for the clicked sector in the legend
function sectorClick(d,i) {
	
	event.stopPropagation();

	//deactivate the mouse over and mouse out events
	d3.selectAll(".scatterLegendSquare")
		.on("mouseover", null)
		.on("mouseout", null);
		
	//Chosen study sector
	var chosen = sectorColor.domain()[i];
		
	/////////////////// WO ///////////////////	
	//Only show the circles of the chosen sector
	scatterWO.selectAll("circle")
		.style("opacity", 0.5)
		.style("visibility", function(d) {
			if (d.Studie_sector != chosen) return "hidden";
			else return "visible";
		});
	
	//Make sure the pop-ups are only shown for the clicked on sector
	scatterWO.selectAll(".voronoi.WO")
		.on("mouseover", function(d,i) {
			if(d.Studie_sector != chosen) return null;
			else return showScatterTooltip.call(this, d, i);
		})
		.on("mouseout",  function(d,i) {
			if(d.Studie_sector != chosen) return null;
			else return removeScatterTooltip.call(this, d, i);
		});
	
}//sectorClick

//Show all the cirkels again when clicked outside legend
function resetClick() {	

	//Activate the mouse over and mouse out events of the legend
	d3.selectAll(".scatterLegendSquare")
		.on("mouseover", sectorSelect(0.02))
		.on("mouseout", sectorSelect(0.5));

	/////////////////// WO ///////////////////	
	//Show all circles
	scatterWO.selectAll("circle")
		.style("opacity", 0.5)
		.style("visibility", "visible");

	//Activate all pop-over events
	scatterWO.selectAll(".voronoi.MBO")
		.on("mouseover", showScatterTooltip)
		.on("mouseout",  function (d,i) { removeScatterTooltip.call(this, d, i); });

}//resetClick

///////////////////////////////////////////////////////////////////////////
/////////////////// Hover functions of the circles ////////////////////////
///////////////////////////////////////////////////////////////////////////

//Hide the tooltip when the mouse moves away
function removeScatterTooltip (d, i) {

	var element = d3.selectAll(".circle.WO."+d.StudieClass);
		
	//Fade out the bubble again
	element.style("opacity", 0.5);
	
	//Hide tooltip
	$('.popover').each(function() {
		$(this).remove();
	}); 
  
	//Fade out guide lines, then remove them
	d3.selectAll(".guide")
		.transition().duration(200)
		.style("opacity",  0)
		.remove()
}//function removeScatterTooltip

//Show the tooltip on the hovered over slice
function showScatterTooltip (d, i) {
		
	var element = d3.selectAll(".circle.WO."+d.StudieClass),
		cont = '.dataresource.scatterWO',
		chartSVG = scatterWO;
	
	//Define and show the tooltip
	$(element).popover({
		placement: 'auto top',
		container: cont,
		trigger: 'manual',
		html : true,
		content: function() { 
			return "<span style='font-size: 11px; text-align: center;'>" + d.Studienaam + "</span>"; }
	});
	$(element).popover('show');

	//Make chosen circle more visible
	element.style("opacity", 1);
	
	//Append lines to bubbles that will be used to show the precise data points
	//vertical line
	chartSVG.append("g")
		.attr("class", "guide")
		.append("line")
			.attr("x1", element.attr("cx"))
			.attr("x2", element.attr("cx"))
			.attr("y1", +element.attr("cy"))
			.attr("y2", (scatterHeight))
			.style("stroke", element.style("fill"))
			.style("opacity",  0)
			.style("pointer-events", "none")
			.transition().duration(400)
			.style("opacity", 0.5);
	//horizontal line
	chartSVG.append("g")
		.attr("class", "guide")
		.append("line")
			.attr("x1", +element.attr("cx"))
			.attr("x2", 0)
			.attr("y1", element.attr("cy"))
			.attr("y2", element.attr("cy"))
			.style("stroke", element.style("fill"))
			.style("opacity",  0)
			.style("pointer-events", "none")
			.transition().duration(400)
			.style("opacity", 0.5);
					
}//function showScatterTooltip

///////////////////////////////////////////////////////////////////////////
//////////////////// Hover function for the legend ////////////////////////
///////////////////////////////////////////////////////////////////////////
	
//Decrease opacity of non selected study sectors when hovering in Legend	
function sectorSelect(opacity) {
	return function(d, i) {
		var chosen = sectorColor.domain()[i];
			
		scatterWO.selectAll("circle")
			.filter(function(d) { return d.Studie_sector != chosen; })
			.transition()
			.style("opacity", opacity);
	  };
}//function sectorSelect
	
//////////////////////////////////////////////////////
/////////////// Draw the Scatter plot ////////////////
//////////////////////////////////////////////////////
						 
function drawScatterWO(data, wrapper, width, height, margin, chartTitle, circleClass) {
							 
	//////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	//////////////////////////////////////////////////////

	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([0, width])
		.domain([0,1])
		.nice();
	//Set new x-axis	
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(5)
		.tickFormat(numFormatPercent)
		.scale(xScale);	

	//Append the x-axis
	wrapper.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(xAxis);
			
	//Set the new y axis range
	var yScale = d3.scale.linear()
		.range([height,0])
		.domain([0,1])
		.nice();
		
	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(6)  //Set rough # of ticks
		.tickFormat(numFormatPercent)
		.scale(yScale);	

	//Append the y-axis
	wrapper.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.call(yAxis);

	////////////////////////////////////////////////////////////	
	///////////////////////// Trendline ////////////////////////
	////////////////////////////////////////////////////////////
	
	// Add trendline
	wrapper.append("line")
		.attr("class", "trendline")
		.attr("x1", xScale(0.1))
		.attr("y1", yScale(0.84992))
		.attr("x2", xScale(0.8))
		.attr("y2", yScale(0.20886));
		
	////////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	////////////////////////////////////////////////////////////	
	//Already defined in global
	//var rScale = d3.scale.sqrt()
	//				.range([0, 20])
	//				.domain([0, 5000]);
	//var sectorColor = d3.scale.ordinal()
	//				.range(["#EFB605", "#E3690B", "#CF003E", "#991C71", "#4F54A8", "#07997E", "#7EB852"])
	//				.domain(["economie", "gedrag & maatschappij", "gezondheidszorg", "kunst, taal en cultuur", "landbouw", "onderwijs", "techniek"]);
				
	wrapper.selectAll("circle")
			.data(data.sort(function(a,b) { return b.Total > a.Total; })) //Sort so the biggest circles are below
			.enter().append("circle")
				.attr("class", function(d,i) { return "circle " + circleClass + " " + d.StudieClass; })
				.style("opacity", 0.6)
				.style("stroke", function(d) { if(d.Studienaam.indexOf("Overig") > -1) return d3.rgb(sectorColor(d.Studie_sector)).darker(); })
				.style("stroke-width", function(d) { if(d.Studienaam.indexOf("Overig") > -1) return 1.5; })
				.style("fill", function(d) {return sectorColor(d.Studie_sector);})
				.attr("cx", function(d) {return xScale(d.perc_blijft);})
				.attr("cy", function(d) {return yScale(d.perc_goed_voldoende);})
				.attr("r", function(d) {return rScale(d.Total);})
				.style("pointer-events", "none");
				
	////////////////////////////////////////////////////////////// 
	//////////////////////// Voronoi ///////////////////////////// 
	////////////////////////////////////////////////////////////// 

	//Initiate the voronoi function
	var voronoi = d3.geom.voronoi()
		.x(function(d) { return xScale(d.perc_blijft); })
		.y(function(d) { return yScale(d.perc_goed_voldoende); })
		.clipExtent([[0, 0], [width, height]]);

	//Initiate the voronoi group element	
	var voronoiGroup = wrapper.append("g")
		.attr("class", "voronoi");
		
	voronoiGroup.selectAll("path")
		.data(voronoi(data))
		.enter().append("path")
		.attr("d", function(d, i) { return "M" + d.join("L") + "Z"; })
		.datum(function(d, i) { return d.point; })
		.attr("class", function(d,i) { return "voronoi " + circleClass + " " + d.StudieClass; })
		//.style("stroke", "red")
		.on("mouseover", showScatterTooltip)
		.on("mouseout",  function (d,i) { removeScatterTooltip.call(this, d, i); });
		
	//////////////////////////////////////////////////////
	///////////////// Initialize Labels //////////////////
	//////////////////////////////////////////////////////

	//Set up X axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + "," + (height + 40) + ")")
		.style("font-size", "10px")
		.text("% dat in dezelfde provincie blijft wonen");

	//Set up y axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "y axis label")
		.attr("text-anchor", "middle")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.attr("transform", "translate(" + 0 + "," + (-margin.top*3/4) + ")")
		.style("font-size", "10px")
		.text("% dat in een goed aansluitende sector werkt")
		.call(wrap, margin.left*2);
		
	//Set up chart title
	wrapper.append("g")
		.append("text")
		.attr("class","chartTitle")
		.attr("transform", "translate(" + (width/2) + "," + (-margin.top/2) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "12px")
		.text(chartTitle);	
		
}// function drawScatter

//////////////////////////////////////////////////////
/////////////////// Bubble Legend ////////////////////
//////////////////////////////////////////////////////

function bubbleLegend(wrapperVar, scale, sizes, titleName) {

	var legendSize1 = sizes[0],
		legendSize2 = sizes[1],
		legendSize3 = sizes[2],
		legendCenter = 0,
		legendBottom = 50,
		legendLineLength = 25,
		textPadding = 5;
	
	wrapperVar.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + legendCenter + "," + -14 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text(titleName)
		.call(wrap, 80);
		
	wrapperVar.append("circle")
        .attr('r', scale(legendSize1))
        .attr('class',"legendCircle")
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize1)));
    wrapperVar.append("circle")
        .attr('r', scale(legendSize2))
        .attr('class',"legendCircle")
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize2)));
    wrapperVar.append("circle")
        .attr('r', scale(legendSize3))
        .attr('class',"legendCircle")
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize3)));
		
	wrapperVar.append("line")
        .attr('class',"legendLine")
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom-2*scale(legendSize1)))
		.attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom-2*scale(legendSize1)));	
	wrapperVar.append("line")
        .attr('class',"legendLine")
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom-2*scale(legendSize2)))
		.attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom-2*scale(legendSize2)));
	wrapperVar.append("line")
        .attr('class',"legendLine")
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom-2*scale(legendSize3)))
		.attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom-2*scale(legendSize3)));
		
	wrapperVar.append("text")
        .attr('class',"legendText")
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom-2*scale(legendSize1)))
		.attr('dy', '0.25em')
		.text(legendSize1);	
	wrapperVar.append("text")
        .attr('class',"legendText")
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom-2*scale(legendSize2)))
		.attr('dy', '0.25em')
		.text(legendSize2);	
	wrapperVar.append("text")
        .attr('class',"legendText")
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom-2*scale(legendSize3)))
		.attr('dy', '0.25em')
		.text(legendSize3);	
		
}//bubbleLegend

//////////////////////////////////////////////////////
//////////// Data for the scatter plot ///////////////
//////////////////////////////////////////////////////

var WOScatter = [
  {
    "Studienaam": "Overig Taal en cultuur",
    "StudieClass": "overig_taal_en_cultuur",
    "Studie_sector": "Taal en cultuur",
    "perc_blijft": 0.4643,
    "perc_goed_voldoende": 0.2897,
    "Total": 107
  },
  {
    "Studienaam": "Geneeskunde",
    "StudieClass": "geneeskunde",
    "Studie_sector": "Gezondheidszorg",
    "perc_blijft": 0.4253,
    "perc_goed_voldoende": 0.8889,
    "Total": 99
  },
  {
    "Studienaam": "Psychologie",
    "StudieClass": "psychologie",
    "Studie_sector": "Gedrag en maatschappij",
    "perc_blijft": 0.6727,
    "perc_goed_voldoende": 0.2394,
    "Total": 71
  },
  {
    "Studienaam": "Overig Natuur",
    "StudieClass": "overig_natuur",
    "Studie_sector": "Natuur",
    "perc_blijft": 0.38,
    "perc_goed_voldoende": 0.625,
    "Total": 64
  },
  {
    "Studienaam": "Business Administration",
    "StudieClass": "business_administration",
    "Studie_sector": "Economie",
    "perc_blijft": 0.4107,
    "perc_goed_voldoende": 0.6349,
    "Total": 63
  },
  {
    "Studienaam": "Overig Economie",
    "StudieClass": "overig_economie",
    "Studie_sector": "Economie",
    "perc_blijft": 0.2195,
    "perc_goed_voldoende": 0.8043,
    "Total": 46
  },
  {
    "Studienaam": "Nederlands Recht",
    "StudieClass": "nederlands_recht",
    "Studie_sector": "Recht",
    "perc_blijft": 0.4857,
    "perc_goed_voldoende": 0.3902,
    "Total": 41
  },
  {
    "Studienaam": "Overig Recht",
    "StudieClass": "overig_recht",
    "Studie_sector": "Recht",
    "perc_blijft": 0.375,
    "perc_goed_voldoende": 0.5,
    "Total": 40
  },
  {
    "Studienaam": "Overig Gedrag en maatschappij",
    "StudieClass": "overig_gedrag_en_maatschappij",
    "Studie_sector": "Gedrag en maatschappij",
    "perc_blijft": 0.5806,
    "perc_goed_voldoende": 0.5278,
    "Total": 36
  },
  {
    "Studienaam": "Pedagogische Wetenschappen",
    "StudieClass": "pedagogische_wetenschappen",
    "Studie_sector": "Gedrag en maatschappij",
    "perc_blijft": 0.5357,
    "perc_goed_voldoende": 0.0909,
    "Total": 33
  },
  {
    "Studienaam": "Overig Onderwijs",
    "StudieClass": "overig_onderwijs",
    "Studie_sector": "Onderwijs",
    "perc_blijft": 0.5172,
    "perc_goed_voldoende": 0.6,
    "Total": 30
  },
  {
    "Studienaam": "Bewegingswetenschappen",
    "StudieClass": "bewegingswetenschappen",
    "Studie_sector": "Gezondheidszorg",
    "perc_blijft": 0.381,
    "perc_goed_voldoende": 0.4615,
    "Total": 26
  },
  {
    "Studienaam": "Overig Techniek",
    "StudieClass": "overig_techniek",
    "Studie_sector": "Techniek",
    "perc_blijft": 0.4211,
    "perc_goed_voldoende": 0.8571,
    "Total": 21
  },
  {
    "Studienaam": "Accountancy and Controlling",
    "StudieClass": "accountancy_and_controlling",
    "Studie_sector": "Economie",
    "perc_blijft": 0.2778,
    "perc_goed_voldoende": 0.9,
    "Total": 20
  },
  {
    "Studienaam": "Onderwijskunde",
    "StudieClass": "onderwijskunde",
    "Studie_sector": "Gedrag en maatschappij",
    "perc_blijft": 0.7143,
    "perc_goed_voldoende": 0.3333,
    "Total": 18
  },
  {
    "Studienaam": "International Business and Management",
    "StudieClass": "international_business_and_management",
    "Studie_sector": "Economie",
    "perc_blijft": 0.1538,
    "perc_goed_voldoende": 0.4615,
    "Total": 13
  },
  {
    "Studienaam": "Technische Planologie",
    "StudieClass": "technische_planologie",
    "Studie_sector": "Gedrag en maatschappij",
    "perc_blijft": 0.1667,
    "perc_goed_voldoende": 0.3846,
    "Total": 13
  },
  {
    "Studienaam": "Communicatie- en Informatiewetenschappen",
    "StudieClass": "communicatie_en_informatiewetenschappen",
    "Studie_sector": "Taal en cultuur",
    "perc_blijft": 0.6,
    "perc_goed_voldoende": 0.5,
    "Total": 12
  },
  {
    "Studienaam": "Internationale Organisaties en Internationale Betrekkingen",
    "StudieClass": "internationale_organisaties_en_internationale_betrekkingen",
    "Studie_sector": "Taal en cultuur",
    "perc_blijft": 0.3333,
    "perc_goed_voldoende": 0.4167,
    "Total": 12
  },
  {
    "Studienaam": "Vastgoedkunde",
    "StudieClass": "vastgoedkunde",
    "Studie_sector": "Gedrag en maatschappij",
    "perc_blijft": 0.375,
    "perc_goed_voldoende": 0.5455,
    "Total": 11
  },
  {
    "Studienaam": "Behavioral and Cognitive Neurosciences",
    "StudieClass": "behavioral_and_cognitive_neurosciences",
    "Studie_sector": "Natuur",
    "perc_blijft": 0.6667,
    "perc_goed_voldoende": 0.6,
    "Total": 10
  },
  {
    "Studienaam": "Fiscaal Recht",
    "StudieClass": "fiscaal_recht",
    "Studie_sector": "Recht",
    "perc_blijft": 0.125,
    "perc_goed_voldoende": 0.8,
    "Total": 10
  },
  {
    "Studienaam": "Human Resource Management",
    "StudieClass": "human_resource_management",
    "Studie_sector": "Economie",
    "perc_blijft": 0.125,
    "perc_goed_voldoende": 0.9,
    "Total": 10
  },
  {
    "Studienaam": "Marketing",
    "StudieClass": "marketing",
    "Studie_sector": "Economie",
    "perc_blijft": 0.1,
    "perc_goed_voldoende": 0.7,
    "Total": 10
  },
  {
    "Studienaam": "Overig Gezondheidszorg",
    "StudieClass": "overig_gezondheidszorg",
    "Studie_sector": "Gezondheidszorg",
    "perc_blijft": 0.2857,
    "perc_goed_voldoende": 0.875,
    "Total": 8
  }
];
	
///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Draw plots ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var rScale = d3.scale.sqrt()
				.range([0, (mobileScreen ? 10 : 15)])
				.domain([0, 100]);

var sectorColor = d3.scale.ordinal()
					.range(["#EFB605", "#E47D06", "#DB0131", "#AF0158", "#7F378D", "#3465A8", "#0AA174", "#7EB852"])
					.domain(["Economie", "Gedrag en maatschappij", "Gezondheidszorg", "Natuur", "Onderwijs", "Recht", "Taal en cultuur", "Techniek"]);
	
	
// Create WO scatter plot
drawScatterWO(data = WOScatter, wrapper = scatterWO, width = scatterWidth, height = scatterHeight, 
			margin = scatterMargin, chartTitle="WO - Rijksuniversiteit Groningen", circleClass = "WO");				

//////////////////////////////////////////////////////
///////////////// Initialize Legend //////////////////
//////////////////////////////////////////////////////

//Draw the legend
createScatterLegend();





