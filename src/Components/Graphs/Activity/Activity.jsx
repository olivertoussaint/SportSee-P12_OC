import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styles from './Activity.module.css';
import BlackDot from '../../../assets/images/blackdot.png';
import RedDot from '../../../assets/images/reddot.png';

const Activity = ({ data }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current || !svgRef.current || !tooltipRef.current) {
      return;
    }

    const containerWidth = 702;
    const containerHeight = 145;
    const margin = { top: 20, right: -80, bottom: 30, left: -14 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    const yAxisOffset = -30; // Ajuster l'offset pour déplacer l'axe des y vers la gauche
    const xAxisOffset = -34; // Décalage de l'axe des x vers la gauche

    // Ajustez la largeur du conteneur SVG pour inclure l'axe des y à droite
    const svgWidth = containerWidth + Math.abs(margin.left) + Math.abs(margin.right) + yAxisOffset;

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.day))
      .range([0, width])
      .padding(0.1);

    const yCalories = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.calories) + 100])
      .nice()
      .range([height, 0]);

    const yKg = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.kilogram) - 1, d3.max(data, (d) => d.kilogram) + 2])
      .nice()
      .range([height, 0]);

    const svg = d3
      .select(svgRef.current)
      .attr('width', svgWidth) // Ajustez la largeur du conteneur SVG
      .attr('height', containerHeight)
      .append('g')
      .attr('class', 'y-axis-right') // Ajoutez la classe y-axis-right ici
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'var(--bgtooltip)')
      .style('color', 'white')
      .style('width', '39px')
      .style('height', '63px')
      .style('line-height', '24px')
      .style('text-align', 'center')
      .style('font-size', '7px');

    const barGroups = svg.selectAll('.bars')
      .data(data)
      .enter()
      .append('g')
      .attr('class', `${styles.barGroupHover}`)
      .on('mouseover', function(event, d) {
        const kilogram = d.kilogram;
        const calories = d.calories;
        const tooltipWidth = parseFloat(tooltip.style('width'));
        const xPosition = event.pageX - tooltipWidth + 40;
        const yPosition = event.pageY - parseFloat(tooltip.style('height')) - 50;

        // Ajuster la position x du tooltip pour le décaler vers la gauche
        const adjustedXPosition = xPosition - 40;

        tooltip
          .style('opacity', 1)
          .style('left', adjustedXPosition + 'px')
          .style('top', yPosition + 'px')
          .html(`${kilogram}Kg<br>${calories}Kcal`);
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      });

    barGroups.append('rect')
      .attr('class', 'bar barKg')
      .attr('x', (d) => x(d.day) + 3) // Décalage vers la droite
      .attr('y', (d) => yKg(d.kilogram))
      .attr('width', x.bandwidth() / 14)
      .attr('height', (d) => height - yKg(d.kilogram))
      .attr('fill', 'black')
      .attr('rx', 3.5)
      .attr('ry', 3.5);

    barGroups.append('rect')
      .attr('class', 'bar barCalories')
      .attr('x', (d) => x(d.day) + x.bandwidth() / 6 + 2 ) // Décalage vers la droite
      .attr('y', (d) => yCalories(d.calories))
      .attr('width', x.bandwidth() / 14)
      .attr('height', (d) => height - yCalories(d.calories))
      .attr('fill', 'red')
      .attr('rx', 3.5)
      .attr('ry', 3.5);

    const minKg = d3.min(data, (d) => d.kilogram - 1);
    const maxKg = d3.max(data, (d) => d.kilogram + 2);
    const midKg = Math.round((minKg + maxKg) / 2);
    
    const yAxisRight = d3.axisRight(yKg)
      .tickValues([minKg, midKg, maxKg])
      .tickFormat((d) => d );

    const yAxisRightGroup = svg.append('g')
      .attr('class', `${styles.yAxisRight}`)
      .attr('transform', `translate(${containerWidth + Math.abs(margin.right) + yAxisOffset}, 0)`)
      .call(yAxisRight);

    yAxisRightGroup.select('.domain').remove();
    yAxisRightGroup.selectAll('.tick line').remove();

    const xAxis = d3.axisBottom(x)
      .tickSizeOuter(0);
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('y', 10)
      .attr('dx', `${xAxisOffset}px`)
      .style('fill', 'lightgrey');

    svg.select('.x-axis')
      .selectAll('.tick line')
      .remove();

    svg.select('.x-axis')
      .selectAll('.domain')
      .attr('stroke', 'lightgrey');
  }, [data]);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.legend}>
        <h3>Activité quotidienne</h3>
        <div className={styles.legendElements}>
          <div className={styles.legend1}>
            <span>
              <img src={BlackDot} alt="point noir" />
            </span>
            Poids (kg)
          </div>
          <div className={styles.legend2}>
            <span>
              <img src={RedDot} alt="point rouge" />
            </span>
            Calories brûlées (kCal)
          </div>
        </div>
      </div>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

Activity.propTypes = {
  data: PropTypes.array.isRequired
};

export default Activity;
