
import React from 'react'

const Filter = ({newSearch, setSearch}) => {
  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

    return (
      <div>
         find countries: <input  value = {newSearch} onChange = {handleSearch}/> 
      </div>
    )
  }

export default Filter