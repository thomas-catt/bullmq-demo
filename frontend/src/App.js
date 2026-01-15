import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [jobId, setJobId] = useState(-1);
  const [status, setStatus] = useState("...");

  const sendEmail = async (email) => {
    setSendingEmail(true);
    try {
      const body = { email }
      const res = await fetch("http://localhost:3000/jobs", {
        headers: { 'Content-type': 'application/json' },
        method: "POST",
        body: JSON.stringify(body)
      })
      const data = await res.json();

      if (!data.success)
        throw data;
      
      setJobId(data.jobId);
      
    } catch (e) {
      alert("An error occured while sending email: " + e.message);
    } finally {
      setSendingEmail(false);
    }
  }

  const updateJobStatus = async (id) => {
    let sendAgain = true;
    try {
      const res = await fetch("http://localhost:3000/jobs/" + id, {
        headers: { 'Content-type': 'application/json' },
        method: "GET",
      })
      const data = await res.json();

      if (!data.success)
        throw data;
      
      setStatus(data.status);
      if (data.status == 'completed' || data.status == 'failed')
        sendAgain = false;
      
    } catch (e) {
      console.log("An error occured while updating status: " + e.message);
      setStatus("?");
    } finally {
      if (sendAgain)
        setTimeout(() => updateJobStatus(id), 2000);
    }
  }

  useEffect(() => {
    if (jobId != -1)
      updateJobStatus(jobId)
  }, [jobId])
  
  return (
    <div className="App">
      <label htmlFor='email-input'>Enter email address: </label>
      <input type="text" name='email-input' id='email-input' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
      <button onClick={() => sendEmail(email)} disabled={sendingEmail}>{sendingEmail ? "Sending email..." : "Send email"}</button>

      {jobId !== -1 && <div className='job-status'>
        <h1>Job #{jobId} Status:</h1>
        <b>Status:</b> <span>{status}</span>
      </div>}
    </div>
  );
}

export default App;
