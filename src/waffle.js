import * as d3 from 'd3'

const waffle = d3.select('.waffle')

d3.csv(require('./data/borough_sightings_count_Nov112019.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // For each item in the array, add a div element
  // if the number is < 5, color it red, otherwise gray

  waffle
    .selectAll('.block')
    .data(datapoints)
    .enter()
    .append('div')
    .attr('class', 'block')
    // .style('border', 'solid red')
    // .style('background-color', d => (d === 'Brooklyn' ? '#FE4A49' : '#CCCCCC'))
    .style('background-color', function(d) {
      if (d.borough === 'Brooklyn') {
        return '#657190'
      } else if (d.borough === 'Manhattan') {
        return '#99A5C6'
      } else if (d.borough === 'Bronx') {
        return '#ECD1DF'
      } else if (d.borough === 'Queens') {
        return '#FFD4A2'
      } else {
        return '#FEF0CA'
      }
    })

  var boroughs = ['Brooklyn', 'Manhattan', 'Bronx', 'Queens', 'Staten Island']

  const legend = d3.select('.waffle-legend')

  legend
    .selectAll('.legend-squares')
    .data(boroughs)
    .enter()
    .append('div')
    .attr('class', 'legend-squares')
    .style('background-color', function(d) {
      // console.log(d)
      if (d === 'Brooklyn') {
        return '#657190'
      } else if (d === 'Manhattan') {
        return '#99A5C6'
      } else if (d === 'Bronx') {
        return '#ECD1DF'
      } else if (d === 'Queens') {
        return '#FFD4A2'
      } else {
        return '#FEF0CA'
      }
    })
    .text(function(d) {
      // console.log(d)
      if (d === 'Brooklyn') {
        return '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Brooklyn'
      } else if (d === 'Manhattan') {
        return '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Manhattan'
      } else if (d === 'Bronx') {
        return '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Bronx'
      } else if (d === 'Queens') {
        return '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Queens'
      } else {
        return '\xa0\xa0\xa0\xa0\xa0\xa0' + 'Staten' + '\xa0' + 'Island'
      }
    })
}
