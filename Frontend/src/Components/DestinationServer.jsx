import React, { useState } from "react";
import {t} from "i18next";
import {useInfos, useStore} from "../store.js";

export const DestinationServer = () => {
    // Destination Server states
    const [DestinationHost, setDestinationHost] = useState("");
    const [DestinationEmail, setDestinationEmail] = useState("");
    const [DestinationPassword, setDestinationPassword] = useState("");

    // Error states
    const [errors, setErrors] = useState({
        host: false,
        email: false,
        password: false
    });

    // Error messages
    const [errorMessages, setErrorMessages] = useState({
        host: "",
        email: "",
        password: ""
    });

    // Validation functions
    const validateHost = (value) => {
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, host: true }));
            setErrorMessages(prev => ({ ...prev, host: `${t("errormessageinputehost")}` }));
            return false;
        }
        setErrors(prev => ({ ...prev, host: false }));
        setErrorMessages(prev => ({ ...prev, host: "" }));
        return true;
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, email: true }));
            setErrorMessages(prev => ({ ...prev, email: `${t("errormessageinputeemail1")}` }));
            return false;
        }
        if (!emailRegex.test(value)) {
            setErrors(prev => ({ ...prev, email: true }));
            setErrorMessages(prev => ({ ...prev, email: `${t("errormessageinputeemail2")}` }));
            return false;
        }
        setErrors(prev => ({ ...prev, email: false }));
        setErrorMessages(prev => ({ ...prev, email: "" }));
        return true;
    };

    const validatePassword = (value) => {
        if (!value.trim()) {
            setErrors(prev => ({ ...prev, password: true }));
            setErrorMessages(prev => ({ ...prev, password: `${t("errormessageinputePassword")}` }));
            return false;
        }
        setErrors(prev => ({ ...prev, password: false }));
        setErrorMessages(prev => ({ ...prev, password: "" }));
        return true;
    };


    const  {setEtape} = useStore()
    const {setHoteDestination,setMailDestination,setPassewordDestination} = useInfos()

    const handleSubmit = (e) => {
        e.preventDefault();

        const isHostValid = validateHost(DestinationHost);
        const isEmailValid = validateEmail(DestinationEmail);
        const isPasswordValid = validatePassword(DestinationPassword);

        if (isHostValid && isEmailValid && isPasswordValid) {
            setEtape(2)
            setHoteDestination(DestinationHost)
            setMailDestination(DestinationEmail)
           setPassewordDestination(DestinationPassword)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="max-w-3xl w-full mx-auto p-6 border border-gray-700 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6 text-white">{t("ftitleD")}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">{t("inputehost")}</label>
                        <input
                            required
                            type="text"
                            placeholder={t("placeholderinputehost")}
                            value={DestinationHost}
                            onChange={(e) => {
                                setDestinationHost(e.target.value);
                                validateHost(e.target.value);
                            }}
                            className={`w-full p-2 border rounded bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.host ? "border-red-500" : ""
                            }`}
                        />
                        {errors.host && (
                            <p className="text-red-500 text-sm mt-1">{errorMessages.host}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">{t("inputeemail")}</label>
                        <input
                            required
                            type="email"
                            value={DestinationEmail}
                            onChange={(e) => {
                                setDestinationEmail(e.target.value);
                                validateEmail(e.target.value);
                            }}
                            placeholder={t("placeholderinputeemail")}
                            className={`w-full p-2 border rounded bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.email ? "border-red-500" : ""
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errorMessages.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-white">{t("inputePassword")}</label>
                        <input
                            required
                            type="password"
                            value={DestinationPassword}
                            onChange={(e) => {
                                setDestinationPassword(e.target.value);
                                validatePassword(e.target.value);
                            }}
                            placeholder={t("placeholderinputePassword")}
                            className={`w-full p-2 border rounded bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.password ? "border-red-500" : ""
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errorMessages.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#BB86FC] hover:opacity-85 text-white rounded transition-colors mt-4"
                    >
                        {t("button")}
                    </button>
                </div>
            </div>
        </form>
    );
};

