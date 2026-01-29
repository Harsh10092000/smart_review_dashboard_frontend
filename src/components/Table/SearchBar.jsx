import React from 'react'
import { TextField } from "@mui/material";
import { SearchIcon } from '../SvgIcons';
const SearchBar = ({value, onChange}) => {
  return (
    // <div className="dashboard-main-filters">
       
          <TextField
            placeholder="Search"
            className='search-bar'
            // size="small"
            id="outlined-start-adornment"
            sx={{ width: "100%" }}
            value={value}
      onChange={(e) => onChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <SearchIcon className="search-icon mr-5" />
                ),
              },
            }}
          />
       
      // </div>
  )
}

export default SearchBar
