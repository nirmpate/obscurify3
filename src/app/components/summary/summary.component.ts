import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

    country: string;
    percentileByCountryAllTime: string;
    allTimeArtists: any[];
    allTimeTracks: any[];
    currentArtists: any[];
    currentTracks: any[];
    audioFeatureAverages: any[];
    longTermAudioFeatures: any;
    shortTermAudioFeatures: any;
    topGenres: any[];

    constructor(
        public dialogRef: MatDialogRef<SummaryComponent>,
        public obscurifyFunc: ObscurityFuncs,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(data);
        this.percentileByCountryAllTime = data.percentileByCountryAllTime;
        this.country = data.country;
        this.allTimeArtists = data.allTimeArtists.length > 5 ? data.allTimeArtists.slice(0,5) : data.allTimeArtists;
        this.allTimeTracks = data.allTimeTracks.length > 5 ? data.allTimeTracks.slice(0,5) : data.allTimeTracks;
        this.currentArtists = data.currentArtists.length > 5 ? data.currentArtists.slice(0,5) : data.currentArtists;
        this.currentTracks = data.currentTracks.length > 5 ? data.currentTracks.slice(0,5) : data.currentTracks;
        this.audioFeatureAverages = data.audioFeatureAverages;
        this.longTermAudioFeatures = data.longTermAudioFeatures;
        this.shortTermAudioFeatures = data.shortTermAudioFeatures;
        this.topGenres = data.topGenres.length > 6 ? data.topGenres.slice(0,6) : data.topGenres;
    }

    close() {
        this.dialogRef.close();
    }

    ngOnInit(): void {
    }

}