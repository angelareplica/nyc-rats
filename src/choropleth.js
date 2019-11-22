import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 10, left: 10, right: 10, bottom: 10 }

let height = 650 - margin.top - margin.bottom

let width = 800 - margin.left - margin.right

let svg = d3
  .select('#choropleth')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var colorScale = d3
  .scaleThreshold()
  .domain([0, 100, 500, 1000, 2000, 3000, 4000, 4500])
  .range([
    '#FEF0CA',
    '#E8DDC1',
    '#D2CBB9',
    '#BCB9B1',
    '#A6A7A8',
    '#9095A0',
    '#7A8398',
    '#657190'
  ])
// .range(d3.schemeBlues[8])

// add a div for the tooltip
var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip-map')
  .style('opacity', 0)

// map and projection
let projection = d3
  .geoMercator()
  .center([-73.94, 40.7]) // center projection on NYC
  .scale(64000)
  .translate([width / 2, height / 2])

var path = d3.geoPath().projection(projection)

// // create a variable to store data from the csv
var sightingsData = d3.map()

Promise.all([
  d3.json(require('./data/nyc_zips.topojson')),
  // d3.csv(require('./data/counted_by_zip.csv'), function(d) {
  //   if (isNaN(d.sighting_count)) {
  //     sightingsData.set(d.zip, 0)
  //   } // adding if statement in case of nulls? (ok there are none apparently)
  //   else {
  //     sightingsData.set(d.zip, +d.sighting_count)
  //   }
  // })
  d3.csv(require('./data/counted_by_zip.csv'), function(d) {
    sightingsData.set(d.zip, +d.sighting_count)
  })
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json]) {
  // console.log(json)

  let zips = topojson.feature(json, json.objects.collection)

  // console.log(zips)

  svg
    .selectAll('.zipshapes')
    // .data(json.features)
    .data(zips.features)
    .enter()
    .append('path')
    .attr('class', 'zipshapes')
    .attr('d', path)
    .attr('fill', function(d) {
      // console.log(d)
      var sightings = (d.sighting_count = sightingsData.get(
        d.properties.postalCode
      )) // attaching data from my csv to my topojson
      if (isNaN(sightings)) {
        return 'none' // apparently there are more zip codes in the topojson than i have data for, so add an if statement to avoid Central Park being black
      } else {
        return colorScale(sightings)
      }
    })
    .attr('stroke', '#303541')
    .attr('stroke-width', 0.1)
    .on('mouseover', function(d) {
      // make the zip areas highlight on mouseover
      d3.select(this)
        .transition()
        .duration(100)
        .attr('fill', '#FFCDC2')
        .attr('stroke', '#847792')
        .attr('stroke-width', 1.5)

      div
        .transition()
        .duration(100)
        .style('opacity', 0.8) // setting the opacity of the tooltip so it appears. 0 > 0.8 > 0

      div
        .html(
          'Zip code: ' +
            '<strong>' +
            d.properties.postalCode +
            '</strong>' +
            '<br/>' +
            d.sighting_count +
            ' 🐀sightings'
        )
        .style('left', d3.event.pageX + 'px')
        // .style('right', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('stroke', '#303541')
        .attr('stroke-width', 0.1)
        .attr('fill', function(d) {
          // console.log(d)
          var sightings = (d.sighting_count = sightingsData.get(
            d.properties.postalCode
          ))
          if (isNaN(sightings)) {
            return 'white'
          } else {
            return colorScale(sightings)
          }
        })

      div
        .transition()
        .duration(200)
        .style('opacity', 0)
    })

  // add text labels
  svg
    .append('text')
    .attr('fill', '#657190')
    .text('Manhattan')
    .attr('x', 230)
    .attr('y', 200)
    .style('font-size', 18)
    .style('font-weight', 'bold')

  svg
    .append('text')
    .attr('fill', '#657190')
    .text('Staten Island')
    .attr('x', 130)
    .attr('y', 370)
    .style('font-size', 18)
    .style('font-weight', 'bold')

  svg
    .append('text')
    .attr('fill', '#657190')
    .text('Brooklyn')
    .attr('x', 280)
    .attr('y', 535)
    .style('font-size', 18)
    .style('font-weight', 'bold')

  svg
    .append('text')
    .attr('fill', '#657190')
    .text('Bronx')
    .attr('x', 530)
    .attr('y', 25)
    .style('font-size', 18)
    .style('font-weight', 'bold')

  svg
    .append('text')
    .attr('fill', '#657190')
    .text('Queens')
    .attr('x', 575)
    .attr('y', 170)
    .style('font-size', 18)
    .style('font-weight', 'bold')

  // adding dots for each sighting. ok this is insane bc there are 140k sightings; what was i thinking
  // svg
  //   .selectAll('.sighting')
  //   .data(fullData)
  //   .enter()
  //   .append('circle')
  //   .attr('class', 'sighting')
  //   .attr('r', 1)
  //   .attr('transform', d => {
  //     // console.log(d)
  //     let coords = projection([+d.Longitude, +d.Latitude])
  //     return `translate(${coords})`
  //   })
  //   .attr('fill', 'orange')
}
