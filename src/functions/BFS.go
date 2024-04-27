package functions

import (
	"fmt"

	"github.com/evelynnn04/Tubes2_Golang-Golang-Kepala/src/datastructure"
)

type node struct {
	vertex *datastructure.Vertex
}

type queue []node

func (q *queue) isEmpty() bool {
	return len(*q) == 0
}

func (q *queue) enqueue(v *datastructure.Vertex) {
	n := &node{vertex: v}
	*q = append(*q, *n)
}

func (q *queue) dequeue() *datastructure.Vertex {
	if !q.isEmpty() {
		processed := (*q)[0].vertex
		*q = (*q)[1:]
		return processed
	} else {
		return nil
	}
}

func BFS(startURL, goalURL string) ([][]string, bool) {
	// Graph init for stroring links
	g := datastructure.NewDirectedGraph()
	g.AddVertex(startURL)

	// Queue init
	vertexQueue := queue{}

	// visited init
	visitedVertices := make(map[string]bool)

	// path init
	var path [][]string

	// state init
	// startState := State{URL: startURL, Path: []string{startURL}}

	// found status init
	isFound := false

	// current URL init
	var currentVertex *datastructure.Vertex = nil
	var currentURL string

	// if found then stop, else keep scraping to the eternity...
	for !isFound {
		if(currentVertex == nil) {
			currentURL = startURL
		} else {
			currentURL = currentVertex.Key
		}
		// scrape links from currentVertex
		links, err := Scrape(currentURL)
		if err != nil {
			fmt.Println("Error scraping:", err)
			return nil, false
		}

		// add currentVertex to visited
		visitedVertices[currentURL] = true

		// add links as child to currentVertex
		for _, link := range links {
			// create new vertex
			g.AddVertex(link)
			fmt.Println(link)

			// assign it as child
			g.AddEdge(currentURL, link)
		}

		// init current vertex
		currentVertex = g.Vertices[currentURL]

		// enqueue child if not visited
		for _, v := range currentVertex.Vertices {
			if !visitedVertices[v.Key] {
				vertexQueue.enqueue(v)
			}
		}

		// dequeue processed links and update the current URL
		currentVertex = vertexQueue.dequeue()

		// if the address is nil tell the program to panic
		if currentVertex == nil {
			panic("current vertex is nil!")
		}
		
		// if found change the status
		if currentURL == goalURL {
			isFound = true
		}
	}
	return path, isFound
}
