package datastructure

type Vertex struct {
	Key string
	Vertices map[string]*Vertex
}

func NewVertex(key string) *Vertex {
	return &Vertex{
		Key:      key,
		Vertices: map[string]*Vertex{},
	}
}

type Graph struct {
	Vertices map[string]*Vertex
}

func NewDirectedGraph() *Graph {
	return &Graph{
		Vertices: map[string]*Vertex{},
	}
}

func (g *Graph) AddVertex(key string) {
	v := NewVertex(key)
	g.Vertices[key] = v
}

func (g *Graph) AddEdge(k1, k2 string) {
	v1 := g.Vertices[k1]
	v2 := g.Vertices[k2]

	if v1 == nil || v2 == nil {
		panic("simpul tidak ada!")
	}

	if _, ok := v1.Vertices[v2.Key]; ok {
		return
	}

	v1.Vertices[v2.Key] = v2

	g.Vertices[v1.Key] = v1
	g.Vertices[v2.Key] = v2
}
