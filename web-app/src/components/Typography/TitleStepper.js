import React from 'react'
import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

export default withStyles({
    root: {}
})(({ children, ...props }) => {
    return (
        <Typography {...props} variant="h5" color="textPrimary" gutterBottom>
            {children}
        </Typography>
    )
})