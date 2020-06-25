import React, { useState} from 'react';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

function StopList(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%'
        }
    }));

    const classes = useStyles();

    let stops = props.stops.map((stop) => {
        return <ListItem key={stop.id}>{stop.attributes.name}</ListItem>
    });

    return (
        <div className={classes.root}>
            <List aria-label="stop list">
                {stops}
            </List>
        </div>
    );
}

//component should have props = {stops, line}
 function LineCard(props) {

    //setting up styling for the individual cards
    //transform and rotation effects were taken from material-ui documentation
    const useStyles = makeStyles((theme) => ({
         root: {
            borderLeft: `10px solid #${props.line.attributes.color}`,
            width: "60%",
            padding: "10px",
            justifyContent: "space-between"
         },
         expand: {
             transform: 'rotate(0deg)',
             marginLeft: 'auto',
             transition: theme.transitions.create('transform', {
                 duration: theme.transitions.duration.shortest,
             }),
         },
        expandOpen: {
             transform: 'rotate(180deg)'
        }
    }));

    //setting up state variable for expanding and collapsing the line card
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();

    //click event to toggle expand state variable
    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    let title = props.line.attributes.long_name;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography display="inline" variant="h4" component="h4">{title}</Typography>
            </CardContent>
            <CardContent>
                {(props.line.isMin) && <Typography display="inline" variant="h4" component="h4">{`Min: ${props.line.stopCount}`}</Typography>}
                {(props.line.isMax) && <Typography display="inline" variant="h4" component="h4">{`Max: ${props.line.stopCount}`}</Typography>}
            </CardContent>
            <CardActions>
                <IconButton 
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={toggleExpanded}
                    aria-expanded={expanded}
                    aria-label="Show Stops"
                >
                    <ExpandMoreIcon></ExpandMoreIcon>
                </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <StopList stops={props.stops}></StopList>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default function BasicInfo(props) {
    let cards = function() {
        let output = '';

        //undefined check on necessary information for template render
        if (props.lines !== undefined && props.stops !== undefined) {
            //we can pull up the relative information on lines and stops since the index corresponds to the same groups
            //ex) lines[0] could be the red line, in which case stops[0] will be an array of stops on the red line
            output = props.lines.map((line, index) => {
                return (
                    <Grid item xs={6} key={props.lines[index].id}>
                        <LineCard line={props.lines[index]} stops={props.stops[index]} key={props.lines[index].id}></LineCard>
                    </Grid>
                )
            });
            return (
                <Grid container justify="space-around" spacing={2}>
                    {output}
                </Grid>
            )
        }
        return output;
    }
    return (
        <div>
            <div className="basic-info-container">
                <Typography variant="h2" component="h2" gutterBottom>Basic Info</Typography>
                {(props.stops !== undefined && props.lines !== undefined) && cards()}
            </div>
        </div>
    );
}