import {t} from "i18next";
import {useInfos} from "../store.js";
export const Finalization = () => {
    const {HoteSource,MailSource,PassewordSource,HoteDestination,MailDestination,PassewordDestination} = useInfos()
    return (
        <>
            <div className={"w-1/2 flex mx-auto"}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 70">
                    <defs>
                        <linearGradient id="serverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4a90e2" stopOpacity="1"/>
                            <stop offset="100%" stopColor="#357abd" stopOpacity="1"/>
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4a90e2" stopOpacity="0.3"/>
                            <stop offset="50%" stopColor="#4CAF50" stopOpacity="0.7"/>
                            <stop offset="100%" stopColor="#4a90e2" stopOpacity="0.3"/>
                        </linearGradient>
                    </defs>


                    <g transform="translate(10,10)">
                        <rect x="0" y="0" width="50" height="50" rx="4" fill="#825daf"/>
                        <rect x="5" y="5" width="40" height="10" rx="2" fill="white" opacity="0.9"/>
                        <rect x="5" y="20" width="40" height="10" rx="2" fill="white" opacity="0.9"/>
                        <rect x="5" y="35" width="40" height="10" rx="2" fill="white" opacity="0.9"/>
                        <circle cx="10" cy="10" r="2" fill="#4CAF50">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="16" cy="10" r="2" fill="#FFA500">
                            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
                        </circle>
                    </g>


                    <g transform="translate(140,10)">
                        <rect x="0" y="0" width="50" height="50" rx="4" fill="#825daf"/>
                        <rect x="5" y="5" width="40" height="10" rx="2" fill="white" opacity="0.9"/>
                        <rect x="5" y="20" width="40" height="10" rx="2" fill="white" opacity="0.9"/>
                        <rect x="5" y="35" width="40" height="10" rx="2" fill="white" opacity="0.9"/>
                        <circle cx="10" cy="10" r="2" fill="#4CAF50">
                            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="16" cy="10" r="2" fill="#FFA500">
                            <animate attributeName="opacity" values="1;0.3;1" dur="1.3s" repeatCount="indefinite"/>
                        </circle>
                    </g>


                    <g>
                        <line x1="60" y1="35" x2="140" y2="35" stroke="url(#lineGradient)" strokeWidth="2"/>

                        <circle r="2" fill="#4CAF50">
                            <animateMotion
                                path="M 60,35 L 140,35"
                                dur="3s"
                                repeatCount="indefinite"/>
                            <animate
                                attributeName="opacity"
                                values="0;1;0"
                                dur="3s"
                                repeatCount="indefinite"/>
                        </circle>

                        <circle r="2" fill="#4CAF50">
                            <animateMotion
                                path="M 60,35 L 140,35"
                                dur="3s"
                                begin="1.5s"
                                repeatCount="indefinite"/>
                            <animate
                                attributeName="opacity"
                                values="0;1;0"
                                dur="3s"
                                begin="1.5s"
                                repeatCount="indefinite"/>
                        </circle>

                        <circle cx="100" cy="35" r="4" fill="#4CAF50" opacity="0.5">
                            <animate
                                attributeName="r"
                                values="2;4;2"
                                dur="2s"
                                repeatCount="indefinite"/>
                            <animate
                                attributeName="opacity"
                                values="0.3;0.7;0.3"
                                dur="2s"
                                repeatCount="indefinite"/>
                        </circle>
                    </g>
                </svg>
            </div>

            <div className={"flex justify-between mx-auto"}>
                <div className={"flex flex-col mr-[230px]"}>
                    <h1 className={"text-white text-lg font-bold "}>{t("ftitleS")}</h1>
                    <h1 className={"text-white"}>{t("inputehost")} {HoteSource}</h1>
                    <h1 className={"text-white"}>{t("inputeemail")} {MailSource}</h1>
                    <h1 className={"text-white"}>{t("inputePassword")} {PassewordSource}</h1>
                </div>
                <div className={"flex flex-col"}>
                    <h1 className={"text-white text-lg font-bold"}>{t("ftitleD")}</h1>
                    <h1 className={"text-white"}>{t("inputehost")} {HoteDestination}</h1>
                    <h1 className={"text-white"}>{t("inputeemail")} {MailDestination}</h1>
                    <h1 className={"text-white"}>{t("inputePassword")} {PassewordDestination}</h1>
                </div>
            </div>
        </>
    )
}