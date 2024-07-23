import { PlaywrightCrawler } from 'crawlee'
import { selectors } from 'playwright'

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page, enqueueLinks, request }) => {
    console.log(request.url)

    if (request.label === 'DETAIL') {
    } else if (request.label === 'COLLECTION') {
      const productSelector = '.product-item > a'
      const nextPageSelector = 'a.pagination_next'

      await page.waitForSelector(productSelector)
      await enqueueLinks({
        selector: productSelector,
        label: 'DETAIL',
      })

      const nextButton = await page.$(nextPageSelector)
      if (nextButton) {
        await enqueueLinks({
          selector: nextPageSelector,
          label: 'COLLECTION',
        })
      }
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
