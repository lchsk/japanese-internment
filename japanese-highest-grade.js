
d3.csv("theme/js/posts/japanese/japanese-highest-grade.csv", function(error, data){
  
  var margin = {top: 40, right: 20, bottom: 30, left: 40};

  var width = 750 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
 
  var y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var sum = data.reduce(
           function(prev, current){
             return +(current.Count) + prev;
           }, 0
         );

  var symbols_jap = ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '-'];

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
      var message_header = d.Symbol;

      switch(message_header){
        case 'J': message_header = 'No schooling or kindergarten'; break;

        case 'S': message_header = 'Elementary 1 (in Japan)'; break;
        case 'T': message_header = 'Elementary 2 (in Japan)'; break;
        case 'U': message_header = 'Elementary 3 (in Japan)'; break;
        case 'V': message_header = 'Elementary 4 (in Japan)'; break;
        case 'W': message_header = 'Elementary 5 (in Japan)'; break;
        case 'X': message_header = 'Elementary 6 (in Japan)'; break;
        case 'Y': message_header = 'Elementary 7 (in Japan)'; break;
        case 'Z': message_header = 'Elementary 8 (in Japan)'; break;
        case 'A': message_header = 'High School 1 (in Japan)'; break;
        case 'B': message_header = 'High School 2 (in Japan)'; break;
        case 'C': message_header = 'High School 3 (in Japan)'; break;
        case 'D': message_header = 'High School 4 (in Japan)'; break;
        case 'E': message_header = 'High School 5 (in Japan)'; break;
        case '1': message_header = 'College 1 (in Japan)'; break;
        case '2': message_header = 'College 2 (in Japan)'; break;
        case '3': message_header = 'College 3 (in Japan)'; break;
        case '4': message_header = 'College 4 (in Japan)'; break;
        case '-': message_header = 'Postgraduate or College 5 or more (in Japan)'; break;
        

        case 'K': message_header = 'Elementary 1 (in US)'; break;
        case 'L': message_header = 'Elementary 2 (in US)'; break;
        case 'M': message_header = 'Elementary 3 (in US)'; break;
        case 'N': message_header = 'Elementary 4 (in US)'; break;
        case 'O': message_header = 'Elementary 5 (in US)'; break;
        case 'P': message_header = 'Elementary 6 (in US)'; break;
        case 'Q': message_header = 'Elementary 7 (in US)'; break;
        case 'R': message_header = 'Elementary 8 (in US)'; break;
        case 'F': message_header = 'High School 1 (in US)'; break;
        case 'G': message_header = 'High School 2 (in US)'; break;
        case 'H': message_header = 'High School 3 (in US)'; break;
        case 'I': message_header = 'High School 4 (in US)'; break;
        //case 'E': message_header = 'High School 5 (in Japan)'; break;
        case '5': message_header = 'College 1 (in US)'; break;
        case '6': message_header = 'College 2 (in US)'; break;
        case '7': message_header = 'College 3 (in US)'; break;
        case '8': message_header = 'College 4 (in US)'; break;
        case '9': message_header = 'Postgraduate or College 5 or more (in US)'; break;

        case '&': message_header = 'Unknown'; break;
        case '0': message_header = 'Elementary education in any other country'; break;

        default: message_header = 'Invalid data';
      }

      return '<strong style="color: #ffffff;">' + message_header + '</strong><br /><span style="color: #D6A692;">' + d.Count + " people (" + (d.Count / sum*100).toFixed(1) + "%)</span>";
    });

  svg = d3.select("#chart5")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);
  
  x.domain(data.map(function(d) { return d.Symbol; }));
  y.domain([d3.max(data, function(d) { return parseFloat(d.Count); }), d3.min(data, function(d) { return parseFloat(d.Count); })]);

  svg.append("g")
      .attr("class", "yaxis").attr('transform', 'translate(18, 0)')
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of People");

      svg.select('.yaxis').append('text').text("Highest grade completed or grade attending")
        .attr('transform', 'translate(380, 20)');

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr('transform', 'translate(20, 0)')
      .attr("x", function(d) { return x(d.Symbol); })
      .attr("width", 5)
      .attr("y", function(d) { return y(parseFloat(d.Count)); })
      .attr("height", function(d) { 
        if (height - y(parseFloat(d.Count)) < 1)
          return 1;
        else
          return height - y(parseFloat(d.Count)); 
      })
      .attr("fill", function(d){
        if (symbols_jap.indexOf(d.Symbol) >= 0)
          return "#C40000"; // jap education
        else if(d.Symbol == 'J') // no schooling
          return '#070707';
        else
          return '#202A5D'; // us education
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
});