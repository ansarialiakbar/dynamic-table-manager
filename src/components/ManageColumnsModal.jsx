import { useSelector, useDispatch } from 'react-redux';
import { Modal, Box, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useForm } from 'react-hook-form';
import { updateColumns } from '../redux/tableSlice';

function ManageColumnsModal({ open, onClose }) {
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.table.columns);
  const { register, handleSubmit, reset } = useForm();

  const handleAddColumn = (data) => {
    if (data.name) {
      dispatch(
        updateColumns({
          ...columns,
          [data.name.toLowerCase()]: { visible: true, label: data.name },
        })
      );
      reset();
      onClose();
    }
  };

  const handleToggleColumn = (key) => {
    dispatch(
      updateColumns({
        ...columns,
        [key]: { ...columns[key], visible: !columns[key].visible },
      })
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <Typography variant="h6" className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Manage Columns
        </Typography>
        <form onSubmit={handleSubmit(handleAddColumn)} className="mb-4">
          <TextField
            label="New Column Name"
            {...register('name')}
            fullWidth
            className="bg-white dark:bg-gray-700 rounded-lg mb-4"
            InputProps={{
              className: 'text-gray-900 dark:text-gray-100',
            }}
            InputLabelProps={{
              className: 'text-gray-900 dark:text-gray-100',
            }}
          />
          <Button
            type="submit"
            variant="contained"
            className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
          >
            Add Column
          </Button>
        </form>
        <div className="space-y-2">
          {Object.keys(columns).map((key) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={columns[key].visible}
                  onChange={() => handleToggleColumn(key)}
                  className="text-primary"
                />
              }
              label={columns[key].label}
              className="text-gray-900 dark:text-gray-100"
            />
          ))}
        </div>
      </Box>
    </Modal>
  );
}

export default ManageColumnsModal;