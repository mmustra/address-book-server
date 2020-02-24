import * as _ from 'lodash';
import { ConfigService } from 'nestjs-config';
import { LoggerModule as LoggerModuleCOnfig, Params } from 'nestjs-pino';
import * as rfs from 'rotating-file-stream';

const LoggerModule = LoggerModuleCOnfig.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const logConfig = configService.get('logger');

    const fileNameGenerator = (date, index) => {
      if (!date) {
        return `${logConfig.folderName}/current.log`;
      }
      const simpleDate = date.toISOString().split('T')[0];
      return `${logConfig.folderName}/${simpleDate}_${index || 1}.log`;
    };

    const fileStream = logConfig.activateLog
      ? rfs.createStream(fileNameGenerator, {
          size: logConfig.fileSize,
          interval: logConfig.interval,
          maxFiles: logConfig.maxFiles,
          compress: 'gzip',
          history: `${logConfig.folderName}/history.txt`,
        })
      : { write: _.noop };

    const logger: Params = {
      pinoHttp: [
        {
          enabled: logConfig.activateLog,
          useLevelLabels: true,
          timestamp: () => {
            return `, "time":"${new Date().toISOString()}"`;
          },
        },
        fileStream,
      ],
    };

    return logger;
  },
});

export { LoggerModule };
