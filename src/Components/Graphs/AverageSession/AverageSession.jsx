import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './AverageSession.module.css';
import PropTypes from 'prop-types';

const AverageSession = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    const margin = { top: 20, right: 5, bottom: 30, left: 5 };
    const fullWidth = 258; // Largeur totale du SVG incluant les marges
    const fullHeight = 263; // Hauteur totale du SVG incluant les marges
    const width = fullWidth - margin.left - margin.right; // Largeur utilisable pour le graphique
    const height = fullHeight - margin.top - margin.bottom; // Hauteur utilisable pour le graphique

    const x = d3.scalePoint().range([0, width])
      .padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
      .x((d) => x(d.day))
      .y((d) => y(d.sessionLength))
      .curve(d3.curveCardinal);

    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    x.domain(data.map((d) => d.day));

    // Vérifie l'URL actuelle pour déterminer le domaine de l'échelle y
    if (window.location.pathname.includes('/user/18')) {
      y.domain([25, d3.max(data, (d) => d.sessionLength + 10)]);
    } else if (window.location.pathname.includes('/user/12')) {
      y.domain([-10, d3.max(data, (d) => d.sessionLength + 5)]);
    }

    
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", 0)
    .attr("x2", width).attr("y2", 0); // Gradient du gauche à droite


    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "hsla(0, 0%, 100%, 0.4)")  // Utilisez n'importe quelle couleur de début
      .attr("stop-opacity", 1);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "hsla(0, 0%, 100%, 0.9)")  // Changez pour n'importe quelle couleur de fin
      .attr("stop-opacity", 1);


    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x)
        .tickSize(0)
        .tickFormat((d) => {
          if (d === 'Ma' || d === 'Me') return 'M'; // Remplace "Ma" et "Me" par "M"
          return d;
        })
      )
      .selectAll('.tick text')
      .style('fill', 'white'); // Applique la couleur blanche aux étiquettes

    chart.select('.domain')
      .style('stroke', 'none');

      chart.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Ajout des cercles représentant les points de données
    chart.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("class", styles.circle) // Ajouter la classe pour les styles et l'ombre
      .attr("cx", (d) => x(d.day))
      .attr("cy", (d) => y(d.sessionLength))
      .attr("r", 4) // Rayon des cercles
      .attr('fill', 'hsla(0, 0%, 100%, 1)')
      .attr('stroke', 'hsla(0, 0%, 100%, 0.2)')
      .attr( 'stroke-width', '10')
      .style("opacity", 0) // Initialement invisible
      .on("mouseover", function(event, d) {
        const [xPosTip, yPos] = d3.pointer(event, svg.node());
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(`${d.sessionLength}min`)
          .style("left", `${xPosTip + 10}px`)
          .style("top", `${yPos - 20}px`);
        const xPos = x(d.day);
        svg.append("rect")
        .attr("class", "overlay")
        .attr("x", margin.left + xPos) // Adjust for margin
        .attr("y", 0) // Start at the top of the SVG
        .attr("width", fullWidth - margin.left - xPos) // Fill to the right
        .attr("height", fullHeight) // Full height of the SVG
        .attr("fill", "rgba(0, 0, 0, 0.2)")
        d3.select(this).style("opacity", 1); // Show the circle on mouseover
        
      })
      .on("mouseout", function() {
        svg.selectAll(".overlay").remove();
        d3.select("#tooltip").style("opacity", 0)
        d3.select(this).style("opacity", 0); // Hide the circle on mouseout
      });

  }, [data]);

  return (
    <div className={styles.container}>
      <h3>Durée moyenne des sessions</h3>
      {/* Tooltip */}
      <div id="tooltip" className={styles.tooltip}></div>
      {/* Graphique */}
      <svg ref={chartRef} width="258" height="263"></svg> {/* Nouvelle largeur du SVG */}
    </div>
  );
}

AverageSession.propTypes = {
  data: PropTypes.array.isRequired,
};

export default AverageSession;
