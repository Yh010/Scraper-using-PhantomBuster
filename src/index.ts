"phantombuster package: 5"
"phantombuster command: nodejs"
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const puppeteer = require("puppeteer")

interface IHackerNewsLink {
	title: string
	url: string
}

const buster = new Buster()

;(async () => {
	const browser = await puppeteer.launch({
		// This is needed to run Puppeteer in a Phantombuster container
		args: ["--no-sandbox"]
	})
	
	 try {
        const page = await browser.newPage()
        await page.goto("https://news.ycombinator.com")
        await page.waitForSelector("#hnmain")

        const hackerNewsLinks: IHackerNewsLink[] = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("a")).map(element => ({
                title: element.text,
                url: element.href,
            }))
        })

        await buster.setResultObject(hackerNewsLinks)
    } catch (error) {
        console.error("An error occurred:", error)
        process.exit(1)
    } finally {
        await browser.close()
    }
})()