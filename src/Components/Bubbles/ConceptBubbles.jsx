import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ConceptBubbles = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.select("g").remove();
    // Dummy data
    const data = [
      { name: "Concept 1", value: 10 },
      { name: "Concept 2", value: 20 },
      { name: "Concept 3", value: 15 },
      { name: "Concept 4", value: 50 },
      { name: "Concept 5", value: 25 },
    ];

    // Set up simulation
    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(-30))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force(
        "center",
        d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2)
      ) // Centering force
      .force(
        "collide",
        d3.forceCollide().radius((d) => d.value + 20)
      ); // Collision detection force

    simulation.on("tick", () => {
      // Update positions of bubbles
      svg
        .selectAll(".concept-bubble")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Create bubbles
    const bubbles = svg
      .selectAll(".concept-bubble")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "concept-bubble")
      .attr("transform", (d, i) => {
        const angle = (i / data.length) * 2 * Math.PI;
        const x = width / 2 + 400 * Math.cos(angle);
        const y = height / 2 + 400 * Math.sin(angle);
        return `translate(${x}, ${y})`;
      });

    bubbles
      .append("circle")
      .attr("r", (d) => d.value)
      .attr("fill", "purple")
      .attr("opacity", 1);

    bubbles
      .append("text")
      .text((d) => d.value)
      .style("text-anchor", "middle")
      .style("alignment-baseline", "middle");
  }, []);

  return (
    <svg
      ref={svgRef}
      width="100vw"
      height="100vh"
      style={{ backgroundColor: "lightgray" }}
    />
  );
};

export default ConceptBubbles;
