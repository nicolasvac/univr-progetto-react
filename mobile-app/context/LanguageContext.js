import React, {useState, useEffect, useContext} from 'react'
import it from '../translations/it.json'
import en from '../translations/en.json'
import * as RNLocalize from 'react-native-localize'

import App from '../App'

const LanguageContext = React.createContext();

const languageObj = {
    'en': en,
    'it': it,
}

export const LanguageContextProvider = ({ children }) => {

    const [selectedLanguage, setSelectedLanguage] = useState('it');

    useEffect(() => {
        const currentLanguage = RNLocalize.findBestAvailableLanguage(Object.keys(languageObj));       
        setSelectedLanguage(currentLanguage?.languageTag || 'it')
    }, [])

    let value = {
        ...languageObj[selectedLanguage]
    }

    return (
        <LanguageContext.Provider value={value}>
            <App />
        </LanguageContext.Provider>
    )
}

export const useTranslation = () => useContext(LanguageContext)
