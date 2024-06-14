import { Dialog, DialogTitle, DialogContent, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { classes } from '~/data/classes';

export const ClassSelectionDialog = ({ open, onClose, onChange }: ClassSelectionDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        method: 'post',
      }}
    >
      <DialogTitle className="flex justify-between items-center">
        <Typography>Choose a class</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="grid grid-cols-6 gap-6">
        <input hidden name="intent" value="create" onChange={() => {}} />

        {Object.values(classes).map(classData => (
          <button
            key={classData.name}
            className="flex flex-col items-center gap-2 pointer opacity-40 hover:opacity-100"
            name="className"
            value={classData.name}
            type="submit"
          >
            <div>
              <classData.SkinIcon className="w-16" />
            </div>

            <div>
              <span className="capitalize text-shadow">{classData.name}</span>
            </div>
          </button>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export interface ClassSelectionDialogProps {
  open: boolean;
  onClose: () => void;
}
