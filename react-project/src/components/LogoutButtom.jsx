import { useNavigate } from "react-router-dom"; 

export default function LogoutButton() {
  
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("jwtToken");
    
    navigate('/login', { replace: true }); 
  }

  return (
    <button onClick={handleLogout} className="fixed top-6 right-8 z-50 text-sm text-yellow-400">Logout</button>
  );
}