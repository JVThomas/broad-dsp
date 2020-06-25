import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Header from './Header';
import Transfers from './Transfers';
import BasicInfo from './BasicInfo';
import LinePlanner from './LinePlanner';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

function App() {
    const [stops, setStops] = useState();
    const [lines, setLines] = useState();
    const [graph, setGraph] = useState();
    const [transfers, setTransfers] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    //helper function that computes max and min stop values
    //function also adds isMax and isMin attributes to lines that meet the min/ max values
    const calcMinMaxStops = function(stopsCollection, lines) {
        let min, max;
        let minIndexes = [] 
        let maxIndexes = [];
        stopsCollection.forEach((stops, index) => {
            let numStops = stops.length;
            if(min === undefined || numStops < min) {
                minIndexes = [index];
                min = numStops;
            } else if(min === numStops) {
                minIndexes.push(index);
            }

            if(max === undefined || numStops > max) {
                maxIndexes = [index];
                max = numStops;
            } else if (numStops === max) {
                maxIndexes.push(index);
            }
        });
        
        minIndexes.forEach((minIndex) => {
            lines[minIndex].isMin = true;
        })

        maxIndexes.forEach((maxIndex) => {
            lines[maxIndex].isMax = true;
        });
    }

    const initSubwayData = function() {
        axios.get('/api/subway')
        .then((response) => {
            //set processed attributes as constants
            calcMinMaxStops(response.data.stops, response.data.lines);
            setStops(response.data.stops);
            setLines(response.data.lines);
            setGraph(response.data.graph);
            setTransfers(response.data.transfers);
        });
    }

    //empty dependency means that this hook is executed only when the component is mounted
    //ideal since pre-processing occurs on back-end, no need to make repeated requests to the api (ours or the MBTA's)
    useEffect(() => {
        initSubwayData();
    }, []);

    //basic styling for page margins and button group
    const useStyles = makeStyles((theme) => ({
        root: {
            margin: "3% 10%"
        },
        buttonContainer:{
            justifyContent: "center",
            marginBottom: "3%"
        }
    }));

    //event handler for button clicks, changes current page which is used to determine which template to render
    const changePage = function(e) {
        setCurrentPage(Number(e.currentTarget.value));
    }

    const classes = useStyles();

    return (
        <div>
            <Header></Header>
            <div className={classes.root}>
                <div className={classes.buttonContainer}>
                    <ButtonGroup>
                        <Button onClick={changePage} value={1}>Basic Info</Button>
                        <Button onClick={changePage} value={2}>Transfers</Button>
                        <Button onClick={changePage} value={3}>Line Planner</Button>
                    </ButtonGroup>
                </div>
                {(stops && lines && currentPage === 1) && <BasicInfo stops={stops} lines={lines}></BasicInfo>}
                {(transfers && currentPage === 2) && <Transfers transfers={transfers}></Transfers>}
                {(graph && currentPage === 3) && <LinePlanner graph={graph}></LinePlanner>} 
            </div>
        </div>
    );
}

export default App;
