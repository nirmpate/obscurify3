import { Component, OnInit, Output, EventEmitter, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IntersectionObserverService } from 'src/app/services/intersectionObserver';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { Platform } from '@angular/cdk/platform';

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
    public platform: Platform) { }

  public show = false;

  public happinessGraph: Chart;
  public danceabilityGraph: Chart;
  public energyGraph: Chart;
  public acousticnessGraph: Chart;

  private intersectionObserverSubs: Subscription;
  private longTermAudioFeatures = {
    danceability : 0,
    energy : 0,
    happiness : 0,
    acousticness : 0,
    tracksCounted : 0
  };
  private shortTermAudioFeatures = {
    danceability : 0,
    energy : 0,
    happiness : 0,
    acousticness : 0,
    tracksCounted : 0
  };

  ngOnChanges(changes: SimpleChanges) {
    if(!changes.data.firstChange && changes.data.previousValue.country != changes.data.currentValue.country) {
      this.happinessGraph.destroy();
      this.danceabilityGraph.destroy();
      this.energyGraph.destroy();
      this.acousticnessGraph.destroy();
      this.createAudioFeatures();
    };
  }

  ngOnInit() {
    this.audioData.emit(this.longTermAudioFeatures);
  }

  private createAudioFeatures() {
    this.longTermAudioFeatures = {
      danceability : 0,
      energy : 0,
      happiness : 0,
      acousticness : 0,
      tracksCounted : 0
    };
    this.shortTermAudioFeatures = {
      danceability : 0,
      energy : 0,
      happiness : 0,
      acousticness : 0,
      tracksCounted : 0
    };
    for (const track of this.data.userAudioFeatures[0].audio_features) {
      if (track != null) {
        this.longTermAudioFeatures.danceability += track.danceability;
        this.longTermAudioFeatures.energy += track.energy;
        this.longTermAudioFeatures.happiness += track.valence;
        this.longTermAudioFeatures.acousticness += track.acousticness;
        this.longTermAudioFeatures.tracksCounted += 1;
      }
    }

    this.longTermAudioFeatures.danceability /= this.longTermAudioFeatures.tracksCounted;
    this.longTermAudioFeatures.energy /= this.longTermAudioFeatures.tracksCounted;
    this.longTermAudioFeatures.happiness /= this.longTermAudioFeatures.tracksCounted;
    this.longTermAudioFeatures.acousticness /= this.longTermAudioFeatures.tracksCounted;

    for (const track of this.data.userAudioFeatures[1].audio_features) {
      if (track != null) {
        this.shortTermAudioFeatures.danceability += track.danceability;
        this.shortTermAudioFeatures.energy += track.energy;
        this.shortTermAudioFeatures.happiness += track.valence;
        this.shortTermAudioFeatures.acousticness += track.acousticness;
        this.shortTermAudioFeatures.tracksCounted += 1;
      }
    }

    this.shortTermAudioFeatures.danceability /= this.shortTermAudioFeatures.tracksCounted;
    this.shortTermAudioFeatures.energy /= this.shortTermAudioFeatures.tracksCounted;
    this.shortTermAudioFeatures.happiness /= this.shortTermAudioFeatures.tracksCounted;
    this.shortTermAudioFeatures.acousticness /= this.shortTermAudioFeatures.tracksCounted;

    const data = {
        labels: ['Current', 'All Time', this.data.country + ' Avg'],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    }
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
      scales: {
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            fontColor: '#000'
          },
          ticks: {
            fontColor: '#000',
            beginAtZero: true,
            stepSize: 0.2
          },
          gridLines: {
            display: false
          },
        }],
        xAxes: [{
            barPercentage: 1.0,
            categoryPercentage: 1.0,
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


  ngAfterViewInit(): void {
    this.intersectionObserverService.init(this.element.nativeElement, {
      threshold: 0.30
    });
    this.intersectionObserverSubs = this.intersectionObserverService
    .getSubject()
    .subscribe(el => {
      if (el.isIntersecting) {
        this.show = true;
      } else {
        this.show = false;
      }
    });
    this.createAudioFeatures();
  }

}
