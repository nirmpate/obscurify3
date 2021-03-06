import { Injectable } from '@angular/core';

@Injectable()
export class ObscurityFuncs {
    findRandomGenres(artist) {
        if (artist.genres.length > 1) {
            const random1 = Math.floor(Math.random() * artist.genres.length);
            let random2 = Math.floor(Math.random() * artist.genres.length);
            while (random1 === random2) {
                random2 = Math.floor(Math.random() * artist.genres.length);
            }
            const returnData = { randomGenre1 : artist.genres[random1], randomGenre2 : artist.genres[random2] };
            // check to see if these genres contain the word "christmas", if so remove it
            if (returnData.randomGenre1.indexOf('christmas') > -1) {
                returnData.randomGenre1 = returnData.randomGenre1.replace('christmas','');
            }
            if (returnData.randomGenre2.indexOf('christmas') > -1) {
                returnData.randomGenre2 = returnData.randomGenre2.replace('christmas','');
            }
            return returnData;
        } else if (artist.genres.length == 1) {
            return { randomGenre1 : artist.genres[0], randomGenre2 : null };
        } else {
            return { randomGenre1 : null, randomGenre2 : null };
        }
  }

  findTopGenres(artists) {
      const genres: any = {};
      const topGenres: any = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < artists.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let y = 0; y < artists[i].genres.length; y++) {
          if (genres[artists[i].genres[y]] != null) {
          genres[artists[i].genres[y]] = genres[artists[i].genres[y]] + 1;
        } else {
          genres[artists[i].genres[y]] = 1;
          }
        }
      }
      for (const g in genres) {
        if (genres.hasOwnProperty(g) && genres[g] > 2) {
          topGenres.push([g, genres[g]]);
        }
      }
      topGenres.sort(this.comparator);
      return [...topGenres.slice(0, 10)];
  }

  calculateAudioFeatureAverages(audioFeatures) {
    let calculatedAudioFeatures = {
        danceability : 0,
        energy : 0,
        happiness : 0,
        acousticness : 0,
        tracksCounted : 0
    };
    for (const track of audioFeatures) {
        if (track != null) {
            calculatedAudioFeatures.danceability += track.danceability;
            calculatedAudioFeatures.energy += track.energy;
            calculatedAudioFeatures.happiness += track.valence;
            calculatedAudioFeatures.acousticness += track.acousticness;
            calculatedAudioFeatures.tracksCounted += 1;
        }
    }
    calculatedAudioFeatures.danceability /= calculatedAudioFeatures.tracksCounted;
    calculatedAudioFeatures.energy /= calculatedAudioFeatures.tracksCounted;
    calculatedAudioFeatures.happiness /= calculatedAudioFeatures.tracksCounted;
    calculatedAudioFeatures.acousticness /= calculatedAudioFeatures.tracksCounted;
    return calculatedAudioFeatures;
  }

  calculateMoodText(userFeatureAverage, obscurifyFeatureAverage) {
      if (!isNaN(userFeatureAverage) && !isNaN(obscurifyFeatureAverage)) {
          const diff = userFeatureAverage - obscurifyFeatureAverage;
          if (diff > 0.01) {
              return (diff * 100).toFixed(1) + "% higher than";
          } else if (diff < -0.01) {
              return (Math.abs(diff) * 100).toFixed(1) + "% lower than";
          } else {
              return " same as ";
          }
      } else {
          return "";
      }
  }

  sortBlogPosts(links) {
      const sortedLinks = links.filter(link => link.published).sort(this.blogDateComparator);
      const featuredPostIndicies = [];
      let featuredPostIndex = -1;
      for (let i = 0; i < sortedLinks.length; i++) {
          if (sortedLinks[i].featured === "yes") {
              featuredPostIndicies.push(i)
          }
      }
      if (featuredPostIndicies.length > 0) {
          featuredPostIndex = featuredPostIndicies[
            //   Math.floor(Math.random() * featuredPostIndicies.length)
            0
          ];
      }
      if (featuredPostIndex > -1) {
          const featuredPost = sortedLinks[featuredPostIndex];
          sortedLinks.splice(featuredPostIndex, 1);
          sortedLinks.unshift(featuredPost);
          return sortedLinks;
      } else {
          return sortedLinks;
      }
  }

  findStarRating(popularity) {
    switch (true) {
        case (popularity >= 90):
            return '★★★★★';
        case (popularity >= 80):
            return '★★★★';
        case (popularity >= 65):
            return '★★★';
        case (popularity >= 50):
            return '★★';
        case (popularity >= 35):
            return '★';
        default:
            return '';
      }
  }

  blogDateComparator(a, b) {
      if (new Date(a.isoDate) > new Date(b.isoDate)) { return -1; }
      if (new Date(a.isoDate) < new Date(b.isoDate)) { return 1; }
      return 0;
  }

  comparator(a, b) {
    if (a[1] > b[1]) { return -1; }
    if (a[1] < b[1]) { return 1; }
    return 0;
  }
}

export default ObscurityFuncs;
