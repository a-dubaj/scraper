import { PlaywrightCrawler } from 'crawlee';
const crawler = new PlaywrightCrawler({
    requestHandler: async ({page}) => {
        await page.waitForSelector('.collection-block-item')
        const title = await page.$$eval('.collection-block-item', (els) => {
            return els.map((el) => el.textContent)
        })

        title.forEach((text, index) => {
            console.log(`Title ${index + 1 }: ${text}`)
        })
    }
})

await crawler.run(['https://warehouse-theme-metal.myshopify.com/collections'])