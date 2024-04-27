package functions

import (
	"fmt"
	"sync"
)

func existGoal(queue []State, goalURL string) bool {
	for _, state := range queue {
		if state.URL == goalURL {
			return true
		}
	}
	return false
}

func successorsBFS(state State, visited map[string]bool, mu *sync.Mutex) []State {
	links, err := Scrape(state.URL)
	if err != nil {
		fmt.Println("Error scraping:", err)
		return nil
	}
	var states []State
	mu.Lock()
	for _, link := range links {
		if !visited[link] {
			visited[link] = true
			newPath := append([]string(nil), state.Path...)
			newPath = append(newPath, link)
			states = append(states, State{URL: link, Path: newPath})
		}
	}
	mu.Unlock()
	return states
}

func BFS(startURL, goalURL string) ([][]string, bool, int) {
	queue := []State{{URL: startURL, Path: []string{startURL}}}
	visited := make(map[string]bool)
	visited[startURL] = true

	var wg sync.WaitGroup
	var mu sync.Mutex
	var foundPaths [][]string

	for {
		localQueue := []State{}
		limiter := make(chan int, 150)
		for _, state := range queue {
			wg.Add(1)
			limiter <- 1
			go func(s State) {
				defer wg.Done()
				links := successorsBFS(s, visited, &mu)
				mu.Lock()
				localQueue = append(localQueue, links...)
				mu.Unlock()
				<-limiter
			}(state)
		}

		wg.Wait()

		if existGoal(localQueue, goalURL) {
			for _, state := range localQueue {
				if state.URL == goalURL {
					foundPaths = append(foundPaths, state.Path)
				}
			}
			return foundPaths, true, len(visited)
		}

		if len(localQueue) == 0 {
			return nil, false, 0
		}

		queue = localQueue
	}
}
