import './index.css'
import './map.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import 'leaflet/dist/images/marker-shadow.png'
import L from "leaflet"
import * as d3 from 'd3'
let chicagoBoundaries = require('./data/Chicago.City.Boundaries.json')

const map = L.map('map').setView([41.8891078, -87.6729024], 13)

L.tileLayer('https://tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.svg({clickable: true}).addTo(map)

const overlay = d3.select(map.getPanes().overlayPane)
const svg = overlay.select('svg').attr('pointer-events', 'auto')
const g = svg.append('g')
    .attr('class', 'leaflet-zoom-hide')


// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
   }

const projection = d3.geoTransform({point: projectPoint})
const pathCreator = d3.geoPath().projection(projection)

const areaPaths = g.selectAll('path')
   .data(chicagoBoundaries.features)
   .join('path')
   .attr('fill-opacity', 0.3)
   .attr('stroke', 'black')
   .attr('z-index', 3000)
   .attr('stroke-width', 0.5)
   .attr('fill', 'black')

console.log(areaPaths)

const onZoom = () => areaPaths.attr('d', pathCreator)
onZoom()
map.on('zoomend', onZoom) 