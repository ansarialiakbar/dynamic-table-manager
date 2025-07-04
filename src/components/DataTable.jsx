import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Typography, TablePagination, Switch, FormControlLabel, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import ManageColumnsModal from './ManageColumnsModal';
import { addData, updateRow, deleteRow, setEditingRow, updateColumns, toggleTheme } from '../redux/tableSlice';

function DataTable() {
  const dispatch = useDispatch();
  const { data, columns, theme, editingRow } = useSelector((state) => state.table);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [openModal, setOpenModal] = useState(false);

  // Load persisted state
  useEffect(() => {
    const savedColumns = localStorage.getItem('columns');
    const savedTheme = localStorage.getItem('theme');
    if (savedColumns) {
      dispatch(updateColumns(JSON.parse(savedColumns)));
    }
    if (savedTheme && savedTheme !== theme) {
      // Toggle theme to match savedTheme
      if ((savedTheme === 'dark' && theme === 'light') || (savedTheme === 'light' && theme === 'dark')) {
        dispatch(toggleTheme());
      }
    }
  }, [dispatch, theme]);

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Searching
  const filteredData = useMemo(() => {
    return sortedData.filter((row) =>
      Object.values(row).some((val) =>
        val.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [sortedData, search]);

  // Pagination
  const paginatedData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Import CSV
  const handleImport = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const newData = result.data
          .filter((row) => row.name && row.email && row.age && row.role)
          .map((row, index) => ({
            id: data.length + index + 1,
            name: row.name,
            email: row.email,
            age: parseInt(row.age),
            role: row.role,
            ...Object.keys(columns).reduce((acc, key) => {
              if (row[key]) acc[key] = row[key];
              return acc;
            }, {}),
          }));
        if (newData.length > 0) {
          dispatch(addData(newData));
        } else {
          alert('Invalid CSV format');
        }
      },
      error: () => alert('Error parsing CSV'),
    });
  };

  // Export CSV
  const handleExport = () => {
    const visibleColumns = Object.keys(columns).filter((key) => columns[key].visible);
    const csv = Papa.unparse({
      fields: visibleColumns.map((key) => columns[key].label),
      data: data.map((row) => visibleColumns.map((key) => row[key])),
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table-data.csv');
  };

  // Inline Editing
  const handleDoubleClick = (row) => {
    dispatch(setEditingRow(row));
  };

  const handleSaveRow = (updatedRow) => {
    if (isNaN(updatedRow.age)) {
      alert('Age must be a number');
      return;
    }
    dispatch(updateRow({ id: editingRow.id, updatedRow }));
  };

  const handleCancelEdit = () => {
    dispatch(setEditingRow(null));
  };

  // Delete Row
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      dispatch(deleteRow(id));
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <Typography variant="h4" className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Data Table Manager
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={theme === 'dark'}
              onChange={() => dispatch(toggleTheme())}
              className="text-gray-900 dark:text-gray-100"
            />
          }
          label="Dark Mode"
          className="text-gray-900 dark:text-gray-100"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white dark:bg-gray-700 rounded-lg"
          InputProps={{
            className: 'text-gray-900 dark:text-gray-100',
          }}
          InputLabelProps={{
            className: 'text-gray-900 dark:text-gray-100',
          }}
        />
        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Manage Columns
        </Button>
        <Button
          variant="contained"
          component="label"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Import CSV
          <input type="file" accept=".csv" hidden onChange={handleImport} />
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Export CSV
        </Button>
      </div>
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-200 dark:bg-gray-700">
              {Object.keys(columns)
                .filter((key) => columns[key].visible)
                .map((key) => (
                  <TableCell
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer text-gray-900 dark:text-gray-100 font-semibold"
                  >
                    {columns[key].label} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                  </TableCell>
                ))}
              <TableCell className="text-gray-900 dark:text-gray-100 font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                onDoubleClick={() => handleDoubleClick(row)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {Object.keys(columns)
                  .filter((key) => columns[key].visible)
                  .map((key) => (
                    <TableCell key={key} className="text-gray-900 dark:text-gray-100">
                      {editingRow?.id === row.id ? (
                        <TextField
                          defaultValue={row[key]}
                          onChange={(e) =>
                            dispatch(setEditingRow({ ...editingRow, [key]: e.target.value }))
                          }
                          type={key === 'age' ? 'number' : 'text'}
                          className="bg-white dark:bg-gray-700 rounded-lg"
                          InputProps={{
                            className: 'text-gray-900 dark:text-gray-100',
                          }}
                        />
                      ) : (
                        row[key]
                      )}
                    </TableCell>
                  ))}
                <TableCell>
                  {editingRow?.id === row.id ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSaveRow(editingRow)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-2 rounded"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
      <ManageColumnsModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}

export default DataTable;