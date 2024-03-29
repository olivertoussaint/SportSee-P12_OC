import React, { useEffect } from 'react';
import * as d3 from "d3";
import PropTypes from 'prop-types';

function AverageSession(props) {
  const userDatas = props.data.sessions;

  useEffect(() => {
    draw(userDatas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDatas]);

  function draw(userData) {
    if (!userData) return;

    // Création des dimensions nécessaires dans des variables
    let margin = { top: 20, right: 20, bottom: 0, left: 20 };
    let height = 263 - margin.top - margin.bottom;
    // Create the chart
    let chart = d3.select(".lineChart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
    // Clean the svg chart if the component re-render
    chart.selectAll(".lineChart .d3").remove();
    let min = d3.min(userData, d => d.sessionLength);
    let max = d3.max(userData, d => d.sessionLength);
    let xScale = d3.scaleLinear()
    .domain([0.5, 7.5])
    .range([-50, 200]);
    let yScale = d3.scaleLinear()
    .domain([min, max + 30])
    .range([height - 40, 0]);
    // Register the line
    let line = d3.line()
    .x(d => xScale(d.day))
    .y(d => yScale(d.sessionLength))
    .curve(d3.curveMonotoneX);
    const linePath = line(userData);
    // Draw the path
    chart.append("path")
    .datum(userData)
    .attr("d", linePath)
    .attr("class", "d3")
    .attr("stroke", "white")
    .attr("stroke-width", "3")
    .attr("fill", "none");
    // Add coordinates for the points to draw info box, transparent div...
    getPathCoordinates(userData, xScale, yScale).forEach((coordinates, index) => {
      let group = chart.append("g")
      .attr("id", "session" + index)
      .attr("class", "d3");
      group.append("rect")
      .attr("x", coordinates.x + 41)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "d3")
      .attr("fill", "rgba(17, 24, 39, 0.3)")
      .attr("opacity", "0");
      group.append("rect")
      .attr("x", getBubbleXCoordinate(coordinates.x) + 51)
      .attr("y", coordinates.y - 25)
      .attr("class", "d3")
      .attr("width", "50")
      .attr("height", 30)
      .attr("fill", "white")
      .attr("opacity", "0");
      group.append("text")
      .attr("x", getBubbleXCoordinate(coordinates.x) + 76)
      .attr("y", coordinates.y - 7)
      .style("text-anchor", "middle")
      .attr("class", "d3")
      .text(userData[index].sessionLength + "min")
      .attr("opacity", "0");
      group.append("circle")
      .attr("class", "d3")
      .attr("cx", coordinates.x)
      .attr("cy", coordinates.y)
      .attr("r", 4)
      .attr("opacity", "0")
      .attr("fill", "white");
      // hitbox
      chart.append("rect")
      .attr("x", coordinates.x + 21)
      .attr("y", 0)
      .attr("width", 41)
      .attr("height", 300)
      .attr("class", "d3")
      .attr("opacity", "0")
      .on("mouseover", function () {
        d3.selectAll(`#session${index} > *`)
        .transition()
        .attr("opacity", "1");
      })
      .on("mouseout", function () {
        d3.selectAll(`#session${index} > *`)
        .transition()
        .attr("opacity", "0");
      });
    });
  }

  // Function to get the coordinates of the points to draw
  function getPathCoordinates(dataPoints, xScale, yScale) {
    let coordinates = dataPoints.map((point, index) => (
      { x: xScale(index + 1), y: yScale(point.sessionLength) }
    ));
    return coordinates;
  }

  // Function to make the last day box appear on the chart and not outside
  function getBubbleXCoordinate(x) {
    if (x <= 170)
      return x;
    else return 125;
  }

  return (
    <div className="lineChart" >
      <p className="lineChart-title">
        Durée moyenne des sessions
      </p>
      <div className="days"> <p>L</p> <p>M</p> <p>M</p> <p>J</p> <p>V</p> <p>S</p> <p>D</p> </div>
    </div>
  );
}

AverageSession.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AverageSession;
