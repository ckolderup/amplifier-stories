// things this script should do:

// 1. go through the full list of .json files and build
// a index.js file with an array of filenames (minus the extension)

// 2. do some basic JSON linting on all the files

// 3. look for any of apple music, spotify, or itunes service URLs
//    and use that URL to look up information on the Odesli API:
//      - urls for other services
//      - album art
//      - artist & song name

import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';

const ODESLI_API ='https://api.song.link/v1-alpha.1/links?url=';

const expandedData = await readFile(process.argv[2]).then(async f => {
  const fileData = JSON.parse(f.toString());
  const stories = fileData.stories.map(async s =>
    fetch(ODESLI_API + encodeURIComponent(s.link)).then(response =>
      response.json().then(apiData => {
        const thumbnailUrl = Object.values(apiData.entitiesByUniqueId).reduce((m, k) => (m.thumbnailHeight > k.thumbnailHeight) ? m : k)?.thumbnailUrl

        return {
          ...s,
          thumbnailUrl: thumbnailUrl,
          links: {
            appleMusic: apiData.linksByPlatform?.appleMusic?.url,
            spotify: apiData.linksByPlatform?.spotify?.url,
            youtube: apiData.linksByPlatform?.youtube?.url
          }
        }
      })
    )
  );
  return {...fileData, stories: await Promise.all(stories)};

}).catch((e)=> {
  console.log(e.message);
  process.exit();
});

await writeFile(process.argv[2], JSON.stringify(expandedData, null, 2));
