import React from 'react'
//import {useDispatch} from 'react-redux'
import {changeFilter} from '../reducers/filterReducer'
import {connect} from 'react-redux'

const Filter = (props) => {
  //const dispatch = useDispatch()
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
    const filterAnecdote = event.target.value
    props.changeFilter(filterAnecdote)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps = {
  changeFilter
}

const ConnectedFilter = connect(
  null,
  mapDispatchToProps
)(Filter)

export default ConnectedFilter