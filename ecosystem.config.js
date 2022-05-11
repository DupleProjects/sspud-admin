module.exports = {
    apps: [
      {
        name: 'sspud-admin',
        exec_mode: 'cluster',
        instances: '2', // Or a number of instances
        script: './node_modules/nuxt/bin/nuxt.js',
        args: 'start',
        env_production: {
            NODE_ENV: "production",
        },
        env_development: {
            NODE_ENV: "development",
        }
      }
    ]
  }
