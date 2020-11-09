import { Component, Input } from '@angular/core';
import { Activity } from '../../models/neo4j';

@Component({
  selector: 'app-activity-list-viewer',
  templateUrl: './activity-list-viewer.component.html',
  styleUrls: ['./activity-list-viewer.component.scss'],
})
export class ActivityListViewerComponent {
  @Input() activities: Activity[] = [];

  trackByFn(index: number) {
    return index;
  }
}
