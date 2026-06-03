import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3001;

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini SDK loaded successfully with custom User-Agent.");
  } else {
    console.log("process.env.GEMINI_API_KEY is not configured yet. Fallback is ready to display custom workflows.");
  }
} catch (e) {
  console.log("Gemini SDK initialization skipped or failed. Fallback system is ready.", e);
}

// REST API for intelligent workflow compiler
app.post("/api/gemini/generate-workflow", async (req, res) => {
  const { prompt } = req.body;
  
  // Custom interactive curation list
  const fallbackNodes = [
    { id: "node-1", type: "trigger" as const, label: "Customer Inbound Trigger", description: `Triggers on new transaction metadata matching: "${prompt || 'Sync customer accounts'}"`, status: "success" as const },
    { id: "node-2", type: "ai_model" as const, label: "Gemini Decisive Hub", description: "Performs neural analysis on payload and classifies intent profile", status: "running" as const },
    { id: "node-3", type: "action" as const, label: "Stripe Ledger Sync", description: "Verifies balance ledger accuracy and triggers CRM pipelines", status: "idle" as const },
    { id: "node-4", type: "notification" as const, label: "Slack Instant Broadcast", description: `Dispatches execution receipts and operational dashboard log updates.`, status: "idle" as const }
  ];
  
  const fallbackEdges = [
    { id: "edge-1", source: "node-1", target: "node-2", animated: true },
    { id: "edge-2", source: "node-2", target: "node-3", animated: true },
    { id: "edge-3", source: "node-3", target: "node-4", animated: false }
  ];

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "Please provide a valid prompt string." });
  }

  if (!ai) {
    return res.json({
      nodes: fallbackNodes,
      edges: fallbackEdges,
      usingFallback: true,
      message: "Showing high-end curated flow. Configure process.env.GEMINI_API_KEY inside the secrets config or env variable tab to unlock real-time intelligence compilation"
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Design an advanced cybernetic automated workflow of discrete nodes and connected sequential edges mapping to the user prompt: "${prompt}". 
Ensure there are between 3 to 6 logical nodes representing triggers, data integrations, and operations. Output your response STRICTLY satisfying the requested JSON schema structure.

Make names and labels highly technical, specific, and futuristic. For trigger labels, e.g., 'GitHub Audit Hook', for models e.g. 'Atlas Cognitive Assessor', for actions e.g. 'Data Ingest Pipeline' or 'Slack Dispatcher'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["nodes", "edges"],
          properties: {
            nodes: {
              type: Type.ARRAY,
              description: "The set of individual system logic steps / components",
              items: {
                type: Type.OBJECT,
                required: ["id", "type", "label", "description", "status"],
                properties: {
                  id: { type: Type.STRING, description: "Unique node code prefix label like node-1, node-2" },
                  type: { 
                    type: Type.STRING, 
                    description: "Type of workflow step identifier",
                    enum: ['trigger', 'ai_model', 'action', 'condition', 'database', 'notification', 'api']
                  },
                  label: { type: Type.STRING, description: "High-level component label (e.g. Gmail Listener, Slack Notification)" },
                  description: { type: Type.STRING, description: "Highly technical description of the business process executed" },
                  status: {
                    type: Type.STRING,
                    description: "Initial automated diagnostic node status state",
                    enum: ['idle', 'running', 'success', 'error']
                  }
                }
              }
            },
            edges: {
              type: Type.ARRAY,
              description: "The directed sequence links matching source of previous node to target of next node",
              items: {
                type: Type.OBJECT,
                required: ["id", "source", "target", "animated"],
                properties: {
                  id: { type: Type.STRING, description: "Unique edge identifier link like edge-1, edge-2" },
                  source: { type: Type.STRING, description: "Source node id matching preceding node" },
                  target: { type: Type.STRING, description: "Target node id matching following node" },
                  animated: { type: Type.BOOLEAN, description: "Set to true representing constant execution flow" }
                }
              }
            }
          }
        }
      }
    });

    const bodyText = response.text || "{}";
    const parsedData = JSON.parse(bodyText.trim());
    
    return res.json({
      nodes: parsedData.nodes || fallbackNodes,
      edges: parsedData.edges || fallbackEdges,
      usingFallback: false
    });
  } catch (error: any) {
    console.error("Gemini compilation exception:", error);
    return res.json({
      nodes: fallbackNodes,
      edges: fallbackEdges,
      usingFallback: true,
      error: error.message || "Unknown compile failure"
    });
  }
});

// Secure server-side relay endpoint to post Discord, Slack or custom API messages without CORS issues
app.post("/api/dispatch-message", async (req, res) => {
  const { service, webhookUrl, messageText, payloadKey } = req.body;
  
  if (!webhookUrl) {
    return res.status(400).json({ error: "Please provide a valid webhook URL." });
  }

  try {
    let payload: any = {};
    
    if (service === "slack") {
      payload = { text: messageText };
    } else if (service === "discord") {
      payload = { content: messageText };
    } else {
      // Custom or default
      const key = payloadKey || "message";
      payload = { [key]: messageText };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const isSuccess = response.status >= 200 && response.status < 300;
    const rawResult = await response.text().catch(() => "");

    return res.json({
      success: isSuccess,
      status: response.status,
      body: rawResult,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (err: any) {
    console.error("Proxy dispatch server failure:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal network dispatch timeout"
    });
  }
});

// Setup Vite Dev server or production static files distribution
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite integrated into custom server as development middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving pre-built assets from /dist folder in Production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Atlas Flow is booting online behind standard port: http://0.0.0.0:${PORT}`);
  });
}

initServer();
