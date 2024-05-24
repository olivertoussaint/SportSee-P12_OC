import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import styles from './AverageSession.module.css'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

/**
 * Component to render an average session length line chart.
 * Uses D3.js to create a responsive and interactive line chart visualizing session durations over days.
 * Adapts its scales and output based on the provided data and routing path.
 *
 * @component
 * @param {Object[]} data - Array of objects representing session data per day.
 * @param {string} data[].day - Day of the week.
 * @param {number} data[].sessionLength - Duration of the session in minutes.
 */

const AverageSession = ({ data }) => {
  const chartRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // Exit if data is empty or undefined
    if (!data || data.length === 0) {
      return
    }

    // Setup the chart dimensions and margins
    const margin = { top: 20, right: 5, bottom: 30, left: 5 }
    const fullWidth = 258
    const fullHeight = 263
    const width = fullWidth - margin.left - margin.right
    const height = fullHeight - margin.top - margin.bottom

    const x = d3.scalePoint().range([0, width]).padding(0.1)
    const y = d3.scaleLinear().range([height, 0])

    // Define the line generator
    const line = d3
      .line()
      .x((d) => x(d.day))
      .y((d) => y(d.sessionLength))
      .curve(d3.curveCardinal)

    // Create the SVG element
    const svg = d3.select(chartRef.current)
    svg.selectAll('*').remove()

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    chart
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')

    // Tooltip setup
    const tooltip = d3.select('#tooltip')

    // Mouse interaction handlers
    svg.on('mouseover', function () {
      svg.selectAll('.overlay').remove()
      chart
        .selectAll('circle')
        .style('opacity', 0)
        .transition()
        .duration(200)
        .style('opacity', 1)
    })

    svg.on('mouseout', function () {
      svg.selectAll('.overlay').remove()
      chart.selectAll('circle').transition().duration(200).style('opacity', 0)
      tooltip.style('opacity', 0)
    })

     // Updating tooltip and circle positions based on mouse movement
    svg.on('mousemove', function (event) {
      const xPos = d3.pointer(event)[0]
      const closest = data.reduce((prev, curr) => {
        return Math.abs(x(curr.day) - xPos) < Math.abs(x(prev.day) - xPos)
          ? curr
          : prev
      })

      chart
        .selectAll('circle')
        .data([closest])
        .join('circle')
        .attr('class', styles.circle)
        .transition()
        .duration(200)
        .ease(d3.easeCubic)
        .attr('cx', x(closest.day))
        .attr('cy', y(closest.sessionLength))
        .attr('r', 4)
        .attr('fill', 'hsla(0, 0%, 100%, 1)')
        .attr('stroke', 'hsla(0, 0%, 100%, 0.2)')
        .attr('stroke-width', '10')
        .style('opacity', 1)

      // Update tooltip position and content
      const tooltipX = x(closest.day)
      const tooltipY = y(closest.sessionLength)

      tooltip
        .style('opacity', 1)
        .style('left', `${tooltipX + 10}px`)
        .style('top', `${tooltipY - 20}px`)
        .html(`${closest.sessionLength}min`)

      svg.selectAll('.overlay').remove()
      svg
        .append('rect')
        .attr('class', 'overlay')
        .attr('x', margin.left + tooltipX)
        .attr('y', 0)
        .attr('width', fullWidth - margin.left - tooltipX)
        .attr('height', fullHeight)
        .attr('fill', 'rgba(0, 0, 0, 0.2)')
    })

    // Set scale domains based on data
    x.domain(data.map((d) => d.day))

    if (location.pathname.includes('/user/18')) {
      y.domain([25, d3.max(data, (d) => d.sessionLength + 10)]) // Adjust y-axis for specific user
    } else if (location.pathname.includes('/user/12')) {
      y.domain([-10, d3.max(data, (d) => d.sessionLength + 5)]) // Adjust y-axis differently for another user
    }

    // Gradient definition for line coloration
    const defs = svg.append('defs')
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(d3.max(data, (d) => d.sessionLength)))

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'hsla(0, 0%, 100%, 0.4)')
      .attr('stop-opacity', 1)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'hsla(0, 0%, 100%, 0.9)')
      .attr('stop-opacity', 1)

    // Append x-axis
    chart
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(0)
          .tickFormat((d) => {
            if (d === 'Ma' || d === 'Me') return 'M'
            return d
          })
      )
      .selectAll('.tick text')
      .style('fill', 'white')

    chart.select('.domain').style('stroke', 'none')

    // Path drawing and animation
    const path = chart
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-gradient)')
      .attr('stroke-width', 2)
      .attr('d', line)

    const totalLength = path.node().getTotalLength()
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(900)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
  }, [data, location])

  return (
    <div className={styles.container}>
      <h3>Durée moyenne des sessions</h3>
      <div id="tooltip" className={styles.tooltip}></div>
      <svg ref={chartRef} width="258" height="263"></svg>
    </div>
  )
}

AverageSession.propTypes = {
  data: PropTypes.array.isRequired,
}

export default AverageSession
