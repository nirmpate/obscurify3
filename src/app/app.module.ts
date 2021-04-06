import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformModule } from '@angular/cdk/platform';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { IntroComponent } from './components/intro/intro.component';
import { TopGenresComponent } from './components/top-genres/top-genres.component';
import { ObscurityRatingComponent } from './components/obscurity-rating/obscurity-rating.component';
import { ObscurityGraphComponent } from './components/obscurity-graph/obscurity-graph.component';
import { ArtistListComponent } from './components/artist/artist-list/artist-list.component';
import { ArtistCardComponent } from './components/artist/artist-card/artist-card.component';
import { ArtistNavComponent } from './components/artist/artist-nav/artist-nav.component';
import { MoodsGraphComponent } from './components/moods-graph/moods-graph.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { AuthService, TokenService, AuthGuard, SpotifyAuthInterceptor } from './services/spotifyAuth';
import { SpotifyAuthComponent } from './components/spotify-auth/spotify-auth.component';
import { InfoService } from './services/infoService';
import { ObscurityFuncs } from './utilities/obscurityFuncs';
import { TrackCardComponent } from './components/artist/track-card/track-card.component';
import { SpotifyService } from './services/spotifyService';
import { AboutComponent } from './components/about/about.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { SummaryComponent } from './components/summary/summary.component';
import { ObscurifyService } from './services/obscurifyService';
import { BrowserCheck } from './services/browserCheck';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SpyOnDirective } from './directives/spy-on.directive';
import { ArticlesModule } from './articles/articles.module';
import { LoginModule } from './login/login.module';
import { GlobalModule } from './global/global.module';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { BlogHomeComponent } from './blog-home/blog-home.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from './services/userService';
import { ShareProfileComponent } from './components/share-profile/share-profile.component';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { LoaderComponent } from './components/loader/loader.component';
import { YearBreakdownComponent } from './components/year-breakdown/year-breakdown.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import { SponsoredComponent } from './components/sponsored/sponsored.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IntroComponent,
    TopGenresComponent,
    ObscurityRatingComponent,
    ObscurityGraphComponent,
    ArtistListComponent,
    ArtistCardComponent,
    ArtistNavComponent,
    MoodsGraphComponent,
    RecommendationsComponent,
    SpotifyAuthComponent,
    TrackCardComponent,
    AboutComponent,
    PrivacyComponent,
    SpyOnDirective,
    BlogHomeComponent,
    SummaryComponent,
    PublicProfileComponent,
    NavMenuComponent,
    ShareProfileComponent,
    LoaderComponent,
    YearBreakdownComponent,
    SponsoredComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    GlobalModule,
    ArticlesModule,
    LoginModule,
    FlexLayoutModule,
    MatChipsModule,
    MatButtonModule,
    AppRoutingModule,
    PlatformModule,
    MatInputModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSelectModule,
    FormsModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    ClipboardModule,
    MatMenuModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatTabsModule,
    MatCardModule,
    MatButtonToggleModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ScullyLibModule,
  ],
  providers: [
    UserService,
    ObscurityFuncs,
    AuthService,
    TokenService,
    AuthGuard,
    InfoService,
    ObscurifyService,
    SpotifyService,
    BrowserCheck,
    [{
      provide:  HTTP_INTERCEPTORS,
      useClass:  SpotifyAuthInterceptor,
      multi:  true
    }]],
  bootstrap: [AppComponent]
})
export class AppModule { }
