export const publicStorage = new sst.aws.Bucket('PublicStorage', {
  access: 'public',
})
