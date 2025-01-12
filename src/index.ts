import app from './app';
import { initializeDB } from './config/db';
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await initializeDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
