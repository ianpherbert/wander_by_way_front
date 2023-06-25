import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export interface ConfirmDialogProps {
    open: boolean;
    body: string;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    onDeny?: () => void;
}

const ConfirmDialog = ({title, body, onClose, onConfirm, onDeny, open}: ConfirmDialogProps) => {
    function handleConfirm() {
        onConfirm();
        onClose();
    }

    function handleDeny() {
        if (onDeny) {
            onDeny();
        }
        onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {title && <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeny}>Cancel</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;