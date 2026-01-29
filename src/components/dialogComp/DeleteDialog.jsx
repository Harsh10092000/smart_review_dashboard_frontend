import React from 'react'
import { Dialog } from '@mui/material'

const DeleteDialog = ({open, handleClose, deleteProperty, deleteHeading, deleteContent }) => {
  return (
     <Dialog
           open={open}
           onClose={handleClose}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
           sx={{
             "& .MuiPaper-root": {
               backgroundColor: "transparent",
               color: "inherit",
               boxShadow: "none",
               borderRadius: 0,
               margin: 0,
               backgroundImage: "none",
               transition: "none",
               overflowY: "initial",
             },
           }}
         >
           <div className="delete-dialog-wrapper">
             <div className="delete-dialog">
               <h2 className="dialog-heading">{deleteHeading}</h2>
               <div className="dialog-content">
                 {deleteContent}
               </div>
               <div className="dialog-actions">
                 <button className="delete-button" onClick={deleteProperty}>Delete</button>
                 <button className="cancel-button" onClick={handleClose}>
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </Dialog>
  )
}

export default DeleteDialog
