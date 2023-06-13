import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { ApiClient } from "adminjs";
import { useNavigate } from "react-router-dom";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Approve({ action, ...props }) {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const apiClient = React.useMemo(() => new ApiClient());
  const handleClose = () => {
    navigate(-1);
  };

  //   console.log(props);
  const handleRequest = async () => {
    await apiClient.resourceAction({
      resourceId: props.resource.id,
      method: "post",
      actionName: action.name,
      params: {
        ids: props.records.map((record) => record.id),
      },
    });

    window.location.href = props.resource.href;
  };
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}>
          Approve Requests
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure u want to Approve {props.records.length} request(s)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleRequest}>
            Approve Requests
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
