module.exports.Movie = Movie;

function now() {
  return Date.now() / 1000;
}

class Movie {

  constructor(socket) {
    this.startTime = 0;
    this.isPlaying = false;
    this.elapsedTime = 0;
    this.socket = socket;
  }

  play() {
    this.startTime = now();
    this.isPlaying = true;
  }

  pause() {
    this.elapsedTime += now() - this.startTime;
    this.isPlaying = false;
  }

  getElapsedTime() {
    var ret = this.elapsedTime;
    if(this.isPlaying) ret += (now() - this.startTime);
    return ret;
  }

}
