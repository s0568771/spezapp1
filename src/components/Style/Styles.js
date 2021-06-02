import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


export function stylePrimary900(){
	const theme = createMuiTheme({
		palette: {
			primary: {
				main: "rgb(13, 71, 161)",
			},
			secondary: {
				main: "rgb(13, 71, 161)",
			},
		},
	});
	return theme;
}
 
export default stylePrimary900;