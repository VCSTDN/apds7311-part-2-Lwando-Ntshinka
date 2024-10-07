import React, {useState} from "react"
import axios from "axios"
import { response } from '/../backend/app'
import './stylesheet.css'  // Import CSS file here

const makePayment = () =>{
    const [payment, setPayment] = useState({
        amount: "",
        currency: "",
        provider: "",
        recipientAccount: "",
        swiftCode: ""
      })

      const handleChange = (e) => {
        const { name, value } = e.target;
        setPayment((prevPayment) => ({ ...prevPayment, [name]: value }));
      }

    const handleSubmitPayment = (e) => {
        e.preventDefault()
        const response = axios.post('https://127.0.0.1:433/make_payment', payment, 
        {headers: {
            'Authorisation': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                alert(response.data.message)
            })
            .catch(error =>{
                console.error('Error when making payments', error)
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
            name="recipientAccount" 
            value={payment.recipientAccount} 
            onChange={handleChange} 
            placeholder="Recipient's Account Information" 
            required 
          />


          <input 
            type="text" 
            name="swiftCode" 
            value={payment.swiftCode} 
            onChange={handleChange} 
            placeholder="SWIFT Code" 
            required 
          />

          <button type="submit">Pay Now</button>
        </form>
      </div>)
}

export default makePayment