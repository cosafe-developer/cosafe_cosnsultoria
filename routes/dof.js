import { Router } from "express";
import rateLimit from "express-rate-limit";

const router = Router();

const DOF_UPSTREAM = "https://sidofqa.segob.gob.mx/dof/sidof";

const dofLimiter = rateLimit({
  windowMs       : 15 * 60 * 1000,
  max            : 60,
  standardHeaders: true,
  legacyHeaders  : false,
  message        : { success: false, error: "Demasiadas consultas al DOF. Intenta en 15 minutos." },
});

router.use(dofLimiter);

router.get("/*", async (req, res, next) => {
  try {
    const url = `${DOF_UPSTREAM}${req.path}`;
    const upstream = await fetch(url, {
      headers: { Accept: "*/*" },
      signal : AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      const err = new Error(`SIDOF respondió con ${upstream.status}`);
      err.status = upstream.status >= 500 ? 502 : upstream.status;
      return next(err);
    }

    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
