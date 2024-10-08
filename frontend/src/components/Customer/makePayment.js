import React, {useState} from 'react'
import axios from 'axios'
import stylesheet from '../stylesheet.css'  // Import CSS file here
import { useNavigate } from 'react-router-dom'
//import checkauth from '../../../../Backend/database/checkAuthentication'

const UseMakePayment = () =>{
    const [payment, setPayment] = useState({
        amount: "",
        currency: "",
        SWIFT: "",
        custID: localStorage.getItem("_id") // Assuming custID is stored in localStorage
      })
      const navigate = useNavigate()

      const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prevPayment) => ({ ...prevPayment, [name]: value }));
      }

      // Retrieve and decode the JWT token
      const token = localStorage.getItem('token');
      if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          console.log(decodedToken);  // Display decoded token in the console
      } else {
          console.log('No token found in localStorage');
      }

    const handleSubmitPayment = (e) => {
        e.preventDefault()
        const response = axios.post('https://localhost:433/make_payment', payment, 
        /*{headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json' }}*/)
            .then(response => {
                alert(response.data.message)
                navigate(`/Customer/customerViewPayments/${payment.custID}`)
            })
            .catch(error =>{
              if (error.response) {
                console.error('Error when making payment:', error.response.data);
                alert(`Payment Failed 1: ${error.response.data.message || error.message}`);
                navigate(`/Customer/customerViewPayments/${payment.custID}`)
            } else if (error.request) {
                console.error('Error Request:', error.request);
                alert('Payment Failed 2: No response received from the server.');
                navigate(`/Customer/customerViewPayments/${payment.custID}`)
            } else {
                console.error('Error:', error.message);
                alert(`Payment Failed 3: ${error.message} Token ${localStorage.getItem('token')}`);
                navigate(`/Customer/customerViewPayments/${payment.custID}`)
            }
          })
    }
    return(
        <div>
        <h2>International Payment</h2>
        <form onSubmit={handleSubmitPayment}>
          <input 
            type="number" 
            name="amount" 
            value={payment.amount} 
            onChange={handleChange} 
            placeholder="Payment Amount" 
            required 
          />

          <select 
            name="currency" 
            value={payment.currency} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ZAR">ZAR</option>
            <option value="GBP">GBP</option>
          </select>

          <input 
            type="text" 
            name="SWIFT" 
            value={payment.SWIFT} 
            onChange={handleChange} 
            placeholder="SWIFT Code" 
            required 
          />

          <button type="submit">Pay Now</button>
          <button type="button" onClick={() => navigate('/Customer/makePayment')} style={{ padding: '10px 20px', margin: '10px' }}>Return</button>
        </form>
      </div>)
}

export default UseMakePayment