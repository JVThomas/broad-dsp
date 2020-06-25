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

//props should essentially contain the line data(from line) as well as the list of stops
//component should map the lines to a className that assigns the proper color on the left of each card

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

    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();
    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    let title = props.line.attributes.long_name;
    // if(props.line.isMax) {
    //     title += ` (Max: ${props.line.stopCount})`;
    // }

    // if(props.line.isMin) {
    //     title += ` (Min: ${props.line.stopCount})`
    // }

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
        if (props.lines !== undefined && props.stops !== undefined) {
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