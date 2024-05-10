import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styles from './Performance.module.css';
import PropTypes from 'prop-types';

const Performance = ({ data }) => {
  const svgRef = useRef();
  console.log(data)

  useEffect(() => {
    if (!data) {
      return;
    }

    const width = 258;
    const height = 263;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const svg = d3.select(svgRef.current);

    // Supprimer le contenu précédent du SVG
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const angleSlice = Math.PI * 2 / data.length;

    const rScale = d3.scaleLinear()
      .domain([30, 200]) // Plage des valeurs de données
      .range([0, radius]);

    const radarLine = d3.lineRadial()
      .radius(d => Math.min(rScale(d.value), radius -10)) // Limite la longueur de la ligne du radar
      .angle((d, i) => i * angleSlice);

    // Ajouter les rayons du radar
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
      .style('fill', 'none') // Pas de remplissage
      .style('stroke', 'white'); // Bordure blanche

    // Ajouter les étiquettes des axes
    g.selectAll('.axisLabel')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', (d, i) => {
        const angle = i * angleSlice;
        const labelWidth = d.subject.length * 4; // Estimation de la largeur en fonction de la longueur du texte
        return Math.cos(angle - Math.PI / 2) * (radius + 25) - labelWidth / 1.8; // Centre le texte
      })
      .attr('y', (d, i) => {
        const angle = i * angleSlice;
        return Math.sin(angle - Math.PI / 2) * (radius + 10);
      })
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .style('fill', 'white')
      .text(d => d.subject);

    // Dessiner le radar
    g.append('path')
      .datum(data)
      .attr('class', 'radarArea')
      .attr('d', radarLine)
      .style('fill', 'var(--radar)')

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
