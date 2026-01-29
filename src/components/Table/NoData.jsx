import React from "react";

const NoData = () => {
  return (
    
        <div class="no-data-wrapper">
          <div style={{textAlign: "center"}}>
          <img
            class="no-data-wrapper-img"
            alt="Empty content"
            src="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/empty/ic-content.svg"
          />
          </div>
          <div class="no-data-wrapper-text">
            No Results Found
          </div>
        </div>
     
  );
};

export default NoData;
