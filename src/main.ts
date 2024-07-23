import { Actor } from 'apify'
import { PlaywrightCrawler, log } from 'crawlee'
import { router } from './route.js'

await Actor.init()
log.setLevel(log.LEVELS.DEBUG)

log.debug('Setting up crawler.')
const crawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: 50,
  requestHandler: router,
})

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections'])

await Actor.exit()
