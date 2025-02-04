import React, { useEffect, useState, useCallback, useRef} from "react";
import { t } from "i18next";
import { useInfos, useStore } from "../store.js";

const POLL_INTERVAL = 2000;
const SERVER_URL = "http://localhost:5000";

// Initial states
const initialProgress = {
    total: 0,
    current: 0,
    status: "initial",
    error: null,
};

const initialServerStatus = {
    isChecking: true,
    isOnline: false,
};

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
        setHoteSource,
    } = useInfos();

    const { setEtape, Etape } = useStore();

    const [progress, setProgress] = useState(initialProgress);
    const [serverStatus, setServerStatus] = useState(initialServerStatus);


    // Check server status
    const checkServer = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/ping`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                timeout: 5000 ,
            });

            const isOnline = response.ok;
            setServerStatus({ isChecking: false, isOnline });

            if (!isOnline) {
                setProgress(prev => ({
                    ...prev,
                    status: "error",
                    error: "Le serveur ne répond pas correctement",
                }));
            }

            return isOnline;
        } catch (error) {
            setServerStatus({ isChecking: false, isOnline: false });
            setProgress(prev => ({
                ...prev,
                status: "error",
                error: "Impossible de se connecter au serveur",
            }));
            return false;
        }
    };

    // Poll progress
    // Modifiez uniquement ces parties dans votre composant Finalization :

    const pollProgress = useCallback(async (taskId, intervalId) => {
        try {
            const response = await fetch(`${SERVER_URL}/progress/${taskId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la récupération de la progression");
            }

            setProgress(data);

            // Continuer le polling sauf si le statut est terminal
            if (["Completed", "Failed"].includes(data.status)) {
                clearInterval(intervalId);
                if (data.status === "Completed") {
                    setEtape(3);
                }
            }
        } catch (error) {
            console.error("Erreur lors du polling:", error);
            setProgress(prev => ({
                ...prev,
                status: "error",
                error: error.message,
            }));
        }
    }, [setEtape]);

    // Start copy process
    const hasRunRef = useRef(false);


    const startCopyProcess = useCallback(async () => {
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        let intervalId = null;

        try {
            const isServerOnline = await checkServer();
            if (!isServerOnline) {
                setProgress(prev => ({
                    ...prev,
                    status: "error",
                    error: "Le serveur n'est pas accessible",
                }));
                return;
            }

            const response = await fetch(`${SERVER_URL}/start_transfer`, {
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

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors du démarrage du transfert");
            }


            await pollProgress(data.task_id);


            intervalId = setInterval(() => pollProgress(data.task_id, intervalId), POLL_INTERVAL);


            return function cleanup() {
                if (intervalId) {
                    clearInterval(intervalId);
                }
            };

        } catch (error) {
            console.error("Erreur lors du démarrage:", error);
            setProgress(prev => ({
                ...prev,
                status: "error",
                error: error.message,
            }));
            return function cleanup() {};
        }
    }, [
        HoteSource,
        MailSource,
        PassewordSource,
        HoteDestination,
        MailDestination,
        PassewordDestination,
        pollProgress,
    ]);

    useEffect(() => {
        let cleanupFn;
        const initProcess = async () => {
            cleanupFn = await startCopyProcess();
        };
        initProcess();
        return () => {
            if (typeof cleanupFn === 'function') {
                cleanupFn();
            }
        };
    }, [startCopyProcess]);

    const handleReset = () => {
        setPassewordDestination("");
        setMailDestination("");
        setMailSource("");
        setHoteDestination("");
        setPassewordSource("");
        setHoteSource("");
        setEtape(0);
    };

    const renderProgressStatus = () => {
        if (progress.status === "Failed") {
            return (
                <pre data-prefix=">" className="text-error">
                <code>{t("error")}: {progress.error}</code>
            </pre>
            );
        }

        if (progress.status === "In progress") {
            return (
                <pre data-prefix=">" className="text-info">
                <code>{t("emails_processed")}: {progress.current} / {progress.total}</code>
            </pre>
            );
        }

        if (progress.status === "Completed") {
            return (
                <pre data-prefix=">" className="text-success">
                <code>{t("copy_complete")}</code>
            </pre>
            );
        }

        if (progress.status === "Initializing") {
            return (
                <pre data-prefix=">" className="text-warning">
                <code>{t("copy_in_progress")}</code>
            </pre>
            );
        }

        return null;
    };

    if (serverStatus.isChecking) {
        return (
            <div className="text-center text-white">
                <p>Vérification de la connexion au serveur...</p>
            </div>
        );
    }

    if (!serverStatus.isOnline) {
        return (
            <div className="text-center text-red-500">
                <p>Le serveur n'est pas accessible. Veuillez vérifier votre connexion et réessayer.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {/* SVG Animation */}
            <div className="w-1/2 flex mx-auto">
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

            {/* Source and Destination Info */}
            <div className="max-w-4xl  mx-auto px-4">
                <div className="grid grid-cols-2 gap-8 text-white">
                    <div>
                        <h2 className="text-sm md:text-lg font-bold">{t("ftitleS")}</h2>
                        <p className={"text-sm md:text-lg"}>{t("inputehost")} {HoteSource}</p>
                        <p className={"text-sm md:text-lg"}>{t("inputeemail")} {MailSource}</p>
                        <p className={"text-sm md:text-lg"}>{t("inputePassword")} {PassewordSource}</p>
                    </div>
                    <div>
                        <h2 className="text-sm md:text-lg font-bold">{t("ftitleD")}</h2>
                        <p className={"text-sm md:text-lg"}>{t("inputehost")} {HoteDestination}</p>
                        <p className={"text-sm md:text-lg"}>{t("inputeemail")} {MailDestination}</p>
                        <p className={"text-sm md:text-lg"}>{t("inputePassword")} {PassewordDestination}</p>
                    </div>
                </div>
            </div>

            {/* Progress Information */}
            <div className="mockup-code mt-6 bg-gray-800 text-white rounded-lg p-4 shadow-lg">
        <pre data-prefix="$">
          <code>{t("starting_copy")}</code>
        </pre>
                {renderProgressStatus()}
            </div>

            {Etape === 3 && (
                <button
                    onClick={handleReset}
                    className="w-full py-2 px-4 bg-[#BB86FC] hover:opacity-85 text-white rounded transition-colors mt-4"
                >
                    {t("buttonF")}
                </button>
            )}
        </div>
    );
};
