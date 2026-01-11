import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const useNotification = () => {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    toastrStyle: '',
    message: ''
  });
  const { vertical, horizontal, open, toastrStyle, message } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleOpen = ({ text = '', style = 'primary' }) => {
    setState({
      ...state,
      message: text,
      toastrStyle: 'toastr-' + style,
      open: true
    });
  };
  return [
    handleOpen,
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      classes={{ root: toastrStyle }}
      onClose={handleClose}
      message={message}
    />
  ];
};

export default useNotification;