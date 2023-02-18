import { createTheme } from '@material-ui/core/styles'

const theme = createTheme();
theme.overrides = {
    // <Switch/> default: color=secondary
    MuiSwitch: {
        root: {

        },
        colorSecondary: {
            '&$checked': {
                color: '#2e7d32',
                '&:hover': {
                    backgroundColor: '#4caf50',
                    '@media (hover: none)': {
                        backgroundColor: 'transparent',
                    },
                },
            },
            // '&$disabled': {
            //     color: theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[800],
            // },
            '&$checked + $track': {
                backgroundColor: '#1b5e20',
            },
            // '&$disabled + $track': {
            //     backgroundColor:
            //         theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
            // },
        }
    }
}

export default theme;