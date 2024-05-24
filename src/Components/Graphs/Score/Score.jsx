import React, { useRef, useEffect } from 'react'
import styles from './Score.module.css'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

/**
 * Component to render a donut chart showing the user's score or completion percentage towards a goal.
 * Uses D3.js to create a visually appealing donut chart with interactive features.
 * The component's visualization and behavior can adapt based on the user's route.
 *
 * @component
 * @param {number} data - The completion fraction of the user's goal (0.0 to 1.0).
 */

const Score = ({ data }) => {
  const svgRef = useRef();
  const location = useLocation();

  useEffect(() => {
    if (data === undefined || data === null) {
      return; // Exit if no data is provided
    }

    const percentage = data * 100; // Convert fraction to percentage
    const svg = d3.select(svgRef.current);
    const width = 258;
    const height = 263;
    const donutDiameter = 159.38;
    const innerRadius = (donutDiameter / 2) * 0.9; // Inner radius of the donut chart
    const arcsData = [data, 1 - data]; // Data for two segments of the donut chart

    const pie = d3.pie().value((d) => d); // Setup pie generator
    const arcGenerator = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(donutDiameter / 2)
      .cornerRadius(10); // Setup arc generator
    const arcs = pie(arcsData);

    svg.selectAll('*').remove(); // Clear any existing SVG content

    let rotation = 0; // Default rotation
    if (location.pathname.includes('/user/18')) {
      rotation = 110; // Rotate chart for specific user
    } else if (location.pathname.includes('/user/12')) {
      rotation = 40; // Rotate chart for another specific user
    }

    // Setup the group to hold the arcs and apply rotation
    const arcGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2}) rotate(${rotation})`);

    // Draw the arcs of the donut chart
    arcGroup
      .selectAll('.arc')
      .data(arcs) // Use the 'arcs' variable instead of calling 'pie(arcsData)' again
      .enter()
      .append('g')
      .attr('class', 'arc')
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (_, i) => (i === 0 ? 'red' : 'transparent')) // First segment red, second transparent
      .transition()
      .duration(900)
      .attrTween('d', function (d) {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle); // Animate the drawing of the arc
        return function (t) {
          d.endAngle = i(t);
          return arcGenerator(d);
        };
      });

    // Draw inner circle for donut chart
    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', innerRadius)
      .attr('fill', 'hsla(0, 0%, 100%, 1)');

    // Add percentage text in the middle of the donut chart
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '26px')
      .style('font-weight', '700')
      .text(`${percentage}%`);

    // Add additional descriptive text below the percentage using foreignObject
    svg
      .append('foreignObject')
      .attr('x', width / 2 - 75)
      .attr('y', height / 2 + 10)
      .attr('width', 150)
      .attr('height', 50)
      .html(`<p class="${styles.customParagraph}">de votre <br/>objectif</p>`);
  }, [data, location]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Score</p>
      <svg ref={svgRef} width={258} height={263}></svg>
    </div>
  )
}

Score.propTypes = {
  data: PropTypes.number.isRequired,
}

export default Score
