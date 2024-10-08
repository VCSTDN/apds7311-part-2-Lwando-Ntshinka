import React, {useEffect, useState} from "react"
import axios from 'axios'
//import { response } from "/../backend/app.js"
import { useNavigate } from 'react-router-dom'
import stylesheet from '../stylesheet.css'
import { useParams } from 'react-router-dom';

function UseCustomerViewPayments() {
    const [payments, setPayments] = useState([])
    const { custID } = useParams()
    const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://localhost:433/payment_details/${custID}`, {headers: { Authorization: `Bearer ${token}` }})
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error('Error fetching customer transactions:', error);
      });
  }, [custID]); //return/store as an array

    return(
        <div className="container">
      <h2>Customer Portal</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((transaction, index) => (
            <tr key={index}>
              <td>{payments._id}</td>
              <td>{payments.amount}</td>
              <td>{payments.currency}</td>
              <td>{payments.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={() => navigate('/Customer/makePayment')} style={{ padding: '10px 20px', margin: '10px' }}>Make Payment</button>
    </div>
    )

}
export default UseCustomerViewPayments