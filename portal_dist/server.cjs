var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server/app.ts
var import_express3 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/apiApp.ts
var import_express2 = __toESM(require("express"), 1);

// server/config/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "decisive-apogee-483418-q7",
  appId: "1:125389861760:web:c9d0ff9e204a880e930765",
  apiKey: "AIzaSyCde6Wxz9xbF62Y11Ux7OaQQoKTh3ehLGk",
  authDomain: "decisive-apogee-483418-q7.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-bsedrc-8d3ec7a9-5b78-44bb-ab3a-7916ac9efd88",
  storageBucket: "decisive-apogee-483418-q7.firebasestorage.app",
  messagingSenderId: "125389861760",
  measurementId: "",
  oAuthClientId: "125389861760-9of6sr7fl401so1tl8mvk75pleo48tah.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// server/config/index.ts
import_dotenv.default.config();
try {
  const envFilePaths = [
    import_path.default.resolve(process.cwd(), "../.dev.env.json"),
    import_path.default.resolve(process.cwd(), ".dev.env.json")
  ];
  for (const fp of envFilePaths) {
    if (import_fs.default.existsSync(fp)) {
      const raw = import_fs.default.readFileSync(fp, "utf8");
      const parsed = JSON.parse(raw);
      for (const [k, v] of Object.entries(parsed)) {
        if (!process.env[k] && typeof v === "string") {
          process.env[k] = v;
        }
      }
      break;
    }
  }
} catch {
}
var isProduction = process.env.NODE_ENV === "production";
var devSecretFallback = !isProduction ? import_crypto.default.randomBytes(32).toString("hex") : "";
var config = {
  port: 3e3,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  offlineMode: process.env.OFFLINE_MODE === "true",
  jwtSecret: (process.env.JWT_SECRET || devSecretFallback).trim(),
  admin: {
    superUsername: (process.env.ADMIN_SUPER_USERNAME || "bserdc.bihar@gmail.com").toLowerCase().trim(),
    superPassword: (process.env.ADMIN_SUPER_PASSWORD || "").trim(),
    securityPin: (process.env.ADMIN_SECURITY_PIN || "").trim()
  },
  firebase: {
    projectId: firebase_applet_config_default.projectId,
    appId: firebase_applet_config_default.appId,
    apiKey: process.env.FIREBASE_API_KEY || firebase_applet_config_default.apiKey,
    authDomain: firebase_applet_config_default.authDomain,
    firestoreDatabaseId: firebase_applet_config_default.firestoreDatabaseId || "ai-studio-bsedrc-8d3ec7a9-5b78-44bb-ab3a-7916ac9efd88",
    storageBucket: firebase_applet_config_default.storageBucket,
    messagingSenderId: firebase_applet_config_default.messagingSenderId,
    serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "",
    isConfigured: !!(firebase_applet_config_default.projectId && (process.env.FIREBASE_API_KEY || firebase_applet_config_default.apiKey))
  },
  cloudflareR2: {
    accountId: (process.env.CLOUDFLARE_R2_ACCOUNT_ID || "").trim(),
    accessKeyId: (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "").trim(),
    secretAccessKey: (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "").trim(),
    bucketName: (process.env.CLOUDFLARE_R2_BUCKET_NAME || "bsedrc").trim(),
    publicUrl: (process.env.CLOUDFLARE_R2_PUBLIC_URL || "").trim(),
    isConfigured: !!(process.env.CLOUDFLARE_R2_ACCOUNT_ID && process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY)
  },
  razorpay: {
    keyId: (process.env.RAZORPAY_KEY_ID || "").trim(),
    keySecret: (process.env.RAZORPAY_KEY_SECRET || "").trim(),
    currency: (process.env.RAZORPAY_CURRENCY || "INR").trim(),
    isRealGateway: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  },
  gemini: {
    apiKey: (process.env.GEMINI_API_KEY || "").trim(),
    isConfigured: !!process.env.GEMINI_API_KEY
  },
  cors: {
    allowedOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5500").split(",").map((o) => o.trim()).filter(Boolean)
  },
  board: {
    name: "Bihar State Educational Development & Research Council",
    nameHindi: "\u092C\u093F\u0939\u093E\u0930 \u0930\u093E\u091C\u094D\u092F \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 \u090F\u0935\u0902 \u0905\u0928\u0941\u0938\u0902\u0927\u093E\u0928 \u092A\u0930\u093F\u0937\u0926",
    shortName: "BSEDRC / BRSV & RCT",
    officeAddress: "Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar 852113",
    helplinePhone: "+91 7070530080",
    helplineEmail: "adarshbiharsiksha@gmail.com",
    regdOffice: "Sahugarh, Madhepura, Bihar (852113)"
  }
};
function validateStartupConfig() {
  const missingSecrets = [];
  if (config.isProduction) {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      missingSecrets.push("JWT_SECRET (must be configured and >= 32 characters in production)");
    }
    if (!process.env.ADMIN_SUPER_PASSWORD || process.env.ADMIN_SUPER_PASSWORD.length < 8) {
      missingSecrets.push("ADMIN_SUPER_PASSWORD (must be configured and >= 8 characters in production)");
    }
    if (!process.env.ADMIN_SECURITY_PIN || process.env.ADMIN_SECURITY_PIN.length < 4) {
      missingSecrets.push("ADMIN_SECURITY_PIN (must be configured and >= 4 characters in production)");
    }
    if (missingSecrets.length > 0) {
      console.error("================================================================");
      console.error("[CRITICAL SECURITY ERROR] Production startup rejected due to missing secrets:");
      missingSecrets.forEach((item) => console.error(`  - ${item}`));
      console.error("Please configure these environment variables in your secure deployment settings.");
      console.error("================================================================");
      throw new Error(`Production startup aborted: Missing required security variables [${missingSecrets.join(", ")}]`);
    }
  } else {
    if (!process.env.ADMIN_SUPER_PASSWORD) {
      console.warn("[SECURITY NOTICE] ADMIN_SUPER_PASSWORD not set in environment. Set it in .env to protect administrative portal.");
    }
    if (!process.env.ADMIN_SECURITY_PIN) {
      console.warn("[SECURITY NOTICE] ADMIN_SECURITY_PIN not set in environment. Set it in .env.");
    }
    if (!process.env.JWT_SECRET) {
      console.warn("[SECURITY NOTICE] JWT_SECRET not set in environment. Generated ephemeral in-memory secret for this session.");
    }
  }
}

// server/middleware/security.ts
function securityMiddleware(req, res, next) {
  const origin = req.headers.origin;
  if (origin) {
    const isAllowed = config.cors.allowedOrigins.includes(origin) || !config.isProduction && (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1"));
    if (isAllowed) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Max-Age", "86400");
    }
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://ai.studio https://*.google.com https://*.run.app;"
  );
  if (config.isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
}

// server/middleware/rateLimiter.ts
var rateLimitBuckets = /* @__PURE__ */ new Map();
var MAX_BUCKETS = 5e4;
var cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitBuckets.entries()) {
    if (now > val.resetTime) {
      rateLimitBuckets.delete(key);
    }
  }
}, 6e4);
if (cleanupTimer.unref) cleanupTimer.unref();
function createRateLimiter(namespace, windowMs = 6e4, max = 30) {
  return (req, res, next) => {
    const forwarded = req.headers["x-forwarded-for"];
    const rawIp = Array.isArray(forwarded) ? forwarded[0] : typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "unknown-ip";
    const cleanIp = rawIp.replace(/[^a-zA-Z0-9.:_-]/g, "");
    const bucketKey = `${namespace}:${cleanIp}`;
    const now = Date.now();
    if (rateLimitBuckets.size >= MAX_BUCKETS && !rateLimitBuckets.has(bucketKey)) {
      let count = 0;
      for (const k of rateLimitBuckets.keys()) {
        rateLimitBuckets.delete(k);
        if (++count > 500) break;
      }
    }
    const record = rateLimitBuckets.get(bucketKey);
    if (!record || now > record.resetTime) {
      rateLimitBuckets.set(bucketKey, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }
    if (record.count >= max) {
      const waitSeconds = Math.ceil((record.resetTime - now) / 1e3);
      res.setHeader("Retry-After", waitSeconds.toString());
      res.status(429).json({
        success: false,
        error: "Too Many Requests",
        message: `Too many attempts from this IP connection. Please wait ${waitSeconds} seconds before trying again.`,
        retryAfter: waitSeconds
      });
      return;
    }
    record.count++;
    next();
  };
}
var authRateLimiter = createRateLimiter("auth", 15 * 60 * 1e3, 5);
var paymentRateLimiter = createRateLimiter("pay", 10 * 60 * 1e3, 10);
var aiRateLimiter = createRateLimiter("ai", 5 * 60 * 1e3, 15);
var apiGeneralLimiter = createRateLimiter("general", 60 * 1e3, 100);

// server/middleware/errorHandler.ts
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[SERVER ERROR] ${req.method} ${req.url} ->`, err);
  res.status(status).json({
    success: false,
    error: err.name || "ServerError",
    message: config.isProduction && status === 500 ? "An unexpected server error occurred. Please try again later." : message,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}

// server/routes/api.routes.ts
var import_express = require("express");

// server/services/authService.ts
var import_crypto2 = __toESM(require("crypto"), 1);
function safeStringCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    import_crypto2.default.timingSafeEqual(bufA, bufA);
    return false;
  }
  return import_crypto2.default.timingSafeEqual(bufA, bufB);
}
function generateAdminToken(user) {
  const iat = Math.floor(Date.now() / 1e3);
  const exp = iat + 24 * 60 * 60;
  const payload = {
    username: user.username,
    email: user.email,
    role: user.role,
    organization: user.organization,
    iat,
    exp
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = import_crypto2.default.createHmac("sha256", config.jwtSecret).update(payloadEncoded).digest("base64url");
  return `bsedrc_v1.${payloadEncoded}.${signature}`;
}
function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return null;
  if (token.startsWith("bsedrc_token_")) {
    try {
      const b64 = token.replace("bsedrc_token_", "");
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      const [username, timestampStr] = decoded.split(":");
      const ts = Number(timestampStr);
      if (Date.now() - ts < 24 * 60 * 60 * 1e3) {
        return {
          username: username || "admin",
          email: username.includes("@") ? username : config.admin.superUsername,
          role: "Administrator",
          organization: config.board.name,
          iat: Math.floor(ts / 1e3),
          exp: Math.floor((ts + 864e5) / 1e3)
        };
      }
    } catch {
    }
  }
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "bsedrc_v1") {
    return null;
  }
  const [, payloadEncoded, signature] = parts;
  const expectedSig = import_crypto2.default.createHmac("sha256", config.jwtSecret).update(payloadEncoded).digest("base64url");
  if (!safeStringCompare(signature, expectedSig)) {
    return null;
  }
  try {
    const payloadJson = Buffer.from(payloadEncoded, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1e3);
    if (now > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
function hashPassword(password, salt) {
  const effectiveSalt = salt || import_crypto2.default.randomBytes(16).toString("hex");
  const derivedKey = import_crypto2.default.scryptSync(password, effectiveSalt, 64);
  return {
    hash: derivedKey.toString("hex"),
    salt: effectiveSalt
  };
}
function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) return false;
  try {
    const derivedKey = import_crypto2.default.scryptSync(password, salt, 64);
    const expectedBuf = Buffer.from(hash, "hex");
    if (derivedKey.length !== expectedBuf.length) {
      import_crypto2.default.timingSafeEqual(derivedKey, derivedKey);
      return false;
    }
    return import_crypto2.default.timingSafeEqual(derivedKey, expectedBuf);
  } catch {
    return false;
  }
}
function validateAdminCredentials(username, password) {
  const superUser = config.admin.superUsername;
  const superPass = config.admin.superPassword;
  if (!superPass) {
    return { isValid: false };
  }
  const inputUser = (username || "").toLowerCase().trim();
  const inputPass = (password || "").trim();
  const isUserMatch = inputUser === superUser || superUser.includes("@") && inputUser === superUser.split("@")[0];
  const isPassMatch = safeStringCompare(inputPass, superPass);
  if (isUserMatch && isPassMatch) {
    return {
      isValid: true,
      role: "Council Administrator",
      email: superUser.includes("@") ? superUser : "bserdc.bihar@gmail.com"
    };
  }
  return { isValid: false };
}
function validateCouncilSecurityPin(pin) {
  if (!pin || !config.admin.securityPin) return false;
  const trimmed = pin.trim();
  return safeStringCompare(trimmed, config.admin.securityPin);
}

// server/services/firebaseServer.ts
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");
var import_auth = require("firebase/auth");
var serverApp;
var serverDb;
var serverAuth;
try {
  const existingApps = (0, import_app.getApps)();
  const serverAppNamed = existingApps.find((a) => a.name === "bsedrc-server");
  if (serverAppNamed) {
    serverApp = serverAppNamed;
  } else {
    serverApp = (0, import_app.initializeApp)({
      projectId: config.firebase.projectId,
      appId: config.firebase.appId,
      apiKey: config.firebase.apiKey,
      authDomain: config.firebase.authDomain,
      storageBucket: config.firebase.storageBucket,
      messagingSenderId: config.firebase.messagingSenderId
    }, "bsedrc-server");
  }
  serverDb = (0, import_firestore.getFirestore)(serverApp, config.firebase.firestoreDatabaseId);
  serverAuth = (0, import_auth.getAuth)(serverApp);
  console.log(`[FIREBASE] Server initialized with Database ID: ${config.firebase.firestoreDatabaseId}`);
} catch (err) {
  console.warn("[FIREBASE] Server initialization warning:", err?.message || err);
}
var FIRESTORE_COLLECTIONS = {
  STUDENTS: "students",
  RESULTS: "results",
  VACANCIES: "vacancies",
  APPLICATIONS: "applications",
  PAYMENTS: "payments",
  CERTIFICATES: "certificates",
  NOTIFICATIONS: "notifications",
  CUSTOM_FORMS: "custom_forms",
  FORM_SUBMISSIONS: "form_submissions",
  GALLERY: "gallery",
  ADMIN_CONFIG: "admin_config",
  USERS: "users"
};

// src/data/initialData.ts
var INITIAL_STUDENTS = [
  {
    id: "std-komal",
    regNo: "MPE-2026-KKH-092",
    rollNo: "202608092",
    name: "KOMAL KUMARI",
    fatherName: "PRAMOD KUMAR",
    motherName: "KUMARI CHANDAN",
    dob: "28-06-2013",
    gender: "Female",
    nationality: "INDIAN",
    category: "OBC",
    course: "Middle Foundation (Class 8th)",
    stream: "General",
    session: "2026-2027",
    centerCode: "10110901003",
    centerName: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
    schoolNameHindi: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
    udiseCode: "10110901003",
    mobile: "9810987654",
    email: "komal.kumari@example.com",
    address: "\u0917\u094D\u0930\u093E\u092E- \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u092A\u094D\u0930\u0916\u0902\u0921- \u0918\u0948\u0932\u093E\u0922\u093C, \u092E\u0927\u0947\u092A\u0941\u0930\u093E, \u092C\u093F\u0939\u093E\u0930 - 852113",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "081", name: "\u0939\u093F\u0928\u094D\u0926\u0940", type: "Theory" },
      { code: "082", name: "\u0917\u0923\u093F\u0924", type: "Theory" },
      { code: "083", name: "\u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
      { code: "084", name: "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
      { code: "085", name: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928", type: "Theory" }
    ],
    registrationDate: "2026-02-15",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C (10110901003)"
  },
  {
    id: "std-5th",
    regNo: "MPE-2026-GHL-051",
    rollNo: "202605051",
    name: "ANANYA RAJ",
    fatherName: "MANISH KUMAR RAJ",
    motherName: "POOJA DEVI",
    dob: "15-09-2015",
    gender: "Female",
    nationality: "INDIAN",
    category: "General",
    course: "Primary/Middle Foundation (Class 5th)",
    stream: "General",
    session: "2026-2027",
    centerCode: "10110901003",
    centerName: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
    schoolNameHindi: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
    udiseCode: "10110901003",
    mobile: "9810112233",
    email: "ananya.raj@example.com",
    address: "\u0917\u094D\u0930\u093E\u092E- \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u092A\u094D\u0930\u0916\u0902\u0921- \u0918\u0948\u0932\u093E\u0922\u093C, \u092E\u0927\u0947\u092A\u0941\u0930\u093E, \u092C\u093F\u0939\u093E\u0930 - 852113",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "051", name: "\u0939\u093F\u0928\u094D\u0926\u0940", type: "Theory" },
      { code: "052", name: "\u0917\u0923\u093F\u0924", type: "Theory" },
      { code: "053", name: "\u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
      { code: "054", name: "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
      { code: "055", name: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928", type: "Theory" }
    ],
    registrationDate: "2026-02-20",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C (10110901003)"
  },
  {
    id: "std-1",
    regNo: "BSE/2025/1001",
    rollNo: "2510101",
    name: "AARAV SHARMA",
    fatherName: "RAJESH SHARMA",
    motherName: "SUNITA SHARMA",
    dob: "2008-05-14",
    gender: "Male",
    category: "General",
    course: "Secondary Examination (Class 10th)",
    stream: "General",
    session: "2024-2025",
    centerCode: "CTR-MD-104",
    centerName: "DR. RAM MANOHAR LOHIYA HIGH SCHOOL, SAHUGARH, MADHEPURA",
    mobile: "9811234567",
    email: "aarav.sharma@example.com",
    address: "Near BNMV College, Sahugarh, Madhepura, Bihar - 852113",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "101", name: "Hindi Course (A)", type: "Theory" },
      { code: "102", name: "English Language & Literature", type: "Theory" },
      { code: "103", name: "Mathematics (Standard)", type: "Theory" },
      { code: "104", name: "Science & Technology", type: "Practical" },
      { code: "105", name: "Social Science", type: "Theory" },
      { code: "106", name: "Information Technology (IT)", type: "Practical" }
    ],
    registrationDate: "2024-09-12",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "Center No. 104 - BNMV Campus Zone, Madhepura (852113)"
  },
  {
    id: "std-2",
    regNo: "BSE/2025/1002",
    rollNo: "2512202",
    name: "PRIYA VERMA",
    fatherName: "MANOJ KUMAR VERMA",
    motherName: "KAVITA VERMA",
    dob: "2007-08-22",
    gender: "Female",
    category: "OBC",
    course: "Secondary Foundation (Class 9th)",
    stream: "Science & Math",
    session: "2024-2025",
    centerCode: "CTR-MD-108",
    centerName: "MADHEPURA CENTRAL ACADEMY, SAHUGARH, MADHEPURA",
    mobile: "9873456123",
    email: "priya.verma@example.com",
    address: "Ward No. 04, Sahugarh, Madhepura, Bihar - 852113",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "101", name: "Hindi Course (A)", type: "Theory" },
      { code: "102", name: "English Language & Literature", type: "Theory" },
      { code: "103", name: "Mathematics (Foundation)", type: "Theory" },
      { code: "104", name: "Science & Technology", type: "Practical" },
      { code: "105", name: "Social Science", type: "Theory" }
    ],
    registrationDate: "2024-09-18",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "Center No. 108 - Sahugarh North Zone, Madhepura"
  },
  {
    id: "std-3",
    regNo: "BSE/2025/1003",
    rollNo: "2512303",
    name: "ROHAN GUPTA",
    fatherName: "SURESH GUPTA",
    motherName: "ANITA GUPTA",
    dob: "2007-11-05",
    gender: "Male",
    category: "General",
    course: "Middle Foundation (Class 8th)",
    stream: "General",
    session: "2024-2025",
    centerCode: "CTR-MD-112",
    centerName: "BNMV COLLEGE SENIOR CAMPUS, MADHEPURA",
    mobile: "9899123890",
    email: "rohan.gupta@example.com",
    address: "Main Road, Near College Chowk, Madhepura, Bihar - 852113",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "081", name: "Hindi Bhasha", type: "Theory" },
      { code: "082", name: "English Language", type: "Theory" },
      { code: "083", name: "Mathematics (Ganit)", type: "Theory" },
      { code: "084", name: "General Science", type: "Theory" },
      { code: "085", name: "Social Studies", type: "Theory" },
      { code: "086", name: "Sanskrit / Third Language", type: "Theory" }
    ],
    registrationDate: "2024-09-25",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "Center No. 112 - Rohini Examination Hub"
  },
  {
    id: "std-4",
    regNo: "BSE/2025/1004",
    rollNo: "2510104",
    name: "ANANYA MISHRA",
    fatherName: "DINESH MISHRA",
    motherName: "POOJA MISHRA",
    dob: "2008-03-19",
    gender: "Female",
    category: "EWS",
    course: "Secondary Examination (Class 10th)",
    stream: "General",
    session: "2024-2025",
    centerCode: "CTR-MD-104",
    centerName: "DR. RAM MANOHAR LOHIYA HIGH SCHOOL, SAHUGARH, MADHEPURA",
    mobile: "9810987654",
    email: "ananya.mishra@example.com",
    address: "VPO Sahugarh, Near Stadium, Madhepura, Bihar - 852113",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "101", name: "Hindi Course (A)", type: "Theory" },
      { code: "102", name: "English Language & Literature", type: "Theory" },
      { code: "103", name: "Mathematics (Basic)", type: "Theory" },
      { code: "104", name: "Science & Technology", type: "Practical" },
      { code: "105", name: "Social Science", type: "Theory" }
    ],
    registrationDate: "2024-10-02",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "Center No. 104 - BNMV Campus Zone, Madhepura (852113)"
  },
  {
    id: "std-5",
    regNo: "BSE/2025/1005",
    rollNo: "2512405",
    name: "VIKRAM SINGH",
    fatherName: "DEVENDRA SINGH",
    motherName: "MEENA DEVI",
    dob: "2006-12-30",
    gender: "Male",
    category: "OBC",
    course: "Middle Foundation (Class 7th)",
    stream: "General",
    session: "2024-2025",
    centerCode: "CTR-MD-119",
    centerName: "ADARSH MIDDLE SCHOOL, SHANKARPUR, MADHEPURA",
    mobile: "9871122334",
    email: "vikram.singh@example.com",
    address: "Ward 08, Shankarpur Road, Madhepura, Bihar - 852113",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "071", name: "Hindi", type: "Theory" },
      { code: "072", name: "English", type: "Theory" },
      { code: "073", name: "Mathematics", type: "Theory" },
      { code: "074", name: "Science", type: "Theory" },
      { code: "075", name: "Social Studies", type: "Theory" }
    ],
    registrationDate: "2024-10-10",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "Center No. 119 - Madhepura Rural Circle"
  },
  {
    id: "std-6",
    regNo: "BSE/2025/1006",
    rollNo: "2514506",
    name: "SNEHA PATEL",
    fatherName: "RAMESH PATEL",
    motherName: "GEETA PATEL",
    dob: "2005-06-15",
    gender: "Female",
    category: "General",
    course: "Middle Foundation (Class 6th)",
    stream: "General",
    session: "2024-2025",
    centerCode: "CTR-MD-125",
    centerName: "MODEL MIDDLE SCHOOL FOUNDATION, MADHEPURA",
    mobile: "9823456789",
    email: "sneha.patel@example.com",
    address: "Station Road, Madhepura, Bihar - 852113",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    subjects: [
      { code: "061", name: "Hindi Bhasha", type: "Theory" },
      { code: "062", name: "English Language", type: "Theory" },
      { code: "063", name: "Mathematics", type: "Theory" },
      { code: "064", name: "Science & Environment", type: "Theory" },
      { code: "065", name: "Social Studies", type: "Theory" }
    ],
    registrationDate: "2024-10-15",
    status: "Verified",
    feeStatus: "Paid",
    examCenter: "Center No. 125 - Dwarka Technical Center"
  }
];
var INITIAL_RESULTS = [
  {
    id: "res-1",
    studentRegNo: "BSE/2025/1001",
    rollNo: "2510101",
    candidateName: "AARAV SHARMA",
    fatherName: "RAJESH SHARMA",
    motherName: "SUNITA SHARMA",
    course: "Secondary Examination (Class 10th)",
    stream: "General",
    session: "2024-2025",
    examYear: 2025,
    centerCode: "CTR-MD-104",
    centerName: "DR. RAM MANOHAR LOHIYA HIGH SCHOOL, SAHUGARH, MADHEPURA",
    subjects: [
      { code: "101", name: "Hindi Course (A)", theoryMax: 80, theoryObt: 72, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 91, grade: "A1", status: "Pass" },
      { code: "102", name: "English Language & Lit.", theoryMax: 80, theoryObt: 68, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 86, grade: "A2", status: "Pass" },
      { code: "103", name: "Mathematics (Standard)", theoryMax: 80, theoryObt: 75, practicalMax: 20, practicalObt: 20, totalMax: 100, totalObt: 95, grade: "A1", status: "Pass" },
      { code: "104", name: "Science & Technology", theoryMax: 80, theoryObt: 65, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 84, grade: "A2", status: "Pass" },
      { code: "105", name: "Social Science", theoryMax: 80, theoryObt: 70, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 88, grade: "A2", status: "Pass" },
      { code: "106", name: "Information Technology", theoryMax: 50, theoryObt: 44, practicalMax: 50, practicalObt: 48, totalMax: 100, totalObt: 92, grade: "A1", status: "Pass" }
    ],
    totalMax: 600,
    totalObt: 536,
    percentage: 89.33,
    division: "1st Division",
    resultStatus: "PASS",
    issueDate: "2025-05-20",
    isPublished: true
  },
  {
    id: "res-2",
    studentRegNo: "BSE/2025/1002",
    rollNo: "2512202",
    candidateName: "PRIYA VERMA",
    fatherName: "MANOJ KUMAR VERMA",
    motherName: "KAVITA VERMA",
    course: "Secondary Foundation (Class 9th)",
    stream: "Science & Math",
    session: "2024-2025",
    examYear: 2025,
    centerCode: "CTR-MD-108",
    centerName: "MADHEPURA CENTRAL ACADEMY, SAHUGARH, MADHEPURA",
    subjects: [
      { code: "101", name: "Hindi Course (A)", theoryMax: 80, theoryObt: 74, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 93, grade: "A1", status: "Pass" },
      { code: "102", name: "English Language", theoryMax: 80, theoryObt: 72, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 91, grade: "A1", status: "Pass" },
      { code: "103", name: "Mathematics (Foundation)", theoryMax: 80, theoryObt: 70, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 88, grade: "A2", status: "Pass" },
      { code: "104", name: "Science & Technology", theoryMax: 80, theoryObt: 76, practicalMax: 20, practicalObt: 20, totalMax: 100, totalObt: 96, grade: "A1", status: "Pass" },
      { code: "105", name: "Social Science", theoryMax: 80, theoryObt: 75, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 93, grade: "A1", status: "Pass" }
    ],
    totalMax: 500,
    totalObt: 461,
    percentage: 92.2,
    division: "1st Division",
    resultStatus: "PASS",
    issueDate: "2025-05-20",
    isPublished: true
  },
  {
    id: "res-3",
    studentRegNo: "BSE/2025/1003",
    rollNo: "2512303",
    candidateName: "ROHAN GUPTA",
    fatherName: "SURESH GUPTA",
    motherName: "ANITA GUPTA",
    course: "Middle Foundation (Class 8th)",
    stream: "General",
    session: "2024-2025",
    examYear: 2025,
    centerCode: "CTR-MD-112",
    centerName: "BNMV COLLEGE SENIOR CAMPUS, MADHEPURA",
    subjects: [
      { code: "081", name: "Hindi Bhasha", theoryMax: 80, theoryObt: 65, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 83, grade: "B1", status: "Pass" },
      { code: "082", name: "English Language", theoryMax: 80, theoryObt: 71, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 90, grade: "A1", status: "Pass" },
      { code: "083", name: "Mathematics (Ganit)", theoryMax: 80, theoryObt: 68, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 86, grade: "A2", status: "Pass" },
      { code: "084", name: "General Science", theoryMax: 80, theoryObt: 67, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 86, grade: "A2", status: "Pass" },
      { code: "085", name: "Social Studies", theoryMax: 80, theoryObt: 58, practicalMax: 20, practicalObt: 17, totalMax: 100, totalObt: 75, grade: "B1", status: "Pass" }
    ],
    totalMax: 500,
    totalObt: 420,
    percentage: 84,
    division: "1st Division",
    resultStatus: "PASS",
    issueDate: "2025-05-20",
    isPublished: true
  },
  {
    id: "res-4",
    studentRegNo: "BSE/2025/1004",
    rollNo: "2510104",
    candidateName: "ANANYA MISHRA",
    fatherName: "DINESH MISHRA",
    motherName: "POOJA MISHRA",
    course: "Secondary Examination (Class 10th)",
    stream: "General",
    session: "2024-2025",
    examYear: 2025,
    centerCode: "CTR-MD-104",
    centerName: "DR. RAM MANOHAR LOHIYA HIGH SCHOOL, SAHUGARH, MADHEPURA",
    subjects: [
      { code: "101", name: "Hindi Course (A)", theoryMax: 80, theoryObt: 70, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 88, grade: "A2", status: "Pass" },
      { code: "102", name: "English Language & Lit.", theoryMax: 80, theoryObt: 64, practicalMax: 20, practicalObt: 17, totalMax: 100, totalObt: 81, grade: "B1", status: "Pass" },
      { code: "103", name: "Mathematics (Basic)", theoryMax: 80, theoryObt: 60, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 79, grade: "B1", status: "Pass" },
      { code: "104", name: "Science & Technology", theoryMax: 80, theoryObt: 59, practicalMax: 20, practicalObt: 18, totalMax: 100, totalObt: 77, grade: "B1", status: "Pass" },
      { code: "105", name: "Social Science", theoryMax: 80, theoryObt: 66, practicalMax: 20, practicalObt: 19, totalMax: 100, totalObt: 85, grade: "A2", status: "Pass" }
    ],
    totalMax: 500,
    totalObt: 410,
    percentage: 82,
    division: "1st Division",
    resultStatus: "PASS",
    issueDate: "2025-05-20",
    isPublished: true
  }
];
var INITIAL_VACANCIES = [
  {
    id: "vac-1",
    postCode: "BSE/EMP/2025/01",
    title: "Examination Center Superintendent",
    department: "Examination & Evaluation Cell",
    vacancies: 18,
    qualification: "Post Graduate with B.Ed / M.Ed and minimum 5 years administrative/educational experience in secondary schools.",
    experience: "5+ Years in Educational Administration",
    ageLimit: "30 - 50 Years (Age relaxation for SC/ST/OBC as per rules)",
    payScale: "Level 10 (\u20B956,100 - \u20B91,77,500)",
    applicationFee: 750,
    lastDate: "2025-10-30",
    status: "Active",
    description: "Responsible for overall conduct of annual board examinations, maintaining integrity of question paper custody, center vigilance, and coordinate evaluation.",
    requirements: ["Master Degree with 55% Marks", "B.Ed / M.Ed from Recognized University", "Clean administrative vigilance record"]
  },
  {
    id: "vac-2",
    postCode: "BSE/EMP/2025/02",
    title: "Computer & Data Entry Operator (Grade-II)",
    department: "IT & Student Registry Wing",
    vacancies: 34,
    qualification: "Graduation in any stream with Diploma in Computer Application (DCA/O Level) and typing speed 35 wpm in English / 30 wpm in Hindi.",
    experience: "1-3 Years in MIS / Data Processing",
    ageLimit: "21 - 35 Years",
    payScale: "Level 4 (\u20B925,500 - \u20B981,100)",
    applicationFee: 450,
    lastDate: "2025-11-15",
    status: "Active",
    description: "Manage student registration database, mark-sheet data entry, verification processing, and assist candidates in digital grievance redressal.",
    requirements: ["Bachelor Degree", "Typing speed 35 WPM (Eng) / 30 WPM (Hindi)", "Expertise in Excel and Web Databases"]
  },
  {
    id: "vac-3",
    postCode: "BSE/EMP/2025/03",
    title: "Assistant Teacher / Subject Specialist (Secondary)",
    department: "Academic Curriculum & Pedagogy",
    vacancies: 42,
    qualification: "Bachelor Degree in Science / Maths / English with B.Ed and qualified Central / State Teacher Eligibility Test (TET/CTET).",
    experience: "2+ Years teaching experience preferred",
    ageLimit: "21 - 38 Years",
    payScale: "Level 7 (\u20B944,900 - \u20B91,42,400)",
    applicationFee: 600,
    lastDate: "2025-10-25",
    status: "Active",
    description: "Design syllabus blueprints, question paper moderation, prepare model answers, and conduct virtual teacher orientation programmes.",
    requirements: ["B.Sc / B.A with 50% Marks", "B.Ed Degree", "CTET Paper II Passed"]
  },
  {
    id: "vac-4",
    postCode: "BSE/EMP/2025/04",
    title: "Senior IT Coordinator & Cyber Security Officer",
    department: "Digital Governance & Portal Infrastructure",
    vacancies: 6,
    qualification: "B.Tech / B.E in Computer Science / IT / MCA with experience in cloud portals, SSL security, and web portal maintenance.",
    experience: "3-6 Years in Web Portals & Database Management",
    ageLimit: "25 - 42 Years",
    payScale: "Level 11 (\u20B967,700 - \u20B92,08,700)",
    applicationFee: 850,
    lastDate: "2025-11-20",
    status: "Active",
    description: "Manage server uptime, result publishing portal security, data backups, and integrate online fee payment gateways.",
    requirements: ["B.Tech / MCA in Computer Science/IT", "Hands-on experience in full-stack web platforms", "Knowledge of ISO 27001 data safety"]
  }
];
var INITIAL_JOB_APPLICATIONS = [
  {
    id: "app-1",
    applicationNo: "JOB-2025-DEO-8812",
    vacancyId: "vac-2",
    postTitle: "Computer & Data Entry Operator (Grade-II)",
    candidateName: "SUMIT KUMAR CHOUDHARY",
    fatherName: "HARISH CHANDRA CHOUDHARY",
    dob: "1998-04-12",
    gender: "Male",
    category: "OBC",
    email: "sumit.choudhary@example.com",
    phone: "9812349988",
    qualification: "BCA (Bachelor of Computer Applications) - 78%",
    percentage: "78.50%",
    address: "Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar - 852113",
    appliedDate: "2025-08-14",
    paymentStatus: "Paid",
    amount: 450,
    examCenterPref: "Madhepura Center (Zone 1)",
    status: "Admit Card Available",
    admitCardReady: true
  },
  {
    id: "app-2",
    applicationNo: "JOB-2025-SUP-9104",
    vacancyId: "vac-1",
    postTitle: "Examination Center Superintendent",
    candidateName: "DR. MEENAKSHI SHARMA",
    fatherName: "SATISH CHANDRA SHARMA",
    dob: "1987-09-18",
    gender: "Female",
    category: "General",
    email: "dr.meenakshi@example.com",
    phone: "9910238844",
    qualification: "M.A., M.Ed, Ph.D in Education - 82%",
    percentage: "82.00%",
    address: "College Road, Ward 12, Madhepura, Bihar - 852113",
    appliedDate: "2025-08-20",
    paymentStatus: "Paid",
    amount: 750,
    examCenterPref: "Madhepura Center (Zone 2)",
    status: "Shortlisted",
    admitCardReady: true
  }
];
var INITIAL_PAYMENTS = [
  {
    id: "pay-1",
    receiptNo: "BSE-REC-2025-9832",
    transactionId: "TXN-UPI-9843219082",
    refNumber: "BSE/2025/1001",
    candidateName: "AARAV SHARMA",
    fatherName: "RAJESH SHARMA",
    candidateMobile: "9811234567",
    purpose: "Annual Board Exam Fee",
    amount: 1250,
    paymentMethod: "UPI",
    paymentDate: "2024-11-10 14:32:10",
    status: "Success",
    bankRef: "HDFC000024-998811"
  },
  {
    id: "pay-2",
    receiptNo: "BSE-REC-2025-9833",
    transactionId: "TXN-NB-4439120931",
    refNumber: "BSE/2025/1002",
    candidateName: "PRIYA VERMA",
    fatherName: "MANOJ KUMAR VERMA",
    candidateMobile: "9873456123",
    purpose: "Registration Fee",
    amount: 650,
    paymentMethod: "Net Banking",
    paymentDate: "2024-11-12 11:15:40",
    status: "Success",
    bankRef: "SBIINBB-772183"
  },
  {
    id: "pay-3",
    receiptNo: "BSE-REC-2025-9834",
    transactionId: "TXN-CARD-119827364",
    refNumber: "JOB-2025-DEO-8812",
    candidateName: "SUMIT KUMAR CHOUDHARY",
    fatherName: "HARISH CHANDRA CHOUDHARY",
    candidateMobile: "9812349988",
    purpose: "Job Application Fee",
    amount: 450,
    paymentMethod: "Debit Card",
    paymentDate: "2025-08-14 16:45:00",
    status: "Success",
    bankRef: "ICIC000918-662819"
  }
];
var INITIAL_CERTIFICATES = [
  {
    id: "cert-1",
    certificateType: "Migration Certificate",
    certificateNo: "BSE/MIG/2025/00142",
    studentRegNo: "BSE/2025/1001",
    studentRollNo: "2510101",
    candidateName: "AARAV SHARMA",
    fatherName: "RAJESH SHARMA",
    motherName: "SUNITA SHARMA",
    course: "Secondary Examination (Class 10th)",
    passingYear: "2025",
    division: "1st Division",
    issueDate: "2025-06-15",
    verificationHash: "SHA256-BSE-MIG-7821-AARAV"
  },
  {
    id: "cert-2",
    certificateType: "Passing Certificate",
    certificateNo: "BSE/PASS/2025/00289",
    studentRegNo: "BSE/2025/1002",
    studentRollNo: "2512202",
    candidateName: "PRIYA VERMA",
    fatherName: "MANOJ KUMAR VERMA",
    motherName: "KAVITA VERMA",
    course: "Senior Secondary Examination (Class 12th)",
    passingYear: "2025",
    division: "1st Division (Distinction)",
    issueDate: "2025-06-20",
    verificationHash: "SHA256-BSE-PASS-9932-PRIYA"
  }
];
var INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Online Student Registration 2025-26: Portal open for Regular & Private Candidates. Search & Download Registration Card now.",
    category: "Admission",
    date: "2025-09-08",
    isNew: true,
    isMarquee: true,
    linkText: "Registration Portal",
    description: "All affiliated institutions, study centers, and independent candidates are notified that student registration cards for the academic session 2025-26 are ready for instant search and download."
  },
  {
    id: "notif-2",
    title: "Secondary (Class 10th) & Sr. Secondary (Class 12th) Annual Board Examination 2025 Results Declared. Check Marksheet online.",
    category: "Results",
    date: "2025-05-20",
    isNew: true,
    isMarquee: true,
    linkText: "View Result",
    description: "Statement of Marks and digital provisional mark-sheets for Class X and Class XII examinations are published. Students can verify with Roll Number and Registration Number."
  },
  {
    id: "notif-3",
    title: "Direct Recruitment Notice 2025: Online applications invited for Center Superintendent, DEO, and Academic Teachers.",
    category: "Recruitment",
    date: "2025-08-01",
    isNew: true,
    isMarquee: true,
    linkText: "Job Portal",
    description: "BSEDRC invites applications from eligible citizens of India for various administrative and academic posts. Candidates can submit their application and pay fee online."
  },
  {
    id: "notif-4",
    title: "Guidelines for Automated Migration & Passing Certificate Generation through Digital Verification System.",
    category: "General Notice",
    date: "2025-07-14",
    isNew: false,
    isMarquee: false,
    linkText: "Certificate System",
    description: "Passed candidates can now instantly generate, digitally sign, and download their official Migration, Provisional, and Passing Certificates directly from the portal."
  },
  {
    id: "notif-5",
    title: "Fee Structure & Online Gateway: Notice regarding standard fee schedule for Examination, Re-evaluation & Duplicate Documents.",
    category: "Examination",
    date: "2025-06-10",
    isNew: false,
    isMarquee: false,
    linkText: "Fee Payment",
    description: "Fee payment is now completely digitized through UPI QR, Net Banking, and Debit Cards with immediate e-receipt generation."
  }
];
var INITIAL_CUSTOM_FORMS = [
  {
    id: "form-talent-exam-2026",
    title: "\u092A\u094D\u0930\u0916\u0902\u0921 \u0938\u094D\u0924\u0930\u0940\u092F \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0936\u093F\u0915\u094D\u0937\u093E \u092A\u094D\u0930\u0924\u093F\u092D\u093E\u2013\u0938\u0939\u2013\u092E\u0947\u0927\u093E \u092A\u094D\u0930\u0924\u093F\u092F\u094B\u0917\u093F\u0924\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u093E 2026 \u092A\u0902\u091C\u0940\u092F\u0928 (Class 5th - 10th)",
    description: "\u092C\u093F\u0939\u093E\u0930 \u0930\u093E\u091C\u094D\u092F \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 \u090F\u0935\u0902 \u0905\u0928\u0941\u0938\u0902\u0927\u093E\u0928 \u092A\u0930\u093F\u0937\u0926\u094D, \u092E\u0927\u0947\u092A\u0941\u0930\u093E \u0926\u094D\u0935\u093E\u0930\u093E \u0906\u092F\u094B\u091C\u093F\u0924 \u092A\u094D\u0930\u0916\u0902\u0921 \u0938\u094D\u0924\u0930\u0940\u092F \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0936\u093F\u0915\u094D\u0937\u093E \u092A\u094D\u0930\u0924\u093F\u092D\u093E\u2013\u0938\u0939\u2013\u092E\u0947\u0927\u093E \u092A\u094D\u0930\u0924\u093F\u092F\u094B\u0917\u093F\u0924\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u2013 2026 (\u0938\u0924\u094D\u0930 2026-27) \u0939\u0947\u0924\u0941 \u0911\u0928\u0932\u093E\u0907\u0928 \u092A\u0902\u091C\u0940\u092F\u0928 \u092A\u094D\u0930\u092A\u0924\u094D\u0930\u0964 \u092A\u0930\u0940\u0915\u094D\u0937\u093E 5 \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u0935\u093F\u0937\u092F\u094B\u0902 (\u0939\u093F\u0928\u094D\u0926\u0940, \u0917\u0923\u093F\u0924, \u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928) \u092E\u0947\u0902 \u0906\u092F\u094B\u091C\u093F\u0924 \u0939\u094B\u0917\u0940\u0964",
    category: "Examination",
    status: "Published",
    applicationFee: 150,
    lastDate: "2026-03-31",
    createdAt: "2026-01-10",
    submissionsCount: 88,
    fields: [
      {
        id: "tf-1",
        label: "\u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0930\u094D\u0925\u0940 \u0915\u093E \u0928\u093E\u092E (Candidate Name)",
        type: "text",
        placeholder: "Enter full name in Capital",
        required: true
      },
      {
        id: "tf-2",
        label: "\u092E\u093E\u0924\u093E \u0915\u093E \u0928\u093E\u092E (Mother Name)",
        type: "text",
        placeholder: "Mother name",
        required: true
      },
      {
        id: "tf-3",
        label: "\u092A\u093F\u0924\u093E \u0915\u093E \u0928\u093E\u092E (Father Name)",
        type: "text",
        placeholder: "Father name",
        required: true
      },
      {
        id: "tf-4",
        label: "\u0915\u0915\u094D\u0937\u093E / \u0935\u0930\u094D\u0917 (Class - 5th to 10th)",
        type: "select",
        options: [
          "Class 5th (\u0915\u0915\u094D\u0937\u093E 5\u0935\u0940\u0902)",
          "Class 6th (\u0915\u0915\u094D\u0937\u093E 6\u0935\u0940\u0902)",
          "Class 7th (\u0915\u0915\u094D\u0937\u093E 7\u0935\u0940\u0902)",
          "Class 8th (\u0915\u0915\u094D\u0937\u093E 8\u0935\u0940\u0902)",
          "Class 9th (\u0915\u0915\u094D\u0937\u093E 9\u0935\u0940\u0902)",
          "Class 10th (\u0915\u0915\u094D\u0937\u093E 10\u0935\u0940\u0902)"
        ],
        required: true
      },
      {
        id: "tf-5",
        label: "\u092A\u0930\u0940\u0915\u094D\u0937\u093E \u0938\u0924\u094D\u0930 (Academic Session)",
        type: "text",
        placeholder: "2026-27",
        required: true
      },
      {
        id: "tf-6",
        label: "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F / \u0938\u094D\u0915\u0942\u0932 \u0915\u093E \u091A\u092F\u0928 (Select School / Center)",
        type: "school_select",
        placeholder: "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0915\u093E \u0928\u093E\u092E \u091A\u0941\u0928\u0947\u0902...",
        required: true,
        helpText: "\u0905\u092A\u0928\u0947 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0915\u093E \u0928\u093E\u092E \u090F\u0935\u0902 UDISE \u0915\u094B\u0921 \u091A\u0941\u0928\u0947\u0902"
      },
      {
        id: "tf-7",
        label: "\u092A\u0930\u0940\u0915\u094D\u0937\u093E \u0935\u093F\u0937\u092F (5 Compulsory Subjects)",
        type: "text",
        placeholder: "\u0939\u093F\u0928\u094D\u0926\u0940, \u0917\u0923\u093F\u0924, \u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928",
        required: true,
        helpText: "5 \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F \u0935\u093F\u0937\u092F: \u0939\u093F\u0928\u094D\u0926\u0940, \u0917\u0923\u093F\u0924, \u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928"
      },
      {
        id: "tf-8",
        label: "\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 (WhatsApp / SMS Alert)",
        type: "phone",
        placeholder: "10-digit mobile number",
        required: true
      }
    ]
  },
  {
    id: "form-scrutiny-2025",
    title: "10\u0935\u0940\u0902 / 12\u0935\u0940\u0902 \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u092C\u094B\u0930\u094D\u0921 \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u0938\u094D\u0915\u094D\u0930\u0942\u091F\u093F\u0928\u0940 \u090F\u0935\u0902 \u092A\u0941\u0928\u0930\u094D\u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928 \u0906\u0935\u0947\u0926\u0928 2025 (Scrutiny Form)",
    description: "\u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u092E\u093E\u0927\u094D\u092F\u092E\u093F\u0915 \u090F\u0935\u0902 \u0909\u091A\u094D\u091A \u092E\u093E\u0927\u094D\u092F\u092E\u093F\u0915 \u092C\u094B\u0930\u094D\u0921 \u092A\u0930\u0940\u0915\u094D\u0937\u093E 2025 \u0915\u0947 \u0909\u0924\u094D\u0924\u0930 \u092A\u0941\u0938\u094D\u0924\u093F\u0915\u093E\u0913\u0902 \u0915\u0940 \u0938\u094D\u0915\u094D\u0930\u0942\u091F\u093F\u0928\u0940 (Scrutiny / Re-totaling) \u0939\u0947\u0924\u0941 \u0911\u0928\u0932\u093E\u0907\u0928 \u0906\u0935\u0947\u0926\u0928 \u092A\u094D\u0930\u092A\u0924\u094D\u0930\u0964 \u092A\u094D\u0930\u0924\u093F \u0935\u093F\u0937\u092F \u0928\u093F\u0930\u094D\u0927\u093E\u0930\u093F\u0924 \u0936\u0941\u0932\u094D\u0915 \u20B9250/- \u0926\u0947\u092F \u0939\u094B\u0917\u093E\u0964",
    category: "Examination",
    status: "Published",
    applicationFee: 250,
    lastDate: "2025-08-31",
    createdAt: "2025-06-01",
    submissionsCount: 14,
    fields: [
      {
        id: "f-1",
        label: "\u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0930\u094D\u0925\u0940 \u0915\u093E \u0928\u093E\u092E (Candidate Name)",
        type: "text",
        placeholder: "Enter student full name",
        required: true
      },
      {
        id: "f-2",
        label: "\u0930\u094B\u0932 \u0928\u0902\u092C\u0930 (Board Roll No)",
        type: "text",
        placeholder: "e.g. 2510101",
        required: true
      },
      {
        id: "f-3",
        label: "\u092A\u0902\u091C\u0940\u092F\u0928 \u0938\u0902\u0916\u094D\u092F\u093E (Registration Number)",
        type: "text",
        placeholder: "e.g. BSE/2025/1001",
        required: true
      },
      {
        id: "f-4",
        label: "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F / \u0938\u094D\u0915\u0942\u0932 \u0915\u093E \u091A\u092F\u0928 (Select School)",
        type: "school_select",
        placeholder: "\u0938\u0939\u0930\u0938\u093E \u092F\u093E \u092E\u0927\u0947\u092A\u0941\u0930\u093E \u0915\u093E \u0938\u094D\u0915\u0942\u0932 \u091A\u0941\u0928\u0947\u0902...",
        required: true,
        helpText: "\u0938\u0939\u0930\u0938\u093E \u090F\u0935\u0902 \u092E\u0927\u0947\u092A\u0941\u0930\u093E UDISE+ \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0938\u094D\u0915\u0942\u0932 \u0938\u0942\u091A\u0940 \u0938\u0947 \u0905\u092A\u0928\u093E \u0938\u094D\u0915\u0942\u0932 \u0916\u094B\u091C\u0947\u0902"
      },
      {
        id: "f-5",
        label: "\u0938\u094D\u0915\u094D\u0930\u0942\u091F\u093F\u0928\u0940 \u0939\u0947\u0924\u0941 \u0935\u093F\u0937\u092F (Subject for Scrutiny)",
        type: "select",
        options: [
          "Mathematics (\u0917\u0923\u093F\u0924)",
          "Science / Physics (\u0935\u093F\u091C\u094D\u091E\u093E\u0928 / \u092D\u094C\u0924\u093F\u0915\u0940)",
          "Chemistry (\u0930\u0938\u093E\u092F\u0928 \u0935\u093F\u091C\u094D\u091E\u093E\u0928)",
          "Biology (\u091C\u0940\u0935 \u0935\u093F\u091C\u094D\u091E\u093E\u0928)",
          "Hindi (\u0939\u093F\u0928\u094D\u0926\u0940)",
          "English (\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u0940)",
          "Social Science (\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928)",
          "Commerce / Accountancy (\u0932\u0947\u0916\u093E\u0936\u093E\u0938\u094D\u0924\u094D\u0930)"
        ],
        required: true
      },
      {
        id: "f-6",
        label: "\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 (WhatsApp / SMS Alert)",
        type: "phone",
        placeholder: "10-digit mobile number",
        required: true
      },
      {
        id: "f-7",
        label: "\u0908\u092E\u0947\u0932 \u0906\u0908\u0921\u0940 (Email ID)",
        type: "email",
        placeholder: "student@example.com",
        required: false
      },
      {
        id: "f-8",
        label: "\u092A\u0941\u0928\u0930\u094D\u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928 \u0915\u093E \u0915\u093E\u0930\u0923 / \u091F\u093F\u092A\u094D\u092A\u0923\u0940 (Reason for Scrutiny)",
        type: "textarea",
        placeholder: "Explain reason for scrutiny or expected marks...",
        required: true
      }
    ]
  },
  {
    id: "form-affiliation-2025",
    title: "\u0928\u0935\u0940\u0928 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0938\u0902\u092C\u0926\u094D\u0927\u0924\u093E \u090F\u0935\u0902 \u0928\u0935\u0940\u0928\u0940\u0915\u0930\u0923 \u0906\u0935\u0947\u0926\u0928 2025-26 (School Affiliation Form)",
    description: "\u092C\u093F\u0939\u093E\u0930 \u0930\u093E\u091C\u094D\u092F \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 \u090F\u0935\u0902 \u0905\u0928\u0941\u0938\u0902\u0927\u093E\u0928 \u092A\u0930\u093F\u0937\u0926 \u0938\u0947 \u0938\u0902\u092C\u0926\u094D\u0927\u0924\u093E (Affiliation) \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u0947 \u092F\u093E \u092A\u0942\u0930\u094D\u0935 \u0938\u0902\u092C\u0926\u094D\u0927\u0924\u093E \u0915\u0947 \u0928\u0935\u0940\u0928\u0940\u0915\u0930\u0923 \u0939\u0947\u0924\u0941 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F\u094B\u0902 \u0926\u094D\u0935\u093E\u0930\u093E \u092D\u0930\u093E \u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u093E \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u092A\u094D\u0930\u092A\u0924\u094D\u0930\u0964",
    category: "Affiliation",
    status: "Published",
    applicationFee: 2500,
    lastDate: "2025-10-31",
    createdAt: "2025-05-15",
    submissionsCount: 8,
    fields: [
      {
        id: "af-1",
        label: "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F / \u0938\u0902\u0938\u094D\u0925\u093E\u0928 \u0915\u093E \u0928\u093E\u092E (Institution Name)",
        type: "text",
        placeholder: "e.g. Aadarsh Gyan Ganga High School",
        required: true
      },
      {
        id: "af-2",
        label: "\u092F\u0942-\u0921\u093E\u0907\u0938 \u0915\u094B\u0921 (11-Digit UDISE Code)",
        type: "text",
        placeholder: "e.g. 10111202922",
        required: true,
        helpText: "UDISE+ \u0926\u094D\u0935\u093E\u0930\u093E \u0906\u0935\u0902\u091F\u093F\u0924 11 \u0905\u0902\u0915\u094B\u0902 \u0915\u093E \u0915\u094B\u0921"
      },
      {
        id: "af-3",
        label: "\u0938\u0902\u092C\u0926\u094D\u0927\u0924\u093E \u0915\u093E \u092A\u094D\u0930\u0915\u093E\u0930 (Affiliation Type)",
        type: "select",
        options: [
          "Fresh Secondary (Class 10th) Affiliation",
          "Senior Secondary (+2 / 12th) Upgrade",
          "Annual Affiliation Renewal",
          "Vocational & Skill Training Center"
        ],
        required: true
      },
      {
        id: "af-4",
        label: "\u091C\u093F\u0932\u093E (District)",
        type: "select",
        options: [
          "Madhepura (\u092E\u0927\u0947\u092A\u0941\u0930\u093E)",
          "Saharsa (\u0938\u0939\u0930\u0938\u093E)",
          "Supaul (\u0938\u0941\u092A\u094C\u0932)",
          "Khagaria (\u0916\u0917\u0921\u093C\u093F\u092F\u093E)",
          "Purnia (\u092A\u0942\u0930\u094D\u0923\u093F\u092F\u093E)",
          "Other Bihar District"
        ],
        required: true
      },
      {
        id: "af-5",
        label: "\u092A\u094D\u0930\u093E\u091A\u093E\u0930\u094D\u092F / \u0928\u093F\u0926\u0947\u0936\u0915 \u0915\u093E \u0928\u093E\u092E (Principal / Director Name)",
        type: "text",
        placeholder: "Full name",
        required: true
      },
      {
        id: "af-6",
        label: "\u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0938\u0902\u092A\u0930\u094D\u0915 \u0928\u0902\u092C\u0930 (Contact Phone)",
        type: "phone",
        placeholder: "Mobile / Landline",
        required: true
      },
      {
        id: "af-7",
        label: "\u0938\u094D\u0915\u0942\u0932 \u092A\u0930\u093F\u0938\u0930 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 (Total Campus Area in Sq. Ft.)",
        type: "number",
        placeholder: "e.g. 15000",
        required: true
      },
      {
        id: "af-8",
        label: "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0915\u093E \u092A\u0942\u0930\u093E \u092A\u0924\u093E (Full Address)",
        type: "textarea",
        placeholder: "Village/Town, Post, Block, District, Pin Code",
        required: true
      }
    ]
  },
  {
    id: "form-correction-2025",
    title: "\u092A\u094D\u0930\u092E\u093E\u0923 \u092A\u0924\u094D\u0930 \u090F\u0935\u0902 \u0905\u0902\u0915\u092A\u0924\u094D\u0930 \u0935\u093F\u0935\u0930\u0923 \u0938\u0941\u0927\u093E\u0930 \u0906\u0935\u0947\u0926\u0928 (Correction in Certificate / Marksheet)",
    description: "\u091B\u093E\u0924\u094D\u0930-\u091B\u093E\u0924\u094D\u0930\u093E \u0915\u0947 \u0928\u093E\u092E, \u092E\u093E\u0924\u093E-\u092A\u093F\u0924\u093E \u0915\u0947 \u0928\u093E\u092E, \u091C\u0928\u094D\u092E\u0924\u093F\u0925\u093F, \u0935\u093F\u0937\u092F \u0905\u0925\u0935\u093E \u091C\u093E\u0924\u093F \u0936\u094D\u0930\u0947\u0923\u0940 \u092E\u0947\u0902 \u0932\u093F\u092A\u093F\u0915\u0940\u092F \u0924\u094D\u0930\u0941\u091F\u093F \u0938\u0941\u0927\u093E\u0930 \u0939\u0947\u0924\u0941 \u0914\u092A\u091A\u093E\u0930\u093F\u0915 \u0906\u0935\u0947\u0926\u0928 \u092A\u0924\u094D\u0930\u0964",
    category: "Correction",
    status: "Published",
    applicationFee: 300,
    lastDate: "2025-12-31",
    createdAt: "2025-06-10",
    submissionsCount: 19,
    fields: [
      {
        id: "cf-1",
        label: "\u091B\u093E\u0924\u094D\u0930 / \u091B\u093E\u0924\u094D\u0930\u093E \u0915\u093E \u0928\u093E\u092E (Candidate Name)",
        type: "text",
        placeholder: "Name as registered",
        required: true
      },
      {
        id: "cf-2",
        label: "\u092A\u0902\u091C\u0940\u092F\u0928 \u0938\u0902\u0916\u094D\u092F\u093E (Registration No)",
        type: "text",
        placeholder: "e.g. BSE/2025/1001",
        required: true
      },
      {
        id: "cf-3",
        label: "\u0938\u0941\u0927\u093E\u0930 \u0915\u093E \u092A\u094D\u0930\u0915\u093E\u0930 (Type of Correction Requested)",
        type: "select",
        options: [
          "Candidate Name Spelling Correction (\u0928\u093E\u092E \u0935\u0930\u094D\u0924\u0928\u0940 \u0938\u0941\u0927\u093E\u0930)",
          "Father's / Mother's Name Correction (\u0905\u092D\u093F\u092D\u093E\u0935\u0915 \u0928\u093E\u092E \u0938\u0941\u0927\u093E\u0930)",
          "Date of Birth (DOB) Correction (\u091C\u0928\u094D\u092E\u0924\u093F\u0925\u093F \u0938\u0941\u0927\u093E\u0930)",
          "Subject Code / Stream Correction (\u0935\u093F\u0937\u092F / \u0938\u0902\u0915\u093E\u092F \u0938\u0941\u0927\u093E\u0930)",
          "Category (Gen/OBC/SC/ST) Correction (\u0936\u094D\u0930\u0947\u0923\u0940 \u0938\u0941\u0927\u093E\u0930)"
        ],
        required: true
      },
      {
        id: "cf-4",
        label: "\u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0917\u0932\u0924 \u0935\u093F\u0935\u0930\u0923 (Current Incorrect Value)",
        type: "text",
        placeholder: "\u091C\u094B \u092A\u094D\u0930\u092E\u093E\u0923\u092A\u0924\u094D\u0930 \u092A\u0930 \u0917\u0932\u0924 \u091B\u092A\u093E \u0939\u0948",
        required: true
      },
      {
        id: "cf-5",
        label: "\u0935\u093E\u0902\u091B\u093F\u0924 \u0938\u0939\u0940 \u0935\u093F\u0935\u0930\u0923 (Correct Required Value)",
        type: "text",
        placeholder: "\u091C\u094B \u0938\u0939\u0940 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F",
        required: true
      },
      {
        id: "cf-6",
        label: "\u0938\u0902\u092A\u0930\u094D\u0915 \u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 (Mobile Number)",
        type: "phone",
        placeholder: "10-digit number",
        required: true
      }
    ]
  },
  {
    id: "form-scholarship-2025",
    title: "\u092E\u0947\u0927\u093E\u0935\u0940 \u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F \u092F\u094B\u091C\u0928\u093E 2025-26 (Merit-Cum-Means Scholarship Scheme)",
    description: "\u0938\u0939\u0930\u0938\u093E, \u092E\u0927\u0947\u092A\u0941\u0930\u093E \u090F\u0935\u0902 \u0915\u094B\u0938\u0940 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u0915\u0947 \u092E\u0947\u0927\u093E\u0935\u0940 \u091B\u093E\u0924\u094D\u0930-\u091B\u093E\u0924\u094D\u0930\u093E\u0913\u0902 \u0939\u0947\u0924\u0941 \u20B912,000/- \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u0938\u0939\u093E\u092F\u0924\u093E \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F \u0906\u0935\u0947\u0926\u0928\u0964 \u0915\u094B\u0908 \u0906\u0935\u0947\u0926\u0928 \u0936\u0941\u0932\u094D\u0915 \u0928\u0939\u0940\u0902 (\u0928\u093F\u0936\u0941\u0932\u094D\u0915)\u0964",
    category: "Scholarship",
    status: "Published",
    applicationFee: 0,
    lastDate: "2025-09-30",
    createdAt: "2025-06-20",
    submissionsCount: 42,
    fields: [
      {
        id: "sc-1",
        label: "\u091B\u093E\u0924\u094D\u0930 / \u091B\u093E\u0924\u094D\u0930\u093E \u0915\u093E \u0928\u093E\u092E (Applicant Name)",
        type: "text",
        placeholder: "Full Name",
        required: true
      },
      {
        id: "sc-2",
        label: "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0915\u093E \u0928\u093E\u092E (School Name)",
        type: "school_select",
        placeholder: "Select school from directory...",
        required: true
      },
      {
        id: "sc-3",
        label: "10\u0935\u0940\u0902 \u092C\u094B\u0930\u094D\u0921 \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u092A\u094D\u0930\u093E\u092A\u094D\u0924\u093E\u0902\u0915 \u092A\u094D\u0930\u0924\u093F\u0936\u0924 (10th Percentage)",
        type: "number",
        placeholder: "e.g. 84.5",
        required: true
      },
      {
        id: "sc-4",
        label: "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0936\u094D\u0930\u0947\u0923\u0940 (Social Category)",
        type: "select",
        options: ["General (EWS)", "OBC / BC-1", "BC-2", "SC", "ST"],
        required: true
      },
      {
        id: "sc-5",
        label: "\u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u092A\u093E\u0930\u093F\u0935\u093E\u0930\u093F\u0915 \u0906\u092F (Annual Family Income in \u20B9)",
        type: "number",
        placeholder: "e.g. 120000",
        required: true
      },
      {
        id: "sc-6",
        label: "\u092C\u0948\u0902\u0915 \u0916\u093E\u0924\u093E \u0938\u0902\u0916\u094D\u092F\u093E (Bank Account Number)",
        type: "text",
        placeholder: "Account Number for DBT transfer",
        required: true
      },
      {
        id: "sc-7",
        label: "\u092C\u0948\u0902\u0915 IFSC \u0915\u094B\u0921 (Bank IFSC Code)",
        type: "text",
        placeholder: "e.g. SBIN0001234",
        required: true
      },
      {
        id: "sc-8",
        label: "\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 (Mobile Number)",
        type: "phone",
        placeholder: "Aadhaar linked phone",
        required: true
      }
    ]
  }
];
var INITIAL_FORM_SUBMISSIONS = [
  {
    id: "sub-101",
    formId: "form-scrutiny-2025",
    formTitle: "10\u0935\u0940\u0902 / 12\u0935\u0940\u0902 \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u092C\u094B\u0930\u094D\u0921 \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u0938\u094D\u0915\u094D\u0930\u0942\u091F\u093F\u0928\u0940 \u090F\u0935\u0902 \u092A\u0941\u0928\u0930\u094D\u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928 \u0906\u0935\u0947\u0926\u0928 2025 (Scrutiny Form)",
    applicantName: "ROHIT KUMAR SINGH",
    applicantMobile: "9811223344",
    applicantEmail: "rohit.singh@gmail.com",
    submittedAt: "2025-06-25 11:20 AM",
    status: "Under Review",
    paymentStatus: "Paid",
    amount: 250,
    receiptNo: "RCP-SCR-9821",
    data: {
      "\u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0930\u094D\u0925\u0940 \u0915\u093E \u0928\u093E\u092E (Candidate Name)": "ROHIT KUMAR SINGH",
      "\u0930\u094B\u0932 \u0928\u0902\u092C\u0930 (Board Roll No)": "2510101",
      "\u092A\u0902\u091C\u0940\u092F\u0928 \u0938\u0902\u0916\u094D\u092F\u093E (Registration Number)": "BSE/2025/1001",
      "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F / \u0938\u094D\u0915\u0942\u0932 \u0915\u093E \u091A\u092F\u0928 (Select School)": "Grantted Dr. Ram Manohar Lohiya High School Sahugadh (10111202922)",
      "\u0938\u094D\u0915\u094D\u0930\u0942\u091F\u093F\u0928\u0940 \u0939\u0947\u0924\u0941 \u0935\u093F\u0937\u092F (Subject for Scrutiny)": "Mathematics (\u0917\u0923\u093F\u0924)",
      "\u092E\u094B\u092C\u093E\u0907\u0932 \u0928\u0902\u092C\u0930 (WhatsApp / SMS Alert)": "9811223344",
      "\u092A\u0941\u0928\u0930\u094D\u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928 \u0915\u093E \u0915\u093E\u0930\u0923 / \u091F\u093F\u092A\u094D\u092A\u0923\u0940 (Reason for Scrutiny)": "I attempted all 6 long questions correctly, expecting at least 15 more marks."
    }
  },
  {
    id: "sub-102",
    formId: "form-affiliation-2025",
    formTitle: "\u0928\u0935\u0940\u0928 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0938\u0902\u092C\u0926\u094D\u0927\u0924\u093E \u090F\u0935\u0902 \u0928\u0935\u0940\u0928\u0940\u0915\u0930\u0923 \u0906\u0935\u0947\u0926\u0928 2025-26 (School Affiliation Form)",
    applicantName: "DR. S. K. JHA (DIRECTOR)",
    applicantMobile: "9431005522",
    applicantEmail: "info@kiranpublicschool.in",
    submittedAt: "2025-06-28 03:45 PM",
    status: "Approved",
    paymentStatus: "Paid",
    amount: 2500,
    receiptNo: "RCP-AFF-4412",
    data: {
      "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F / \u0938\u0902\u0938\u094D\u0925\u093E\u0928 \u0915\u093E \u0928\u093E\u092E (Institution Name)": "Kiran Public School Madhepura",
      "\u092F\u0942-\u0921\u093E\u0907\u0938 \u0915\u094B\u0921 (11-Digit UDISE Code)": "10111203442",
      "\u0938\u0902\u092C\u0926\u094D\u0927\u0924\u093E \u0915\u093E \u092A\u094D\u0930\u0915\u093E\u0930 (Affiliation Type)": "Senior Secondary (+2 / 12th) Upgrade",
      "\u091C\u093F\u0932\u093E (District)": "Madhepura (\u092E\u0927\u0947\u092A\u0941\u0930\u093E)",
      "\u092A\u094D\u0930\u093E\u091A\u093E\u0930\u094D\u092F / \u0928\u093F\u0926\u0947\u0936\u0915 \u0915\u093E \u0928\u093E\u092E (Principal / Director Name)": "Dr. S. K. Jha",
      "\u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0938\u0902\u092A\u0930\u094D\u0915 \u0928\u0902\u092C\u0930 (Contact Phone)": "9431005522",
      "\u0938\u094D\u0915\u0942\u0932 \u092A\u0930\u093F\u0938\u0930 \u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932 (Total Campus Area in Sq. Ft.)": "32000",
      "\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0915\u093E \u092A\u0942\u0930\u093E \u092A\u0924\u093E (Full Address)": "Ward No 12, Main Road, Madhepura, Bihar - 852113"
    }
  }
];
var INITIAL_GALLERY = [
  {
    id: "gal-1",
    title: "Annual Girl Student Merit Felicitation & Shield Distribution",
    titleHindi: "\u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u092E\u0947\u0927\u093E \u0938\u092E\u094D\u092E\u093E\u0928 \u090F\u0935\u0902 \u092C\u093E\u0932\u093F\u0915\u093E \u092A\u094D\u0930\u0924\u093F\u092D\u093E \u092A\u0941\u0930\u0938\u094D\u0915\u093E\u0930 \u0938\u092E\u093E\u0930\u094B\u0939",
    category: "Awards & Distribution",
    imageUrl: "/assets/images/bihar_student_awards_1789140543552.jpg",
    date: "2025-05-18",
    caption: "\u092E\u0927\u0947\u092A\u0941\u0930\u093E \u092A\u0930\u093F\u0937\u0926 \u0926\u094D\u0935\u093E\u0930\u093E \u0906\u092F\u094B\u091C\u093F\u0924 \u092D\u0935\u094D\u092F \u0938\u092E\u093E\u0930\u094B\u0939 \u092E\u0947\u0902 \u0909\u0924\u094D\u0915\u0943\u0937\u094D\u091F \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928 \u0915\u0930\u0928\u0947 \u0935\u093E\u0932\u0940 \u092E\u0947\u0927\u093E\u0935\u0940 \u091B\u093E\u0924\u094D\u0930\u093E \u0915\u094B \u092E\u0902\u091A \u092A\u0930 \u0936\u0940\u0932\u094D\u0921, \u092E\u0947\u0921\u0932 \u090F\u0935\u0902 \u092A\u094D\u0930\u0936\u0938\u094D\u0924\u093F \u092A\u0924\u094D\u0930 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0947 \u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0905\u0924\u093F\u0925\u093F\u0917\u0923\u0964",
    featured: true
  },
  {
    id: "gal-2",
    title: "Madhepura Teachers Council & Academic Delegation Assembly",
    titleHindi: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u091C\u0917\u091C\u0940\u0935\u0928 \u0906\u0936\u094D\u0930\u092E \u092E\u0927\u0947\u092A\u0941\u0930\u093E \u0936\u093F\u0915\u094D\u0937\u0915 \u090F\u0935\u0902 \u092A\u0930\u093F\u0937\u0926 \u092A\u094D\u0930\u0924\u093F\u0928\u093F\u0927\u093F \u092E\u0902\u0921\u0932",
    category: "Campus Life",
    imageUrl: "/assets/images/madhepura_school_teachers_1789140526358.jpg",
    date: "2025-04-12",
    caption: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u091C\u0917\u091C\u0940\u0935\u0928 \u0906\u0936\u094D\u0930\u092E (\u092E\u0927\u0947\u092A\u0941\u0930\u093E) \u092A\u0930\u093F\u0938\u0930 \u092E\u0947\u0902 \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u0917\u0941\u0923\u0935\u0924\u094D\u0924\u093E \u0909\u0928\u094D\u0928\u092F\u0928, \u0921\u093F\u091C\u093F\u091F\u0932 \u092A\u0902\u091C\u0940\u092F\u0928 \u0924\u0925\u093E \u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928 \u092E\u093E\u0928\u0915\u094B\u0902 \u092A\u0930 \u0938\u092E\u0940\u0915\u094D\u0937\u093E \u092C\u0948\u0920\u0915\u0964",
    featured: true
  },
  {
    id: "gal-3",
    title: "State Level Fine Arts & Cultural Student Excellence Award",
    titleHindi: "\u0930\u093E\u091C\u094D\u092F \u0938\u094D\u0924\u0930\u0940\u092F \u091A\u093F\u0924\u094D\u0930\u0915\u0932\u093E \u090F\u0935\u0902 \u0938\u093E\u0902\u0938\u094D\u0915\u0943\u0924\u093F\u0915 \u092A\u094D\u0930\u0924\u093F\u092D\u093E \u0938\u092E\u094D\u092E\u093E\u0928",
    category: "Awards & Distribution",
    imageUrl: "/assets/images/girl_art_award_ceremony_1789140696861.jpg",
    date: "2025-03-05",
    caption: "\u092E\u093E\u0927\u094D\u092F\u092E\u093F\u0915 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0915\u0940 \u091B\u093E\u0924\u094D\u0930\u093E \u0915\u094B \u0909\u0924\u094D\u0915\u0943\u0937\u094D\u091F \u091A\u093F\u0924\u094D\u0930\u0915\u0932\u093E \u090F\u0935\u0902 \u0928\u0935\u093E\u091A\u093E\u0930 \u092A\u094D\u0930\u0926\u0930\u094D\u0936\u0928 \u0939\u0947\u0924\u0941 \u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0905\u0924\u093F\u0925\u093F \u0926\u094D\u0935\u093E\u0930\u093E \u092E\u0947\u0921\u0932 \u090F\u0935\u0902 \u0938\u092E\u094D\u092E\u093E\u0928 \u092A\u0924\u094D\u0930 \u092D\u0947\u0902\u091F\u0964",
    featured: true
  },
  {
    id: "gal-4",
    title: "Grand Annual Students Assembly & Academic Convention",
    titleHindi: "\u0935\u093F\u0936\u093E\u0932 \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u091B\u093E\u0924\u094D\u0930 \u0938\u092E\u094D\u092E\u0947\u0932\u0928 \u090F\u0935\u0902 \u092A\u094D\u0930\u0924\u093F\u092D\u093E \u0938\u092E\u094D\u092E\u093E\u0928 \u092E\u0902\u0921\u092A, \u092E\u0927\u0947\u092A\u0941\u0930\u093E",
    category: "Campus Life",
    imageUrl: "/assets/images/bihar_student_gathering_1789140582732.jpg",
    date: "2025-02-14",
    caption: "\u092D\u0935\u094D\u092F \u0936\u093E\u092E\u093F\u092F\u093E\u0928\u093E \u092E\u0902\u0921\u092A \u092E\u0947\u0902 \u090F\u0915\u0924\u094D\u0930\u093F\u0924 \u0938\u0948\u0915\u0921\u093C\u094B\u0902 \u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u0935 \u092E\u093E\u0927\u094D\u092F\u092E\u093F\u0915 \u091B\u093E\u0924\u094D\u0930-\u091B\u093E\u0924\u094D\u0930\u093E\u090F\u0902, \u0936\u093F\u0915\u094D\u0937\u0915 \u090F\u0935\u0902 \u0905\u092D\u093F\u092D\u093E\u0935\u0915\u0917\u0923\u0964",
    featured: true
  },
  {
    id: "gal-5",
    title: "Board Examination Registration & Admit Card Distribution",
    titleHindi: "\u0906\u0926\u0930\u094D\u0936 \u0938\u0902\u0915\u0941\u0932 \u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u092A\u0902\u091C\u0940\u092F\u0928 \u092A\u0924\u094D\u0930 \u0935\u093F\u0924\u0930\u0923",
    imageUrl: "/assets/images/students_exam_forms_1789140710491.jpg",
    category: "Examination",
    date: "2025-01-20",
    caption: "\u092A\u0930\u093F\u0937\u0926 \u0938\u0947 \u0938\u0902\u092C\u0926\u094D\u0927 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F\u094B\u0902 \u092E\u0947\u0902 \u091B\u093E\u0924\u094D\u0930\u094B\u0902 \u0915\u094B \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u092C\u094B\u0930\u094D\u0921 \u092A\u0902\u091C\u0940\u092F\u0928 \u092A\u094D\u0930\u092A\u0924\u094D\u0930 \u090F\u0935\u0902 \u0921\u093F\u091C\u093F\u091F\u0932 \u092A\u094D\u0930\u0935\u0947\u0936 \u092A\u0924\u094D\u0930 \u092A\u094D\u0930\u0926\u093E\u0928 \u0915\u0930\u0924\u0947 \u0936\u093F\u0915\u094D\u0937\u0915\u0964",
    featured: false
  },
  {
    id: "gal-6",
    title: "Utkramit Madhya Vidyalaya Morsanda Madhepura Students Queue",
    titleHindi: "\u0909\u0924\u094D\u0915\u094D\u0930\u092E\u093F\u0924 \u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u092E\u094B\u0930\u0938\u0902\u0921\u093E \u092E\u0927\u0947\u092A\u0941\u0930\u093E \u0905\u0928\u0941\u0936\u093E\u0938\u093F\u0924 \u0915\u0924\u093E\u0930",
    imageUrl: "/assets/images/madhepura_school_queue_1789140682148.jpg",
    category: "Campus Life",
    date: "2025-01-26",
    caption: "\u0917\u0941\u0932\u093E\u092C\u0940-\u0928\u093E\u0930\u0902\u0917\u0940 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u092D\u0935\u0928 \u0915\u0947 \u092C\u093E\u0939\u0930 \u092A\u094D\u0930\u093E\u0930\u094D\u0925\u0928\u093E \u0938\u092D\u093E \u090F\u0935\u0902 \u0928\u093F\u092F\u092E\u093F\u0924 \u0915\u0915\u094D\u0937\u093E \u0938\u0902\u091A\u093E\u0932\u0928 \u0939\u0947\u0924\u0941 \u0905\u0928\u0941\u0936\u093E\u0938\u093F\u0924 \u092A\u0902\u0915\u094D\u0924\u093F\u092C\u0926\u094D\u0927 \u091B\u093E\u0924\u094D\u0930-\u091B\u093E\u0924\u094D\u0930\u093E\u090F\u0902\u0964",
    featured: false
  },
  {
    id: "gal-7",
    title: "Utkramit Uccha Madhyamik +2 School Tiyar Tola Phulaut Assembly",
    titleHindi: "\u0909\u0924\u094D\u0915\u094D\u0930\u092E\u093F\u0924 \u0909\u091A\u094D\u091A \u092E\u093E\u0927\u094D\u092F\u092E\u093F\u0915 +2 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0924\u093F\u092F\u0930 \u091F\u094B\u0932\u093E \u092B\u0941\u0932\u094C\u0924 \u092A\u0930\u093F\u0938\u0930",
    imageUrl: "/assets/images/bihar_school_assembly_1789140559004.jpg",
    category: "Campus Life",
    date: "2024-11-14",
    caption: "\u091A\u094C\u0938\u093E, \u092E\u0927\u0947\u092A\u0941\u0930\u093E \u0938\u094D\u0925\u093F\u0924 \u0909\u091A\u094D\u091A \u092E\u093E\u0927\u094D\u092F\u092E\u093F\u0915 \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u092A\u0930\u093F\u0938\u0930 \u092E\u0947\u0902 \u0905\u0928\u0941\u0936\u093E\u0938\u093F\u0924 \u092A\u094D\u0930\u093E\u0930\u094D\u0925\u0928\u093E \u090F\u0935\u0902 \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u0938\u0924\u094D\u0930\u0964",
    featured: false
  },
  {
    id: "gal-8",
    title: "Council Merit Medal & Educational Scholarship Conferment",
    titleHindi: "\u092A\u0930\u093F\u0937\u0926 \u092E\u0947\u0927\u093E\u0935\u0940 \u091B\u093E\u0924\u094D\u0930-\u091B\u093E\u0924\u094D\u0930\u093E \u092E\u0947\u0921\u0932 \u090F\u0935\u0902 \u091B\u093E\u0924\u094D\u0930\u0935\u0943\u0924\u094D\u0924\u093F \u0935\u093F\u0924\u0930\u0923",
    imageUrl: "/assets/images/bihar_student_awards_1789140543552.jpg",
    category: "Awards & Distribution",
    date: "2024-12-05",
    caption: "\u0915\u0915\u094D\u0937\u093E 6\u0920\u0940 \u0938\u0947 10\u0935\u0940\u0902 \u0924\u0915 \u0915\u0947 \u092E\u0947\u0927\u093E\u0935\u0940 \u091B\u093E\u0924\u094D\u0930-\u091B\u093E\u0924\u094D\u0930\u093E\u0913\u0902 \u0915\u094B \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u092E\u0947\u0902 \u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u0905\u0902\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0928\u0947 \u092A\u0930 \u0938\u092E\u094D\u092E\u093E\u0928\u0964",
    featured: true
  }
];
var initialStudents = INITIAL_STUDENTS;
var initialResults = INITIAL_RESULTS;
var initialVacancies = INITIAL_VACANCIES;
var initialApplications = INITIAL_JOB_APPLICATIONS;
var initialPayments = INITIAL_PAYMENTS;
var initialCertificates = INITIAL_CERTIFICATES;
var initialNotifications = INITIAL_NOTIFICATIONS;
var initialCustomForms = INITIAL_CUSTOM_FORMS;
var initialFormSubmissions = INITIAL_FORM_SUBMISSIONS;
var initialGallery = INITIAL_GALLERY;

// server/services/dataStore.ts
var UnifiedDataStore = class {
  constructor() {
    this.memory = {
      students: [...initialStudents],
      results: [...initialResults],
      vacancies: [...initialVacancies],
      applications: [...initialApplications],
      payments: [...initialPayments],
      certificates: [...initialCertificates],
      notifications: [...initialNotifications],
      forms: [...initialCustomForms],
      submissions: [...initialFormSubmissions],
      gallery: [...initialGallery]
    };
  }
  isFirestoreReady() {
    return !!serverDb;
  }
  // ==========================================
  // STUDENTS (Cloud Firestore)
  // ==========================================
  async getStudents(filter) {
    if (serverDb) {
      try {
        const colRef = (0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.STUDENTS);
        let q = (0, import_firestore.query)(colRef);
        if (filter?.course) {
          q = (0, import_firestore.query)(colRef, (0, import_firestore.where)("course", "==", filter.course));
        }
        if (filter?.limit) {
          q = (0, import_firestore.query)(q, (0, import_firestore.limit)(filter.limit));
        }
        const snap = await (0, import_firestore.getDocs)(q);
        if (!snap.empty) {
          let list = snap.docs.map((d) => d.data());
          if (filter?.search) {
            const s = filter.search.toLowerCase();
            list = list.filter(
              (st) => st.name.toLowerCase().includes(s) || st.regNo.toLowerCase().includes(s) || st.rollNo.toLowerCase().includes(s)
            );
          }
          return list;
        }
      } catch (err) {
        console.warn("[FIRESTORE] getStudents error, falling back to cache:", err?.message);
      }
    }
    let results = [...this.memory.students];
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      results = results.filter(
        (st) => st.name.toLowerCase().includes(s) || st.regNo.toLowerCase().includes(s) || st.rollNo.toLowerCase().includes(s)
      );
    }
    if (filter?.course) {
      results = results.filter((st) => st.course === filter.course);
    }
    if (filter?.limit) {
      results = results.slice(0, filter.limit);
    }
    return results;
  }
  async getStudentByRegOrRoll(identifier) {
    const clean = identifier.trim().toLowerCase();
    if (serverDb) {
      try {
        const colRef = (0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.STUDENTS);
        const docSnap = await (0, import_firestore.getDoc)((0, import_firestore.doc)(colRef, clean.toUpperCase()));
        if (docSnap.exists()) {
          return docSnap.data();
        }
        const qReg = (0, import_firestore.query)(colRef, (0, import_firestore.where)("regNo", "==", identifier.trim()));
        const snapReg = await (0, import_firestore.getDocs)(qReg);
        if (!snapReg.empty) {
          return snapReg.docs[0].data();
        }
        const qRoll = (0, import_firestore.query)(colRef, (0, import_firestore.where)("rollNo", "==", identifier.trim()));
        const snapRoll = await (0, import_firestore.getDocs)(qRoll);
        if (!snapRoll.empty) {
          return snapRoll.docs[0].data();
        }
      } catch (err) {
        console.warn("[FIRESTORE] getStudentByRegOrRoll query fallback:", err?.message);
      }
    }
    const found = this.memory.students.find(
      (st) => st.regNo.toLowerCase() === clean || st.rollNo.toLowerCase() === clean || st.id.toLowerCase() === clean
    );
    return found || null;
  }
  async saveStudent(student) {
    const existingIndex = this.memory.students.findIndex((s) => s.regNo === student.regNo || s.id === student.id);
    if (existingIndex >= 0) {
      this.memory.students[existingIndex] = { ...this.memory.students[existingIndex], ...student };
    } else {
      this.memory.students.unshift(student);
    }
    if (serverDb) {
      try {
        const docId = student.id || student.regNo.replace(/\//g, "_");
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.STUDENTS, docId), {
          ...student,
          _updatedAt: (0, import_firestore.serverTimestamp)()
        }, { merge: true });
      } catch (err) {
        console.warn("[FIRESTORE] saveStudent fallback:", err?.message);
      }
    }
    return student;
  }
  async deleteStudent(idOrReg) {
    const idx = this.memory.students.findIndex((s) => s.id === idOrReg || s.regNo === idOrReg);
    let matchedStudent = null;
    if (idx >= 0) {
      matchedStudent = this.memory.students[idx];
      this.memory.students.splice(idx, 1);
    }
    if (serverDb) {
      try {
        const colRef = (0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.STUDENTS);
        const cleanId = idOrReg.replace(/\//g, "_");
        const idsToDelete = /* @__PURE__ */ new Set([idOrReg, cleanId]);
        if (matchedStudent) {
          if (matchedStudent.id) idsToDelete.add(matchedStudent.id);
          if (matchedStudent.regNo) {
            idsToDelete.add(matchedStudent.regNo);
            idsToDelete.add(matchedStudent.regNo.replace(/\//g, "_"));
          }
        }
        for (const docId of idsToDelete) {
          try {
            await (0, import_firestore.deleteDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.STUDENTS, docId));
          } catch {
          }
        }
        const qId = (0, import_firestore.query)(colRef, (0, import_firestore.where)("id", "==", idOrReg));
        const snapId = await (0, import_firestore.getDocs)(qId);
        for (const d of snapId.docs) {
          try {
            await (0, import_firestore.deleteDoc)(d.ref);
          } catch {
          }
        }
        const qReg = (0, import_firestore.query)(colRef, (0, import_firestore.where)("regNo", "==", idOrReg));
        const snapReg = await (0, import_firestore.getDocs)(qReg);
        for (const d of snapReg.docs) {
          try {
            await (0, import_firestore.deleteDoc)(d.ref);
          } catch {
          }
        }
        if (matchedStudent && matchedStudent.regNo && matchedStudent.regNo !== idOrReg) {
          const qMatchedReg = (0, import_firestore.query)(colRef, (0, import_firestore.where)("regNo", "==", matchedStudent.regNo));
          const snapMatchedReg = await (0, import_firestore.getDocs)(qMatchedReg);
          for (const d of snapMatchedReg.docs) {
            try {
              await (0, import_firestore.deleteDoc)(d.ref);
            } catch {
            }
          }
        }
      } catch (err) {
        console.warn("[FIRESTORE] deleteStudent fallback:", err?.message);
      }
    }
    return true;
  }
  // ==========================================
  // RESULTS (Cloud Firestore)
  // ==========================================
  async getResults() {
    if (serverDb) {
      try {
        const snap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.RESULTS));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data());
        }
      } catch (err) {
        console.warn("[FIRESTORE] getResults error:", err?.message);
      }
    }
    return this.memory.results;
  }
  async searchResult(rollNo, regNo) {
    const cleanRoll = rollNo?.trim();
    const cleanReg = regNo?.trim();
    if (serverDb && (cleanRoll || cleanReg)) {
      try {
        const colRef = (0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.RESULTS);
        if (cleanRoll) {
          const q = (0, import_firestore.query)(colRef, (0, import_firestore.where)("rollNo", "==", cleanRoll));
          const snap = await (0, import_firestore.getDocs)(q);
          if (!snap.empty) return snap.docs[0].data();
        }
        if (cleanReg) {
          const q = (0, import_firestore.query)(colRef, (0, import_firestore.where)("studentRegNo", "==", cleanReg));
          const snap = await (0, import_firestore.getDocs)(q);
          if (!snap.empty) return snap.docs[0].data();
        }
      } catch (err) {
        console.warn("[FIRESTORE] searchResult query error:", err?.message);
      }
    }
    const found = this.memory.results.find((r) => {
      const matchRoll = cleanRoll ? r.rollNo.toLowerCase() === cleanRoll.toLowerCase() : false;
      const matchReg = cleanReg ? r.studentRegNo.toLowerCase() === cleanReg.toLowerCase() : false;
      return cleanRoll && cleanReg ? matchRoll || matchReg : matchRoll || matchReg;
    });
    return found || null;
  }
  async saveResult(result) {
    const idx = this.memory.results.findIndex((r) => r.rollNo === result.rollNo || r.id === result.id);
    if (idx >= 0) {
      this.memory.results[idx] = result;
    } else {
      this.memory.results.unshift(result);
    }
    if (serverDb) {
      try {
        const docId = result.id || result.rollNo;
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.RESULTS, docId), {
          ...result,
          _updatedAt: (0, import_firestore.serverTimestamp)()
        }, { merge: true });
      } catch (err) {
        console.warn("[FIRESTORE] saveResult fallback:", err?.message);
      }
    }
    return result;
  }
  // ==========================================
  // NOTIFICATIONS (Cloud Firestore)
  // ==========================================
  async getNotifications() {
    if (serverDb) {
      try {
        const snap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.NOTIFICATIONS));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data());
        }
      } catch (err) {
        console.warn("[FIRESTORE] getNotifications fallback:", err?.message);
      }
    }
    return this.memory.notifications;
  }
  async saveNotification(notification) {
    const idx = this.memory.notifications.findIndex((n) => n.id === notification.id);
    if (idx >= 0) {
      this.memory.notifications[idx] = notification;
    } else {
      this.memory.notifications.unshift(notification);
    }
    if (serverDb) {
      try {
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.NOTIFICATIONS, notification.id), notification, { merge: true });
      } catch (err) {
        console.warn("[FIRESTORE] saveNotification fallback:", err?.message);
      }
    }
    return notification;
  }
  async deleteNotification(id) {
    this.memory.notifications = this.memory.notifications.filter((n) => n.id !== id);
    if (serverDb) {
      try {
        await (0, import_firestore.deleteDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.NOTIFICATIONS, id));
      } catch (err) {
        console.warn("[FIRESTORE] deleteNotification fallback:", err?.message);
      }
    }
    return true;
  }
  // ==========================================
  // GALLERY (Cloud Firestore)
  // ==========================================
  async getGallery() {
    if (serverDb) {
      try {
        const snap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.GALLERY));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data());
        }
      } catch (err) {
        console.warn("[FIRESTORE] getGallery fallback:", err?.message);
      }
    }
    return this.memory.gallery;
  }
  async saveGalleryItem(item) {
    const idx = this.memory.gallery.findIndex((g) => g.id === item.id);
    if (idx >= 0) {
      this.memory.gallery[idx] = item;
    } else {
      this.memory.gallery.unshift(item);
    }
    if (serverDb) {
      try {
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.GALLERY, item.id), item, { merge: true });
      } catch (err) {
        console.warn("[FIRESTORE] saveGalleryItem fallback:", err?.message);
      }
    }
    return item;
  }
  async deleteGalleryItem(id) {
    this.memory.gallery = this.memory.gallery.filter((g) => g.id !== id);
    if (serverDb) {
      try {
        await (0, import_firestore.deleteDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.GALLERY, id));
      } catch (err) {
        console.warn("[FIRESTORE] deleteGalleryItem fallback:", err?.message);
      }
    }
    return true;
  }
  // ==========================================
  // ONLINE FORMS & SUBMISSIONS (Cloud Firestore)
  // ==========================================
  async getForms() {
    if (serverDb) {
      try {
        const snap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data());
        }
      } catch (err) {
        console.warn("[FIRESTORE] getForms fallback:", err?.message);
      }
    }
    return this.memory.forms;
  }
  async getFormById(id) {
    if (serverDb) {
      try {
        const docSnap = await (0, import_firestore.getDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS, id));
        if (docSnap.exists()) {
          return docSnap.data();
        }
      } catch (err) {
        console.warn("[FIRESTORE] getFormById fallback:", err?.message);
      }
    }
    const found = this.memory.forms.find((f) => f.id === id);
    return found || null;
  }
  async saveForm(form) {
    const idx = this.memory.forms.findIndex((f) => f.id === form.id);
    if (idx >= 0) {
      this.memory.forms[idx] = form;
    } else {
      this.memory.forms.unshift(form);
    }
    if (serverDb) {
      try {
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.CUSTOM_FORMS, form.id), form, { merge: true });
      } catch (err) {
        console.warn("[FIRESTORE] saveForm fallback:", err?.message);
      }
    }
    return form;
  }
  async getSubmissions(formId) {
    if (serverDb) {
      try {
        const colRef = (0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.FORM_SUBMISSIONS);
        const q = formId ? (0, import_firestore.query)(colRef, (0, import_firestore.where)("formId", "==", formId)) : colRef;
        const snap = await (0, import_firestore.getDocs)(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data());
        }
      } catch (err) {
        console.warn("[FIRESTORE] getSubmissions fallback:", err?.message);
      }
    }
    if (formId) {
      return this.memory.submissions.filter((s) => s.formId === formId);
    }
    return this.memory.submissions;
  }
  async saveSubmission(submission) {
    this.memory.submissions.unshift(submission);
    if (serverDb) {
      try {
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.FORM_SUBMISSIONS, submission.id), {
          ...submission,
          _submittedAt: (0, import_firestore.serverTimestamp)()
        }, { merge: true });
      } catch (err) {
        console.warn("[FIRESTORE] saveSubmission fallback:", err?.message);
      }
    }
    return submission;
  }
  // ==========================================
  // PAYMENTS (Cloud Firestore)
  // ==========================================
  async savePayment(payment) {
    this.memory.payments.unshift(payment);
    if (serverDb) {
      try {
        const docId = payment.orderId || payment.transactionId || `PAY-${Date.now()}`;
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, FIRESTORE_COLLECTIONS.PAYMENTS, docId), {
          ...payment,
          _createdAt: (0, import_firestore.serverTimestamp)()
        }, { merge: true });
      } catch (err) {
        console.warn("[FIRESTORE] savePayment fallback:", err?.message);
      }
    }
    return payment;
  }
  async getPaymentByTxn(txnId) {
    const clean = txnId.trim().toLowerCase();
    if (serverDb) {
      try {
        const colRef = (0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.PAYMENTS);
        const q = (0, import_firestore.query)(colRef, (0, import_firestore.where)("transactionId", "==", txnId.trim()));
        const snap = await (0, import_firestore.getDocs)(q);
        if (!snap.empty) {
          return snap.docs[0].data();
        }
      } catch (err) {
        console.warn("[FIRESTORE] getPaymentByTxn fallback:", err?.message);
      }
    }
    const found = this.memory.payments.find((p) => {
      const pAny = p;
      return p.transactionId?.toLowerCase() === clean || p.receiptNo?.toLowerCase() === clean || p.refNumber?.toLowerCase() === clean || pAny.orderId?.toLowerCase() === clean || pAny.razorpayOrderId?.toLowerCase() === clean;
    });
    return found || null;
  }
  async getPayments() {
    if (serverDb) {
      try {
        const snap = await (0, import_firestore.getDocs)((0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.PAYMENTS));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data());
        }
      } catch (err) {
        console.warn("[FIRESTORE] getPayments fallback:", err?.message);
      }
    }
    return this.memory.payments;
  }
  // ==========================================
  // CERTIFICATES (Cloud Firestore)
  // ==========================================
  async verifyCertificate(serialNo) {
    const clean = serialNo.trim();
    if (serverDb) {
      try {
        const colRef = (0, import_firestore.collection)(serverDb, FIRESTORE_COLLECTIONS.CERTIFICATES);
        const qCert = (0, import_firestore.query)(colRef, (0, import_firestore.where)("certificateNo", "==", clean));
        const snapCert = await (0, import_firestore.getDocs)(qCert);
        if (!snapCert.empty) {
          return snapCert.docs[0].data();
        }
        const qReg = (0, import_firestore.query)(colRef, (0, import_firestore.where)("studentRegNo", "==", clean));
        const snapReg = await (0, import_firestore.getDocs)(qReg);
        if (!snapReg.empty) {
          return snapReg.docs[0].data();
        }
      } catch (err) {
        console.warn("[FIRESTORE] verifyCertificate fallback:", err?.message);
      }
    }
    const found = this.memory.certificates.find(
      (c) => c.certificateNo.toLowerCase() === clean.toLowerCase() || c.studentRegNo.toLowerCase() === clean.toLowerCase() || c.studentRollNo.toLowerCase() === clean.toLowerCase() || c.id.toLowerCase() === clean.toLowerCase()
    );
    return found || null;
  }
};
var dataStore = new UnifiedDataStore();

// server/controllers/authController.ts
var AuthController = class {
  /**
   * POST /api/admin/login or /api/auth/login
   */
  async login(req, res) {
    const username = (req.body.username || req.body.email || "").trim();
    const password = (req.body.password || "").trim();
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username/Email and Password are required."
      });
      return;
    }
    if (serverDb) {
      try {
        const snap = await (0, import_firestore.getDoc)((0, import_firestore.doc)(serverDb, "admin_config", "admin_portal_credentials"));
        if (snap.exists()) {
          const cloudConfig = snap.data();
          const cleanUser = username.toLowerCase().trim();
          const userMatch = cleanUser === cloudConfig.username?.toLowerCase() || cleanUser === cloudConfig.email?.toLowerCase() || cleanUser === config.admin.superUsername || config.admin.superUsername.includes("@") && cleanUser === config.admin.superUsername.split("@")[0];
          if (userMatch) {
            let passMatch = false;
            if (cloudConfig.passwordHash && cloudConfig.passwordSalt) {
              passMatch = verifyPassword(password, cloudConfig.passwordHash, cloudConfig.passwordSalt);
            } else if (cloudConfig.passwordPlain) {
              passMatch = safeStringCompare(password, cloudConfig.passwordPlain);
              if (passMatch) {
                try {
                  const { hash, salt } = hashPassword(password);
                  await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, "admin_config", "admin_portal_credentials"), {
                    username: config.admin.superUsername,
                    email: cloudConfig.email || config.admin.superUsername,
                    passwordHash: hash,
                    passwordSalt: salt,
                    passwordPlain: null,
                    // Wipe legacy plain password
                    updatedAt: (0, import_firestore.serverTimestamp)()
                  }, { merge: true });
                } catch {
                }
              }
            }
            if (passMatch) {
              const user = {
                username: username.trim(),
                email: cloudConfig.email || config.admin.superUsername,
                role: "Council Administrator",
                organization: config.board.name
              };
              const token = generateAdminToken(user);
              res.json({
                success: true,
                token,
                user,
                message: "Administrative authentication successful."
              });
              return;
            }
          }
        }
      } catch (err) {
        console.warn("[AUTH] Firestore admin credentials check failed:", err?.message);
      }
    }
    const validation = validateAdminCredentials(username, password);
    if (validation.isValid) {
      const user = {
        username: username.trim(),
        email: validation.email || config.admin.superUsername,
        role: validation.role || "Administrator",
        organization: config.board.name
      };
      const token = generateAdminToken(user);
      res.json({
        success: true,
        token,
        user,
        message: "Administrative authentication successful."
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: "Invalid administrative credentials. Please verify your email and password."
    });
  }
  /**
   * POST /api/auth/register (Student / Candidate Account Registration)
   */
  async registerCandidate(req, res) {
    const { name, email, phone, course, dob, password, fatherName, motherName } = req.body;
    if (!name || !course) {
      res.status(400).json({
        success: false,
        message: "Candidate Name and Course are mandatory fields for registration."
      });
      return;
    }
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const regNo = `BSE/${currentYear}/${Math.floor(1e3 + Math.random() * 9e3)}`;
    const rollNo = `${currentYear}08${Math.floor(100 + Math.random() * 900)}`;
    const studentRecord = {
      id: `std-${Date.now()}`,
      regNo,
      rollNo,
      name: name.toUpperCase().trim(),
      fatherName: (fatherName || "").toUpperCase().trim(),
      motherName: (motherName || "").toUpperCase().trim(),
      dob: dob || "01-01-2010",
      gender: req.body.gender || "Male",
      category: req.body.category || "General",
      course,
      stream: req.body.stream || "General",
      session: `${currentYear}-${currentYear + 1}`,
      centerCode: "10110901003",
      centerName: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
      schoolNameHindi: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
      udiseCode: "10110901003",
      mobile: phone || "7070530080",
      email: email || "candidate@example.com",
      address: req.body.address || "\u092E\u0927\u0947\u092A\u0941\u0930\u093E, \u092C\u093F\u0939\u093E\u0930 - 852113",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      subjects: [
        { code: "081", name: "\u0939\u093F\u0928\u094D\u0926\u0940", type: "Theory" },
        { code: "082", name: "\u0917\u0923\u093F\u0924", type: "Theory" },
        { code: "083", name: "\u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
        { code: "084", name: "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
        { code: "085", name: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928", type: "Theory" }
      ],
      registrationDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Verified",
      feeStatus: "Paid",
      examCenter: "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C (10110901003)"
    };
    await dataStore.saveStudent(studentRecord);
    if (serverDb) {
      try {
        const userId = email ? email.replace(/[^a-zA-Z0-9]/g, "_") : regNo.replace(/\//g, "_");
        await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, "users", userId), {
          uid: userId,
          regNo,
          rollNo,
          name: studentRecord.name,
          email: email || "",
          phone: phone || "",
          course,
          role: "candidate",
          createdAt: (0, import_firestore.serverTimestamp)()
        }, { merge: true });
      } catch (err) {
        console.warn("[AUTH] Error storing user profile in Firestore:", err?.message);
      }
    }
    const token = generateAdminToken({
      username: regNo,
      email: email || "",
      role: "Candidate",
      organization: config.board.name
    });
    res.json({
      success: true,
      message: "Student Registration successfully registered in Cloud Firestore!",
      regNo,
      rollNo,
      token,
      student: studentRecord
    });
  }
  /**
   * POST /api/auth/candidate-login
   */
  async candidateLogin(req, res) {
    const { identifier, dob } = req.body;
    if (!identifier) {
      res.status(400).json({
        success: false,
        message: "Registration Number or Roll Number is required."
      });
      return;
    }
    const student = await dataStore.getStudentByRegOrRoll(identifier);
    if (!student) {
      res.status(404).json({
        success: false,
        message: `Candidate record not found for '${identifier}'.`
      });
      return;
    }
    if (dob && student.dob && student.dob.trim() !== dob.trim()) {
      res.status(401).json({
        success: false,
        message: "Date of Birth does not match Council Records for this Registration Number."
      });
      return;
    }
    const token = generateAdminToken({
      username: student.regNo,
      email: student.email || "",
      role: "Candidate",
      organization: config.board.name
    });
    res.json({
      success: true,
      token,
      student,
      message: "Candidate authentication successful."
    });
  }
  /**
   * POST /api/admin/forgot-password or /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    const { email } = req.body;
    const cleanEmail = (email || "").toLowerCase().trim();
    if (cleanEmail === config.admin.superUsername || config.admin.superUsername.includes("@") && cleanEmail === config.admin.superUsername.split("@")[0]) {
      res.json({
        success: true,
        message: "Admin account verified. Please enter the authorized Council Security PIN to proceed."
      });
      return;
    }
    res.status(404).json({
      success: false,
      message: "The email provided is not registered as an authorized Board Administrator."
    });
  }
  /**
   * POST /api/admin/reset-password or /api/auth/reset-password
   */
  async resetPassword(req, res) {
    const { email, newPassword, securityPin } = req.body;
    const cleanEmail = (email || "").toLowerCase().trim();
    const isAuthorizedAdmin = cleanEmail === config.admin.superUsername || config.admin.superUsername.includes("@") && cleanEmail === config.admin.superUsername.split("@")[0];
    const isPinValid = validateCouncilSecurityPin(securityPin);
    if (isAuthorizedAdmin && isPinValid) {
      if (!newPassword || newPassword.length < 8) {
        res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters."
        });
        return;
      }
      const { hash, salt } = hashPassword(newPassword.trim());
      config.admin.superPassword = newPassword.trim();
      if (serverDb) {
        try {
          await (0, import_firestore.setDoc)((0, import_firestore.doc)(serverDb, "admin_config", "admin_portal_credentials"), {
            username: config.admin.superUsername,
            email: cleanEmail,
            passwordHash: hash,
            passwordSalt: salt,
            passwordPlain: null,
            // Wipe legacy plain field
            updatedAt: (0, import_firestore.serverTimestamp)()
          }, { merge: true });
        } catch (err) {
          console.warn("[AUTH] Failed to save updated password hash to Firestore:", err?.message);
        }
      }
      res.json({
        success: true,
        message: "Administrator password successfully updated and cryptographically hashed! You can now log in."
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: "Password reset rejected. Invalid email or unauthorized Security PIN."
    });
  }
  /**
   * GET /api/admin/me or /api/auth/me
   */
  async getProfile(req, res) {
    if (!req.adminUser) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
      return;
    }
    res.json({
      success: true,
      user: req.adminUser
    });
  }
};
var authController = new AuthController();

// server/services/storageService.ts
var import_client_s3 = require("@aws-sdk/client-s3");
var import_s3_request_presigner = require("@aws-sdk/s3-request-presigner");
var StorageService = class {
  constructor() {
    this.r2Client = null;
    this.bucketName = config.cloudflareR2.bucketName || "bsedrc";
    this.initR2();
  }
  initR2() {
    if (config.cloudflareR2.isConfigured) {
      try {
        this.r2Client = new import_client_s3.S3Client({
          region: "auto",
          endpoint: `https://${config.cloudflareR2.accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: config.cloudflareR2.accessKeyId,
            secretAccessKey: config.cloudflareR2.secretAccessKey
          }
        });
      } catch (err) {
        console.warn("[STORAGE] Cloudflare R2 init warning:", err);
      }
    }
  }
  isCloudflareConfigured() {
    return !!this.r2Client;
  }
  getBucketName() {
    return this.bucketName;
  }
  /**
   * Determine storage category directory prefix
   */
  getCategoryPrefix(category) {
    const cat = (category || "documents").toLowerCase();
    switch (cat) {
      case "profile":
      case "profiles":
        return { prefix: "profiles/", defaultPrivate: false };
      case "gallery":
        return { prefix: "gallery/", defaultPrivate: false };
      case "certificate":
      case "certificates":
        return { prefix: "certificates/", defaultPrivate: true };
      case "form":
      case "forms":
      case "form_submissions":
        return { prefix: "forms/", defaultPrivate: true };
      default:
        return { prefix: "documents/", defaultPrivate: true };
    }
  }
  /**
   * Centralized upload to Cloudflare R2 Object Storage
   * Supports: profile photos, gallery images, certificates, form attachments
   */
  async uploadFile(payload) {
    if (!this.r2Client) {
      throw new Error("Cloudflare R2 Object Storage is not initialized or configured. Check R2 credentials.");
    }
    const { fileName, fileData, contentType, category = "documents", customKey } = payload;
    if (!fileName || !fileData) {
      throw new Error("Missing required fileName or fileData for Cloudflare R2 upload.");
    }
    let buffer;
    let detectedMime = contentType || "application/octet-stream";
    if (Buffer.isBuffer(fileData)) {
      buffer = fileData;
    } else if (typeof fileData === "string") {
      const match = fileData.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = contentType || match[1];
        buffer = Buffer.from(match[2], "base64");
      } else {
        buffer = Buffer.from(fileData, "base64");
      }
    } else {
      throw new Error("Unsupported fileData type. Expected base64 string or Buffer.");
    }
    const sizeBytes = buffer.length;
    const MAX_SIZE = 10 * 1024 * 1024;
    if (sizeBytes > MAX_SIZE) {
      throw new Error(`File size (${(sizeBytes / 1024 / 1024).toFixed(2)} MB) exceeds maximum allowed size of 10MB.`);
    }
    const { prefix, defaultPrivate } = this.getCategoryPrefix(category);
    const isPrivate = payload.isPrivate !== void 0 ? payload.isPrivate : defaultPrivate;
    const ext = (fileName.split(".").pop() || "").toLowerCase();
    const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "pdf"];
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`Unsupported file format '.${ext}'. Only PDF documents and JPG, PNG, WEBP images are permitted.`);
    }
    if (["jpg", "jpeg"].includes(ext)) detectedMime = "image/jpeg";
    else if (ext === "png") detectedMime = "image/png";
    else if (ext === "webp") detectedMime = "image/webp";
    else if (ext === "pdf") detectedMime = "application/pdf";
    const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!ALLOWED_MIMES.includes(detectedMime)) {
      throw new Error(`File MIME type '${detectedMime}' is not permitted. Only PDF documents and standard web images are allowed.`);
    }
    const cleanBaseName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
    const sanitizedKey = `${prefix}${Date.now()}_${cleanBaseName}.${ext}`;
    await this.r2Client.send(new import_client_s3.PutObjectCommand({
      Bucket: this.bucketName,
      Key: sanitizedKey,
      Body: buffer,
      ContentType: detectedMime,
      Metadata: {
        category,
        isPrivate: String(isPrivate),
        originalName: encodeURIComponent(fileName.slice(0, 100))
      }
    }));
    let publicUrl = "";
    let signedUrl = "";
    if (!isPrivate) {
      publicUrl = config.cloudflareR2.publicUrl ? `${config.cloudflareR2.publicUrl.replace(/\/$/, "")}/${sanitizedKey}` : `https://${this.bucketName}.r2.cloudflarestorage.com/${sanitizedKey}`;
    } else {
      signedUrl = await this.getSignedDownloadUrl(sanitizedKey, 900);
    }
    return {
      success: true,
      url: isPrivate ? `/api/storage/file/${encodeURIComponent(sanitizedKey)}` : publicUrl,
      key: sanitizedKey,
      signedUrl: isPrivate ? signedUrl : void 0,
      isPrivate,
      category,
      provider: "Cloudflare R2 Object Storage",
      sizeBytes,
      contentType: detectedMime
    };
  }
  /**
   * Generates a time-limited presigned URL for private R2 objects (max 900s / 15 mins)
   */
  async getSignedDownloadUrl(key, expiresInSeconds = 900) {
    if (!this.r2Client) {
      throw new Error("Cloudflare R2 client is not initialized.");
    }
    const effectiveExpiry = Math.min(Math.max(expiresInSeconds, 60), 900);
    const command = new import_client_s3.GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });
    return (0, import_s3_request_presigner.getSignedUrl)(this.r2Client, command, { expiresIn: effectiveExpiry });
  }
  /**
   * Check if a file physically exists in Cloudflare R2
   */
  async checkFileExists(key) {
    if (!this.r2Client) {
      return { exists: false };
    }
    try {
      const response = await this.r2Client.send(new import_client_s3.HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      }));
      return {
        exists: true,
        sizeBytes: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata
      };
    } catch (err) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return { exists: false };
      }
      throw err;
    }
  }
  /**
   * Get object stream and metadata from Cloudflare R2
   */
  async getFileObject(key) {
    if (!this.r2Client) {
      throw new Error("Cloudflare R2 client is not initialized.");
    }
    const command = new import_client_s3.GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });
    const response = await this.r2Client.send(command);
    return {
      stream: response.Body,
      contentType: response.ContentType || "application/octet-stream",
      contentLength: response.ContentLength || 0,
      lastModified: response.LastModified
    };
  }
  /**
   * Delete an object from Cloudflare R2
   */
  async deleteFile(key) {
    if (!this.r2Client) {
      throw new Error("Cloudflare R2 client is not initialized.");
    }
    await this.r2Client.send(new import_client_s3.DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key
    }));
    return { success: true, key };
  }
  /**
   * List objects in Cloudflare R2 by prefix
   */
  async listObjects(prefix, maxKeys = 100) {
    if (!this.r2Client) {
      return [];
    }
    const response = await this.r2Client.send(new import_client_s3.ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
      MaxKeys: maxKeys
    }));
    return (response.Contents || []).map((item) => ({
      key: item.Key || "",
      size: item.Size,
      lastModified: item.LastModified
    }));
  }
};
var storageService = new StorageService();

// server/controllers/studentController.ts
var StudentController = class {
  /**
   * GET /api/students
   */
  async getStudents(req, res) {
    const search = req.query.search;
    const course = req.query.course;
    const limit = req.query.limit ? Number(req.query.limit) : void 0;
    const students = await dataStore.getStudents({ search, course, limit });
    res.json({
      success: true,
      count: students.length,
      students
    });
  }
  /**
   * GET /api/students/:regNo
   */
  async getStudentByRegNo(req, res) {
    const regNo = decodeURIComponent(req.params.regNo).trim();
    if (!regNo) {
      res.status(400).json({ success: false, message: "Registration number is required." });
      return;
    }
    const student = await dataStore.getStudentByRegOrRoll(regNo);
    if (!student) {
      res.status(404).json({
        success: false,
        message: `Candidate with Registration/Roll No '${regNo}' not found in Council Central Database.`
      });
      return;
    }
    res.json({
      success: true,
      student
    });
  }
  /**
   * POST /api/students
   */
  async registerOrUpdateStudent(req, res) {
    const body = req.body;
    if (!body.name || !body.course) {
      res.status(400).json({
        success: false,
        message: "Candidate Name and Course are mandatory fields."
      });
      return;
    }
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const regNo = body.regNo || `BSE/${currentYear}/${Math.floor(1e3 + Math.random() * 9e3)}`;
    const rollNo = body.rollNo || `${currentYear}08${Math.floor(100 + Math.random() * 900)}`;
    const newStudent = {
      id: body.id || `std-${Date.now()}`,
      regNo,
      rollNo,
      name: body.name.toUpperCase().trim(),
      fatherName: (body.fatherName || "").toUpperCase().trim(),
      motherName: (body.motherName || "").toUpperCase().trim(),
      dob: body.dob || "01-01-2010",
      gender: body.gender || "Male",
      category: body.category || "General",
      course: body.course,
      stream: body.stream || "General",
      session: body.session || `${currentYear}-${currentYear + 1}`,
      centerCode: body.centerCode || "10110901003",
      centerName: body.centerName || "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
      schoolNameHindi: body.schoolNameHindi || body.centerName || "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C",
      udiseCode: body.udiseCode || "10110901003",
      mobile: body.mobile || "7070530080",
      email: body.email || "candidate@example.com",
      address: body.address || "\u092E\u0927\u0947\u092A\u0941\u0930\u093E, \u092C\u093F\u0939\u093E\u0930 - 852113",
      photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      subjects: body.subjects && body.subjects.length > 0 ? body.subjects : [
        { code: "081", name: "\u0939\u093F\u0928\u094D\u0926\u0940", type: "Theory" },
        { code: "082", name: "\u0917\u0923\u093F\u0924", type: "Theory" },
        { code: "083", name: "\u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
        { code: "084", name: "\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928", type: "Theory" },
        { code: "085", name: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928", type: "Theory" }
      ],
      registrationDate: body.registrationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: body.status || "Verified",
      feeStatus: body.feeStatus || "Paid",
      examCenter: body.examCenter || "\u092E\u0927\u094D\u092F \u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F, \u0905\u0930\u094D\u0930\u093E\u0939\u093E, \u0918\u0948\u0932\u093E\u0922\u093C (10110901003)"
    };
    const saved = await dataStore.saveStudent(newStudent);
    res.json({
      success: true,
      student: saved,
      message: "Student record successfully saved."
    });
  }
  /**
   * DELETE /api/students/:id
   */
  async deleteStudent(req, res) {
    const id = req.params.id;
    const student = await dataStore.getStudentByRegOrRoll(id);
    if (student?.photoKey) {
      try {
        await storageService.deleteFile(student.photoKey);
      } catch (err) {
        console.warn("[STORAGE] Failed to clean up student R2 photo:", err?.message);
      }
    }
    await dataStore.deleteStudent(id);
    res.json({
      success: true,
      message: "Student record deleted successfully."
    });
  }
};
var studentController = new StudentController();

// server/controllers/resultController.ts
var ResultController = class {
  /**
   * GET /api/results
   */
  async getAllResults(req, res) {
    const results = await dataStore.getResults();
    res.json({
      success: true,
      count: results.length,
      results
    });
  }
  /**
   * GET /api/results/search?rollNumber=...&regNumber=...
   */
  async searchResult(req, res) {
    const rollNumber = (req.query.rollNumber || req.query.rollNo || "").trim();
    const regNumber = (req.query.regNumber || req.query.regNo || "").trim();
    if (!rollNumber && !regNumber) {
      res.status(400).json({
        success: false,
        message: "Please provide either Roll Number or Registration Number."
      });
      return;
    }
    const result = await dataStore.searchResult(rollNumber, regNumber);
    if (!result) {
      res.status(404).json({
        success: false,
        message: "No board examination result matched the provided credentials."
      });
      return;
    }
    res.json({
      success: true,
      result
    });
  }
  /**
   * POST /api/results (Admin only)
   */
  async saveResult(req, res) {
    const resultData = req.body;
    if (!resultData.rollNo || !resultData.candidateName) {
      res.status(400).json({
        success: false,
        message: "Roll Number and Candidate Name are required."
      });
      return;
    }
    const saved = await dataStore.saveResult(resultData);
    res.json({
      success: true,
      result: saved,
      message: "Examination result successfully published."
    });
  }
};
var resultController = new ResultController();

// server/services/paymentService.ts
var import_crypto3 = __toESM(require("crypto"), 1);
var PaymentService = class {
  constructor() {
    this.processedPayments = /* @__PURE__ */ new Set();
  }
  /**
   * Replay protection check
   */
  isPaymentProcessed(paymentId) {
    if (!paymentId) return false;
    return this.processedPayments.has(paymentId);
  }
  markPaymentProcessed(paymentId) {
    if (paymentId) {
      this.processedPayments.add(paymentId);
      if (this.processedPayments.size > 1e4) {
        const first = this.processedPayments.values().next().value;
        if (first) this.processedPayments.delete(first);
      }
    }
  }
  /**
   * Create an official payment order via Razorpay API or local treasury fallback
   */
  async createOrder(params) {
    const { amount, serviceType, candidateName, regNumber, email, phone } = params;
    const rawNum = Number(amount);
    if (isNaN(rawNum) || rawNum < 50 || rawNum > 25e3) {
      throw new Error("Invalid payment amount. Fee amount must be between \u20B950 and \u20B925,000.");
    }
    const payableAmount = Math.round(rawNum);
    let razorpayOrderId = null;
    if (config.razorpay.isRealGateway) {
      try {
        const basicAuth = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString("base64");
        const res = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: Math.round(payableAmount * 100),
            // paise
            currency: config.razorpay.currency,
            receipt: "BSE_" + Date.now().toString().slice(-8),
            notes: {
              serviceType: (serviceType || "Board Examination Fee").slice(0, 40),
              candidateName: (candidateName || "Candidate").slice(0, 40),
              regNumber: (regNumber || "").slice(0, 40)
            }
          })
        });
        if (res.ok) {
          const rzpData = await res.json();
          razorpayOrderId = rzpData.id;
        } else {
          console.warn("[RAZORPAY] Order creation gateway warning:", await res.text());
        }
      } catch (err) {
        console.warn("[RAZORPAY] Network error:", err.message);
      }
    }
    const orderId = razorpayOrderId || "ORD_" + Date.now() + "_" + Math.floor(100 + Math.random() * 900);
    const transactionId = "TXN_BSE_" + Math.floor(1e7 + Math.random() * 9e7);
    return {
      orderId,
      razorpayOrderId,
      transactionId,
      amount: payableAmount,
      currency: config.razorpay.currency,
      serviceType: serviceType || "Board Examination Fee",
      candidateName: candidateName || "Council Candidate",
      regNumber: regNumber || "",
      email: email || config.board.helplineEmail,
      phone: phone || config.board.helplinePhone,
      keyId: config.razorpay.keyId,
      hasRealGateway: !!razorpayOrderId,
      status: "created",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Verify Razorpay payment signature securely using HMAC SHA-256 with constant-time equality
   */
  verifySignature(payload) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
    if (config.razorpay.keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      try {
        const generatedSig = import_crypto3.default.createHmac("sha256", config.razorpay.keySecret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
        const genBuf = Buffer.from(generatedSig, "utf8");
        const rcvBuf = Buffer.from(razorpay_signature, "utf8");
        if (genBuf.length !== rcvBuf.length) {
          import_crypto3.default.timingSafeEqual(genBuf, genBuf);
          return false;
        }
        return import_crypto3.default.timingSafeEqual(genBuf, rcvBuf);
      } catch {
        return false;
      }
    }
    if (config.isProduction && (!razorpay_payment_id || !razorpay_order_id)) {
      return false;
    }
    return true;
  }
};
var paymentService = new PaymentService();

// server/controllers/paymentController.ts
var PaymentController = class {
  /**
   * POST /api/payments/create-order
   */
  async createOrder(req, res) {
    const { amount, serviceType, candidateName, regNumber, email, phone } = req.body;
    try {
      const order = await paymentService.createOrder({
        amount: Number(amount) || 650,
        serviceType: serviceType || "Board Examination Fee",
        candidateName: candidateName || "Candidate",
        regNumber,
        email,
        phone
      });
      await dataStore.savePayment(order);
      res.json({
        success: true,
        order
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Failed to initialize payment gateway order"
      });
    }
  }
  /**
   * POST /api/payments/verify
   */
  async verifyPayment(req, res) {
    const {
      orderId,
      transactionId,
      paymentMethod,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    const paymentTxnId = razorpay_payment_id || transactionId;
    if (paymentTxnId && paymentService.isPaymentProcessed(paymentTxnId)) {
      res.status(409).json({
        success: false,
        message: "This payment transaction has already been verified and recorded."
      });
      return;
    }
    const isSignatureValid = paymentService.verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });
    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        message: "Invalid cryptographic payment signature received from gateway."
      });
      return;
    }
    if (paymentTxnId) {
      paymentService.markPaymentProcessed(paymentTxnId);
    }
    const recordedPayment = {
      orderId: razorpay_order_id || orderId,
      transactionId: razorpay_payment_id || transactionId || "TXN_BSE_" + Math.floor(1e7 + Math.random() * 9e7),
      bankRef: "SBIN" + Math.floor(1e8 + Math.random() * 9e8),
      paymentMethod: paymentMethod || (razorpay_payment_id ? "Razorpay (UPI / Cards / Netbanking)" : "UPI / Card"),
      status: "SUCCESS",
      verified: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    await dataStore.savePayment(recordedPayment);
    res.json({
      success: true,
      payment: recordedPayment,
      message: "Fee payment successfully recorded in Council Central Treasury."
    });
  }
  /**
   * GET /api/payments
   */
  async getPayments(req, res) {
    const payments = await dataStore.getPayments();
    res.json({
      success: true,
      count: payments.length,
      payments
    });
  }
  /**
   * GET /api/payments/receipt/:txnId
   */
  async getReceipt(req, res) {
    const txnId = req.params.txnId;
    const payment = await dataStore.getPaymentByTxn(txnId);
    if (!payment) {
      res.status(404).json({
        success: false,
        message: `Transaction record '${txnId}' not found.`
      });
      return;
    }
    res.json({
      success: true,
      receipt: payment
    });
  }
};
var paymentController = new PaymentController();

// server/controllers/storageController.ts
var StorageController = class {
  /**
   * Helper to check authentication for private files
   */
  isAuthorized(req) {
    const authHeader = req.headers.authorization;
    let token = "";
    if (authHeader) {
      token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
    } else if (req.query.token && typeof req.query.token === "string") {
      token = req.query.token.trim();
    }
    if (!token) return false;
    const user = verifyAdminToken(token);
    return !!user;
  }
  /**
   * POST /api/storage/upload
   * Centralized Cloudflare R2 upload for:
   * - Profile photos (public)
   * - Gallery images (public)
   * - Certificates (private)
   * - Form submissions & attachments (private)
   */
  async upload(req, res) {
    const { fileName, fileData, contentType, category, isPrivate, customKey } = req.body;
    if (!fileName || !fileData) {
      res.status(400).json({
        success: false,
        message: "fileName and fileData (base64 string or buffer) are required."
      });
      return;
    }
    try {
      const result = await storageService.uploadFile({
        fileName,
        fileData,
        contentType,
        category,
        isPrivate: typeof isPrivate === "boolean" ? isPrivate : void 0,
        customKey
      });
      res.status(201).json(result);
    } catch (err) {
      console.error("[R2 UPLOAD ERROR]", err);
      res.status(500).json({
        success: false,
        message: err.message || "File upload to Cloudflare R2 failed"
      });
    }
  }
  /**
   * GET /api/storage/file/:key(*)
   * Download / Stream file from Cloudflare R2
   * Protects private files (certificates, forms, documents)
   */
  async getFile(req, res) {
    const rawKey = req.params.key || req.query.key;
    if (!rawKey) {
      res.status(400).json({ success: false, message: "File key is required." });
      return;
    }
    const key = decodeURIComponent(rawKey);
    const isPrivate = key.startsWith("certificates/") || key.startsWith("forms/") || key.startsWith("documents/");
    if (isPrivate && !this.isAuthorized(req)) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Access to private documents and certificates in Cloudflare R2 requires authentication."
      });
      return;
    }
    try {
      const { exists } = await storageService.checkFileExists(key);
      if (!exists) {
        res.status(404).json({
          success: false,
          error: "NotFound",
          message: `Object with key '${key}' does not exist in Cloudflare R2 bucket '${storageService.getBucketName()}'.`
        });
        return;
      }
      const fileObj = await storageService.getFileObject(key);
      res.setHeader("Content-Type", fileObj.contentType);
      if (fileObj.contentLength) {
        res.setHeader("Content-Length", fileObj.contentLength);
      }
      if (fileObj.lastModified) {
        res.setHeader("Last-Modified", fileObj.lastModified.toUTCString());
      }
      const ext = key.split(".").pop()?.toLowerCase() || "";
      const isImg = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
      res.setHeader("Content-Disposition", isImg ? "inline" : `attachment; filename="${key.split("/").pop()}"`);
      fileObj.stream.pipe(res);
    } catch (err) {
      console.error("[R2 GET FILE ERROR]", err);
      res.status(500).json({
        success: false,
        message: err.message || "Failed to retrieve file from Cloudflare R2"
      });
    }
  }
  /**
   * GET /api/storage/signed-url
   * Generate time-limited presigned URL for private R2 objects
   */
  async getSignedUrl(req, res) {
    const rawKey = req.query.key || "";
    if (!rawKey) {
      res.status(400).json({ success: false, message: 'Query parameter "key" is required.' });
      return;
    }
    const key = decodeURIComponent(rawKey);
    const isPrivate = key.startsWith("certificates/") || key.startsWith("forms/") || key.startsWith("documents/");
    if (isPrivate && !this.isAuthorized(req)) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Generating signed URLs for private objects requires authentication."
      });
      return;
    }
    try {
      const expiresIn = req.query.expiresIn ? Math.min(Number(req.query.expiresIn), 604800) : 3600;
      const signedUrl = await storageService.getSignedDownloadUrl(key, expiresIn);
      res.json({
        success: true,
        key,
        signedUrl,
        expiresInSeconds: expiresIn
      });
    } catch (err) {
      console.error("[R2 SIGNED URL ERROR]", err);
      res.status(500).json({
        success: false,
        message: err.message || "Failed to generate signed URL"
      });
    }
  }
  /**
   * DELETE /api/storage/file
   * Delete object from Cloudflare R2 (Admin protected)
   */
  async deleteFile(req, res) {
    const rawKey = req.body.key || req.query.key || req.params.key;
    if (!rawKey) {
      res.status(400).json({ success: false, message: "File key is required for deletion." });
      return;
    }
    const key = decodeURIComponent(rawKey);
    if (!this.isAuthorized(req)) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Deleting files from Cloudflare R2 requires admin authentication."
      });
      return;
    }
    try {
      const existsResult = await storageService.checkFileExists(key);
      if (!existsResult.exists) {
        res.status(404).json({
          success: false,
          message: `File '${key}' was not found in Cloudflare R2 bucket.`
        });
        return;
      }
      await storageService.deleteFile(key);
      res.json({
        success: true,
        message: `File '${key}' successfully deleted from Cloudflare R2.`,
        key
      });
    } catch (err) {
      console.error("[R2 DELETE ERROR]", err);
      res.status(500).json({
        success: false,
        message: err.message || "Failed to delete file from Cloudflare R2"
      });
    }
  }
  /**
   * GET /api/storage/verify/:key(*)
   * Check physical existence of file in R2
   */
  async verifyFile(req, res) {
    const rawKey = req.params.key || req.query.key;
    if (!rawKey) {
      res.status(400).json({ success: false, message: "File key is required." });
      return;
    }
    const key = decodeURIComponent(rawKey);
    try {
      const check = await storageService.checkFileExists(key);
      res.json({
        success: true,
        key,
        bucket: storageService.getBucketName(),
        exists: check.exists,
        sizeBytes: check.sizeBytes,
        contentType: check.contentType,
        lastModified: check.lastModified
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Verification check failed"
      });
    }
  }
  /**
   * GET /api/storage/status
   */
  async getStatus(req, res) {
    const isConfigured = storageService.isCloudflareConfigured();
    res.json({
      success: true,
      cloudflareR2Available: isConfigured,
      bucketName: storageService.getBucketName(),
      storageType: "Cloudflare R2 Object Storage",
      publicUrlConfigured: !!config.cloudflareR2.publicUrl,
      publicBaseUrl: config.cloudflareR2.publicUrl || ""
    });
  }
  /**
   * GET /api/storage/list
   * Admin-only object listing in R2
   */
  async list(req, res) {
    if (!this.isAuthorized(req)) {
      res.status(401).json({ success: false, error: "Unauthorized", message: "Admin authentication required." });
      return;
    }
    try {
      const prefix = req.query.prefix;
      const maxKeys = req.query.maxKeys ? Number(req.query.maxKeys) : 100;
      const objects = await storageService.listObjects(prefix, maxKeys);
      res.json({
        success: true,
        bucket: storageService.getBucketName(),
        count: objects.length,
        objects
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message || "List failed" });
    }
  }
};
var storageController = new StorageController();

// server/controllers/contentController.ts
var ContentController = class {
  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  async getNotifications(req, res) {
    const notifications = await dataStore.getNotifications();
    res.json({ success: true, count: notifications.length, notifications });
  }
  async saveNotification(req, res) {
    const item = req.body;
    if (!item.title) {
      res.status(400).json({ success: false, message: "Notification title is required" });
      return;
    }
    const saved = await dataStore.saveNotification(item);
    res.json({ success: true, notification: saved });
  }
  async deleteNotification(req, res) {
    const id = req.params.id;
    await dataStore.deleteNotification(id);
    res.json({ success: true, message: "Notification deleted" });
  }
  // ==========================================
  // GALLERY
  // ==========================================
  async getGallery(req, res) {
    const gallery = await dataStore.getGallery();
    res.json({ success: true, count: gallery.length, gallery });
  }
  async saveGalleryItem(req, res) {
    const item = req.body;
    if (!item.title || !item.imageUrl) {
      res.status(400).json({ success: false, message: "Title and Image URL are required" });
      return;
    }
    const saved = await dataStore.saveGalleryItem(item);
    res.json({ success: true, item: saved });
  }
  async deleteGalleryItem(req, res) {
    const id = req.params.id;
    try {
      const items = await dataStore.getGallery();
      const existing = items.find((g) => g.id === id);
      if (existing?.imageKey) {
        await storageService.deleteFile(existing.imageKey);
      }
    } catch (err) {
      console.warn("[STORAGE] Failed to clean up gallery R2 image:", err?.message);
    }
    await dataStore.deleteGalleryItem(id);
    res.json({ success: true, message: "Gallery item deleted" });
  }
  // ==========================================
  // ONLINE FORMS & SUBMISSIONS
  // ==========================================
  async getForms(req, res) {
    const forms = await dataStore.getForms();
    res.json({ success: true, count: forms.length, forms });
  }
  async getFormById(req, res) {
    const id = req.params.id;
    const form = await dataStore.getFormById(id);
    if (!form) {
      res.status(404).json({ success: false, message: `Form '${id}' not found` });
      return;
    }
    res.json({ success: true, form });
  }
  async saveForm(req, res) {
    const item = req.body;
    if (!item.title) {
      res.status(400).json({ success: false, message: "Form title is required" });
      return;
    }
    const saved = await dataStore.saveForm(item);
    res.json({ success: true, form: saved });
  }
  async submitForm(req, res) {
    const formId = req.params.id;
    const { applicantName, email, phone, data, formTitle, amount } = req.body;
    const submission = {
      id: `sub-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      formId,
      formTitle: formTitle || "Application Form",
      applicantName: applicantName || "Applicant",
      applicantMobile: phone || "7070530080",
      applicantEmail: email || "",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "Submitted",
      paymentStatus: amount && amount > 0 ? "Pending" : "Free",
      amount: Number(amount) || 0,
      receiptNo: `RCP-${Date.now().toString().slice(-6)}`,
      data: data || {}
    };
    const saved = await dataStore.saveSubmission(submission);
    res.json({
      success: true,
      submission: saved,
      message: "Application form successfully submitted to the Council."
    });
  }
  async getSubmissions(req, res) {
    const formId = req.query.formId;
    const submissions = await dataStore.getSubmissions(formId);
    res.json({ success: true, count: submissions.length, submissions });
  }
  // ==========================================
  // CERTIFICATE VERIFICATION
  // ==========================================
  async verifyCertificate(req, res) {
    const serialNo = decodeURIComponent(req.params.serialNo).trim();
    const certificate = await dataStore.verifyCertificate(serialNo);
    if (!certificate) {
      res.status(404).json({
        success: false,
        verified: false,
        message: `Certificate Serial Number '${serialNo}' is not registered in Council Digital Verification Archive.`
      });
      return;
    }
    res.json({
      success: true,
      verified: true,
      certificate
    });
  }
};
var contentController = new ContentController();

// server/services/geminiService.ts
var import_genai = require("@google/genai");
var genAIClient = null;
function getGenAI() {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn("[GEMINI] Failed to initialize GoogleGenAI client:", err);
    }
  }
  return genAIClient;
}
var GeminiService = class {
  /**
   * Generates AI assistance for candidate queries, syllabus, or board rules
   */
  async handleCandidateQuery(prompt, context) {
    const ai = getGenAI();
    if (ai) {
      try {
        const systemInstruction = `
You are the Official AI Academic Assistant for Bihar State Educational Development & Research Council (BSEDRC / BRSV & RCT - \u092C\u093F\u0939\u093E\u0930 \u0930\u093E\u091C\u094D\u092F \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 \u090F\u0935\u0902 \u0905\u0928\u0941\u0938\u0902\u0927\u093E\u0928 \u092A\u0930\u093F\u0937\u0926).
Office Address: Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar 852113.
Helpline: +91 7070530080, Email: adarshbiharsiksha@gmail.com.
You help students, teachers, and guardians with:
- Board examination schedules, syllabus, admit cards, and registration numbers.
- Results verification, re-evaluation, passing criteria (minimum 33% per subject, 300+ marks for 1st Division).
- Digital certificates, migration certificates, and online fee payments.
Respond politely in clear, formal Hindi and English (Bilingual or language chosen by user). Be concise, helpful, and official.
`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `${context ? `Context: ${context}

` : ""}User Query: ${prompt}`,
          config: {
            systemInstruction
          }
        });
        const reply = response.text || "";
        if (reply) {
          return {
            success: true,
            reply,
            source: "gemini"
          };
        }
      } catch (err) {
        console.warn("[GEMINI] generateContent error:", err.message);
      }
    }
    return {
      success: true,
      reply: `\u0928\u092E\u0938\u094D\u0924\u0947! \u092C\u093F\u0939\u093E\u0930 \u0930\u093E\u091C\u094D\u092F \u0936\u0948\u0915\u094D\u0937\u0923\u093F\u0915 \u0935\u093F\u0915\u093E\u0938 \u090F\u0935\u0902 \u0905\u0928\u0941\u0938\u0902\u0927\u093E\u0928 \u092A\u0930\u093F\u0937\u0926 (BSEDRC) \u0915\u0947 \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0938\u0939\u093E\u092F\u0924\u093E \u0915\u0947\u0902\u0926\u094D\u0930 \u092E\u0947\u0902 \u0906\u092A\u0915\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948\u0964
- \u092A\u0930\u0940\u0915\u094D\u0937\u093E \u0938\u0902\u092C\u0902\u0927\u0940 \u0915\u093F\u0938\u0940 \u092D\u0940 \u091C\u093E\u0928\u0915\u093E\u0930\u0940, \u092A\u094D\u0930\u0935\u0947\u0936 \u092A\u0924\u094D\u0930 \u092F\u093E \u0905\u0902\u0915\u092A\u0924\u094D\u0930 \u0938\u0924\u094D\u092F\u093E\u092A\u0928 \u0915\u0947 \u0932\u093F\u090F \u092A\u094B\u0930\u094D\u091F\u0932 \u0915\u0947 \u092E\u0947\u0928\u0942 \u0938\u0947 \u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0935\u093F\u0915\u0932\u094D\u092A \u091A\u0941\u0928\u0947\u0902\u0964
- \u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0939\u0947\u0932\u094D\u092A\u0932\u093E\u0907\u0928: +91 7070530080
- \u0908\u092E\u0947\u0932: adarshbiharsiksha@gmail.com
- \u0915\u093E\u0930\u094D\u092F\u093E\u0932\u092F: \u0928\u0947\u0939\u093E \u092D\u0935\u0928, \u092C\u0940\u090F\u0928\u090F\u092E\u0935\u0940 \u0915\u0949\u0932\u0947\u091C \u0915\u0947 \u092A\u093E\u0938, \u0938\u093E\u0939\u0941\u0917\u0922\u093C, \u092E\u0927\u0947\u092A\u0941\u0930\u093E, \u092C\u093F\u0939\u093E\u0930 - 852113.`,
      source: "knowledge-base"
    };
  }
};
var geminiService = new GeminiService();

// server/controllers/aiController.ts
var AiController = class {
  /**
   * POST /api/ai/assistant
   * Protected server-side proxy for Gemini 2.5 Flash
   */
  async handleAssistantQuery(req, res) {
    const { prompt, context } = req.body;
    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      res.status(400).json({
        success: false,
        message: "A valid text prompt is required."
      });
      return;
    }
    const cleanPrompt = prompt.trim();
    if (cleanPrompt.length > 1e3) {
      res.status(400).json({
        success: false,
        message: "Prompt exceeds maximum permitted length of 1,000 characters."
      });
      return;
    }
    const cleanContext = typeof context === "string" ? context.slice(0, 500) : void 0;
    try {
      const result = await geminiService.handleCandidateQuery(cleanPrompt, cleanContext);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "AI Assistant service unavailable"
      });
    }
  }
};
var aiController = new AiController();

// server/middleware/auth.ts
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Authorization token required. Please log into the BSEDRC Council Admin Portal."
    });
    return;
  }
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
  const user = verifyAdminToken(token);
  if (!user) {
    res.status(401).json({
      success: false,
      error: "InvalidToken",
      message: "Admin session expired or invalid. Please re-authenticate."
    });
    return;
  }
  req.adminUser = user;
  next();
}

// server/routes/api.routes.ts
var apiRouter = (0, import_express.Router)();
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    system: "BSEDRC Enterprise Fullstack Backend",
    board: config.board.name,
    boardHindi: config.board.nameHindi,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    environment: config.nodeEnv,
    offlineMode: config.offlineMode,
    firebaseConnected: config.firebase.isConfigured,
    firestoreDatabase: config.firebase.firestoreDatabaseId,
    cloudflareR2Connected: config.cloudflareR2.isConfigured,
    razorpayConfigured: config.razorpay.isRealGateway,
    geminiConfigured: config.gemini.isConfigured
  });
});
apiRouter.get("/config", (req, res) => {
  res.json({
    boardName: config.board.name,
    boardHindi: config.board.nameHindi,
    boardShort: config.board.shortName,
    officeAddress: config.board.officeAddress,
    helplinePhone: config.board.helplinePhone,
    helplineEmail: config.board.helplineEmail,
    regdOffice: config.board.regdOffice,
    offlineMode: config.offlineMode,
    razorpayKeyId: config.razorpay.keyId,
    currency: config.razorpay.currency,
    firebaseProjectId: config.firebase.projectId,
    firestoreDatabaseId: config.firebase.firestoreDatabaseId
  });
});
apiRouter.post("/admin/login", authRateLimiter, (req, res) => authController.login(req, res));
apiRouter.post("/auth/login", authRateLimiter, (req, res) => authController.login(req, res));
apiRouter.post("/auth/register", (req, res) => authController.registerCandidate(req, res));
apiRouter.post("/auth/candidate-login", (req, res) => authController.candidateLogin(req, res));
apiRouter.post("/admin/forgot-password", authRateLimiter, (req, res) => authController.forgotPassword(req, res));
apiRouter.post("/auth/forgot-password", authRateLimiter, (req, res) => authController.forgotPassword(req, res));
apiRouter.post("/admin/reset-password", authRateLimiter, (req, res) => authController.resetPassword(req, res));
apiRouter.post("/auth/reset-password", authRateLimiter, (req, res) => authController.resetPassword(req, res));
apiRouter.get("/admin/me", requireAdminAuth, (req, res) => authController.getProfile(req, res));
apiRouter.get("/auth/me", requireAdminAuth, (req, res) => authController.getProfile(req, res));
apiRouter.get("/students", (req, res) => studentController.getStudents(req, res));
apiRouter.get("/students/:regNo", (req, res) => studentController.getStudentByRegNo(req, res));
apiRouter.post("/students", (req, res) => studentController.registerOrUpdateStudent(req, res));
apiRouter.delete("/students/:id", requireAdminAuth, (req, res) => studentController.deleteStudent(req, res));
apiRouter.get("/results", (req, res) => resultController.getAllResults(req, res));
apiRouter.get("/results/search", (req, res) => resultController.searchResult(req, res));
apiRouter.post("/results", requireAdminAuth, (req, res) => resultController.saveResult(req, res));
apiRouter.post("/payments/create-order", paymentRateLimiter, (req, res) => paymentController.createOrder(req, res));
apiRouter.post("/payments/verify", paymentRateLimiter, (req, res) => paymentController.verifyPayment(req, res));
apiRouter.get("/payments", requireAdminAuth, (req, res) => paymentController.getPayments(req, res));
apiRouter.get("/payments/receipt/:txnId", (req, res) => paymentController.getReceipt(req, res));
apiRouter.post("/storage/upload", (req, res) => storageController.upload(req, res));
apiRouter.get("/storage/status", (req, res) => storageController.getStatus(req, res));
apiRouter.get("/storage/signed-url", (req, res) => storageController.getSignedUrl(req, res));
apiRouter.get("/storage/file", (req, res) => storageController.getFile(req, res));
apiRouter.get("/storage/file/:key(*)", (req, res) => storageController.getFile(req, res));
apiRouter.get("/storage/verify", (req, res) => storageController.verifyFile(req, res));
apiRouter.get("/storage/verify/:key(*)", (req, res) => storageController.verifyFile(req, res));
apiRouter.delete("/storage/file", requireAdminAuth, (req, res) => storageController.deleteFile(req, res));
apiRouter.delete("/storage/file/:key(*)", requireAdminAuth, (req, res) => storageController.deleteFile(req, res));
apiRouter.get("/storage/list", requireAdminAuth, (req, res) => storageController.list(req, res));
apiRouter.get("/notifications", (req, res) => contentController.getNotifications(req, res));
apiRouter.post("/notifications", requireAdminAuth, (req, res) => contentController.saveNotification(req, res));
apiRouter.delete("/notifications/:id", requireAdminAuth, (req, res) => contentController.deleteNotification(req, res));
apiRouter.get("/gallery", (req, res) => contentController.getGallery(req, res));
apiRouter.post("/gallery", requireAdminAuth, (req, res) => contentController.saveGalleryItem(req, res));
apiRouter.delete("/gallery/:id", requireAdminAuth, (req, res) => contentController.deleteGalleryItem(req, res));
apiRouter.get("/forms", (req, res) => contentController.getForms(req, res));
apiRouter.get("/forms/:id", (req, res) => contentController.getFormById(req, res));
apiRouter.post("/forms", requireAdminAuth, (req, res) => contentController.saveForm(req, res));
apiRouter.post("/forms/:id/submit", (req, res) => contentController.submitForm(req, res));
apiRouter.get("/forms/submissions", requireAdminAuth, (req, res) => contentController.getSubmissions(req, res));
apiRouter.get("/certificates/verify/:serialNo", (req, res) => contentController.verifyCertificate(req, res));
apiRouter.post("/ai/assistant", aiRateLimiter, (req, res) => aiController.handleAssistantQuery(req, res));

// server/apiApp.ts
function createApiApp() {
  validateStartupConfig();
  const app = (0, import_express2.default)();
  app.disable("x-powered-by");
  app.use(securityMiddleware);
  app.use(import_express2.default.json({ limit: "15mb" }));
  app.use(import_express2.default.urlencoded({ extended: true, limit: "15mb" }));
  app.use(apiGeneralLimiter);
  app.use("/api", apiRouter);
  app.use("/", apiRouter);
  app.use(errorHandler);
  return app;
}

// server/app.ts
async function createExpressApp() {
  validateStartupConfig();
  const app = (0, import_express3.default)();
  app.disable("x-powered-by");
  const apiApp = createApiApp();
  app.use("/api", apiApp);
  if (!config.isProduction) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express3.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  return app;
}

// server.ts
var PORT = 3e3;
async function startServer() {
  try {
    const app = await createExpressApp();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[BSEDRC Server] Official Fullstack Server listening on http://0.0.0.0:${PORT}`);
      console.log(`[BSEDRC Server] API endpoints mounted at http://0.0.0.0:${PORT}/api`);
    });
  } catch (error) {
    console.error("[BSEDRC Server] Critical failure starting server:", error);
    process.exit(1);
  }
}
startServer();
//# sourceMappingURL=server.cjs.map
