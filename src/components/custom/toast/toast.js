import { toast } from 'react-toastify';

// Toast utility functions
const toastUtils = {
  success: (message, options = {}) => toast.success(message, options),
  error: (message, options = {}) => toast.error(message, options),
  info: (message, options = {}) => toast.info(message, options),
  warning: (message, options = {}) => toast.warning(message, options),
  loading: (message, options = {}) => 
    toast.loading(message, { 
      ...options,
      autoClose: false 
    }),
  update: (toastId, options) => toast.update(toastId, options),
  dismiss: (toastId) => toast.dismiss(toastId)
};

export default toastUtils; 