import { Filter } from 'bad-words';
import config from "../src/config";
import { Settings } from "../src/database";

const filter = new Filter({
  placeHolder: config.filter.placeholder
});

Settings.get(config.settings.keys.badWords)
  .then((data) => {
    if (data && data.words) {
      filter.addWords(...data.words);
    }
  });

export default filter;