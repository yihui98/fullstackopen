
import React, { useState } from 'react'

const Filter = ({persons, newSearch, setSearch}) => {
  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

    return (
      <div> filter shown with: <input  value = {newSearch} onChange = {handleSearch}/> </div>
    )
  }

export default Filter