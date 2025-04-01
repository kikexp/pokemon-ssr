import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'page-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPageComponent { }
