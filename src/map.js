import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 10, left: 10, right: 10, bottom: 10 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#map')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// map and projection
var projection = d3
  .geoEqualEarth()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2])
var path = d3.geoPath().projection(projection)

// create a variable to store data from the csv
var data = d3.map()

var promises = [
  d3.json(require('.data/nyc_zips.topojson')),
  d3.csv(require('./data/counted_by_zip.csv'), function(d) {
    data.set(d.zip, d.sightings_count)
  })
]

Promise.all(promises).then(ready)

function ready([json]) {
  console.log(json)

}