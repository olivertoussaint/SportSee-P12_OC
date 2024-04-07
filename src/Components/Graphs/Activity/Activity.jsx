import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styles from './Activity.module.css'; // Importation du fichier CSS
import BlackDot from '../../../assets/images/blackdot.png';
import RedDot from '../../../assets/images/reddot.png';

const Activity = ({ data }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || !containerRef.current) {
      return;
    }

    const containerWidth = 702;
    const containerHeight = 200;
    const margin = { top: 20, right: 40, bottom: 30, left: 40 }; // Ajuster la marge droite
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Ajouter la propriété "day" à chaque objet dans les données
    const dataWithDay = data.map((d, i) => ({ ...d, day: i + 1 }));

    // Créer l'élément SVG
    const svg = d3.select(containerRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    // Ajouter un groupe pour le graphique en lui-même
    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Créer l'échelle X avec le domaine basé sur les valeurs des jours
    const xScale = d3.scaleBand()
      .domain(dataWithDay.map(d => d.day.toString())) // Domaine basé sur les valeurs des jours
      .range([0, width])
      .padding(0.8); // Espacement entre les bandes

    // Calculer la valeur minimale et maximale des kilogrammes
    const minValue = Math.floor(d3.min(data, d => d.kilogram)) - 1;
    const maxValue = Math.floor(d3.max(data, d => d.kilogram)) + 2;

    // Créer l'échelle Y pour les kilogrammes avec le domaine basé sur les valeurs de données
    const yScaleKg = d3.scaleLinear()
      .domain([minValue, maxValue]) // Utiliser les valeurs min et max calculées
      .range([height, 0]);

    // Définir les trois valeurs à afficher sur l'axe des ordonnées
    const yValues = [minValue, Math.floor((minValue + maxValue) / 2), maxValue];

    // Créer l'axe Y pour les kilogrammes
    const yAxisKg = d3.axisRight(yScaleKg)
      .tickSize(0) // Définir la taille des marques à 0 pour les rendre invisibles
      .tickValues(yValues) // Utiliser les valeurs spécifiées pour les étiquettes

    // Ajouter une classe à l'axe des ordonnées pour les kilogrammes et appliquer la classe du module CSS
    chart.append("g")
      .attr("class", styles.yAxisKg) // Appliquer la classe CSS du module
      .attr("transform", `translate(${width}, 0)`)
      .call(yAxisKg);

    // Créer l'échelle Y pour les calories avec le domaine basé sur les valeurs de données
    const yScaleCalories = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.calories)]) // Utiliser d.calories pour accéder aux valeurs de calories
      .range([height, 0]);

    // Créer l'axe Y pour les calories
    const yAxisCalories = d3.axisLeft(yScaleCalories)
      .tickSize(0) // Définir la taille des marques à 0 pour les rendre invisibles
      .tickValues([0, Math.ceil(d3.max(data, d => d.calories) / 2), d3.max(data, d => d.calories)]); // Utiliser les valeurs spécifiées pour les étiquettes

    // Ajouter une classe à l'axe des ordonnées pour les calories et appliquer la classe du module CSS
    chart.append("g")
      .attr("class", styles.yAxisCalories) // Appliquer la classe CSS du module
      .call(yAxisCalories);

    // Créer les barres pour représenter les kilogrammes
    const barGroup = chart.selectAll(".bar-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .on("mouseover", function() {
        d3.select(this).selectAll(".hover-rect").style("opacity", 1); // Rendre le rectangle visible au survol de la souris
      })
      .on("mouseout", function() {
        d3.select(this).selectAll(".hover-rect").style("opacity", 0); // Rendre le rectangle invisible lorsque la souris quitte la barre
      });

    // Créer le rectangle supplémentaire pour l'effet au survol de la souris
    barGroup.append("rect")
      .attr("class", "hover-rect") // Ajouter une classe pour appliquer des styles CSS si nécessaire
      .attr("x", (d, i) => xScale((i + 1).toString()) - xScale.bandwidth() / 2) // Positionner le rectangle à la position de la première barre
      .attr("y", 0) // Position Y du haut du rectangle
      .attr("width", xScale.bandwidth() * 3.5) // Largeur du rectangle égale à la largeur des deux barres
      .attr("height", height) // Hauteur du rectangle égale à la hauteur du graphique
      .attr("fill", "var(--bgbargroup)") // Couleur de remplissage du rectangle
      .style("opacity", 0); // Rendre le rectangle invisible par défaut

    barGroup.append("rect")
      .attr("class", styles.barKg) // Ajouter une classe pour appliquer des styles CSS si nécessaire
      .attr("x", (d, i) => xScale((i + 1).toString())) // Utiliser les valeurs des jours pour positionner les barres sur l'axe X
      .attr("y", d => yScaleKg(d.kilogram)) // Utiliser d.kilogram pour accéder aux valeurs de poids
      .attr("width", xScale.bandwidth() / 2.5) // Largeur de la barre basée sur la moitié de la largeur de la bande dans l'échelle X
      .attr("height", d => height - yScaleKg(d.kilogram)); // Hauteur de la barre basée sur la valeur de poids et l'échelle Y
    

    // Créer les barres pour représenter les calories
    barGroup.append("rect")
      .attr("class", styles.barCalories) // Ajouter une classe pour appliquer des styles CSS si nécessaire
      .attr("x", (d, i) => xScale((i + 1).toString()) + xScale.bandwidth() / 2 + 10) // Positionner la deuxième barre à côté de la première avec un espace de 10 pixels
      .attr("y", d => yScaleCalories(d.calories)) // Utiliser d.calories pour accéder aux valeurs de calories
      .attr("width", xScale.bandwidth() / 2.5) // Largeur de la barre basée sur la moitié de la largeur de la bande dans l'échelle X
      .attr("height", d => height - yScaleCalories(d.calories)) // Hauteur de la barre basée sur la valeur de calories et l'échelle Y
      .attr("fill", "var(--redColor)"); // Couleur de remplissage des barres pour les calories

  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.legend}>
        <h3>Activité quotidienne</h3>
        <div className={styles.legendElements}>
          <div className={styles.legend1}>
            <span>
              <img src={BlackDot} alt="point noir" />
            </span>
            Poids
          </div>
          <div className={styles.legend2}>
            <span>
              <img src={RedDot} alt="point rouge" />
            </span>
            Calories brûlées (kCal)
          </div>
        </div>
      </div>
      <svg ref={containerRef}></svg>
    </div>
  );
};

Activity.propTypes = {
  data: PropTypes.array.isRequired
};

export default Activity;
