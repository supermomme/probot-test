// Deployments API example
// See: https://developer.github.com/v3/repos/deployments/ to learn more

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')
  app.on('pull_request.labeled', async context => {
    // Creates a deployment on a pull request event
    // Then sets the deployment status to success
    // NOTE: this example doesn't actually integrate with a cloud
    // provider to deploy your app, it just demos the basic API usage.
    if (context.payload.label.name === 'e2e') {
      const res = await context.github.repos.createDeployment(context.repo({
        ref: context.payload.pull_request.head.ref,
        task: 'deploy',
        payload: {
          schema: 'rocks!'
        },
        environment: 'e2e',
        description: 'e2e Test',
        production_environment: false
      }))
      await context.github.repos.createDeploymentStatus(context.repo({
        deployment_id: res.data.id,
        state: 'pending',
        description: 'e2e Test',
        auto_inactive: true
      }))
    }
    console.log(Object.keys(context.github.checks))
    console.log(context.github.checks.get())
  })
  app.on('deployment.created', async context => {
    let deployment = context.payload.deployment
    console.log('create some deployment')
    await context.github.repos.createDeploymentStatus(context.repo({
      deployment_id: deployment.id,
      state: 'pending',
      description: 'e2e Test werden ausgeführt',
      auto_inactive: true
    }))
    setTimeout(async () => {
      await context.github.repos.createDeploymentStatus(context.repo({
        deployment_id: deployment.id,
        state: 'failure',
        description: 'e2e Test bestanden'
      }))
    }, 10000);
    // await context.github.checks.create({})
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}

