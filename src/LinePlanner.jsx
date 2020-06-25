import React, {useEffect, useState} from 'react';

export default function LineTransfer(props) {
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [enableButton, setEnableButton] = useState(false);

    useEffect(() => {
        if(props.graphs[source] && props.graphs[destination]) {
            setEnableButton(true); 
        } else {
            setEnableButton(false);
        }
    }, [props.source, props.destination]);

    const calcPath = function(source, destination) {
        let sourceQueue = [{
            node: props.graphs[source],
            path: []
        }];
        let destinationQueue = [{
            node: props.graphs[destination],
            path: []
        }];

        let currentSourceLines = [];
        let currentDestinationLines = [];
        let breadcrumb = {};
        let sourceNode;
        let destinationNode;
        let tripLines = [];
        let sourceFinal, destinationFinal;

        const compileResult = function(sourceArr, destinationArr) {
            let result = sourceArr;

            for(let i = destinationArr.length - 1; i >= 0; i--) {
                let line = currentDestinationLines[i];
                result.push(line);
            }

            return result;
        }

        const updateRouteLists = function(routes, currentPath, breadcrumb) {
            if(routes.length === 1 && routes[0] !== currentPath[currentPath.length-1]) {
                let pathCopy = currentPath.slice(currentPath)
            }
        }

        while(sourceQueue.length > 0 && sourceQueue.length > 0) {
            sourceNode = sourceQueue.shift();
            destinationNode = destinationQueue.shift();
            if(sourceNode.name === destinationNode.name) {
                //need to check if the paths are the same
                sourceFinal = currentSourceLines;
                destinationFinal = currentDestinationLines;
                break;
            } else if(breadcrumb[sourceNode.name]) {
                sourceFinal = currentSourceLines;
                destinationFinal = breadcrumb[sourceNode.name];
                break;
            } else if(breadcrumb[destinationNode.name]) {
                sourceFinal = breadcrumb[destinationNode.name];
                destinationFinal = currentDestinationLines;
            } else {
                let sourceNodeRoutes = Object.keys(sourceNode.routes);
                let destinationNodeRoutes = Object.keys(sourceNode.routes);

                updateRouteLists(sourceNodeRoutes, currentSourceLines, breadcrumb);
                updateRouteLists(destinationNodeRoutes, currentDestinationLines, breadcrumb);
            }
        }
    }
}