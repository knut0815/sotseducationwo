//////////////////////////////////////////////////////
////////////// Draw the Chord/Sankey /////////////////
//////////////////////////////////////////////////////

function drawChordWO(width, height, margin) {
	
	var Names= ["Andere branche","Financiële dienstverlening","HBO-instellingen","Industrie, handel, transport","Informatie en communicatie","Juridische dienstverlening","Onderzoeksinstituten","Overheid","Overig gezondheidszorg","Overig onderwijs","Overige zakelijke dienstverlening","Pers en voorlichting","Personeel en organisatie","Universiteiten","Welzijnsinstellingen","Ziekenhuizen","",
				"Techniek","Taal en cultuur","Recht","Onderwijs","Natuur","Gezondheidszorg","Gedrag en maatschappij","Economie",""];
	var emptyPerc = 0.5;

	////////////////////////////////////////////////////////////
	/////////////////////// WO Data ///////////////////////////
	////////////////////////////////////////////////////////////

	var totalWO = 730,
		respondents = 730,
		emptyStroke = Math.round(totalWO*emptyPerc);
	var matrix = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,33,4,1,2,5,24,23,0], //Andere branche
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,0,2,0,0,48,0], //Financiële dienstverlening
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,2,3,8,0,0], //Hbo-instellingen
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,2,3,0,9,2,4,28,0], //Industrie, handel, transport
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,13,3,1,5,1,4,11,0], //Informatie en communicatie
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,0,0,0,1,1,0], //Juridische dienstverlening
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,0,5,3,3,1,0], //Onderzoeksinstituten
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,29,1,1,2,22,6,0], //Overheid
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,2,15,26,5,0], //Overig gezondheidszorg
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,1,23,0,0,20,3,0], //Overig onderwijs
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,2,0,4,0,9,11,0], //Overige zakelijke dienstverlening
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,1,0,0,0,1,0], //Pers en voorlichting
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,1,0,0,3,6,0], //Personeel en organisatie
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,13,3,1,19,3,13,10,0], //Universiteiten (niet academische ziekenhuizen)
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,0,0], //Welzijnsinstellingen
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,14,81,8,2,0], //Ziekenhuizen (inclusief academische medische centra)
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke], //dummyBottom
		[1,0,0,9,3,0,0,0,0,0,0,0,0,4,0,3,0,0,0,0,0,0,0,0,0,0], //Techniek
		[33,4,2,2,13,0,5,7,3,9,6,5,3,13,0,1,0,0,0,0,0,0,0,0,0,0], //Taal en cultuur
		[4,5,1,3,3,24,1,29,0,1,2,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0], //Recht
		[1,0,1,0,1,0,0,1,0,23,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0], //Onderwijs
		[2,2,2,9,5,0,5,1,2,0,4,0,0,19,0,14,0,0,0,0,0,0,0,0,0,0], //Natuur
		[5,0,3,2,1,0,3,2,15,0,0,0,0,3,4,81,0,0,0,0,0,0,0,0,0,0], //Gezondheidszorg
		[24,0,8,4,4,1,3,22,26,20,9,0,3,13,11,8,0,0,0,0,0,0,0,0,0,0], //Gedrag en maatschappij
		[23,48,0,28,11,1,1,6,5,3,11,1,6,10,0,2,0,0,0,0,0,0,0,0,0,0], //Economie
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,emptyStroke,0,0,0,0,0,0,0,0,0] //dummyTop
	];
	var offset = (2*Math.PI)/360 * (emptyStroke/(totalWO + emptyStroke))*360/4; //((SUM white / SUM (all + white)*360/4)

	////////////////////////////////////////////////////////////
	///////////////// Initiate variables ///////////////////////
	////////////////////////////////////////////////////////////

	var outerRadius = Math.min(width, height) / 2 - 100,
		innerRadius = outerRadius * 0.95;
		
	var	pullOutSize = 50, //how far apart to pull the two halves
		numRight = 16, //How many arcs on the right side
		opacityDefault = 0.6, //default opacity of chords
		opacityLow = 0.02;

	function fill() {
		return "#00A1DE";
	}

	//create number formatting functions
	var formatPercent = d3.format("%");

	//create the arc path data generator for the groups
	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius)
		.startAngle(startAngle)
		.endAngle(endAngle);

	//create the chord path data generator for the chords
	var path = chordStretch()
		.radius(innerRadius)
		.startAngle(startAngle)
		.endAngle(endAngle);

	var chord = d3.layout.chord()
		.padding(.02)
		.sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
		.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
		.matrix(matrix);

	var svg = chordWrapper.append("g")
			.attr("id", "circle")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

	////////////////////////////////////////////////////////////
	////////////////// Draw outer Arcs /////////////////////////
	////////////////////////////////////////////////////////////

	var outerArcs = svg.selectAll("g.group")
		.data(chord.groups)
		.enter().append("g")
		.attr("class", "group")
		.on("mouseover", fade(opacityLow))
		.on("mouseout", fade(opacityDefault));

	outerArcs.append("path")
		.style("stroke", function(d,i) { //If this is the dummy arc, make it transparent and not responsive
			if (Names[i] === "") {return "none";
			} else {return fill(d.index); }
		})
		.style("fill", function(d,i) {
			if (Names[i] === "") {return "none";
			} else {
				return fill(d.index); 
			}
		})
		.style("pointer-events", function(d,i) {
			if (Names[i] === "") {return "none";
			} else {return "auto"; }
		})
		.attr("transform", function(d, i) { //Pull the two slices apart
					d.pullOutSize = pullOutSize * ( i > numRight ? -1 : 1);
					return "translate(" + d.pullOutSize + ',' + 0 + ")";
		})
		.attr("d", arc);

	////////////////////////////////////////////////////////////
	////////////////// Append Names ////////////////////////////
	////////////////////////////////////////////////////////////

	//create the group labels
	outerArcs.append("text")
		.attr("class", "chordText")
		.attr("dy", ".35em")
		.attr("fill", "#8F8F8F")
		.attr("transform", function(d, i) {
			d.angle = ((d.startAngle + d.endAngle) / 2) + offset;
			d.pullOutSize = pullOutSize * ( i > numRight ? -1 : 1);
			var c = arc.centroid(d);
			return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
			+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
			+ "translate(" + 20 + ",0)"
			+ (d.angle > Math.PI ? "rotate(180)" : "")
		})
		.attr("text-anchor", function (d) { return d.angle > Math.PI ? "end" : "begin";})
		.text(function (d) {return Names[d.index];});

	/////////////////////// Tooltip /////////////////////////
	//Create the title tooltip for the new groups
	outerArcs.append("title");		
	//Create the title tooltip for the new groups
	outerArcs.select("title")
		.text(function(d, i) {return numFormatPercentDec(d.value/respondents) + " mensen in " + Names[i];});
				

	////////////////////////////////////////////////////////////
	////////////////// Draw inner chords ///////////////////////
	////////////////////////////////////////////////////////////

	var chords = svg.selectAll("path.chord")
		.data(chord.chords)
		.enter().append("path")
			.attr("class", "chord")
			.style("stroke", "none")
			.style("fill", 	"url(#gradientLinearPerLine)") //gradientLinear //"#C4C4C4")
			.style("pointer-events", function(d,i) { //Remove pointer events from dummy strokes
				if (Names[d.source.index] === "") {return "none";
				} else {return "auto"; }
			})
			.style("opacity", function(d) {
				if (Names[d.source.index] === "") {return 0;
				} else {return opacityDefault; }
			})
			.on("mouseover", fadeOnChord)
			.on("mouseout", fade(opacityDefault))
			.attr("d", path);
			
		// Add title tooltip for each new chord.
		chords.append("title");
		
		// Update all chord title texts
		chords.select("title")
			.text(function(d) {
					return [numFormatPercentDec(d.source.value/respondents), " studenten van ", Names[d.target.index], " naar de sector ", Names[d.source.index]].join(""); 
			});
			
	////////////////////////////////////////////////////////////
	////////////////// Extra Functions /////////////////////////
	////////////////////////////////////////////////////////////

	function startAngle(d) {
			return d.startAngle + offset;
		}

	function endAngle(d) {
		return d.endAngle + offset;
	}

	// Returns an event handler for fading a given chord group.
	function fade(opacity) {
	  return function(d, i) {
		svg.selectAll("path.chord")
			.filter(function(d) { return d.source.index != i && d.target.index != i && Names[d.source.index] != ""; })
			.transition()
			.style("opacity", opacity);
	  };
	}//fade
	// Fade function when hovering over chord
	function fadeOnChord(d) {
		var chosen = d;
		svg.selectAll("path.chord")
			.transition()
			.style("opacity", function(d) {
				if (d.source.index == chosen.source.index && d.target.index == chosen.target.index) {
					return opacityDefault;
				} else { 
					return opacityLow; 
				}//else
			});
	}//fadeOnChord

	////////////////////////////////////////////////////////////
	/////////////// Custom Chord Function //////////////////////
	////////////////////////////////////////////////////////////

	function chordStretch() {
		var source = d3_source, 
			target = d3_target, 
			radius = d3_svg_chordRadius, 
			startAngle = d3_svg_arcStartAngle, 
			endAngle = d3_svg_arcEndAngle;
			
		var π = Math.PI,
			halfπ = π / 2;

		function subgroup(self, f, d, i) {
			var subgroup = f.call(self, d, i), 
				r = radius.call(self, subgroup, i), 
				a0 = startAngle.call(self, subgroup, i) - halfπ, 
				a1 = endAngle.call(self, subgroup, i) - halfπ;
		  return {
			r: r,
			a0: [a0],
			a1: [a1],
			p0: [ r * Math.cos(a0), r * Math.sin(a0)],
			p1: [ r * Math.cos(a1), r * Math.sin(a1)]
		  };
		}

		function arc(r, p, a) {
			var sign = (p[0] >= 0 ? 1 : -1); //Does p[0] lie on the right side?
			return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + (p[0] + sign*pullOutSize) + "," + p[1];
		}


		function curve(p1) {
			var sign = (p1[0] >= 0 ? 1 : -1); //Does p1[0] lie on the right side?
			return "Q 0,0 " + (p1[0] + sign*pullOutSize) + "," + p1[1];
		}
		
		/*
		M = moveto
		M x,y
		Q = quadratic Bézier curve
		Q control-point-x,control-point-y end-point-x, end-point-y
		A = elliptical Arc
		A rx, ry x-axis-rotation large-arc-flag, sweep-flag  end-point-x, end-point-y
		Z = closepath

		M251.5579641956022,87.98204731514328
		A266.5,266.5 0 0,1 244.49937503334525,106.02973926358392
		Q 0,0 -177.8355222451483,198.48621369706098
		A266.5,266.5 0 0,1 -191.78901944612068,185.0384338992728
		Q 0,0 251.5579641956022,87.98204731514328
		Z
		*/	
		function chord(d, i) {
			var s = subgroup(this, source, d, i), 
				t = subgroup(this, target, d, i);
						
		return "M" + (s.p0[0] + pullOutSize) + "," + s.p0[1] + 
				arc(s.r, s.p1, s.a1 - s.a0) + 
				curve(t.p0) + 
				arc(t.r, t.p1, t.a1 - t.a0) + 
				curve(s.p0) + 
				"Z";
	   }//chord

		chord.radius = function(v) {
		  if (!arguments.length) return radius;
		  radius = d3_functor(v);
		  return chord;
		};
		chord.source = function(v) {
		  if (!arguments.length) return source;
		  source = d3_functor(v);
		  return chord;
		};
		chord.target = function(v) {
		  if (!arguments.length) return target;
		  target = d3_functor(v);
		  return chord;
		};
		chord.startAngle = function(v) {
		  if (!arguments.length) return startAngle;
		  startAngle = d3_functor(v);
		  return chord;
		};
		chord.endAngle = function(v) {
		  if (!arguments.length) return endAngle;
		  endAngle = d3_functor(v);
		  return chord;
		};
		return chord;
	  };
	  
	function d3_svg_chordRadius(d) {
		return d.radius;
	}

	function d3_source(d) {
		return d.source;
	}
	  
	function d3_target(d) {
		return d.target;
	}

	function d3_svg_arcStartAngle(d) {
		return d.startAngle;
	}
	  
	function d3_svg_arcEndAngle(d) {
		return d.endAngle;
	}

	function d3_functor(v) {
		return typeof v === "function" ? v : function() {
			return v;
		};
	}

	////////////////////////////////////////////////////////////
	//////////// END - Custom Chord Function ///////////////////
	////////////////////////////////////////////////////////////

}