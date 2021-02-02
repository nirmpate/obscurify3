import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IntersectionObserverService } from 'src/app/services/intersectionObserver';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { DomSanitizer } from '@angular/platform-browser';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';

@Component({
  selector: 'app-moods-graph',
  templateUrl: './moods-graph.component.html',
  styleUrls: ['./moods-graph.component.scss'],
  providers: [IntersectionObserverService]
})
export class MoodsGraphComponent implements OnInit, AfterViewInit {
  @Input() data;
  @Output() audioData = new EventEmitter<{}>();
  @ViewChild('happinessGraphElement') happinessGraphElement: ElementRef;
  @ViewChild('danceabilityGraphElement') danceabilityGraphElement: ElementRef;
  @ViewChild('energyGraphElement') energyGraphElement: ElementRef;
  @ViewChild('acousticnessGraphElement') acousticnessGraphElement: ElementRef;

  constructor(
    public element: ElementRef,
    public intersectionObserverService: IntersectionObserverService,
    public platform: Platform,
    public sanitizer: DomSanitizer,
    private obscurifyFunc: ObscurityFuncs
    ) { }

  public show = false;

  public happinessGraph: Chart;
  public danceabilityGraph: Chart;
  public energyGraph: Chart;
  public acousticnessGraph: Chart;

  private intersectionObserverSubs: Subscription;
  public longTermAudioFeatures = {
    danceability : 0,
    energy : 0,
    happiness : 0,
    acousticness : 0,
    tracksCounted : 0
  };
  public shortTermAudioFeatures = {
    danceability : 0,
    energy : 0,
    happiness : 0,
    acousticness : 0,
    tracksCounted : 0
  };

  public acousticnessCurrentText: string;
  public acousticnessAllTimeText: string;
  public energyCurrentText: string;
  public energyAllTimeText: string;
  public danceabilityCurrentText: string;
  public danceabilityAllTimeText: string;
  public happinessCurrentText: string;
  public happinessAllTimeText: string;

  public happinessTrack: any;
  public energyTrack: any;
  public danceabilityTrack: any;
  public acousticnessTrack: any;

  ngOnChanges(changes: SimpleChanges) {
    if(!changes.data.firstChange && changes.data.previousValue.country != changes.data.currentValue.country) {
      this.happinessGraph.destroy();
      this.danceabilityGraph.destroy();
      this.energyGraph.destroy();
      this.acousticnessGraph.destroy();
      this.createAudioFeatures(false);
    };
  }

  ngOnInit() {
      this.getMoodTracks();
  }

  private getMoodTracks() {
      if (
          this.data.currentTracks && this.data.shortTermAudioFeaturesPerTrack &&
          this.data.currentTracks.length == this.data.shortTermAudioFeaturesPerTrack.length
      ) {
          this.happinessTrack = this.findTrackByAudioFeature("valence", this.data.currentTracks, this.data.shortTermAudioFeaturesPerTrack);
          this.energyTrack = this.findTrackByAudioFeature("energy", this.data.currentTracks, this.data.shortTermAudioFeaturesPerTrack);
          this.danceabilityTrack = this.findTrackByAudioFeature("danceability", this.data.currentTracks, this.data.shortTermAudioFeaturesPerTrack);
          this.acousticnessTrack = this.findTrackByAudioFeature("acousticness", this.data.currentTracks, this.data.shortTermAudioFeaturesPerTrack);
      }

  }

  private createAudioFeatures(emitAudioFeatureFlag) {
    if (this.data.shortTermAudioFeatures) {
        this.shortTermAudioFeatures = this.data.shortTermAudioFeatures;
    }
    if (this.data.longTermAudioFeatures) {
        this.longTermAudioFeatures = this.data.longTermAudioFeatures;
    }
    if (emitAudioFeatureFlag) {
        this.audioData.emit(this.longTermAudioFeatures);
    }
    this.happinessCurrentText = this.obscurifyFunc.calculateMoodText(this.shortTermAudioFeatures.happiness, this.data.audioFeatureAverages.happiness.N);
    this.happinessAllTimeText = this.obscurifyFunc.calculateMoodText(this.longTermAudioFeatures.happiness, this.data.audioFeatureAverages.happiness.N);
    this.energyCurrentText = this.obscurifyFunc.calculateMoodText(this.shortTermAudioFeatures.energy, this.data.audioFeatureAverages.energy.N);
    this.energyAllTimeText = this.obscurifyFunc.calculateMoodText(this.longTermAudioFeatures.energy, this.data.audioFeatureAverages.energy.N);
    this.danceabilityCurrentText = this.obscurifyFunc.calculateMoodText(this.shortTermAudioFeatures.danceability, this.data.audioFeatureAverages.danceability.N);
    this.danceabilityAllTimeText = this.obscurifyFunc.calculateMoodText(this.longTermAudioFeatures.danceability, this.data.audioFeatureAverages.danceability.N);
    this.acousticnessCurrentText = this.obscurifyFunc.calculateMoodText(this.shortTermAudioFeatures.acousticness, this.data.audioFeatureAverages.acousticness.N);
    this.acousticnessAllTimeText = this.obscurifyFunc.calculateMoodText(this.longTermAudioFeatures.acousticness, this.data.audioFeatureAverages.acousticness.N);

    const data = {
        labels: ['Your Current', 'Your All Time', this.data.country + ' Avg'],
        datasets: [{
            data: [],
            backgroundColor: [
                '#5AA9E6',
                'rgba(0,0,0,0.9)',
                '#A9E5AC'
            ],
            borderColor: [
                '#fefefe',
                '#fefefe',
                '#fefefe'
            ],
            borderWidth: 1,
            barThickness: 50
        }]
    };
    const option = {
      global: {
        defaultFontColor: '#000',
        defaultFontFamily	: '"Helvetica Neue", sans-serif'
      },
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 3000
      },
      tooltips: {
        enabled: false
      },
      legend: {
        display: false
      },
      dataset: {
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            fontColor: '#000'
          },
          ticks: {
            fontFamily: '"Helvetica Neue", sans-serif',
            fontColor: '#000',
            beginAtZero: true,
            stepSize: 0.2,
            fontStyle	: 'bold'

          },
          gridLines: {
            display: false
          },
        }],
        xAxes: [{
            ticks: {
              fontFamily: '"Helvetica Neue", sans-serif',
              fontColor: '#000',
              fontSize: '12',
              fontStyle	: 'bold'
            },
            gridLines: {
              display: false
            }
        }]
      }
    };
    if (this.platform.isBrowser) {
      const happinessGraphContext = this.happinessGraphElement.nativeElement;
      const happinessData = data;
      happinessData.datasets[0].data = [
        this.shortTermAudioFeatures.happiness,
        this.longTermAudioFeatures.happiness,
        this.data.audioFeatureAverages.happiness.N
      ];
      this.happinessGraph = new Chart(happinessGraphContext, {
        type: 'bar',
        data: happinessData,
        options: option
      });

      const danceabilityGraphContext = this.danceabilityGraphElement.nativeElement;
      const danceabilityData = data;
      danceabilityData.datasets[0].data = [
        this.shortTermAudioFeatures.danceability,
        this.longTermAudioFeatures.danceability,
        this.data.audioFeatureAverages.danceability.N
      ];

      this.danceabilityGraph = new Chart(danceabilityGraphContext, {
        type: 'bar',
        data: danceabilityData,
        options: option
      });

      const energyGraphContext = this.energyGraphElement.nativeElement;
      const energyData = data;
      energyData.datasets[0].data = [
        this.shortTermAudioFeatures.energy,
        this.longTermAudioFeatures.energy,
        this.data.audioFeatureAverages.energy.N
      ];

      this.energyGraph = new Chart(energyGraphContext, {
        type: 'bar',
        data: energyData,
        options: option
      });
      const acousticnessGraphContext = this.acousticnessGraphElement.nativeElement;
      const acousticnessData = data;
      acousticnessData.datasets[0].data = [
        this.shortTermAudioFeatures.acousticness,
        this.longTermAudioFeatures.acousticness,
        this.data.audioFeatureAverages.acousticness.N
      ];

      this.acousticnessGraph = new Chart(acousticnessGraphContext, {
        type: 'bar',
        data: acousticnessData,
        options: option
      });
    }


  }

  private findTrackByAudioFeature(audioFeature, trackIDs, trackAudioFeatures) {
      let threshold = 0.9;
      for (let threshold = 0.9; threshold > 0.3; threshold -= 0.05) {
          for (let i = 0; i < trackAudioFeatures.length; i++) {
              if (trackAudioFeatures[i][audioFeature] >= threshold) {
                  return trackIDs[i];
              }
          }
      }
      return null;
  }


  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.20
    });
    this.intersectionObserverSubs = this.intersectionObserverService
    .getSubject()
    .subscribe(el => {
      if (el.isIntersecting) {
        this.show = true;
      }
    });
    this.createAudioFeatures(true);
  }

}
