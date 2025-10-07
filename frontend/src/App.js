import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/body/Home/Home";
import Login from "./components/body/Login/Login";
import { UserProvider, UserContext } from './context/UserContext';
import { useContext } from "react";
import Profile from "./components/body/profile/Profile";
import UpdatePerson from "./components/body/profile/updatePerson/UpdatePerson";
import UpdateUser from "./components/body/profile/updateUser/UpdateUser";
import EducationForm from "./components/body/Home/Educations/EducationForm/EducationForm";

function AppRoutes() {
  const { loadingUser } = useContext(UserContext);

  //Este ver si despues lo cambio por otra cosa como un SWEET ALERT:
  if (loadingUser) {
    return <div>Loading User...</div>
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />}/>
        <Route path="update-user" element={<UpdateUser />}/>
        <Route path="update-person" element={<UpdatePerson />} />
        <Route path="/educations/form/:id" element={<EducationForm />} />
        {/* Aquí más rutas si quieres */}
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
