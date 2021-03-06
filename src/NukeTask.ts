import { GulpTask } from './GulpTask';
import gulp = require('gulp');

export interface INukeConfig {
}

export class NukeTask extends GulpTask<INukeConfig> {
  public name: string = 'nuke';

  public taskConfig: INukeConfig = {
  };

  public executeTask(
    gulp: gulp.Gulp,
    completeCallback: (result?: Object) => void
  ): void {
    /* tslint:disable:typedef */
    const del = require('del');
    /* tslint:disable:typedef */

    const { distFolder, libFolder, libAMDFolder, tempFolder } = this.buildConfig;
    let nukePaths = [
      distFolder,
      libAMDFolder,
      libFolder,
      tempFolder
    ];

    // Give each registered task an opportunity to add their own nuke paths.
    for (const executable of this.buildConfig.uniqueTasks) {
      if (executable.getNukeMatch) {
        // Set the build config, as tasks need this to build up paths
        nukePaths = nukePaths.concat(executable.getNukeMatch(this.buildConfig));
      }
    }

    let uniquePaths: { [key: string]: string } = {};

    // Create dictionary of unique paths. (Could be replaced with ES6 set.)
    nukePaths.forEach(path => {
      if (!!path) {
        uniquePaths[path] = path;
      }
    });

    // Reset nukePaths to only unique non-empty paths.
    nukePaths = [];
    for (let path in uniquePaths) {
      if (uniquePaths.hasOwnProperty(path)) {
        nukePaths.push(path);
      }
    }

    del(nukePaths)
      .then(() => completeCallback())
      .catch((error) => completeCallback(error));
  }
}
