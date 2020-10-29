import { Injectable } from '@angular/core';
import { Neo4jRepositoryService } from '../neo4j/neo4j-repository.service';

// tslint:disable-next-line
const cytoscape = (window as any)['cytoscape'];

@Injectable({
  providedIn: 'root',
})
export class CytoscapeService {
  constructor(private readonly repository: Neo4jRepositoryService) {}

  async apply(container: HTMLDivElement) {
    const data = await this.repository.getAll();
    const style = [
      { selector: 'node[label = "WebContents"]', css: { 'background-color': '#6FB1FC', content: 'data(title)' } },
      { selector: 'node[label = "Word"]', css: { 'background-color': '#6FB1FC', content: 'data(name)' } },
      { selector: 'edge', css: { content: 'data(relationship)', 'target-arrow-shape': 'triangle' } },
    ];

    const cy = cytoscape({
      container,
      style,
      elements: {
        nodes: data.nodes.map((obj) => ({ data: obj })),
        edges: data.relationships.map((obj) => ({ data: obj })),
      },
    });

    // debug
    console.log('[dev] cytoscape applied', cy);
  }
}
