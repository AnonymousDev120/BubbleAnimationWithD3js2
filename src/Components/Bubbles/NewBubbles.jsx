import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./Bubbles.css";

const NewBubbles = () => {
  const svgRef = useRef();
  var data = [{ id: 1, name: "data1", value: 10 }];
  const data2 = [
    { name: "Concept 1", value: 10 },
    { name: "Concept 2", value: 20 },
    { name: "Concept 3", value: 15 },
    { name: "Concept 1", value: 10 },
    { name: "Concept 2", value: 20 },
    { name: "Concept 3", value: 15 },
    { name: "Concept 1", value: 10 },
    { name: "Concept 2", value: 20 },
    { name: "Concept 3", value: 15 },
    { name: "Concept 1", value: 10 },
    { name: "Concept 2", value: 20 },
    { name: "Concept 3", value: 15 },
  ];
  const data3 = [
    { name: "Dummy 1", value: 10 },
    { name: "Dummy 2", value: 20 },
    { name: "Dummy 3", value: 15 },
    { name: "Dummy 1", value: 10 },
    { name: "Dummy 2", value: 20 },
    { name: "Dummy 3", value: 15 },
    { name: "Dummy 1", value: 10 },
    { name: "Dummy 2", value: 20 },
    { name: "Dummy 3", value: 15 },
    { name: "Dummy 1", value: 10 },
    { name: "Dummy 2", value: 20 },
    { name: "Dummy 3", value: 15 },
  ];
  const [currentCircle, setCurrentCircle] = useState();
  useEffect(() => {
    let clickedBubble;
    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    var currentOpacity;
    var currentC;
    // Create a scale to map the data values to bubble sizes
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.name.length * 15)])
      .range([0, 50]);
    // Randomly position the bubbles around the edges of the SVG
    const randomX = () => Math.floor(Math.random() * width);
    const randomY = () => Math.floor(Math.random() * height);
    data.forEach((d) => {
      const side = Math.floor(Math.random() * 4);
      switch (side) {
        case 0: // top side
          d.x = randomX();
          d.y = 0;
          break;
        case 1: // right side
          d.x = width;
          d.y = randomY();
          break;
        case 2: // bottom side
          d.x = randomX();
          d.y = height;
          break;
        case 3: // left side
          d.x = 0;
          d.y = randomY();
          break;
      }
      d.opacity = 0;
    });
    // Create a simulation to position the bubbles
    // Create a simulation to position the bubbles
    var simulation;

    simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force("x", d3.forceX(width / 2).strength(0.01))
      .force("y", d3.forceY(height / 2).strength(0.01))
      .force(
        "collision",
        d3.forceCollide().radius((d) => sizeScale(d.name.length * 15) + 20)
      )
      .on("tick", () => {
        svg
          .selectAll("g")
          .attr("transform", (d) => `translate(${d.x},${d.y})`)
          .attr("opacity", (d) => d.opacity);
        data.forEach((d) => {
          if (d.opacity < 1) {
            d.opacity += 0.005;
          }

          currentOpacity = d.opacity;
        });
        simulation.alphaTarget(0.1).restart();
      });

    // Add groups containing the circles and labels to the SVG
    const groups = svg
      .selectAll("g")
      .attr("id", "firstBubble")
      .data(data)
      .enter()
      .append("g")

      .attr("opacity", 0)
      .on("mouseover", function (d) {
        // reduce opacity of other <g> elements
        const currentCircle = d3.select(this);
        const otherCircles = groups.filter(function () {
          return this !== currentCircle.node();
        });
        currentCircle.style("opacity", 1);
        otherCircles.style("opacity", 0.5);
      })
      .on("mouseout", function () {
        // Change the opacity of all circles back to 1
        groups.style("opacity", currentOpacity);
      })
      .on("click", function (d) {
        bubbleClick(d3.select(this), d); // pass the clicked bubble element as an argument
      });

    function bubbleClick(clickedBubble, d) {
      simulation.stop();
      const clickedDatum = clickedBubble.datum();
      const unclickedBubbles = svg.selectAll("g").filter((d) => {
        return d !== clickedDatum;
      });
      unclickedBubbles.remove();
      console.log(clickedDatum);
      // setData([clickedDatum]);
      function updateData(d) {
        var temp = [];
        d.forEach((e) => {
          if (e.name !== clickedDatum.name) {
            temp = [...temp, e];
          }
        });
        return temp;
      }
      data = Math.random() < 0.5 ? updateData(data2) : updateData(data3);
      clickedDatum.x = width / 2;
      clickedDatum.y = height / 2;
      const numCircles = data.length;
      const numCirclesPerSide = Math.ceil(numCircles / 4);
      let numCirclesPlaced = 0;

      data.forEach((d, i) => {
        const side = Math.floor(numCirclesPlaced / numCirclesPerSide);

        switch (side) {
          case 0: // top side
            d.x =
              width / 2 - (numCirclesPerSide - (i % numCirclesPerSide)) * 50;
            d.y = height / 4;
            break;
          case 1: // right side
            d.x = (width * 3) / 4;
            d.y =
              height / 2 - (numCirclesPerSide - (i % numCirclesPerSide)) * 50;
            break;
          case 2: // bottom side
            d.x = width / 2 - (i % numCirclesPerSide) * 50;
            d.y = (height * 3) / 4;
            break;
          case 3: // left side
            d.x = width / 4;
            d.y = height / 2 - (i % numCirclesPerSide) * 50;
            break;
        }

        d.opacity = 0;
        numCirclesPlaced++;
      });

      console.log(data);

      // Add the groups
      const groups = svg
        .selectAll(".newbubbles")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
        .style("opacity", (d) => d.opacity)
        .on("click", function (d) {
          bubbleClick(d3.select(this), d); // pass the clicked bubble element as an argument
        });

      // Add the circles to the groups
      groups
        .append("circle")
        .attr("r", (d) => sizeScale(d.name.length * 15))
        .style("fill", "purple")
        .on("mouseover", function () {
          d3.select(this).style("opacity", 1);
        })
        .on("mouseout", function () {
          d3.select(this).style("opacity", 1);
        })
        .transition() // add transition for opacity change
        .duration(1)
        .ease(d3.easeLinear) // set duration to 1 second
        .style("opacity", 1); // increase opacity to 0.8

      // Add the labels to the groups
      groups
        .append("text")
        .text((d) => d.name)
        .attr("dy", 5)
        .style("font-size", "12px")
        .style("text-anchor", "middle");

      const simulation2 = d3
        .forceSimulation([clickedDatum])
        .force("charge", d3.forceManyBody().strength(5))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
        .force("x", d3.forceX(width / 2).strength(0.01))
        .force("y", d3.forceY(height / 2).strength(0.01))
        .force(
          "collision",
          d3.forceCollide().radius((d) => sizeScale(d.name.length * 15))
        )
        .on("tick", () => {
          svg
            .selectAll("g")
            .filter((d) => d === clickedDatum)
            .attr("transform", (d) => `translate(${width / 2},${height / 2})`)
            .style("opacity", (d) => d.opacity);
          [clickedDatum].forEach((d) => {
            if (d.opacity < 1) {
              d.opacity += 0.005;
            }

            currentOpacity = d.opacity;
          });
          simulation2.alphaTarget(0.5).restart();
        });

      simulation = d3
        .forceSimulation([...data, clickedDatum])
        .force("charge", d3.forceManyBody().strength(5))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.1))
        .force("x", d3.forceX(width / 2).strength(0.01))
        .force("y", d3.forceY(height / 2).strength(0.01))
        .force(
          "collision",
          d3.forceCollide().radius((d) => sizeScale(d.name.length * 15) + 20)
        )
        .on("tick", () => {
          svg
            .selectAll("g")
            .attr("transform", (d) => `translate(${d.x},${d.y})`)
            .style("opacity", (d) => d.opacity);
          data.forEach((d) => {
            if (d.opacity < 1) {
              d.opacity += 0.005;
            }

            currentOpacity = d.opacity;
          });

          if (simulation.alpha() < 0.1) {
            simulation.alphaTarget(0.1).restart();
          } else if (simulation.alpha() < 0.2) {
            simulation.alphaTarget(0.2).restart();
          } else if (simulation.alpha() < 0.3) {
            simulation.alphaTarget(0.3).restart();
          } else {
            simulation.alphaTarget(0.5).restart();
          }
        });

      clickedBubble.select("circle").style("fill", "red").style("opacity", 1);
      clickedBubble.on("click", null);
    }

    // start with opacity 0
    // Add the circles to the groups
    groups
      .append("circle")
      .attr("r", (d) => sizeScale(d.name.length * 15))
      .style("fill", "purple")
      .on("mouseover", function () {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
      })
      .transition() // add transition for opacity change
      .duration(1)
      .ease(d3.easeLinear) // set duration to 1 second
      .style("opacity", 1); // increase opacity to 0.8
    // Add the labels to the groups
    groups
      .append("text")
      .text((d) => d.name)
      .attr("dy", 5)
      .style("font-size", "12px")
      .style("text-anchor", "middle");

    waitForValue();

    return () => {
      simulation.stop();
    };
  }, []);

  function waitForValue() {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (document.getElementById("firstBubble") !== null) {
          var element = document.getElementById("firstBubble");
          var event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(event);
          clearInterval(intervalId);
          resolve();
        }
      }, 1000);
    });
  }

  return <svg width="100%" height="100%" ref={svgRef}></svg>;
};

export default NewBubbles;
