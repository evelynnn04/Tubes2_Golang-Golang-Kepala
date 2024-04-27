package functions

import (
	"encoding/json"
	"fmt"

	"net/url"
	"strconv"
	"strings"
	"time"
)

type Node struct {
	Name string `json:"name"`
	ID   string `json:"id,omitempty"`
}

type Link struct {
	Source string `json:"source"`
	Target string `json:"target"`
}

type DetailsEntry map[string]string

type Graph struct {
	Nodes   []Node         `json:"nodes"`
	Links   []Link         `json:"links"`
	Details []DetailsEntry `json:"details"`
}

func DataIntoJson(paths [][]string, runtime time.Duration, totalpath string, totalDepth string, totalArticle int) (string, error) {

	runtimeString := runtime.String()
	strTotArtic := strconv.Itoa(totalArticle)

	details := []DetailsEntry{
		{"runtime": runtimeString},
		{"totalpath": totalpath},
		{"depth": totalDepth},
		{"totArticle": strTotArtic},
	}

	graph := Graph{
		Details: details,
	}

	uniqueNodes := make(map[string]bool)
	linksSet := make(map[string]struct{})

	var fromTitle, toTitle string
	if len(paths) > 0 {
		fromURL, err := url.Parse(paths[0][0])
		if err != nil {
			return "error", fmt.Errorf("error parsing from URL: %w", err)
		}
		toURL, err := url.Parse(paths[0][len(paths[0])-1])
		if err != nil {
			return "error", fmt.Errorf("error parsing to URL: %w", err)
		}
		fromTitle = strings.TrimPrefix(fromURL.Path, "/wiki/")
		toTitle = strings.TrimPrefix(toURL.Path, "/wiki/")
	}

	for _, path := range paths {
		for i := 0; i < len(path)-1; i++ {
			sourceURL, err := url.Parse(path[i])
			if err != nil {
				return "error", fmt.Errorf("error parsing URL: %w", err)
			}
			targetURL, err := url.Parse(path[i+1])
			if err != nil {
				return "error", fmt.Errorf("error parsing URL: %w", err)
			}

			sourceTitle := strings.TrimPrefix(sourceURL.Path, "/wiki/")
			targetTitle := strings.TrimPrefix(targetURL.Path, "/wiki/")

			uniqueNodes[sourceTitle] = true
			uniqueNodes[targetTitle] = true

			linkKey := sourceTitle + "->" + targetTitle
			linksSet[linkKey] = struct{}{}
		}
	}

	for title := range uniqueNodes {
		node := Node{Name: title}
		if title == fromTitle {
			node.ID = "from"
		} else if title == toTitle {
			node.ID = "to"
		}
		graph.Nodes = append(graph.Nodes, node)
	}

	for linkKey := range linksSet {
		parts := strings.Split(linkKey, "->")
		graph.Links = append(graph.Links, Link{Source: parts[0], Target: parts[1]})
	}
	graphJSON, err := json.MarshalIndent(graph, "", "  ")
	if err != nil {
		return "", fmt.Errorf("error creating JSON: %w", err)
	}

	return string(graphJSON), nil
}
