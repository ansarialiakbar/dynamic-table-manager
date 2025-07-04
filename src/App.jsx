import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { createTheme } from '@mui/material/styles';
import DataTable from './components/DataTable';

function App() {
  const themeMode = useSelector((state) => state.table.theme);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: { main: '#2563eb' },
      secondary: { main: '#dc2626' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`min-h-screen ${themeMode === 'dark' ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
        <DataTable />
      </div>
    </ThemeProvider>
  );
}

export default App;