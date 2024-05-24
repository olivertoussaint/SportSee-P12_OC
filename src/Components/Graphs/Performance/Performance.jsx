import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styles from './Performance.module.css';
import PropTypes from 'prop-types';

/**
 * Component to render a radar chart for performance data.
 * Uses D3.js to create a responsive radar chart visualizing various performance metrics.
 * The chart dimensions and scales are dynamically adjusted based on the provided data.
 *
 * @component
 * @param {Object[]} data - Array of objects representing performance metrics.
 * @param {string} data[].subject - The subject or category of the metric.
 * @param {number} data[].value - The value of the performance metric.
 */

const Performance = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) {
      return; // Exit if no data is provided
    }

    const width = 258;
    const height = 263;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove(); // Clear previous renderings

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const angleSlice = Math.PI * 2 / data.length; // Calculate the angle for each slice

    const rScale = d3.scaleLinear()
      .domain([30, 200]) // Data value range
      .range([0, radius]);

    const radarLine = d3.lineRadial()
      .radius(d => Math.min(rScale(d.value), radius -10)) // Limit the radar line length
      .angle((d, i) => i * angleSlice);

    // Add the radar grid lines
    g.selectAll('.levels')
      .data([20, 60, 100, 150, 200])
      .enter()
      .append('polygon')
      .attr('class', 'gridPolygon')
      .attr('points', function(d) {
        let points = [];
        for (let i = 0; i < data.length; i++) {
          const angle = i * angleSlice;
          const x = Math.cos(angle - Math.PI / 2) * rScale(d);
          const y = Math.sin(angle - Math.PI / 2) * rScale(d);
          points.push([x, y]);
        }
        return points.join(' ');
      })
      .style('fill', 'none') 
      .style('stroke', 'white'); 

    // Add axis labels
    g.selectAll('.axisLabel')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', (d, i) => {
        const angle = i * angleSlice;
        const labelWidth = d.subject.length * 4; // Estimate label width based on text length
        return Math.cos(angle - Math.PI / 2) * (radius + 25) - labelWidth / 1.8; // Center the text
      })
      .attr('y', (d, i) => {
        const angle = i * angleSlice;
        return Math.sin(angle - Math.PI / 2) * (radius + 10);
      })
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('fill', 'white')
      .text(d => d.subject);

    // Draw the radar area
    const radarArea = g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .style('fill', 'var(--radar)'); // Custom CSS variable for radar color

      // Animate the radar chart
    radarArea.transition()
    .duration(1000)
    .attrTween('d', function (d) {
      const interpolate = d3.interpolate({ length: 0 }, { length: 1 });
      return function (t) {
        return radarLine(d.map(item => ({
          ...item,
          value: item.value * interpolate(t).length
        })));
      }
    })

  }, [data]);

  return (
    <div className={styles.container}>
      <svg ref={svgRef} width={258} height={263}></svg>
    </div>
  );
};

Performance.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Performance;
