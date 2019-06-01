var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
module.exports = function () {
  let defaultConfig = useDefaultConfig;
  defaultConfig["prod"] = defaultConfig["dev"];
	return defaultConfig;
};