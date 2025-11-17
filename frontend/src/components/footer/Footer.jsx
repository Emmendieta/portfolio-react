import { useState } from 'react';
import Contacts from './contacts/Contacts';
import './Footer.css';
import NewSocialMediaContact from './newSocialMediaContact/newSocialMediaContact';
import SocialMedias from './socialMedias/SocialMedias';
import { useRefresh } from '../../context/RefreshContext';
import { LANG_CONST } from "../constants/selectConstLang.js";
import { useLanguage } from '../../context/LanguageContext.jsx';

function Footer() {

    const { refreshKey } = useRefresh();
    const { language } = useLanguage();
    const TEXT = LANG_CONST[language];

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
                    <h4 id='signatureH4'>{TEXT.EMILIANO_MENDIETA}</h4>
                </section>
                <section id="secSocialMedias">
                    <SocialMedias refreshKey={refreshKey} />
                </section>
            </div>
            <div id="ftDivBottom">
                <h1 id="copyRights">{TEXT.COPYRIGHTS}</h1>
            </div>
        </>
    );
};

export default Footer;