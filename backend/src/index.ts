import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Sistem Pemdes Kadurama API',
    timestamp: new Date().toISOString()
  });
});

// Mock endpoint for village stats
app.get('/api/stats', (req: Request, res: Response) => {
  res.json({
    desa: 'Kadurama',
    kecamatan: 'Ciawigebang',
    kabupaten: 'Kuningan',
    provinsi: 'Jawa Barat',
    totalPenduduk: 3428,
    totalKK: 1042,
    lakiLaki: 1740,
    perempuan: 1688,
    dusun: ['Manis', 'Pahing', 'Puhun', 'Wage', 'Kliwon']
  });
});

app.listen(PORT, () => {
  console.log(`[server]: Sistem Desa Kadurama Backend running on http://localhost:${PORT}`);
});
