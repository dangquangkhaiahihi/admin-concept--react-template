
import React from 'react';
import * as MaterialUi from '@material-ui/core';

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                // <MaterialUi.Box p={3}>
                <MaterialUi.Box>
                    <MaterialUi.Typography>
                        {children}
                    </MaterialUi.Typography>
                </MaterialUi.Box>
            )}
        </div>
    );
}