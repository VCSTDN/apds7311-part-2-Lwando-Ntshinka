import React, { useState } from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
import stylesheet from '../stylesheet.css'

const UseVerifyPayment = () => {
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    

    const handleVerifyPayment = (e) => {
        e.preventDefault();
        axios.post('https://127.0.0.1:433/verify_payment', {
            title, post
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            alert(response.data.message);
        })
        .catch(error => {
            console.error('An error occurred while processing payment', error);
        });
    };

    return (
        <form onSubmit={handleVerifyPayment}>
        <div>
        <div className="container">
        <h2>Verify Payment</h2>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
            <label>Details</label>
            <input type="text" value={post} onChange={(e) => setPost(e.target.value)} />
        </div>
        <button type="submit">Verify Payment</button>
        </div>
    </form>
    );
};

export default UseVerifyPayment
