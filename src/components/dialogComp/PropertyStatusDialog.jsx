import React from 'react'
import { Dialog } from '@mui/material'

const PropertyStatusDialog = ({open, handleClose, onClickFunction, heading, content, actionButtonText, actionButtonClass }) => {
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
               <h2 className="dialog-heading">{heading}</h2>
               <div className="dialog-content">
                 {content}
               </div>
               <div className="dialog-actions">
                 <button className="delete-button" onClick={onClickFunction}>{actionButtonText}</button>
                 <button className="cancel-button" onClick={handleClose}>
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </Dialog>
  )
}

export default PropertyStatusDialog
