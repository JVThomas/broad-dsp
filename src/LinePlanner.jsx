import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export default function LinePlanner(props) {
    const [source, setSource] = useState(undefined);
    const [destination, setDestination] = useState(undefined);
    const [enableButton, setEnableButton] = useState(false);
    const [options, setOptions] = useState(null);
    const [path, setPath] = useState('');

    //this hook allows us to set up a new options collections for the drop downs when graph data is updated
    useEffect(() => {
        setOptions(Object.keys(props.graph));
    }, [props.graph]);

    //this hook will check if the source and destination values are populated when their value changes
    //if the values are valid, the enableButton value will be set to true
    //the Find Path button has its disabled attribute tied to this state variable, which allows for button control on invalid inputs
    useEffect(() => {
        if(source !== undefined && destination !== undefined) {
            setEnableButton(true); 
        } else {
            setEnableButton(false);
        }
    }, [source, destination]);

    const useStyles = makeStyles((theme) => ({
        pathContainer: {
            marginTop: "20px"
        }
    }))

    const classes = useStyles();

    //function used to calculcate a path between two nodes
    //basic idea is to do a BST from the source and destination, updating each at the same time
    //assumption was that if you increment both sides 1 depth simultaneously, the first intersection should be a vaild path between the two
    const calcPath = function(source, destination) {

        //null check on values, exit function if check is true
        if(source === undefined || destination === undefined) {
            return null;
        }

        //initializing queues for both source and destiantion paths
        let sourceQueue = [{
            node: props.graph[source],
            lines: []
        }];
        let destinationQueue = [{
            node: props.graph[destination],
            lines: []
        }];

        //initializing variables to keep track of nodes visited, current paths, and current nodes
        let currentSourceLines = [];
        let currentDestinationLines = [];
        let breadcrumb = {};
        let sourceNode, destinationNode;

        //helper function to combine the source path and the destination path into one
        const compileResult = function(sourceArr, destinationArr) {
            let sourceLength = sourceArr.length;
            let destinationLength = destinationArr.length;
            //check on the last elements on both paths to avoid duplicating the route value on the intersecting node
            //need to reverse destination node order before joining as well to ensure proper ordering from source to destination
            if(sourceArr[sourceLength-1] === destinationArr[destinationLength - 1]) {
                destinationArr = destinationArr.slice(0, destinationLength -1).reverse();
            } else {
                destinationArr = destinationArr.reverse();
            }

            //flatten and join the two arrays at the end
            return [sourceArr, destinationArr].flat().join(', ');
        }

        //basic helper to add neighbors at current node to the queue
        //cloned state of the current path is also passed along side each neighbor node
        const addToQueue = function(neighbors, currentLines, queue) {
            let neighborList = Object.keys(neighbors);
            neighborList.forEach((neighbor) => {
                queue.push(Object.assign({}, {lines: currentLines.slice(0)}, {node: props.graph[neighbor]}));
            });
        }

        //strategy
            //if the nodes are the same, check the existing lists
                //if the lists are empty, it means source === destination, pick one line to return
                //if the lists are not empty, combine the existing paths and return
            //if the nodes are not the same
                //check if current route is different from the previous item in the list
                    //add new route if it is different
                //save route to hash with a copy of the current route attached to it
                //push neighbors of currentNode onto queue with copies of the current route attached to it

        //basic loop condition to keep the search going until intersection is found or neither side has any valid paths
        while(sourceQueue.length > 0 || sourceQueue.length > 0) {
            //BTS requires FIFO processing, so shift is used
            let sourceData = sourceQueue.shift();
            let sourceNode = sourceData.node;
            let currentSourceLines = sourceData.lines;

            let destinationData = destinationQueue.shift();
            let destinationNode = destinationData.node;
            let currentDestinationLines = destinationData.lines;

            //conditional if souce node is the same as the destination node
            if(sourceNode.name === destinationNode.name && sourceNode.name !== undefined) {
                //if paths are empty, it means the source === destination, return any route
                if(currentSourceLines.length === 0 && currentDestinationLines.length === 0) {
                    setPath(Object.keys(sourceNode.routes)[0]);
                } else {
                    //else take current paths and send to helper for output formatting
                   return compileResult(currentSourceLines, currentDestinationLines);
                }
            //if sourceNode was already visited by destinationPath, get path saved in breadcrumb and combine with current source path
            } else if (sourceNode && breadcrumb[sourceNode.name] && breadcrumb[sourceNode.name].visitedBy === 'destination') {
                let result = compileResult(currentSourceLines, breadcrumb[sourceNode.name].lines);
                return setPath(result);
            //if destinationNode was already visted on the sourcePath, get saved path in breadcrumb and combine with current destination path
            } else if (destinationNode && breadcrumb[destinationNode.name] && breadcrumb[destinationNode.name].visitedBy === 'source') {
                let result = compileResult(breadcrumb[destinationNode.name].lines, currentDestinationLines);
                return setPath(result);
            } else {
                //undefined check on source node
                if(sourceNode) {
                    //get routes from source node
                    let sourceNodeRoutes = Object.keys(sourceNode.routes);
                    let sourceLength = currentSourceLines.length;
                    //if the node is an intersection route, do not add routes to current path unless currentPath is empty
                    //if currentPath is empty, simply pick a route available and set that as its value
                    //otherwise if path is not empty let the node's neighbors determine the next line in the path
                    if ((sourceNodeRoutes.length === 1 && sourceNodeRoutes[0] !== currentSourceLines[sourceLength - 1]) || 
                    currentSourceLines.length === 0) {
                        currentSourceLines.push(sourceNodeRoutes[0]);
                    }
                    addToQueue(sourceNode.neighbors, currentSourceLines, sourceQueue);
                    //add node to breadcrumb object with path at the time of visit
                    //mark visitedBy to ensure that cycles are not travelled again
                    breadcrumb[sourceNode.name] = Object.assign({}, {node: sourceNode, visitedBy:'source'}, {lines: currentSourceLines.slice(0)});
                }

                //destination node has the same logic as above
                if(destinationNode) {
                    let destinationNodeRoutes = Object.keys(destinationNode.routes);
                    let destinationLength = currentDestinationLines.length;
                    if ((destinationNodeRoutes.length === 1 && destinationNodeRoutes[0] !== currentDestinationLines[destinationLength -1]) || 
                    currentDestinationLines.length === 0) {
                        currentDestinationLines.push(destinationNodeRoutes[0]);
                    }
                    addToQueue(destinationNode.neighbors, currentDestinationLines, destinationQueue);
                    breadcrumb[destinationNode.name] = Object.assign({}, {node: destinationNode, visitedBy:'destination'}, {lines: currentDestinationLines.slice(0)});
                }
            }
        }
    }

    return (
       <div>
           <Grid container spacing={2}>
               <Grid item xs={4}>
                   <Autocomplete
                        id="source-box"
                        onChange={(event, newValue) => {setSource(newValue)}}
                        options={options}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} label="Source" variant="outlined"></TextField>}
                   >    
                   </Autocomplete>
               </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        id="destination-box"
                        onChange={(event, newValue) => setDestination(newValue)}
                        options={options}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} label="Destination" variant="outlined"></TextField>}
                    >
                    </Autocomplete>
                </Grid>
                <Grid item xs={4}>
                    <Button onClick={() => calcPath(source, destination)} disabled={!enableButton}>Find Path</Button>
                </Grid>
           </Grid>
            <div id="output-container" className={classes.pathContainer}>
                {(path) && <Typography variant="h5" component="h5">{`Path: ${path}`}</Typography>}
            </div>
       </div>
    )
}