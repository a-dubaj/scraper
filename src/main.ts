import { PlaywrightCrawler } from 'crawlee'

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page, enqueueLinks, request }) => {
    console.log(request.url)

    if (request.label === 'DETAIL') {
    } else if (request.label === 'COLLECTION') {
      const productSelector = '.product-item > a'
      await page.waitForSelector(productSelector)
      await enqueueLinks({
        selector: productSelector,
        label: 'DETAIL',
      })
    } else {
      const collectionSelector = '.collection-block-item'
      await page.waitForSelector(collectionSelector)
      await enqueueLinks({
        selector: collectionSelector,
        label: 'COLLECTION',
      })
    }
  },
})

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections'])
