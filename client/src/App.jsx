import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { useEffect } from "react";
import ServerDown from "./pages/ServerDown";

function App() {
  const nav = useNavigate()
  useEffect(()=>{
    async function checkServer() {
      try{
        const response = await fetch('http://localhost:8000', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const data = await response.json();
        console.log(data)
      } catch(err) {
        console.log('heloo')
          nav('/server-down')
      }
    }

    checkServer();
  }, [])
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/server-down" element={<ServerDown />}/>
    </Routes>
  );
}

export default App;
