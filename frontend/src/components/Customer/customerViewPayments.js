import React, {useEffect, useState} from "react"
import axios from 'axios'
//import { response } from "/../backend/app.js"
import stylesheet from '../stylesheet.css'
import { useParams } from 'react-router-dom';

function UseCustomerViewPayments() {
    const [payments, setPayments] = useState([])
    const { custID } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`https://127.0.0.1:433/${custID}/payment_details`, {headers: { Authorization: `Bearer ${token}` }})
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
    </div>
    )

}
export default UseCustomerViewPayments