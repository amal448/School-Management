import { config } from './config/app.config';
import mongoose from 'mongoose';
import app from './app';

mongoose.connect(config.database.uri)
  .then(() => {
    app.listen(config.server.port, () => {
      console.log(`🚀 Server running in ${config.server.env} mode on port ${config.server.port}`);
    });
  }).catch((error)=>console.log(error)
  );