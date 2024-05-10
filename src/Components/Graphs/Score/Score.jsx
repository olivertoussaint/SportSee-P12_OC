import React, { useRef, useEffect } from 'react';
import styles from './Score.module.css'; 
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const Score = ({ data }) => {
  const svgRef = useRef();
  const location = useLocation();

  useEffect(() => {
    if (data === undefined || data === null) {
      return;
    }

    const percentage = data * 100;
    const svg = d3.select(svgRef.current);
    const width = 258;
    const height = 263;
    const donutDiameter = 159.38;
    const innerRadius = (donutDiameter / 2) * 0.90;
    const arcsData = [data, 1 - data];

    const pie = d3.pie().value(d => d);
    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(donutDiameter / 2).cornerRadius(10);
    const arcs = pie(arcsData);

    svg.selectAll('*').remove();

    let rotation = 0; // Rotation par défaut
    if (location.pathname.includes('/user/18')) {
      rotation = 110;
    } else if (location.pathname.includes('/user/12')) {
      rotation = 40;
    }

    const arcGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2}) rotate(${rotation})`);

    arcGroup
      .selectAll('.arc')
      .data(arcs)
      .enter()
      .append('g')
      .attr('class', 'arc')
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (_, i) => i === 0 ? 'red' : 'transparent');

    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', innerRadius)
      .attr('fill', 'hsla(0, 0%, 100%, 1)');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '26px')
      .style('font-weight', '700')
      .text(`${percentage}%`);

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
  );
};

Score.propTypes = {
  data: PropTypes.number.isRequired,
}

export default Score;
