import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DomSanitizer } from '@angular/platform-browser';
import { ObscurityFuncs } from 'src/app/utilities/obscurityFuncs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

    country: string;
    percentileByCountryAllTime: string;
    percentileByCountryRecent: string;
    allTimeArtists: any[];
    allTimeTracks: any[];
    currentArtists: any[];
    currentTracks: any[];
    audioFeatureAverages: any[];
    longTermAudioFeatures: any;
    shortTermAudioFeatures: any;
    topGenresAllTime: any[];
    topGenresCurrent: any[];
    tabGroup: any;
    currentSelectedTab = "All Time";

    constructor(
        public dialogRef: MatDialogRef<SummaryComponent>,
        public obscurifyFunc: ObscurityFuncs,
        public sanitizer: DomSanitizer,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.percentileByCountryAllTime = data.percentileByCountryAllTime;
        this.percentileByCountryRecent = data.percentileByCountryRecent;
        this.country = data.country;
        this.allTimeArtists = data.allTimeArtists.length > 5 ? data.allTimeArtists.slice(0, 5) : data.allTimeArtists;
        this.allTimeTracks = data.allTimeTracks.length > 5 ? data.allTimeTracks.slice(0, 5) : data.allTimeTracks;
        this.currentArtists = data.currentArtists.length > 5 ? data.currentArtists.slice(0, 5) : data.currentArtists;
        this.currentTracks = data.currentTracks.length > 5 ? data.currentTracks.slice(0, 5) : data.currentTracks;
        this.audioFeatureAverages = data.audioFeatureAverages;
        this.longTermAudioFeatures = data.longTermAudioFeatures;
        this.shortTermAudioFeatures = data.shortTermAudioFeatures;
        this.topGenresAllTime = data.topGenresAllTime.length > 6 ? data.topGenresAllTime.slice(0, 5) : data.topGenresAllTime;
        this.topGenresCurrent = data.topGenresCurrent.length > 6 ? data.topGenresCurrent.slice(0, 5) : data.topGenresCurrent;
    }

    close() {
        this.dialogRef.close();
    }

    ngOnInit(): void {
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.currentSelectedTab = tabChangeEvent.tab.textLabel;
    }

}
