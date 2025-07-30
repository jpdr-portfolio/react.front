const config = {
  azureClientId: "",
  azureTenantId: "",
  azureRedirectUrl: "",
  azureScope: "",
  backendServerUrlNotes: ""
};

export async function loadConfig() {
    const response = await fetch("/config.json");
    const data = await response.json();
    config.azureClientId = data.REACT_APP_AZURE_CLIENT_ID;
    config.azureTenantId = data.REACT_APP_AZURE_TENANT_ID;
    config.azureRedirectUrl = data.REACT_APP_AZURE_REDIRECT_URL;
    config.azureScope = data.REACT_APP_AZURE_SCOPE;
    config.backendServerUrlNotes = data.REACT_APP_BACKED_SERVER_URL_NOTES;

}

export default config;