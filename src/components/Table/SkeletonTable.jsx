import React from 'react'

const SkeletonRow = ({key}) => {
  return (
    <div className="div-table-row div-table-row-block">
        <div key={key} className="div-table-cell">
          <div className="skeleton" />
        </div>
     
    </div>
  )
}




  
// const SkeletonTable = ({ count }) => {
//     const rows = [];
//     let i = 0;
//     while (i < count) {
//       rows.push(<SkeletonRow key={i} />);
//       i++;
//     }
//     return <>{rows}</>;
//   };

   


    const SkeletonTable = ({ count }) => (
      <>
        {Array(count).fill().map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </>
    ); 
    export default SkeletonTable