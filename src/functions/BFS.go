package functions

import (
	"github.com/evelynnn04/Tubes2_Golang-Golang-Kepala/src/datastructure"
)

type node struct {
	vertex *datastructure.Vertex
	next   *node
}

type queue struct {
	head *node
	tail *node
}

func (q *queue) enqueue(v *datastructure.Vertex) {
	n := &node{vertex: v}
	if q.tail == nil {
		q.head = n
		q.tail = n
	} else {
		q.tail.next = n
		q.tail = n
	}
}

func (q *queue) dequeue() *datastructure.Vertex {
	n := q.head
	if n == nil {
		return nil
	} else {
		q.head = q.head.next
		if q.head == nil {
			q.tail = nil
		}
		return n.vertex
	}
}

func BFS(startURL, goalURL string) (datastructure.Graph, bool) {
	// Graph init for stroring links
	var g = datastructure.NewDirectedGraph()
	g.AddVertex(startURL)
	currentVertex := g.Vertices[startURL]

	// Queue init
	vertexQueue := &queue{}

	// visited init
	visitedVertices := map[string]bool{}

	// found status init
	isFound := false
	
	// if found then stop, else keep scraping to the eternity...
	for !isFound {
		// scrape links from currentVertex
		links := Scrape(currentVertex.Key)

		// add links as child to currentVertex
		for _, element := range links {
			g.AddVertex(element)
		}

		// add currentVertex to visited
		visitedVertices[currentVertex.Key] = true

		// enqueue child if not visited
		for _, v := range currentVertex.Vertices {
			if !visitedVertices[v.Key] {
				vertexQueue.enqueue(v)
			}
		}

		// dequeue processed links
		currentVertex = vertexQueue.dequeue()
		
		// if found change the status
		if currentVertex.Key == goalURL {
			isFound = true
		}
	}
	return *g, isFound
}
