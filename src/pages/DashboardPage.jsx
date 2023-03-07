import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "./auth/contexts/AuthContext";
import {database} from "../firebase"


// Displaying the dashboard page
// Dashboard page currently has the activity status card
function DashboardPage() {
  const [error, setError] = useState("")
  const {currentUser} = useAuth()
  
  const [selectedStatus, setSelectedStatus] = useState('Online');
  const activityStatuses = ['Online', 'Idle', 'Do Not Disturb', 'Invisible'];
  
  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

    return (
      <div className="flex justify-start bg-blue-200 min-h-screen">
        <Card className="w-full max-w-sm p-4 bg-blue-100 border-blue-400 shadow sm:p-6 md:p-100">
          <Card.Body>
          <select value={selectedStatus} onChange={handleChange}>
        {activityStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <p>You are currently {selectedStatus}.</p>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email: </strong>{currentUser.email}
            <div>
            <Link to="/set-profile">Update Profile</Link>

            </div>
          </Card.Body>
        </Card>
      </div>
    );
}

export default DashboardPage;