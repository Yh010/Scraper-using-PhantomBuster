"phantombuster package: 5"
"phantombuster command: nodejs"
"phantombuster flags: save-folder"

const Buster = require("phantombuster")
const puppeteer = require("puppeteer")

const buster = new Buster()

interface IHackerNewsLink {
	title: string
	url: string
}

;(async () => {
	const browser = await puppeteer.launch({
		// This is needed to run Puppeteer in a Phantombuster container
		args: ["--no-sandbox"]
	})
	
	const page = await browser.newPage()
	await page.goto("https://news.ycombinator.com")
	await page.waitForSelector("#hnmain")

	const hackerNewsLinks = await page.evaluate(() => {
		const data: IHackerNewsLink[] = []
		document.querySelectorAll("a.storylink").forEach((element) => {
            if (element instanceof HTMLAnchorElement) {
                data.push({
                    title: element.text,
                    url: element.href,
            })
	    }
})
		return data
	})

	await buster.setResultObject(hackerNewsLinks)
	await page.screenshot({ path: "hacker-news.png" })

	await page.close()
	await browser.close()
	process.exit()
})()
