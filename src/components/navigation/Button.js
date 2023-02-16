import React from "react"
import './Button.css'
import { useNavigate } from 'react-router-dom';

// This function is the export for the buttons component which includes two buttons, the sign in and sign up button.
function LoginButtons() { 
    let navigate = useNavigate();
  
    return (
        <div className="space-x-4">
            <button onClick={() => navigate('/signup', { replace: true })} className="px-4 py-0.5 bg-white hover:bg-blue-200 rounded duration-500 ">Sign Up</button>
            <button onClick={() => navigate('/signin', { replace: true })} className="px-4 py-0.5 bg-white hover:bg-blue-200 rounded duration-500 ">Sign In</button>
        </div>
      
      );
  }

  export default LoginButtons;