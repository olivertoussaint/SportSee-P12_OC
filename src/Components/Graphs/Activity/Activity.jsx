import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import styles from './Activity.module.css'
import BlackDot from '../../../assets/images/blackdot.png'
import RedDot from '../../../assets/images/reddot.png'
import { useLocation } from 'react-router-dom'

const Activity = ({ data }) => {
  const containerRef = useRef(null)
  const tooltipRef = useRef(null)
  const location = useLocation()
  const [tooltip, setTooltip] = useState('')
  const [tooltipVisibility, setTooltipVisibility] = useState('hidden')

  useEffect(() => {

    
    if (!data || !containerRef.current) {
      return
    }
    console.log(location)

    const containerWidth = 702
    const containerHeight = 200
    const margin = { top: 20, right: 10, bottom: 30, left: 60 }
    const width = containerWidth - margin.left - margin.right
    const height = containerHeight - margin.top - margin.bottom
    const spaceBetweenBars = 15

    const svg = d3
      .select(containerRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight)

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xScale = d3
      .scaleBand()
      .domain(data.map((_, i) => (i + 1).toString()))
      .range([0, width])
      .paddingInner(0.9)
      .paddingOuter(0.5)

    const xAxisGroup = chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .attr('class', styles.xAxis)

    // Adding a line to cover the stroke-dasharray
    chart
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height)
      .attr('y2', height)
      .attr('stroke', '#ccc') // Match the color of the axis
      .attr('stroke-width', '1') // Ensure it covers the dashed line

    xAxisGroup.selectAll('.tick line, .domain').remove()

    xAxisGroup
      .selectAll('.tick text')
      .style('fill', '#ccc')
      .style('text-anchor', 'start')
      .attr('dy', '0.95em')
      .attr('x', '-3px') // décale le texte horizontalement

    let yMinCalories = d3.min(data, (d) => d.calories - 100)
    let yMaxCalories = d3.max(data, (d) => d.calories + 100)
    let yMedianCalories = d3.median(data, (d) => d.calories + 80)

    const yScaleCalories = d3
      .scaleLinear()
      .domain([yMinCalories, yMaxCalories])
      .range([height, 0])

    const yAxisCalories = d3
      .axisLeft(yScaleCalories)
      .tickValues([yMinCalories, yMedianCalories, yMaxCalories])
      .tickFormat(d3.format('.2s'))

    // Ajout de l'axe Y et mise à jour immédiate pour le rendre invisible
chart
.append('g')
.call(yAxisCalories)
.attr('class', styles.yAxisLeft)
.call(g => {
  g.selectAll('.tick line').remove(); // Supprime les lignes des ticks si nécessaire
  g.selectAll('.tick text').style('fill', '#ccc'); // Change la couleur des textes des ticks si vous souhaitez les garder visibles
})
.style('display', 'none'); // Rend tout le groupe de l'axe Y invisible

    const barWidth = xScale.bandwidth() * 0.7

    let yMinKg = d3.min(data, (d) => d.kilogram)
    let yMaxKg = d3.max(data, (d) => d.kilogram)
    let yMedianKg = d3.median(data, (d) => d.kilogram)

      // Ajustements conditionnels basés sur l'URL
      if (location.pathname.includes('/user/18')) {
        yMinKg -= 1
        yMaxKg +=2
        yMedianKg +=1

    
      } else if (location.pathname.includes('/user/12')) {
        // Faites d'autres ajustements si nécessaire pour l'utilisateur 12
        yMinKg -=2
        yMaxKg +=1
        yMedianKg -=2
      }
  

    const yScaleKg = d3
      .scaleLinear()
      .domain([yMinKg, yMaxKg, yMedianKg])
      .range([height, 0])

    const yAxisKg = d3
      .axisRight(yScaleKg)
      .tickValues([yMinKg, yMedianKg, yMaxKg])
      .tickFormat(d3.format('.2s'))

    
    chart
      .append('g')
      .call(yAxisKg)
      .attr('transform', `translate(${width}, 0)`)
      .attr('class', styles.yAxisRight)
      .call((g) => {
        g.select('.domain').remove()
        g.selectAll('line').remove()
        g.selectAll('.tick text').attr('dx', '20px').style('fill', '#ccc')
      })

    chart
      .append('g')
      .attr('class', styles.grid)
      .call(
        d3
          .axisRight(yScaleKg)
          .tickValues([yMinKg, yMedianKg, yMaxKg])
          .tickSize(-width)
          .tickFormat('')
      )
      .attr('transform', `translate(${width}, 0)`)
      .call((g) => {
        g.select('.domain').remove()
        g.selectAll('.tick line')
          .attr('stroke-dasharray', '2,2')
          .attr('stroke', '#ccc')
      })

    const hoverContainer = chart
      .selectAll('.hover-container')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'hover-container')

    hoverContainer
      .append('rect')
      .attr('class', styles.hoverRect)
      .attr(
        'x',
        (d) =>
          xScale((data.indexOf(d) + 1).toString()) -
          barWidth / 2 -
          spaceBetweenBars
      ) // Légèrement plus large pour une meilleure couverture
      .attr('y', 0)
      .attr('width', barWidth * 2 + spaceBetweenBars * 2.5) // Augmente la largeur pour couvrir complètement les deux barres et l'espace
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('opacity', 0)
      .on('mouseover', function (event, d) {
        setTooltip(
          <div>
            {d.kilogram} kg
            <br />
            {d.calories} Kcal
          </div>
        )

        setTooltipVisibility('visible')
        
        tooltipRef.current.style.left = `${event.pageX - 90}px`
        tooltipRef.current.style.top = `${event.pageY - 208}px`

        d3.select(this).style('opacity', 0.5).style('fill', 'var(--bgbargroup)')
      })
      .on('mouseout', function () {
        setTooltipVisibility('hidden')
        d3.select(this)
        .style('opacity', 0)
        .style('fill', 'transparent')
      })
    hoverContainer
      .append('path')
      .attr('class', styles.barKg)
      .attr('d', (d) => {
        const x = xScale((data.indexOf(d) + 1).toString()) - barWidth / 2
        const y = yScaleKg(d.kilogram)
        const barHeight = Math.max(0, height - yScaleKg(d.kilogram)) // Calcul de la hauteur de la barre correctement
        return `M${x},${y} a3,3 0 0 1 3-3 h${
          barWidth - 6
        } a3,3 0 0 1 3,3 v${barHeight} h-${barWidth}z`
      })
      .attr('fill', '#74c476')

    hoverContainer
      .append('path')
      .attr('class', styles.barCalories)
      .attr('d', (d) => {
        const x =
          xScale((data.indexOf(d) + 1).toString()) +
          barWidth / 2 +
          spaceBetweenBars / 2
        const y = yScaleCalories(d.calories)
        const barHeight = height - yScaleCalories(d.calories) // Calcul de la hauteur de la barre correctement
        return `M${x},${y} a3,3 0 0 1 3-3 h${
          barWidth - 6
        } a3,3 0 0 1 3,3 v${barHeight} h-${barWidth}z`
      })
      .attr('fill', 'hsla(0, 0%, 77%, 0.5)')
  }, [data, location])

  return (
    <div className={styles.container}>
      <div className={styles.legend}>
        <h3>Activité quotidienne</h3>
        <div className={styles.legendElements}>
          <div className={styles.legend1}>
            <img src={BlackDot} alt="Black dot" /> Poids
          </div>
          <div className={styles.legend2}>
            <img src={RedDot} alt="Red dot" /> Calories brûlées (kCal)
          </div>
        </div>
      </div>
      <svg ref={containerRef}></svg>
      <div
        ref={tooltipRef}
        className={styles.tooltip}
        style={{ visibility: tooltipVisibility }}
      >
        {tooltip}
      </div>
    </div>
  )
}

Activity.propTypes = {
  data: PropTypes.array.isRequired,
}

export default Activity
