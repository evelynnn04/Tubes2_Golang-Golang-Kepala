package functions

import (
	"strings"

	"github.com/gocolly/colly"
)

func Scrape(startURL string) []string {
	c := colly.NewCollector(
		colly.AllowedDomains("wikipedia.org", "en.wikipedia.org"),
	)

	c.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"

	var links []string

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		if e.Request.AbsoluteURL(link) != "" {
			if strings.HasPrefix(link, "/wiki/") && !strings.Contains(link, ":") {
				fullLink := e.Request.AbsoluteURL(link)

				links = append(links, fullLink)
			}
		}
	})

	c.Visit(startURL)

	c.Wait()

	return links
}
