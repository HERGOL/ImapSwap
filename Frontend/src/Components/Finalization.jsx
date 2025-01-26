import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { useInfos , useStore } from "../store.js";

export const Finalization = () => {
    const {
        HoteSource,
        MailSource,
        PassewordSource,
        HoteDestination,
        MailDestination,
        PassewordDestination,
        setPassewordDestination,
        setMailDestination,
        setMailSource,
        setHoteDestination,
        setPassewordSource,
        setHoteSource
    } = useInfos();

    const {
        setEtape,
        Etape
    }=useStore()

    const [taskId, setTaskId] = useState(null);
    const [progress, setProgress] = useState({
        total: 0,
        current: 0,
        status: "initial", // "initial", "in_progress", "done", "error"
        error: null,
    });

    const [isCopyStarted, setIsCopyStarted] = useState(false);

    useEffect(() => {
        if (isCopyStarted) return;

        const startCopyProcess = async () => {
            try {
                setIsCopyStarted(true);
                const response = await fetch("http://localhost:5000/start_transfer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        source_host: HoteSource,
                        source_email: MailSource,
                        source_password: PassewordSource,
                        dest_host: HoteDestination,
                        dest_email: MailDestination,
                        dest_password: PassewordDestination,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    setTaskId(data.task_id);
                } else {
                    console.error("Erreur lors du démarrage :", data.error);
                    setProgress({
                        ...progress,
                        status: "error",
                        error: data.error || "Erreur inconnue",
                    });
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                setProgress({
                    ...progress,
                    status: "error",
                    error: "Erreur réseau",
                });
            } finally {
                setIsCopyStarted(false);
            }
        };

        startCopyProcess();
    }, [HoteSource, MailSource, PassewordSource, HoteDestination, MailDestination, PassewordDestination]);

    useEffect(() => {
        if (!taskId) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:5000/progress/${taskId}`);
                const data = await response.json();

                if (response.ok) {
                    setProgress(data);
                    if (data.status === "Completed" || data.error) {
                        clearInterval(interval);
                        setEtape(3)
                    }
                } else {
                    console.error("Erreur lors de la récupération de la progression :", data.error);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [taskId]);

    const HandleClick = () => {
        setPassewordDestination("")
            setMailDestination("")
            setMailSource("")
            setHoteDestination("")
            setPassewordSource("")
            setHoteSource("")
        setEtape(0)
    }
    return (
        <>
            <div className="container mx-auto p-6">
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
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s"
                                         repeatCount="indefinite"/>
                            </circle>
                            <circle cx="16" cy="10" r="2" fill="#FFA500">
                                <animate attributeName="opacity" values="1;0.3;1" dur="1.3s" repeatCount="indefinite"/>
                            </circle>
                        </g>


                        <g>
                            <line x1="60" y1="35" x2="140" y2="35" stroke="url(#lineGradient)" strokeWidth="2"/>

                            {progress.status === "Failed" ?
                                <circle cx="100" cy="35" r="4"
                                        fill={progress.status === "Failed" ? "#EA4335" : progress.status === "Completed" ? "#4CAF50" : "#BB86FC"}
                                        opacity="0.5">
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
                                :
                                <>
                                    <circle r="2"
                                            fill={progress.status === "Failed" ? "#EA4335" : progress.status === "Completed" ? "#4CAF50" : "#BB86FC"}>
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

                                    <circle r="2"
                                            fill={progress.status === "Failed" ? "#EA4335" : progress.status === "Completed" ? "#4CAF50" : "#BB86FC"}>
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

                                    <circle cx="100" cy="35" r="4"
                                            fill={progress.status === "Failed" ? "#EA4335" : progress.status === "Completed" ? "#4CAF50" : "#BB86FC"}
                                            opacity="0.5">
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
                                </>
                            }

                        </g>
                    </svg>
                </div>

                {/* Informations source et destination */}
                <div className="grid grid-cols-2 gap-8 text-white">
                    <div>
                        <h2 className="text-lg font-bold">{t("ftitleS")}</h2>
                        <p>{t("inputehost")} {HoteSource}</p>
                        <p>{t("inputeemail")} {MailSource}</p>
                        <p>{t("inputePassword")} {PassewordSource}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{t("ftitleD")}</h2>
                        <p>{t("inputehost")} {HoteDestination}</p>
                        <p>{t("inputeemail")} {MailDestination}</p>
                        <p>{t("inputePassword")} {PassewordDestination}</p>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="mockup-code mt-6 bg-gray-800 text-white rounded-lg p-4 shadow-lg">
        <pre data-prefix="$">
          <code>{t("starting_copy")}</code>
        </pre>

                    {progress.status === "Failed" && (
                        <pre data-prefix=">" className="text-error">
            <code>{t("error")}: {progress.error}</code>
          </pre>
                    )}

                    {progress.status === "current" && (
                        <pre data-prefix=">" className="text-info">
            <code>{t("emails_processed")}: {progress.current} / {progress.total}</code>
          </pre>
                    )}

                    {progress.status === "Completed" && (
                        <pre data-prefix=">" className="text-success">
            <code>{t("copy_complete")}</code>
          </pre>
                    )}

                    {progress.status === "Initializing" && (
                        <pre data-prefix=">" className="text-warning">
            <code>{t("copy_in_progress")}</code>
          </pre>
                    )}
                </div>
            </div>
            {Etape === 3 &&
            <button
               onClick={HandleClick}
                className="w-full py-2 px-4 bg-[#BB86FC] hover:opacity-85 text-white rounded transition-colors mt-4"
            >{t("buttonF")}</button>
            }
        </>
    );
};
