package main

type node struct {
	vertex *Vertex
	next   *node
}

type queue struct {
	head *node
	tail *node
}

func (q *queue) enqueue(v *Vertex) {
	n := &node{vertex: v}
	if q.tail == nil {
		q.head = n
		q.tail = n
	} else {
		q.tail.next = n
		q.tail = n
	}
}

func (q *queue) dequeue() *Vertex {
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

func BFS(startVertex *Vertex, processVertex func(string)) {
	// Graph for stroring links
	// graph := NewDirectedGraph()
	vertexQueue := &queue{}
	visitedVertices := map[string]bool{}
	currentVertex := startVertex

	for {
		processVertex(currentVertex.Key)
		visitedVertices[currentVertex.Key] = true
		for _, v := range currentVertex.Vertices {
			if !visitedVertices[v.Key] {
				vertexQueue.enqueue(v)
			}
		}
		currentVertex = vertexQueue.dequeue()
		// Stop if empty (temporaty condition for now...)
		if currentVertex == nil {
			break
		}
	}
}
