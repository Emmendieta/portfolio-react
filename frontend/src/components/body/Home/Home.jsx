import EducationsList from "./Educations/EducationsList.jsx";
import LanguagesList from "./Languajes/LanguageList.jsx";
import Person from "./Person/Person.jsx";
import ProyectsList from "./Proyects/ProyectsList.jsx";
import WorksList from "./Works/WorksList.jsx";

function Home() {

    return (
        <>
            <Person />
            <EducationsList />
            <WorksList />
            <LanguagesList />
            <ProyectsList />
        </>
    );
};

export default Home;
