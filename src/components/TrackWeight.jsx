import React, { useState } from 'react';


function TrackWeight({ formData, handleChange }) {

  async function handleSave() {

    try {
      const response = await fetch(`http://localhost:3001/saveWeight`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      console.log(data);

      handleChange({ target: { name: 'weight', value: '' } });
      handleChange({ target: { name: 'date', value: '' } });
      handleChange({ target: { name: 'comment', value: '' } });
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }

  return (
    <div className='container'>
      <form className="form" onSubmit={handleSave}>
        <label htmlFor="weight">Weight</label>
        <input 
          type="text" 
          value={formData.weight} 
          name="weight" 
          placeholder='155 Lbs' 
          onChange={handleChange} 
          className='form--input'
        />
        
        <label htmlFor="date">Date</label>
        <input 
          type="text" 
          value={formData.date} 
          name='date' 
          placeholder='20/09/2002' 
          onChange={handleChange} 
          className='form--input'
        />
        
        <label htmlFor="comment">Comments</label>
        <input 
          type="text" 
          value={formData.comment} 
          name='comment' 
          placeholder='After flu' 
          onChange={handleChange} 
          className='form--input'
        />

        <button type='submit' className='btn'>Save</button>
      </form> 
    </div>
  )
}

export default TrackWeight;
