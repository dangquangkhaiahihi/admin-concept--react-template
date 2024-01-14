/* eslint-disable no-useless-constructor */
import React from "react";
import { CircularProgress, Backdrop, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 99999,
        color: "#fff",
    },
}));

export default function LoaddingProgress(props) {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={props.value >=0}>
            <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" {...props} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography component="div"  color="inherit">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        </Backdrop>
    );
}

