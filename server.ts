import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { dbManager } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // CORS Middleware (Cross-Device & Mobile Support)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Never Cache API Responses
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Request logger
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.url}`);
    }
    next();
  });

  // Active SSE clients for real-time cross-device order notifications
  const sseClients: express.Response[] = [];

  const broadcastEvent = (event: string, data: any) => {
    const payload = `data: ${JSON.stringify({ event, data })}\n\n`;
    for (let i = sseClients.length - 1; i >= 0; i--) {
      try {
        sseClients[i].write(payload);
      } catch {
        sseClients.splice(i, 1);
      }
    }
  };

  // Real-Time Order Stream (Server-Sent Events)
  app.get('/api/orders/stream', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('data: {"type":"connected"}\n\n');
    sseClients.push(res);

    // Heartbeat every 20 seconds
    const heartbeat = setInterval(() => {
      try {
        res.write(': heartbeat\n\n');
      } catch {
        clearInterval(heartbeat);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(heartbeat);
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  // -------------------------------------------------------------
  // API ROUTES (Backend Database)
  // -------------------------------------------------------------

  // 1. Health check & DB status
  app.get('/api/health', (req, res) => {
    const stats = dbManager.getStats();
    res.json({
      status: 'ok',
      database: 'connected',
      type: 'Persistent Server File DB',
      stats,
    });
  });

  // 2. Products CRUD
  app.get('/api/products', (req, res) => {
    try {
      const products = dbManager.getProducts();
      res.json({ success: true, count: products.length, data: products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    try {
      const product = dbManager.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, data: product });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/products', (req, res) => {
    try {
      const newProduct = dbManager.createProduct(req.body);
      res.status(201).json({ success: true, data: newProduct });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    try {
      const updated = dbManager.updateProduct(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    try {
      const deleted = dbManager.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, message: 'Product deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Orders CRUD
  app.get('/api/orders', (req, res) => {
    try {
      const orders = dbManager.getOrders();
      res.json({ success: true, count: orders.length, data: orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/orders/:id', (req, res) => {
    try {
      const order = dbManager.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      res.json({ success: true, data: order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/orders', (req, res) => {
    try {
      const createdOrder = dbManager.createOrder(req.body);
      broadcastEvent('ORDER_CREATED', createdOrder);
      res.status(201).json({ success: true, data: createdOrder });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    try {
      const { status, notes, deliveryCourier, trackingCode } = req.body;
      const updated = dbManager.updateOrderStatus(
        req.params.id,
        status,
        notes,
        deliveryCourier,
        trackingCode
      );
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      broadcastEvent('ORDER_UPDATED', updated);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/orders/:id', (req, res) => {
    try {
      const deleted = dbManager.deleteOrder(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      broadcastEvent('ORDER_DELETED', { id: req.params.id });
      res.json({ success: true, message: 'Order deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Settings & Stats
  app.get('/api/settings', (req, res) => {
    try {
      const settings = dbManager.getSettings();
      res.json({ success: true, data: settings });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = dbManager.updateSettings(req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/stats', (req, res) => {
    try {
      const stats = dbManager.getStats();
      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/reset-db', (req, res) => {
    try {
      dbManager.resetDatabase();
      broadcastEvent('DATABASE_RESET', {});
      res.json({ success: true, message: 'Database reset to default products' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // VITE DEV SERVER OR STATIC SERVE
  // -------------------------------------------------------------
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');
  const hasBuiltDist = fs.existsSync(path.resolve(distPath, 'index.html'));

  if (isProduction && hasBuiltDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[Prod] Serving pre-built static bundle from dist');
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Dev] Mounted Vite middlewares on Express server');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OSTAD GEAR Server + Database running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});
