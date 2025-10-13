import { useState } from 'react';
import Contacts from './contacts/Contacts';
import './Footer.css';
import NewSocialMediaContact from './newSocialMediaContact/newSocialMediaContact';
import SocialMedias from './socialMedias/SocialMedias';
import { useRefresh } from '../../context/RefreshContext';


function Footer() {

    const { refreshKey } = useRefresh();

    return (
        <>
            <div id="ftDivLine"></div>
            <div id="ftDivTop">
                <NewSocialMediaContact />
            </div>
            <div id="ftDivMiddle">
                <section id="secContacts">
                    <Contacts refreshKey={refreshKey} />
                </section>
                <section id="secSignature">
                    <h4 id='signatureH4'>Emiliano Manuel Mendieta</h4>
                </section>
                <section id="secSocialMedias">
                    <SocialMedias refreshKey={refreshKey} />
                </section>
            </div>
            <div id="ftDivBottom">
                <h1 id="copyRights">© Todos los derechos reserado.  2025</h1>
            </div>
        </>
    );
};

export default Footer;