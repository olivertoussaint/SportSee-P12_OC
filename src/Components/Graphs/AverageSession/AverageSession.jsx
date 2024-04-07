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
    const width = 258 - margin.left - margin.right; // Nouvelle largeur du SVG
    const height = 263 - margin.top - margin.bottom;

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

    // Ajout des cercles représentant les points de données
    chart.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("class", styles.circle) // Ajouter la classe pour les styles et l'ombre
      .attr("cx", (d) => x(d.day))
      .attr("cy", (d) => y(d.sessionLength))
      .attr("r", 4) // Rayon des cercles
      .style("opacity", 0) // Initialement invisible
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1); // Changement d'opacité au survol
        const [xPos, yPos] = d3.pointer(event);
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(`${d.sessionLength}min`)
          .style("left", (xPos + 10) + "px")
          .style("top", (yPos - 5) + "px");
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0); // Rétablir l'opacité à 0 à la sortie
        d3.select("#tooltip").style("opacity", 0);
      });

    // Ajout de la ligne
    chart.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    // Ajout du filtre pour l'ombre
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 6) // Rayon de flou
      .attr("result", "blur");
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 2) // Décalage horizontal de l'ombre
      .attr("dy", 0) // Décalage vertical de l'ombre
      .attr("result", "offsetBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "offsetBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

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
