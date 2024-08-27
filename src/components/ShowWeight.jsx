import { useEffect, useState } from 'react';


function ShowWeight() {
  const metric = 2.2046;

  const [weights, setWeight] = useState([]);
  const [mass, setMass] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ id: null, weight: "", date: "", comment: "" });

  function handleClick() {
    setMass(prevMass => !prevMass);
  }

  useEffect(() => {
    fetch(`http://localhost:3001/getWeight`) 
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok ' + res.statusText);
        }
        return res.json();
      })
      .then(data => setWeight(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);



  function handleEditClick(weight) {
    setEditData(weight);
    setShowModal(true);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleFormSubmit(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    fetch(`http://localhost:3001/updateWeight/${editData.id}`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weight: editData.weight,
        date: editData.date,
        comment: editData.comment,
      }),
    })
      .then(res => res.text())
      .then(message => {
        console.log(message);
        setWeight(weights.map(w => w.id === editData.id ? editData : w));
        setShowModal(false);
      })
      .catch(err => console.error('Update error:', err));
  }

  function handleDelete(id) {
    fetch(`http://localhost:3001/deleteWeight/${id}`, { // Cambia esta URL
      method: 'DELETE',
    })
      .then(res => res.text())
      .then(message => {
        console.log(message);
        setWeight(weights.filter(w => w.id !== id));
      })
      .catch(err => console.error('Delete error:', err));
  }

  return (
    <div className='show--weight'>
      <h1 className='show--weight--h1'>Weight Data</h1> 
      <button className='handleclick' onClick={handleClick}> Change Weight {mass ? ' To Kgs' : ' To Lbs'}</button>
      <table style={{width: '100vw', tableLayout: 'fixed'}}>
        <thead>
          <tr>
            <th>Weight</th>
            <th>Date</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {weights.map(weight => (
            <tr key={weight.id}>
              <td>{mass ? weight.weight + " Lbs" : (weight.weight / metric).toFixed(1) + ' Kgs'}</td>
              <td>{weight.date}</td>
              <td>{weight.comment}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
                  <p style={{cursor: 'pointer', textDecoration: 'underline', margin: 10, padding: 0}} onClick={() => handleEditClick(weight)}>Edit</p> 
                  <p style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => handleDelete(weight.id)}>Delete</p> 
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            minWidth: '300px',
          }}>
            <h2>Edit Weight</h2>
            <form onSubmit={handleFormSubmit} className='form'>
              <div>
                <label>Weight: </label>
                <input
                  type="text"
                  name="weight"
                  value={editData.weight}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Date: </label>
                <input
                  type="text"
                  name="date"
                  value={editData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Comment: </label>
                <input
                  type="text"
                  name="comment"
                  value={editData.comment}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className='btn' style={{margin: '5px'}}>Save</button>
              <button type="button" onClick={() => setShowModal(false)} className='btn'>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowWeight;
