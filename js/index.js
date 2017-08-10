var width = window.innerWidth,
    height = window.innerHeight;

var canvas = d3.select(".canvas")
          .attr("width", width)
          .attr("height", height);
var svg = canvas.append("svg")
          .attr("width", width)
          .attr("height", height);



setTimeout(() => {
  $.getJSON("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json", (data)=>{

  var force = d3.forceSimulation()
  .force("link", d3.forceLink().id( (d, i) => { return i; }))
  .force('charge_force', d3.forceManyBody().strength(-2.75)) 
  .force('center', d3.forceCenter(width / 2, height / 2))

  
  var link = svg.selectAll(".link")
              .data(data.links)
            .enter().insert("line")
              .attr("class", "link")

  var node = canvas.select(".flagpole").selectAll(".node")
              .data(data.nodes)
            .enter().append("div")
              .attr("class", d => 'flag flag-' + d.code)
              .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

  
  force
    .nodes(data.nodes)
    .on("tick", ticked);
    
  force.force("link")
        .links(data.links)
  
  function ticked () {
    link
        .attr("x1", (d) => { return Math.max(d.source.x, Math.min(width, d.source.x)); })
        .attr("y1", (d) => { return Math.max(d.source.y, Math.min(height, d.source.y)); })
        .attr("x2", (d) => { return Math.max(d.target.x, Math.min(width, d.target.x)); })
        .attr("y2", (d) => { return Math.max(d.target.y, Math.min(height, d.target.y)); });

    node
        .style('left', d => Math.max(16, Math.min(width - 16, d.x)) + "px")
        .style('top', d => Math.max(10, Math.min(height - 10, d.y)) + "px");
  }
  
  
  function dragstarted(d) {
    if (!d3.event.active) force.alphaTarget(0.5).restart();
      d.fx = d.x;
      d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) force.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  }
  
    $('.loading-container').hide();
    $('.headers').animate({opacity: 1});
})
}, 1500)
