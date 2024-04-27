package functions

import (
	"fmt"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

func Scrape(startURL string) ([]string, error) {
	client := &http.Client{}

	resp, err := client.Get(startURL)
	if err != nil {
		return nil, fmt.Errorf("error fetching the page: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("error: non-200 HTTP status code: %d", resp.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error parsing HTML: %w", err)
	}

	uniqueLinks := make(map[string]bool)
	var links []string

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		link, _ := s.Attr("href")

		if strings.HasPrefix(link, "/wiki/") && !strings.Contains(link, ":") {
			if hashIndex := strings.Index(link, "#"); hashIndex != -1 {
				link = link[:hashIndex]
			}

			absLink, err := resolveRelativeURL(startURL, link)
			if err != nil {
				fmt.Printf("Invalid URL %s: %v\n", link, err)
				return
			}

			if _, exists := uniqueLinks[absLink]; !exists {
				uniqueLinks[absLink] = true
				links = append(links, absLink)
			}
		}
	})

	sort.Strings(links)
	return links, nil
}

func resolveRelativeURL(baseURL, relURL string) (string, error) {
	base, err := url.Parse(baseURL)
	if err != nil {
		return "", err
	}
	rel, err := url.Parse(relURL)
	if err != nil {
		return "", err
	}
	return base.ResolveReference(rel).String(), nil
}
