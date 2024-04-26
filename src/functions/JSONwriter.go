package functions

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"strings"
	"time"
)

type Node struct {
	Name string `json:"name"`
}

type Link struct {
	Source string `json:"source"`
	Target string `json:"target"`
}

type Details struct {
	Runtime   string `json:"runtime"`
	TotalPath string `json:"totalpath"`
}

type Graph struct {
	Nodes   []Node  `json:"nodes"`
	Links   []Link  `json:"links"`
	Details Details `json:"details"`
}

func DataIntoJson(paths [][]string, filename string, runtime time.Duration, totalpath string) error {
	runtimeString := runtime.String()

	graph := Graph{
		Details: Details{
			Runtime:   runtimeString,
			TotalPath: totalpath,
		},
	}
	uniqueNodes := make(map[string]bool)
	linksSet := make(map[string]struct{})

	for _, path := range paths {
		for i := 0; i < len(path)-1; i++ {
			sourceURL, err := url.Parse(path[i])
			if err != nil {
				return fmt.Errorf("error parsing URL: %w", err)
			}
			targetURL, err := url.Parse(path[i+1])
			if err != nil {
				return fmt.Errorf("error parsing URL: %w", err)
			}

			sourceTitle := strings.TrimPrefix(sourceURL.Path, "/wiki/")
			targetTitle := strings.TrimPrefix(targetURL.Path, "/wiki/")

			if !uniqueNodes[sourceTitle] {
				uniqueNodes[sourceTitle] = true
				graph.Nodes = append(graph.Nodes, Node{Name: sourceTitle})
			}
			if !uniqueNodes[targetTitle] {
				uniqueNodes[targetTitle] = true
				graph.Nodes = append(graph.Nodes, Node{Name: targetTitle})
			}

			source := sourceURL.String()
			target := targetURL.String()
			linkKey := source + "->" + target

			if _, exists := linksSet[linkKey]; !exists {
				linksSet[linkKey] = struct{}{}
				graph.Links = append(graph.Links, Link{Source: source, Target: target})
			}
		}
	}

	graphJSON, err := json.MarshalIndent(graph, "", "  ")
	if err != nil {
		return fmt.Errorf("error creating JSON: %w", err)
	}

	err = os.WriteFile(filename, graphJSON, 0644)
	if err != nil {
		return fmt.Errorf("error writing JSON to file: %w", err)
	}

	fmt.Printf("JSON file '%s' created successfully!\n", filename)
	return nil
}
