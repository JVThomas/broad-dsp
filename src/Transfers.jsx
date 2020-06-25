import React, {Fragment, useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

export default function Transfers(props) {
    const [transfers, setTransfers] = useState(props.transfers);

    let RouteTags = function(props) {

        const routeList = Object.keys(props.routes);
        const gridMargin = {
            marginTop: "10px"
        }
        
        let tags = routeList.map((route, key) => {
            let routeData = props.routes[route];
            let style = {
                backgroundColor: `#${routeData.color}`,
                color: 'white',
                padding: "3px",
                display: "inline-block"
            };

            return (
                <Grid item xs={3}>
                    <span key={`${props.transferName}-${key}`} style={style}>{routeData.long_name}</span>
                </Grid>
            )
        });

        return (
            <Grid style={gridMargin} container spacing={1}>
                {tags}
            </Grid>
        );
    }

    const TransferCards = function(props) {
        let cards = props.transfers.map((transfer) => {
            return (
                <Grid item xs={6} key={`${transfer.name}-card`}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" component="h4">{transfer.name}</Typography>
                            <RouteTags transferName={transfer.name} routes={transfer.routes}></RouteTags>   
                        </CardContent>
                    </Card>
                </Grid>
            )
        });
        return <Grid container spacing={3}>{cards}</Grid>
    }

    return (
        <div>
            <Typography variant="h2" component="h2" gutterBottom>Transfers</Typography>
            {(props.transfers) && <TransferCards transfers={props.transfers}></TransferCards>}
        </div>
    );
}