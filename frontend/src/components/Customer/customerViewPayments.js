import React, {useEffect, useState} from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import stylesheet from '../stylesheet.css'
import { useParams } from 'react-router-dom';

function UseCustomerViewPayments() {
    const [payments, setPayments] = useState([])
    const { custID } = useParams()
    const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://localhost:433/payment_details/${custID}`, custID, {headers: { Authorization: `Bearer ${token}` }})
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error('Error response fetching customer transactions:', error.response.data);
      } else if(error.message) {
          console.error('Error message fetching customer transactions:', error.message);
      }
      else if (error.req){
        console.error('Error request fetching customer transactions:', error.req);
      }
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
                      <td>{transaction._id}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.currency}</td>
                      <td>{transaction.status}</td>
                  </tr>
              ))}
          </tbody>
      </table>

      <button type="button" onClick={() => navigate('/Customer/makePayment')} style={{  padding: '10px 20px', margin: '10px' }}>Make Payment</button>
    </div>
    )

}
export default UseCustomerViewPayments