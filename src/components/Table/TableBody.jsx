import React from 'react'
import "./table.css";

const TableBody = ({flockData}) => {
  return (
    <div className="div-table-body">
        {flockData.map((flock) => (
          <div className="div-table-row" key={flock.id}>
            <div className="div-table-cell">{flock.id}</div>
            <div className="div-table-cell div-table-cell-email">{flock.breed}<br/><span className="div-table-cell-email-span">{flock.email}</span></div>
            <div className="div-table-cell">{flock.age}</div>
            <div className="div-table-cell">{flock.eggsPerDay}</div>
            <div className="div-table-cell">{flock.status}</div>
           
            <div className="div-table-cell">{flock.mobile}</div>
            <div className="div-table-cell">{flock.address}</div>
          </div>
        ))}
      </div>
  )
}

export default TableBody
