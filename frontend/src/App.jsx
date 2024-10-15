 
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Feed from './pages/Feed';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {
          //child routes will render inside layout container
        }
        <Route index element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="/feed" element={<Feed />} />
    </Routes>
  );
}

export default App;
