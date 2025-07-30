import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../authConfig";

let msalInstance;

if (typeof window !== "undefined" && window.crypto?.subtle) {
    const { PublicClientApplication } = require("@azure/msal-browser");
    const { msalConfig } = require("../authConfig");
    msalInstance = new PublicClientApplication(msalConfig);
}

export { msalInstance };