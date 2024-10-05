import React, {useState} from "react";
import axios from "axios";
import { response } from '/../backend/app'

const verifyPayment = () =>{
    const [title, setTitle] = useState('')
    const [post, setPost] = useState ('')

    const handleVerifyPayment = (e) => {
        e.preventDefault()
        axios.post('https://127.0.0.1:433/make_payment', {
            title, post
        }, {headers: {
            'Authorisation': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                alert(response.data.message)
            })
            .catch(error =>{
                console.error('An error adding blog', error)
            })
    }
    return(
    <form onSubmit={handleVerifyPayment}>

    </form>)
}

export default verifyPayment