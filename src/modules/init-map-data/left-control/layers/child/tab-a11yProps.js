export function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export function a11yPropsSearchFields(index) {
    return {
        id: `search-fields-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export function a11yPropsEdit(index) {
    return {
        id: `edit-verison-${index}`,
        'aria-controls': `edit-verison-tabpanel-${index}`,
    };
}