import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './Activity.module.css';
import BlackDot from '../../../assets/images/blackdot.png';
import RedDot from '../../../assets/images/reddot.png';
import activityFormat from '../../../dataFormat/activityFormat';
import PropTypes from 'prop-types';

function Activity({ data }) {
  const [userData, setUserData] = useState(null);
  const svgRef = useRef();
  const containerRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (data) {
      const formattedUserData = activityFormat(data);
      if (formattedUserData.length > 0) {
        setUserData(formattedUserData);
      } else {
        console.error('Error fetching user data: Invalid data format');
      }
    } else {
      console.error('Error fetching user data: No data received');
    }
  }, [data]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    const width = 800; // Changer la largeur du graphique
    const height = 400; // Changer la hauteur du graphique
    const margin = { top: 20, right: 60, bottom: 30, left: 40 }; // Ajout de la marge pour l'axe y à droite

    const x = d3
      .scaleBand()
      .domain(userData.map((d) => d.day))
      .range([0, width])
      .padding(0.2);

    const yMaxKg = d3.max(userData, (d) => d.kilogram) + 2;
    const yMinKg = d3.min(userData, (d) => d.kilogram) - 1;
    const yKg = d3
      .scaleLinear()
      .domain([yMinKg, yMaxKg])
      .nice()
      .range([height, 0]);

    const yMaxCalories = d3.max(userData, (d) => d.calories) + 100;
    const yMinCalories = 0;
    const yCalories = d3
      .scaleLinear()
      .domain([yMinCalories, yMaxCalories])
      .nice()
      .range([height, 0]);

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const tooltip = d3.select(tooltipRef.current)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'red')
      .style('color', 'white')
      .style('padding', '5px');

    const handleMouseOver = (event, d) => {
      const kilogram = d.kilogram;
      const calories = d.calories;
      tooltip
        .style('opacity', 1)
        .html(`Kilogram: ${kilogram}<br>Calories: ${calories}`)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 'px');
    };

    const handleMouseOut = () => {
      tooltip.style('opacity', 0);
    };

    const barWidth = x.bandwidth();

    svg
      .selectAll('.barKg')
      .data(userData)
      .enter()
      .append('rect')
      .attr('class', 'barKg')
      .attr('x', (d) => x(d.day))
      .attr('y', (d) => yKg(d.kilogram))
      .attr('width', barWidth / 30) // Réduit la largeur pour donner de l'espace entre les barres
      .attr('height', (d) => height - yKg(d.kilogram))
      .attr('fill', 'black')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    svg
      .selectAll('.barCalories')
      .data(userData)
      .enter()
      .append('rect')
      .attr('class', 'barCalories')
      .attr('x', (d) => x(d.day) + barWidth / 10) // Déplace à droite pour séparer les barres
      .attr('y', (d) => yCalories(d.calories))
      .attr('width', barWidth / 2) // Réduit la largeur pour donner de l'espace entre les barres
      .attr('height', (d) => height - yCalories(d.calories))
      .attr('fill', 'red')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Créer l'axe y pour les poids
    const yKgAxis = d3.axisLeft(yKg)
      .tickValues([yMinKg, (yMinKg + yMaxKg) / 2, yMaxKg + 2]);

    // Ajoute un groupe pour l'axe y à gauche
    svg.append("g")
      .attr("class", "y-axis-kg")
      .call(yKgAxis);

    // Crée l'axe y pour les calories
    const yCaloriesAxis = d3.axisRight(yCalories)
      .tickValues([yMinCalories, yMaxCalories / 2, yMaxCalories]);

    // Ajoute un groupe pour l'axe y à droite
    svg.append("g")
      .attr("class", "y-axis-calories")
      .attr("transform", `translate(${width}, 0)`)
      .call(yCaloriesAxis);

  }, [userData]);

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
}

Activity.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Activity;
