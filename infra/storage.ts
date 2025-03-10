export const assetStorage = new sst.aws.Bucket('AssetStorage', {
  access: 'cloudfront',
})
