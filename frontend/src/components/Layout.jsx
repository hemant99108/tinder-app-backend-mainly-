 import { Outlet } from "react-router-dom"


const Layout = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-600">
    {/* The Outlet will render child components (Signup/Login) */}
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
      <Outlet />
    </div>
  </div>
  )
}

export default Layout;
