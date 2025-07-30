import { LogLevel } from "@azure/msal-browser";

const azureClientId = process.env.REACT_APP_AZURE_CLIENT_ID;
const azureTenantId = process.env.REACT_APP_AZURE_TENANT_ID;
const azureRedirectUrl = process.env.REACT_APP_AZURE_REDIRECT_URL;

export const msalConfig = {
     auth: {
         clientId: azureClientId, 
         authority: 'https://login.microsoftonline.com/' + azureTenantId + "/v2.0", 
         redirectUri: azureRedirectUrl, 
         postLogoutRedirectUri: azureRedirectUrl, 
         navigateToLoginRequestUrl: false, 
     },
     cache: {
         cacheLocation: 'localStorage', 
         storeAuthStateInCookie: false, 
     },
     system: {
         loggerOptions: {
             loggerCallback: (level, message, containsPii) => {
                 if (containsPii) {
                     return;
                 }
                 switch (level) {
                     case LogLevel.Error:
                         console.error(message);
                         return;
                     case LogLevel.Info:
                         //console.info(message);
                         return;
                     case LogLevel.Verbose:
                         console.debug(message);
                         return;
                     case LogLevel.Warning:
                         console.warn(message);
                         return;
                     default:
                         return;
                 }
             },
         },
     },
 };

  export const loginRequest = {
    scopes: ["openid", "profile", "email", "api://"+ azureClientId + "/access_as_user"]
 };