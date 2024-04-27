package functions

import (
	"fmt"
	"sync"
)

var wg sync.WaitGroup
var mu sync.Mutex

type State struct {
	URL  string
	Path []string
}

func successors(state State) []State {
	links, err := Scrape(state.URL)
	if err != nil {
		fmt.Println("Error scraping:", err)
		return nil
	}
	var states []State
	for _, link := range links {
		newPath := append([]string(nil), state.Path...)
		newPath = append(newPath, link)
		states = append(states, State{URL: link, Path: newPath})
	}
	return states
}

func DLSMultiplePaths(current State, goalURL string, limit int, paths *[][]string, isVisited map[string]bool, totalArticle *int) {
	defer wg.Done()
	if current.URL == goalURL {
		mu.Lock()
		*paths = append(*paths, current.Path)
		mu.Unlock()
		return
	}

	if limit == 0 {
		return
	}

	mu.Lock()
	isVisited[current.URL] = true
	*totalArticle++
	mu.Unlock()

	limiter := make(chan int, 15)
	for _, succ := range successors(current) {
		wg.Add(1)
		limiter <- 1
		go func(succ State) {
			DLSMultiplePaths(succ, goalURL, limit-1, paths, isVisited, totalArticle)
			<-limiter
		}(succ)

	}

	mu.Lock()
	isVisited[current.URL] = false
	mu.Unlock()
}

func IDSMultiplePaths(startURL, goalURL string, maxDepth int) ([][]string, bool, int) {
	var paths [][]string
	totalArticle := 0
	startState := State{URL: startURL, Path: []string{startURL}}
	isVisited := make(map[string]bool)

	for depth := 0; depth <= maxDepth; depth++ {
		wg.Add(1)
		DLSMultiplePaths(startState, goalURL, depth, &paths, isVisited, &totalArticle)
		wg.Wait()
		if len(paths) > 0 {
			break
		}
	}
	return paths, len(paths) > 0, totalArticle
}
