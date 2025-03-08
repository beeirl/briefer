export const secret = {
  TwelvelabsApiKey: new sst.Secret('TwelvelabsApiKey'),
  GoogleClientID: new sst.Secret('GoogleClientID'),
}

export const allSecrets = [...Object.values(secret)]
