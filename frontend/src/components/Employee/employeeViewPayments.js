import React, {useEffect, useState} from "react";
import axios from "axios";
import { response } from "/../backend/app";

const customerViewPayments = () => {
    const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('https://127.0.0.1:433/:CUS001/view_banking_details')
      .then(response => {
        setTransactions(response.data);
      })
      .catch(error => {
        console.error('Error fetching all transactions:', error);
      });
  }, []); //return/store as an array

    return( 
      <div className="container">
      <h2>Employee Portal</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer ID</th>
            <th>Payment ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction._id}</td>
              <td>{transaction.custID}</td>
              <td>{transaction.payID}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.currency}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )

}
export default customerViewPayments