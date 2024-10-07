//Imports
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './views/stylesheet.css' //imported CSS

// Components (assuming you have these components created)
import Login from './components/login'
import Register from './components/register'
import CustomerViewPayments from './components/Customer/customerViewPayments'
import EmployeeViewPayments from './components/Employee/employeeViewPayments'

//Implement IFrames
// IFrame Component for embedding external pages
const IFrameComponent = ({ src }) => {
  return (
    <iframe 
      src={src} 
      width="100%" 
      height="600px" 
      style={{ border: 'none' }}
      title="IFrame Example"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  );
};


function App() {
  return (
    /*<!--Add paths to methods in routes-->*/
    <Router>
      <Routes> 
        <Route path='/login' element={<Login/>}/>
        <Route path='./Customer/customerViewPayments' element={<CustomerViewPayments/>}/>
        <Route path='./Customer/makePayment' element={<makePayments/>}/>
        <Route path='/Employee/employeeViewPayments' element={<EmployeeViewPayments/>}/>
        <Route path='/Employee/verifyPayments' element={<employeeViewPayments/>}/>
        <Route path='/external' element={<IFrameComponent src="https://example.com"/>}/>
         {/* Add IFrame route here */}
      </Routes>
    </Router>
  );
}

export default App;
