import Educations from "./Educations/Educations.jsx";
import Language from "./Languajes/Language.jsx";
import Person from "./Person/Person.jsx";
import Proyects from "./Proyects/Proyects.jsx";
import Works from "./Works/Works.jsx";
function Home() {
    return (
        <>
            <Person />
            <Educations />
            <Works />
            <Language />
            <Proyects />
        </>
    );
};

export default Home;