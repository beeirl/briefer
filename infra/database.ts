const mysql = planetscale.getDatabaseOutput({
  name: 'briefer',
  organization: '5head',
})

const branch =
  $app.stage !== 'production'
    ? new planetscale.Branch('DatabaseBranch', {
        database: mysql.name,
        name: $app.stage,
        organization: mysql.organization,
        parentBranch: 'main',
      })
    : planetscale.getBranchOutput({
        database: mysql.name,
        name: 'main',
        organization: mysql.organization,
      })

const password = new planetscale.Password('DatabasePassword', {
  branch: branch.name,
  database: mysql.name,
  name: `${$app.name}-${$app.stage}-credentials`,
  organization: mysql.organization,
  role: 'admin',
})

export const database = new sst.Linkable('Database', {
  properties: {
    username: password.username,
    host: branch.mysqlAddress,
    password: password.plaintext,
    database: password.database,
    port: 3306,
  },
})
