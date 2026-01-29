import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react'

const Filter = ({filterOptions, value, onChange}) => {
  return (
    <FormControl
              sx={{ width: ["100%"] }}
              className='filter-dropdown'
            >
          
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
  

                value={value || "All"}
                // label="Filter By"
                // onChange={(e) => {
                //   handleFilterChange(e.target.value), handleCurreentPage(1);
                //   handleFilterChangeprop(filterChange + 1);
                // }}
                onChange={(e) => onChange(e.target.value)}
              >
               
                {filterOptions.map((item) => (

                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
  )
}

export default Filter
