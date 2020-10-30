import {Injectable} from '@angular/core';

declare var document: any;

interface Scripts {
  name: string;
  src: any;
  async: boolean;
}

const start = +new Date();
const elapsed = +new Date() % 600000;

const ScriptStore: Scripts[] = [
  {name: 'buysellads', src: 'https://cdn4.buysellads.net/pub/obscurifymusic.js?' + (start - elapsed), async: true},
];

@Injectable()
export class ScriptService {

  private scripts: any = {};

  constructor() {
      ScriptStore.forEach((script: any) => {
          this.scripts[script.name] = {
              loaded: false,
              src: script.src
          };
      });
  }

  load(...scripts: string[]) {
      const promises: any[] = [];
      scripts.forEach((script) => promises.push(this.loadScript(script)));
      return Promise.all(promises);
  }

  loadScript(name: string) {
      return new Promise((resolve, reject) => {
          if (this.scripts[name].loaded) {
              resolve({script: name, loaded: true, status: 'Already Loaded'});
          }
          else {
              //load script
              const script = document.createElement('script');
              script.type = 'text/javascript';
              script.async = this.scripts[name].async;
              script.src = this.scripts[name].src;
              if (script.readyState) {
                  script.onreadystatechange = () => {
                      if (script.readyState === 'loaded' || script.readyState === 'complete') {
                          script.onreadystatechange = null;
                          this.scripts[name].loaded = true;
                          resolve({script: name, loaded: true, status: 'Loaded'});
                      }
                  };
              } else {
                  script.onload = () => {
                      this.scripts[name].loaded = true;
                      resolve({script: name, loaded: true, status: 'Loaded'});
                  };
              }
              script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
              document.getElementsByTagName('head')[0].appendChild(script);
          }
      });
  }

}
