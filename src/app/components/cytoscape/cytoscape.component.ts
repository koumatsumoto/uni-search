import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CytoscapeService } from '../../services/cytoscape/cytoscape.service';

@Component({
  selector: 'app-cytoscape',
  templateUrl: './cytoscape.component.html',
  styleUrls: ['./cytoscape.component.scss'],
})
export class CytoscapeComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  constructor(private readonly service: CytoscapeService) {}

  async ngAfterViewInit() {
    await this.service.apply(this.container.nativeElement);
  }
}
