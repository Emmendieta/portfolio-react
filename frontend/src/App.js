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
import WorksForm from "./components/body/Home/Works/WorksForm/WorksForm";
import LanguagesForm from "./components/body/Home/Languajes/LanguageForm/LanguageForm";
import ProyectForm from "./components/body/Home/Proyects/ProyectForm/ProyectForm";
import SocialmediasForm from "./components/footer/SocialMediaContactForm/SocialMediaContactForm";
import CategoriesForm from "./components/body/Home/Categories/CategoriesForm/CategoriesForm";
import NotFound from "./components/body/Home/NotFound/NotFound";
import Forbidden from "./components/body/Home/Forbidden/Forbidden";

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
        <Route path="/works/form/:id" element={<WorksForm />} />
        <Route path="/languages/form/:id" element={<LanguagesForm />} />
        <Route path="/proyects/form/:id" element={<ProyectForm />} />
        <Route path="/social-medias/form/:id" element={<SocialmediasForm />} />
        <Route path="/categories/form/:id" element={<CategoriesForm />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
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
