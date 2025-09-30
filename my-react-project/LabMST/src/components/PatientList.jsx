import React, { useState } from "react";

function PatientList() {
  const [patients, setPatients] = useState([
    { id: 1, name: "Parv Gupta", disease: "Flu" },
    { id: 2, name: "Adarsh Kumar", disease: "Diabetes" },
    { id: 3, name: "Saksham Sharma", disease: "Asthma" },
  ]);

  const removePatient = (id) => {
    const updatedPatients = patients.filter((patient) => patient.id !== id);
    setPatients(updatedPatients);
  };

  return (
    <div>
      <h2>Patient List</h2>
      <div className="patient-container">
        {patients.map((patient) => (
          <div key={patient.id} className="patient-card">
            <h3>{patient.id}</h3>
            <h3>{patient.name}</h3>
            <p>Disease: {patient.disease}</p>
            <button onClick={() => removePatient(patient.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientList;
