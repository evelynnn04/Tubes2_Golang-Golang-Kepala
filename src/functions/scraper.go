package functions

import (
	"strings"

	"github.com/gocolly/colly"
)

func Scrape(startURL string) ([]string, error) {
	c := colly.NewCollector(
		colly.AllowedDomains("wikipedia.org", "en.wikipedia.org"),
		// colly.CacheDir("./scrapeCache"),
	)

	c.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"

	uniqueLinks := make(map[string]bool)
	var links []string
	var scrapeError error

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		if e.Request.AbsoluteURL(link) != "" && strings.HasPrefix(link, "/wiki/") && !strings.Contains(link, ":") {
			fullLink := e.Request.AbsoluteURL(link)
			if _, exists := uniqueLinks[fullLink]; !exists {
				uniqueLinks[fullLink] = true
				links = append(links, fullLink)
			}
		}
	})

	c.OnError(func(r *colly.Response, err error) {
		scrapeError = err
	})

	c.Visit(startURL)

	c.Wait()

	return links, scrapeError
}
