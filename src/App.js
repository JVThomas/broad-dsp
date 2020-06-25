import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import Header from './Header';
import Transfers from './Transfers';
import BasicInfo from './BasicInfo';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

function App() {
    const [stops, setStops] = useState();
    const [lines, setLines] = useState();
    const [graph, setGraph] = useState();
    const [transfers, setTransfers] = useState();
    const [currentPage, setCurrentPage] = useState(1);

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

    useEffect(() => {
        initSubwayData();
    }, []);

    const useStyles = makeStyles((theme) => ({
        root: {
            margin: "3% 10%"
        },
        buttonContainer:{
            justifyContent: "center",
            marginBottom: "3%"
        }
    }));

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
            </div>
        </div>
    );
}

export default App;
