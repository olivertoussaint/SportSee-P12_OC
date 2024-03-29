import React, { useRef, useEffect, useState } from 'react';
import styles from './Score.module.css'; 
import * as d3 from 'd3';

const PerformanceChart = () => {
  const svgRef = useRef();
  const [data, setData] = useState([100, 30]); // Exemple de données, chaque valeur représente un segment en pourcentage

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const width = 258;
    const height = 263;
    const donutDiameter = 159.38;
    const innerRadius = (donutDiameter / 2) * 0.90; // rayon intérieur pour le donut

    const pie = d3.pie().value((d) => d);
    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(donutDiameter / 2).cornerRadius(10); // Applique un arrondi aux bords

    const arcs = pie(data);

    svg.selectAll('*').remove(); // Supprime les éléments SVG précédents pour éviter les duplications

    // Ajoute un groupe pour les arcs et les transformer pour faire pivoter le donut vers la droite
    const arcGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2}) rotate(80)`);

    arcGroup
      .selectAll('.arc')
      .data(arcs)
      .enter()
      .append('g')
      .attr('class', 'arc')
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (_, i) => i === 0 ? 'transparent' : 'red') // Rouge pour la plus petite, transparente pour la plus grande
      .style('borderRadius', (_, i) => {
        const value = data[i];
        const percentage = (value / data.reduce((acc, curr) => acc + curr, 0)) * 100;
        return `${Math.min(percentage, 100)}%`; // Applique un border radius en fonction de la proportion de chaque segment
      });

    // Ajoute un cercle au milieu du donut
    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', innerRadius) // ajuste le rayon du cercle central
      .attr('fill', 'hsla(0, 0%, 100%, 1)');

    // Calcule le pourcentage le plus petit
    const smallestPercentage = Math.min(...data);

    // Ajoute le texte au centre du fond avec le pourcentage le plus petit
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 - 10) // Déplace de 10px vers le haut
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle') // Centre verticalement
      .style('font-size', '26px')
      .style('font-weight', 700)
      .text(`${smallestPercentage}%`);

    // Ajoute le paragraphe en dessous sur deux lignes
    svg
      .append('foreignObject')
      .attr('x', width / 2 - 75) // positionne le paragraphe à partir du centre
      .attr('y', height / 2 + 10) // positionne le paragraphe sous le texte
      .attr('width', 150)
      .attr('height', 50)
      .html(`<p class=${styles.customParagraph}>de votre <br/>objectif</p>`);

  }, [data]); // Ajout de la variable 'data' comme dépendance du useEffect

  return (
    <div className={styles.container}>
      <p className={styles.title}>Score</p>
      <svg ref={svgRef} width={258} height={263} style={{ borderRadius: '10px', backgroundColor: 'var(--bg2)' }}></svg>
    </div>
  );
};

export default PerformanceChart;
