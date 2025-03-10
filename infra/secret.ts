export const secret = {
  GeminiApiKey: new sst.Secret('GeminiApiKey'),
  GoogleClientID: new sst.Secret('GoogleClientID'),
  TwelvelabsApiKey: new sst.Secret('TwelvelabsApiKey'),
}

export const allSecrets = [...Object.values(secret)]
