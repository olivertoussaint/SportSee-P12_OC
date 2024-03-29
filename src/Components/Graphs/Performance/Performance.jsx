import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const RadarChart = () => {
  const svgRef = useRef();

  const defaultVariableOptions = [
    { key: "intensity", label: "intensity" },
    { key: "speed", label: "speed" },
    { key: "strength", label: "strength" },
    { key: "endurance", label: "endurance" },
    { key: "energy", label: "energy" },
    { key: "cardio", label: "cardio" }
  ];

  const defaultSetOptions = [
    {
      key: "me",
      label: "My Scores",
      values: {
        intensity: 1,
        speed: 8,
        strength: 2,
        endurance: 7,
        energy: 6,
        cardio: 4
      }
    },
    {
      key: "everyone",
      label: "Everyone",
      values: {
        intensity: 1,
        speed: 8,
        strength: 2,
        endurance: 7,
        energy: 6,
        cardio: 4
      }
    }
  ];

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Données du graphique radar
    const data = defaultSetOptions[0].values; // Utilise les scores "My Scores" par défaut
    const labels = defaultVariableOptions.map(option => option.label);

    // Défini les dimensions du graphique
    const width = 258;
    const height = 263;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    // Crée une échelle radiale
    const angleSlice = Math.PI * 2 / labels.length;
    const rScale = d3.scaleLinear()
      .domain([0, 10]) // Plage des valeurs de données (score de 0 à 10)
      .range([0, radius]);

    // Crée un générateur de chemin pour les points du radar
    const radarLine = d3.lineRadial()
      .radius(d => rScale(d))
      .angle((d, i) => i * angleSlice);

    // Dessine le graphique
    svg.selectAll("*").remove();
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Ajouter les axes radar
    const axisGrid = g.append("g")
      .attr("class", "axisWrapper");

    // Ajouter les rayons du radar
    axisGrid.selectAll(".levels")
      .data(d3.range(1, 6).reverse())
      .enter()
      .append("polygon") // Remplacer les cercles par des polygones
      .attr("class", "gridPolygon") // Classe CSS
      .attr("points", function(d) {
        let points = [];
        for (let i = 0; i < labels.length; i++) {
          const angle = i * angleSlice;
          let factor = 1;
          if (labels[i] === "intensity" || labels[i] === "endurance") {
            factor = 0.9; // Ajuster le facteur pour l'espace entre les polygones
          }
          const x = Math.cos(angle - Math.PI / 2) * radius * (d / 5) * factor;
          const y = Math.sin(angle - Math.PI / 2) * radius * (d / 5) * factor;
          points.push([x, y]);
        }
        return points.join(" ");
      })
      .attr("stroke", "hsla(0, 0%, 100%, 1)")
      .attr("fill", "none");

    // Ajouter les étiquettes des axes
    axisGrid.selectAll(".axisLabel")
      .data(labels)
      .enter()
      .append("text")
      .attr("class", "axisLabel")
      .attr("x", (d, i) => {
        const angle = i * angleSlice;
        if (d === "cardio" || d === "energy" || d === "intensity" || d === "endurance") {
          return Math.cos(angle - Math.PI / 2) * radius * 1.3 - 15; // Décalage pour les étiquettes spécifiques
        } else {
          return Math.cos(angle - Math.PI / 2) * radius * 1.1; // Multipliez par un facteur pour ajuster la position
        }
      })
      .attr("y", (d, i) => {
        const angle = i * angleSlice;
        return Math.sin(angle - Math.PI / 2) * radius * 1.1; // Multipliez par un facteur pour ajuster la position
      })
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .style("fill", "white") // Ajout de la couleur blanche ici
      .text(d => d);

    // Dessiner le radar
    const radarArea = g.selectAll(".radarArea")
      .data([data])
      .enter()
      .append("path")
      .attr("class", "radarArea")
      .attr("d", d => radarLine(Object.values(d)))
      .style("fill", "hsla(0, 100%, 50%, 0.7)")
      .style("fill-opacity", 0.5);

  }, []);

  return (
    <svg ref={svgRef} width={258} height={263} style={{ borderRadius: '10px', backgroundColor: 'var(--bgPerformance)' }}></svg>
  );
};

export default RadarChart;
