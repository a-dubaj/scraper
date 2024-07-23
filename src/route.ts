import { createPlaywrightRouter, Dataset } from 'crawlee'

export const router = createPlaywrightRouter()
router.addHandler('DETAIL', async ({ request, page, log }) => {
  log.debug(`Extracting data: ${request.url}`)

  const title = await page.locator('.product-meta h1').textContent()
  const sku = await page.locator('span.product-meta__sku-number').textContent()

  const priceElement = page
    .locator('span.price')
    .filter({
      hasText: '$',
    })
    .first()

  const currentPrice = await priceElement.textContent()
  const rawPrice = currentPrice?.split('$')[1]
  const price = Number(rawPrice?.replace(',', ''))

  const inStockElement = page
    .locator('span.product-form__inventory')
    .filter({
      hasText: 'In stock',
    })
    .first()

  const inStock = (await inStockElement.count()) > 0

  const results = {
    url: request.url,
    title,
    sku,
    currentPrice: price,
    availableInStock: inStock,
  }

  log.debug(`Saving data: ${request.url}`)
  await Dataset.pushData(results)
  // await Dataset.exportToJSON('saved-products')
  await Dataset.exportToCSV('saved-products')
})

router.addHandler(
  'COLLECTION',
  async ({ page, enqueueLinks, request, log }) => {
    log.debug(`Enqueueing pagination for: ${request.url}`)

    await page.waitForSelector('.product-item > a')
    await enqueueLinks({
      selector: '.product-item > a',
      label: 'DETAIL',
    })

    const nextButton = await page.$('a.pagination__next')
    if (nextButton) {
      await enqueueLinks({
        selector: 'a.pagination__next',
        label: 'COLLECTION',
      })
    }
  },
)

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
  log.debug(`Enqueueing categories from page: ${request.url}`)
  await page.waitForSelector('.collection-block-item')
  await enqueueLinks({
    selector: '.collection-block-item',
    label: 'COLLECTION',
  })
})
