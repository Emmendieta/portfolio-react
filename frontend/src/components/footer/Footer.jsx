import Contacts from './contacts/Contacts';
import './Footer.css';
import NewSocialMediaContact from './newSocialMediaContact/newSocialMediaContact';
import SocialMedias from './socialMedias/SocialMedias';


function Footer() {
    return (
        <>
            <div id="ftDivLine"></div>
            <div id="ftDivTop">
                <NewSocialMediaContact />
            </div>
            <div id="ftDivMiddle">
                <section id="secContacts">
                    <Contacts />
                </section>
                <section id="secSignature">
                    <h4>Aca va la firma</h4>
                </section>
                <section id="secSocialMedias">
                    <SocialMedias />
                </section>
            </div>
            <div id="ftDivBottom">
                <h1 id="copyRights">© Todos los derechos reserado.  2025</h1>
            </div>
        </>
    );
};

export default Footer;