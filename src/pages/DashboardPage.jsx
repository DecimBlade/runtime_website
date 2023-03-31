import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "./auth/contexts/AuthContext";
import {auth, database, db} from "../firebase"
import {Chart} from 'react-google-charts';

// Displaying the dashboard page
// Dashboard page currently has the activity status card
function DashboardPage() {
  const [error, setError] = useState("")
  const {currentUser} = useAuth()
  const user = auth.currentUser
  const userRef = db.users.doc(user.uid)
  
  const [selectedStatus, setSelectedStatus] = useState('Online');
  const activityStatuses = ['Online', 'Idle', 'Do Not Disturb', 'Invisible'];
  
  const handleChange = (event) => {
    const newStatus = event.target.value
    setSelectedStatus(newStatus);
    db.users.doc(user.uid).update({visibility: newStatus})
  };
  const [senderUsername, setSenderUsername] = useState('')
  userRef.get().then((doc) => {
      if(doc.exists) {setSenderUsername(doc.data().username)}
  })


  const exampleData = [
    ['Watch time', 'Hours per day'],
    ['Monday', 4],
    ['Tuesday', 5],
    ['Wednesday', 6],
    ['Thursday', 7],
    ['Friday', 8],
    ['Saturday', 9],
    ['Sunday', 10],
  ];

  const options = {
    title: "Watch time per day",
  };

    return (
      <div className="flex justify-start bg-blue-200 dark:bg-slate-800 min-h-screen">
        <Card className="w-full max-w-sm p-4 bg-blue-100 dark:bg-slate-600 dark:text-white shadow sm:p-6 md:p-100">
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
            <br></br>
            <strong>Username: </strong>{senderUsername}
            <div>
            <Link to="/set-profile">Update Profile</Link>

            </div>
          </Card.Body>
        </Card>
      </div>
    );
}

export default DashboardPage;