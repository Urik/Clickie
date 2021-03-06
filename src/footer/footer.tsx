import React from 'react';

import linkedIn from './linkedin-log.png';
import './footer.scss';

export function Footer() {
  return (
    <section className="section app-footer">
      <div className="app-footer">
        <p>
          Created by Uri Berman Kleiner
          <a
            href="https://www.linkedin.com/in/bermanuri"
            rel="noopener noreferrer"
            target="_blank"
            title="I'm on LinkedIn!"
          >
            <img className="linkedin-logo" alt="linkedin logo" src={linkedIn} />
          </a>
        </p>
        <p>
          Icons made by <a href="https://www.flaticon.com/authors/smashicons">Smashicons</a> and <a href="https://www.flaticon.com/authors/freepik">Freepik</a> from <a href="https://www.flaticon.com/">www.flaticon.com</a>
        </p>
        <p>Thanks to <a href="https://github.com/dbkaplun/driftless" rel="noopener noreferrer" target="_blank">Driftless</a> for the high accuracy interval implementation!</p>
        <p>Thanks to <a href="https://github.com/goldfire/howler.js/" rel="noopener noreferrer" target="_blank">Howler.js</a> for its great audio playback library for Javascript!</p>
        <p>Thanks to <a href="https://bulma.io/" rel="noopener noreferrer" target="_blank">Bulma</a> for the lovely CSS framework!</p>
      </div>
    </section>
  );
}
