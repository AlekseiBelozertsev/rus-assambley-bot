import { data } from "../data/data.js";

export class Launcher {
  constructor(bot, port, appUrl) {
    this.port = port;
    this.appUrl = appUrl;
    this.bot = bot;
  }

  launch(launcherType) {
    switch (launcherType) {
      case "dev":
        this.bot
          .launch()
          .then(() => {
            console.log(data.botIsRunning + " " + this.port);
          })
          .catch((error) => {
            console.error(data.botLaunchError, error);
          });
        break;

      case "prod":
        this.bot
          .launch({
            webhook: {
              domain: this.appUrl,
              port: this.port,
            },
          })
          .then(() => {
            console.log(data.botIsRunning + " " + this.port);
          });
        break;
    }
  }
}
