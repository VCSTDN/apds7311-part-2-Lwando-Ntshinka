//Imports
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Components (assuming you have these components created)
import Login from './components/login'
import Register from './components/register'
import CustomerViewPayments from './components/Customer/customerViewPayments'
import MakePayments from './components/Customer/makePayment'
import EmployeeViewPayments from './components/Employee/employeeViewPayments'
import EmployeeVerifyPayments from './components/Employee/verifyPayments'

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
      <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        {/* Customer Routes */}
        <Route path='/Customer/customerViewPayments/:custID' element={<CustomerViewPayments/>}/>
        <Route path='/Customer/makePayment' element={<MakePayments/>}/>

        {/* Employee Routes */}
        <Route path='/Employee/employeeViewPayments' element={<EmployeeViewPayments/>}/>
        <Route path='/Employee/verifyPayments' element={<EmployeeVerifyPayments/>}/>
         
         </Routes>
    </Router>
  );
}

export default App;
