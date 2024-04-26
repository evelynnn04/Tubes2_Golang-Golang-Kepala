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

func isPathInPaths(paths [][]string, path []string) bool {
	for _, p := range paths {
		if len(p) == len(path) {
			match := true
			for i := range p {
				if p[i] != path[i] {
					match = false
					break
				}
			}
			if match {
				return true
			}
		}
	}
	return false
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

func DLSMultiplePaths(current State, goalURL string, limit int, paths *[][]string) {
	defer wg.Done()
	if current.URL == goalURL {
		mu.Lock()
		if !isPathInPaths(*paths, current.Path) {
			*paths = append(*paths, current.Path)
		}
		mu.Unlock()
		return
	}

	if limit == 0 {
		return
	}

	limiter := make(chan int, 10)
	for _, succ := range successors(current) {
		wg.Add(1)
		limiter <- 1
		go func(succ State) {
			DLSMultiplePaths(succ, goalURL, limit-1, paths)
			<-limiter
		}(succ)

	}
}

func IDSMultiplePaths(startURL, goalURL string, maxDepth int) ([][]string, bool) {
	var paths [][]string
	startState := State{URL: startURL, Path: []string{startURL}}
	for depth := 0; depth <= maxDepth; depth++ {
		wg.Add(1)
		DLSMultiplePaths(startState, goalURL, depth, &paths)
		if len(paths) > 0 {
			break
		}
	}
	return paths, len(paths) > 0
}
