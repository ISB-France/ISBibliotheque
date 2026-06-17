import { config } from './config/index.js'
import { createApp } from './app.js'
import { logger } from './utils/logger.js'

const app = createApp()

app.listen(config.port, () => {
  logger.info(
    { port: config.port, env: config.env, commit: config.commit },
    `${config.name} v${config.version} started`,
  )
})
