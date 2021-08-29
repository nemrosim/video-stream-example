import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/file';
import chunkRoutes from './routes/chunk';
import segmentRoutes from './routes/segment';

const app = express();
app.use(cors());

app.use(fileRoutes);
app.use(chunkRoutes);
app.use(segmentRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});
