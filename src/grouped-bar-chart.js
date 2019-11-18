import * as d3 from 'd3'

const margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 70
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#grouped-bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var colorScale = d3.scaleOrdinal().range(['#657190', '#99A5C6', '#ECD1DF'])

// scale for distance between groups of bars
var xPositionScale0 = d3
  .scaleBand()
  .rangeRound([0, width])
  .padding(0.3)

var xPositionScale1 = d3.scaleBand().padding(0.1)

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 2500]) // bc the max monthly sightings is ~2200, in July 2017
  .range([height - margin.top - margin.bottom, 0])

d3.csv(require('./data/grouped_monthly_count_2017_to_2019.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(datapoints)

  const months = datapoints.map(d => d['month'])

  xPositionScale0.domain(months)
  xPositionScale1
    .domain(['2017', '2018', '2019'])
    .range([0, xPositionScale0.bandwidth()])

  // Grouping bars together + transforming!
  // using translaet to reposition group element w/ margins on left and top
  var monthName = svg
    .selectAll('.month-name')
    .data(datapoints)
    .enter()
    .append('g')
    .attr('class', 'month-name')
    .attr('transform', d => `translate(${xPositionScale0(d.month)},0)`)

  // add 2017 bars!
  monthName
    .selectAll('.bars-2017')
    .data(d => [d])
    .enter()
    .append('rect')
    .attr('class', 'bars-2017')
    .style('fill', '#657190')
    .attr('x', d => xPositionScale1('2017'))
    .attr('y', d => yPositionScale(d['2017']))
    .attr('width', xPositionScale1.bandwidth())
    .attr('height', d => {
      return height - margin.top - margin.bottom - yPositionScale(d['2017'])
    })

  // add 2018 bars!
  monthName
    .selectAll('.bars-2018')
    .data(d => [d])
    .enter()
    .append('rect')
    .attr('class', 'bars-2018')
    .style('fill', '#99A5C6')
    .attr('x', d => xPositionScale1('2018'))
    .attr('y', d => yPositionScale(d['2018']))
    .attr('width', xPositionScale1.bandwidth())
    .attr('height', d => {
      return height - margin.top - margin.bottom - yPositionScale(d['2018'])
    })

  // add 2019 bars!
  monthName
    .selectAll('.bars-2019')
    .data(d => [d])
    .enter()
    .append('rect')
    .attr('class', 'bars-2019')
    .style('fill', '#ECD1DF')
    .attr('x', d => xPositionScale1('2019'))
    .attr('y', d => yPositionScale(d['2019']))
    .attr('width', xPositionScale1.bandwidth())
    .attr('height', d => {
      return height - margin.top - margin.bottom - yPositionScale(d['2019'])
    })

  // ADD AXES!
  var yAxis = d3.axisLeft(yPositionScale).ticks(5)

  var xAxis = d3.axisBottom(xPositionScale0)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .call(g => g.select(".domain").remove()) // remove y-axis line

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height - margin.top - margin.bottom})`) // remove spacing at bottom
    .call(xAxis)
    .call(g => g.select('.domain').remove()) // remove x-axis line

  // ADD LEGEND!

  var years = ['2017', '2018', '2019']

  var legend = svg
    .selectAll('.legend')
    .data(years)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      return 'translate(0,' + i * 20 + ')'
    })

  legend
    .append('rect')
    .attr('x', width - 15)
    .attr('width', 12)
    .attr('height', 12)
    .style('fill', function(d) {
      return colorScale(d)
    })

  legend
    .append('text')
    .attr('x', width - 20)
    .attr('y', 6)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .style('font-size', '10px')
    .style('fill', 'white')
    .text(function(d) {
      return d
    })
}
