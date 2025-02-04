import { useState } from 'react'
import './i18n.js'
import './App.css'
import ReactCountryFlag from "react-country-flag"


import {useStore} from "./store.js";


//components
import {SourceServer} from "./Components/SourceServer.jsx";
import {DestinationServer} from "./Components/DestinationServer.jsx";
import {Finalization} from "./Components/Finalization.jsx";
//translation
import {t} from "i18next";
import {useTranslation} from "react-i18next";

function App() {
     const {i18n} = useTranslation()
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

     const {Etape,setEtape} = useStore()


    const GoToEtape = (EtapeToGo) =>{
         if (Etape > EtapeToGo){
             setEtape(EtapeToGo)
         }
    }

  return (
      <div className={"bg-[#0d1117] min-h-screen w-screen"}>
          <div className="navbar bg-[#010409] rounded-box">
              <div className="flex-1 px-2 lg:flex-none">
                  <a className="text-lg font-bold text-white">IMAP Swap</a>
              </div>
              <div className="flex flex-1 justify-end px-2">
                  <div className="flex items-stretch">
                      <div className="dropdown dropdown-end">
                          <div
                              tabIndex="0"
                              role="button"
                              className="btn btn-ghost rounded-btn text-white flex items-center gap-2"
                          >
                              <ReactCountryFlag
                                  countryCode={i18n.language === 'en' ? 'US' : i18n.language.substring(0, 2).toUpperCase()}
                                  svg/>
                              {i18n.language.toUpperCase()}
                          </div>
                          <ul
                              tabIndex="0"
                              className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow"
                          >
                              <li>
                                  <a onClick={() => changeLanguage('fr')}>
                                      <ReactCountryFlag countryCode="FR" svg/> FR
                                  </a>
                              </li>
                              <li>
                                  <a onClick={() => changeLanguage('en')}>
                                      <ReactCountryFlag countryCode="US" svg/> EN
                                  </a>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center mt-24">
              <h1 className="text-white text-4xl font-bold">
                  {t("titleL")} <span
                  className="bg-[#BB86FC] text-white px-2 rounded-lg">{t("titleM")}</span>{t("titleR")}
              </h1>
          </div>

          <div className="mt-10 mx-auto flex flex-col w-3/4 bg-[#1e1e1e] rounded-2xl p-6">
              {/* Stepper */}
              <div className="flex justify-center w-full mb-8 cursor-pointer">

                  <ol className="flex items-center justify-center w-full px-2 py-4 sm:p-6 space-x-2 sm:space-x-4 text-xs sm:text-sm md:text-lg font-medium text-center text-white">
                      <li onClick={() => GoToEtape(0)}
                          className={`flex items-center  ${Etape === 0 ? "text-[#BB86FC]" : Etape >= 1 ? "text-green-500" : "text-white"} `}>
        <span
            className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 me-2 sm:me-3 text-xs ${Etape === 0 ? "text-[#BB86FC] border-[#BB86FC]" : Etape >= 1 ? "text-green-500 border-green-500" : "text-white border-white"}  border-2  rounded-full shrink-0`}>
          1
        </span>
                          Source
                          <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                          <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 ms-2 sm:ms-6 rtl:rotate-180"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 12 10"
                          >
                              <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m7 9 4-4-4-4M1 9l4-4-4-4"
                              />
                          </svg>
                      </li>
                      <li onClick={() => {
                          GoToEtape(1)
                      }}
                          className={`flex items-center  ${Etape === 1 ? "text-[#BB86FC]" : Etape >= 2 ? "text-green-500" : "text-white"} `}>
        <span
            className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 me-2 sm:me-3 text-xs ${Etape === 1 ? "text-[#BB86FC] border-[#BB86FC]" : Etape >= 2 ? "text-green-500 border-green-500" : "text-white border-white"}  border-2  rounded-full shrink-0`}>
          2
        </span>
                          Destination
                          <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                          <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 ms-2 sm:ms-6 rtl:rotate-180"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 12 10"
                          >
                              <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m7 9 4-4-4-4M1 9l4-4-4-4"
                              />
                          </svg>
                      </li>
                      <li onClick={() => GoToEtape(2)}
                          className={`flex items-center  ${Etape === 2 ? "text-[#BB86FC]" : Etape >= 3 ? "text-green-500" : "text-white"} `}>
        <span
            className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 me-2 sm:me-3 text-xs ${Etape === 2 ? "text-[#BB86FC] border-[#BB86FC]" : Etape >= 3 ? "text-green-500 border-green-500" : "text-white border-white"}  border-2  rounded-full shrink-0`}>
          3
        </span>
                          Finalization
                      </li>
                  </ol>
              </div>

              {/* Form */}
              {Etape === 0 &&
                  <SourceServer/>
              }
              {Etape === 1 &&
                  <DestinationServer/>
              }
              {Etape >= 2 &&
                  <Finalization/>
              }
          </div>
          <footer className="footer footer-center bg-[#010409] text-base-content p-4">
              <aside>
                  <p className={"text-lg font-bold text-white"}>Made with 💜 || Powered by <span onClick={()=> window.open("https://hergol.me/")} className={"cursor-pointer"}>Hergol </span> </p>
              </aside>
          </footer>
      </div>
  )
}

export default App
