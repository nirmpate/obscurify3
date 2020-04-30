import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-obscurity-graph',
  templateUrl: './obscurity-graph.component.html',
  styleUrls: ['./obscurity-graph.component.scss']
})
export class ObscurityGraphComponent {
  @Input() data;
  @ViewChild('globalAvgBar', {static: true}) globalBar;
  @ViewChild('countryAvgBar', {static: true}) countryBar;
  @ViewChild('allTimeBar', {static: true}) allTimeBar;
  @ViewChild('recentBar', {static: true}) recentBar;

  displayName: string;
  imageURL = '';
  country = '';
  allTimeObscurifyScore: number;
  recentObscurifyScore: number;
  countryAverageScore: number;
  globalAverageScore: number;
  percentileByCountry: number;
  userCountByCountry: number;
  totalUserCount: number;
  topGenres: any[];
  longTermAudioFeatures: any;
  shortTermAudioFeatures: any;
  audioFeatureAverages: any;
  doneLoading = false;
  scoreArray: any[];
  highestScoreElement;
  highestScore: number;
  lowestScore: number;
  barActive = false;

  constructor(private renderer: Renderer2, public el: ElementRef, public sanitizer: DomSanitizer) {


    // events.subscribe('graphInit', () => {

    //   this.setGraph();
    // });

  }

  // ngOnInit(): void {
  //   this.allTimeObscurifyScore = this.data.allTimeObscurifyScore;
  //   this.recentObscurifyScore = this.data.recentObscurifyScore;
  //   this.globalAverageScore = this.data.globalAverageScore;
  //   this.countryAverageScore = this.data.countryAverageScore;

  //   this.scoreArray = [[this.countryAverageScore, this.countryBar],
  //   [this.globalAverageScore, this.globalBar],
  //   [this.allTimeObscurifyScore, this.allTimeBar],
  //   [this.recentObscurifyScore, this.recentBar]];
  // }



  // setGraph(): void {
  //   function sort(array) {
  //     array.sort((a , b) => {
  //       return b[0] - a[0];
  //     });
  //   }

  //   if (!this.doneLoading) {

  //     sort(this.scoreArray);
  //     const sortedArray = this.scoreArray;
  //     this.highestScore = sortedArray[0][0];

  //     this.renderer.setStyle(sortedArray[0][1].nativeElement, 'height', '100%');
  //     this.barActive = true;
  //     // highest score from array
  //     sortedArray.shift();
  //     let graphHeight;

  //     sortedArray.forEach((val) => {
  //       graphHeight = 100 - (Math.round(((this.highestScore / val[0]) - 1) * 100));
  //       this.renderer.setStyle(val[1].nativeElement, 'height', String(graphHeight) + '%');

  //     });
  //     this.doneLoading = true;
  //   }
  // }
}
