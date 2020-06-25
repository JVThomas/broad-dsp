const _ = require('lodash');
const axios = require('axios');

const processGraph = function (stops, graph, transfers, routeLongName, color) {

    //helper function that adds stop as an element in neighbor object
    //element will consist of routes with routeName:index pairings
    const addStopAsNeighbor = function (index, stops, centerStop, route) {
        let neighbor = stops[index];
        centerStop.neighbors[neighbor.attributes.name] = {
            [route]: index
        };
    }

    //iterate through each element, save stop onto stop hash
    //each stop saves the routes with its position on said route based on the initial stops array
    //each stop also saves its neighbors as objets that denotes its(neighbor) position on the route where the relationship occurs
    stops.forEach((stop, index) => {
        let route = stop.relationships.route.data.id;
        let stopName = stop.attributes.name;
        let routeData = {index, long_name: routeLongName, color};
        if (!graph[stopName]) {
            graph[stopName] = {
                routes: {
                    [route]: routeData
                },
                neighbors: {}
            }
        } else {
            graph[stopName].routes[route] = routeData;

            //explicit check on two during processing to prevent duplicate push to transers array
            let routeCount = Object.keys(graph[stopName].routes).length;
            if(routeCount === 2) {
                let transferStop = graph[stopName];
                transferStop.name = stopName;
                transfers.push(transferStop);
            }
        }

        if (stops[index - 1]) {
            addStopAsNeighbor(index - 1, stops, graph[stopName], route);
        }

        if (stops[index + 1]) {
            addStopAsNeighbor(index + 1, stops, graph[stopName], route);
        }
    });
}

const processSubwayData = function (req, res) {

    let stopPromiseArray = [];
    let stopsCollection = [];
    let graph = {};
    let lines;

    //get the list of all the line names for the heavy and light rails
    axios.get('https://api-v3.mbta.com/routes', {
        params: {
            'fields[route]': 'long_name,color',
            'filter[type]': '0,1',
            'api_key': process.env.MBTA_API_KEY
        }
    }).then((response) => {
        //iterate through each line, send a request to MBTA to get all stops for current line in loop
        //push promise into array
        lines = response.data.data.map((lineData) => {
            const id = lineData.id;
            let promise = axios.get('https://api-v3.mbta.com/stops', {
                params: {
                    include: 'route',
                    'filter[route]': id,
                    'api_key': process.env.MBTA_API_KEY
                }
            });
            stopPromiseArray.push(promise)
            return lineData;
        });
        return Promise.all(stopPromiseArray);
    })
    .then((promiseData) => {
        let transfers = [];
        stopsCollection = promiseData.map((lineData, index) => {
            let routeLongName = lines[index].attributes.long_name;
            let color = lines[index].attributes.color;
            let stops = lineData.data.data;
            lines[index].stopCount = stops.length;
            processGraph(stops, graph, transfers, routeLongName, color);
            return stops;
        });
        res.status(200).send({
            stops: stopsCollection,
            lines,
            graph,
            transfers
        });
    })
    .catch((error) => {
        console.log(error);
        if (error.status) {
            res.status(error.status).send({
                message: 'MBTA API request failed'
            });
        } else {
            res.status(500).send({
                message: 'Server endpoint processing error'
            });
        }
    });
}

module.exports = processSubwayData