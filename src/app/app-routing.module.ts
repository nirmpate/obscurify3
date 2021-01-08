import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/spotifyAuth';
import { SpotifyAuthComponent } from './components/spotify-auth/spotify-auth.component';
import { AboutComponent } from './components/about/about.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { LoginComponent } from './login/login/login.component';
import { BlogHomeComponent } from './blog-home/blog-home.component';


const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'authorized',
    canActivate: [ AuthGuard ],
    component: SpotifyAuthComponent
  },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule), component: BlogHomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
