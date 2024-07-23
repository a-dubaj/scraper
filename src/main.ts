import { PlaywrightCrawler } from 'crawlee'

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page, enqueueLinks, request }) => {
    console.log(request.url)

    const collectionSelector = '.collection-block-item'
    await page.waitForSelector(collectionSelector)
    await enqueueLinks({
      selector: collectionSelector,
      label: 'COLLECTION',
    })
  },
})

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections'])
