package functions

type State struct {
	URL  string
	Path []string
}

func isGoal(state State, goalURL string) bool {
	return state.URL == goalURL
}

func successors(state State) []State {
	links := Scrape(state.URL)
	var states []State
	for _, link := range links {
		newPath := append([]string(nil), state.Path...)
		newPath = append(newPath, link)
		states = append(states, State{URL: link, Path: newPath})
	}
	return states
}

func dls(current State, goalURL string, limit int, visited map[string]bool) (bool, []string) {
	if isGoal(current, goalURL) {
		return true, current.Path
	}

	if limit == 0 || visited[current.URL] {
		return false, nil
	}

	visited[current.URL] = true

	for _, succ := range successors(current) {
		found, path := dls(succ, goalURL, limit-1, visited)
		if found {
			return true, path
		}
	}

	visited[current.URL] = false

	return false, nil
}

func Ids(startURL, goalURL string, maxDepth int) ([]string, bool) {
	visited := make(map[string]bool)
	startState := State{URL: startURL, Path: []string{startURL}}
	for depth := 0; depth <= maxDepth; depth++ {
		found, path := dls(startState, goalURL, depth, visited)
		if found {
			return path, true
		}
	}
	return nil, false
}
