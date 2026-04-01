import { useState, useRef, useEffect } from "react";
import { Link, useLoaderData, useFetcher } from "react-router";
import type { Route } from "./+types/analyzer";
import { getSupabaseServerClient } from "../lib/supabase.server";

export function meta() {
  return [{ title: "AI Analyzer | CuberWorld" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { supabase } = getSupabaseServerClient(request);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { user: null, hasAccess: false, subscription: null };

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const hasAccess = subscription && (
      (subscription.plan_type === "trial" &&
        subscription.status === "active" &&
        new Date(subscription.trial_ends_at) > new Date()) ||
      (subscription.status === "active" &&
        (subscription.plan_type === "monthly" || subscription.plan_type === "lifetime"))
    );

    return { user: { id: user.id, email: user.email }, hasAccess: !!hasAccess, subscription };
  } catch {
    return { user: null, hasAccess: false, subscription: null };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const { supabase } = getSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", analysis: null };

  const formData = await request.formData();
  const frames = formData.getAll("frame") as string[];

  if (!frames.length) return { error: "No video frames provided", analysis: null };

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // Use first, middle, and last frames for analysis
    const selectedFrames = [
      frames[0],
      frames[Math.floor(frames.length / 2)],
      frames[frames.length - 1],
    ].filter(Boolean);

    const imageContent = selectedFrames.map(frame => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: "image/jpeg" as const,
        data: frame.replace(/^data:image\/jpeg;base64,/, ""),
      },
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: `You are an expert Rubik's cube speedcubing coach. I am showing you ${selectedFrames.length} frames from a video of someone solving a 3x3 Rubik's cube (beginning, middle, and end of the solve).

Please analyze what you can see and provide specific, actionable coaching feedback. Structure your response as:

**SOLVE ANALYSIS**
- What stage of the solve appears to be in each frame
- Any observations about technique

**STRENGTHS**
- What the solver appears to be doing well

**AREAS TO IMPROVE**
- Specific issues observed (finger tricks, lookahead, pauses, grip, etc.)
- Estimated impact on solve time

**RECOMMENDATIONS**
- 3-5 concrete, specific things to practice
- Prioritized by impact

Keep feedback constructive, specific, and actionable. Focus on technique over general tips.`,
            },
          ],
        },
      ],
    });

    const analysis = response.content[0].type === "text" ? response.content[0].text : "";
    return { analysis, error: null };
  } catch (err) {
    console.error("AI analysis error:", err);
    return { error: "Analysis failed. Please try again.", analysis: null };
  }
}

// ─── Recording Component (client-only) ───────────────────────────────────────

function VideoRecorder({ onAnalyze }: { onAnalyze: (frames: string[]) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
      setError(null);
    } catch (err) {
      setError("CAMERA ACCESS DENIED. PLEASE ALLOW CAMERA PERMISSION.");
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream, { mimeType: "video/webm" });
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setHasRecording(true);
    };
    mr.start(100);
    mediaRecorderRef.current = mr;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const extractFrames = async (): Promise<string[]> => {
    if (!recordedUrl) return [];
    setExtracting(true);

    return new Promise(resolve => {
      const video = document.createElement("video");
      video.preload = "auto";
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const frames: string[] = [];
      const numFrames = 8;

      canvas.width = 640;
      canvas.height = 360;

      let duration = 0;
      let phase: "discovering" | "capturing" = "capturing";

      const captureFrame = (i: number) => {
        if (i >= numFrames) {
          setExtracting(false);
          resolve(frames);
          return;
        }
        video.currentTime = (duration / numFrames) * i;
      };

      video.onseeked = () => {
        if (phase === "discovering") {
          phase = "capturing";
          duration = video.currentTime;
          captureFrame(0);
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg", 0.7));
        captureFrame(frames.length);
      };

      video.onloadedmetadata = () => {
        if (!isFinite(video.duration)) {
          phase = "discovering";
          video.currentTime = Number.MAX_SAFE_INTEGER;
        } else {
          duration = video.duration;
          captureFrame(0);
        }
      };

      video.onerror = () => {
        setExtracting(false);
        resolve(frames);
      };

      video.src = recordedUrl;
    });
  };

  const handleAnalyze = async () => {
    const frames = await extractFrames();
    onAnalyze(frames);
  };

  useEffect(() => {
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  useEffect(() => {
    if (!hasRecording && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [hasRecording, stream]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {error && (
        <div className="alert-retro alert-error">
          <span className="font-pixel" style={{ fontSize: "0.5rem" }}>{error}</span>
        </div>
      )}

      {/* Camera view */}
      {!hasRecording && (
        <div style={{ position: "relative", background: "#000", border: "2px solid var(--green)", aspectRatio: "16/9", overflow: "hidden" }}>
          <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {!stream && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
              <div className="font-pixel" style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}>CAMERA OFFLINE</div>
              <button className="btn-retro" onClick={startCamera}>▶ ENABLE CAMERA</button>
            </div>
          )}
          {recording && (
            <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 10, height: 10, background: "var(--red)", borderRadius: "50%", animation: "blink 0.8s step-end infinite" }} />
              <span className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--red)" }}>REC</span>
            </div>
          )}
        </div>
      )}

      {/* Recorded video — separate container so native controls (progress bar) are not clipped */}
      {hasRecording && recordedUrl && (
        <div style={{ border: "2px solid var(--green)", background: "#000" }}>
          <video
            ref={recordedVideoRef}
            src={recordedUrl}
            controls
            style={{ width: "100%", display: "block" }}
          />
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {hasRecording ? (
          <>
            <button
              className="btn-retro btn-retro-cyan"
              onClick={handleAnalyze}
              disabled={extracting}
              style={{ flex: 1 }}
            >
              {extracting ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1 }} />
                  EXTRACTING FRAMES...
                </span>
              ) : "🤖 ANALYZE WITH AI"}
            </button>
            <button
              className="btn-retro"
              onClick={() => {
                if (recordedUrl) URL.revokeObjectURL(recordedUrl);
                setHasRecording(false);
                setRecordedUrl(null);
                chunksRef.current = [];
              }}
            >
              ↺ REDO
            </button>
          </>
        ) : stream && (
          <>
            {!recording ? (
              <button className="btn-retro btn-retro-magenta" onClick={startRecording}>
                ● START RECORDING
              </button>
            ) : (
              <button className="btn-retro btn-retro-yellow" onClick={stopRecording}>
                ■ STOP RECORDING
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Analysis Display ─────────────────────────────────────────────────────────

const panelFont: React.CSSProperties = { fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.9rem", lineHeight: 1.6 };

function AnalysisResult({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <div key={i} className="font-pixel" style={{ fontSize: "0.55rem", color: "var(--cyan)", marginTop: "1rem", marginBottom: "0.25rem" }}>
              {line.replace(/\*\*/g, "")}
            </div>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <div key={i} style={{ ...panelFont, color: "var(--green)", paddingLeft: "1rem" }}>
              {line}
            </div>
          );
        }
        return line ? (
          <div key={i} style={{ ...panelFont, color: "var(--text-dim)" }}>{line}</div>
        ) : <div key={i} style={{ height: "0.5rem" }} />;
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyzerPage() {
  const { user, hasAccess, subscription } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const handleAnalyze = (frames: string[]) => {
    const fd = new FormData();
    frames.forEach(f => fd.append("frame", f));
    fetcher.submit(fd, { method: "post" });
  };

  const isAnalyzing = fetcher.state !== "idle";
  const analysis = fetcher.data?.analysis;
  const analysisError = fetcher.data?.error;

  // Not logged in
  if (!user) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
          <span className="neon-magenta">AI ANALYZER</span>
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "2rem" }}>
          Create a free account to access the AI video analyzer with your 7-day trial.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/register" className="btn-retro btn-retro-cyan">CREATE ACCOUNT</Link>
          <Link to="/login" className="btn-retro">LOGIN</Link>
        </div>
      </div>
    );
  }

  // No access (trial expired, no subscription)
  if (!hasAccess) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
          <span className="neon-yellow">ACCESS REQUIRED</span>
        </h1>
        <div className="alert-retro alert-error" style={{ marginBottom: "2rem", textAlign: "left" }}>
          <span className="font-pixel" style={{ fontSize: "0.5rem" }}>
            {subscription ? "✗ YOUR FREE TRIAL HAS EXPIRED" : "✗ NO ACTIVE SUBSCRIPTION"}
          </span>
        </div>
        <p className="font-retro" style={{ color: "var(--text-dim)", marginBottom: "2rem" }}>
          Upgrade to continue using the AI Analyzer. Monthly or lifetime access available.
        </p>
        <Link to="/pricing" className="btn-retro btn-retro-magenta" style={{ fontSize: "0.7rem", padding: "0.8rem 1.5rem" }}>
          ► VIEW PRICING
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          🤖 AI <span className="neon-magenta">ANALYZER</span>
        </h1>
        <p className="font-retro" style={{ color: "var(--text-dim)" }}>
          Record your solve, then let AI analyze your technique and give personalized feedback.
        </p>
        {subscription?.plan_type === "trial" && (
          <div style={{ marginTop: "0.75rem" }}>
            <span className="font-pixel" style={{ fontSize: "0.4rem", color: "var(--yellow)" }}>
              ⏱ FREE TRIAL — EXPIRES {new Date(subscription.trial_ends_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Recorder — centered */}
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginBottom: "1rem" }}>
          STEP 1: RECORD YOUR SOLVE
        </div>
        {isClient ? (
          <VideoRecorder onAnalyze={handleAnalyze} />
        ) : (
          <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--border)" }}>
            <div className="spinner" />
          </div>
        )}
      </div>

      {/* Analysis — below */}
      <div style={{ maxWidth: "700px", margin: "2rem auto 0" }}>
        <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginBottom: "1rem" }}>
          STEP 2: AI ANALYSIS
        </div>

        <div className="retro-box-magenta" style={{ minHeight: "200px" }}>
          {isAnalyzing && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", gap: "1.5rem" }}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, borderTopColor: "var(--magenta)", borderColor: "rgba(255,0,255,0.2)" }} />
              <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--magenta)" }}>
                ANALYZING SOLVE...
              </div>
              <div style={{ ...panelFont, color: "var(--text-dim)" }}>
                AI is reviewing your technique
              </div>
            </div>
          )}

          {!isAnalyzing && analysisError && (
            <div className="alert-retro alert-error">
              <span className="font-pixel" style={{ fontSize: "0.5rem" }}>✗ {analysisError}</span>
            </div>
          )}

          {!isAnalyzing && !analysis && !analysisError && (
            <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
              <div className="font-pixel" style={{ fontSize: "0.6rem", color: "var(--border)", marginBottom: "1rem" }}>
                [AWAITING RECORDING]
              </div>
              <p style={{ ...panelFont, color: "var(--text-dim)" }}>
                Record a solve above, then click "Analyze with AI" to get personalized feedback.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <div className="font-pixel" style={{ fontSize: "0.45rem", color: "var(--text-dim)", marginBottom: "0.75rem" }}>
                  WHAT THE AI LOOKS FOR:
                </div>
                {["Finger tricks & ergonomics", "F2L pair efficiency", "Cross planning", "OLL/PLL recognition speed", "Lookahead & flow", "Pause reduction"].map(tip => (
                  <div key={tip} style={{ ...panelFont, color: "var(--text-dim)", padding: "0.25rem 0" }}>
                    ▸ {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isAnalyzing && analysis && (
            <div>
              <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--magenta)", marginBottom: "1.5rem" }}>
                ✓ ANALYSIS COMPLETE
              </div>
              <AnalysisResult text={analysis} />
              <div className="retro-divider" />
              <div style={{ ...panelFont, fontSize: "0.85rem", color: "var(--text-dim)" }}>
                Powered by Claude AI · For best results, ensure good lighting and a visible cube
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="retro-box" style={{ marginTop: "2rem" }}>
        <div className="font-pixel" style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginBottom: "1rem" }}>TIPS FOR BEST RESULTS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "💡", tip: "Good lighting — make sure all cube colors are clearly visible" },
            { icon: "📐", tip: "Camera angle — position camera slightly above and to the side" },
            { icon: "⏱", tip: "Full solve — record from scramble to solved state" },
            { icon: "🎥", tip: "Steady camera — use a phone stand or prop it up" },
          ].map(({ icon, tip }) => (
            <div key={tip} style={{ ...panelFont, color: "var(--text-dim)", display: "flex", gap: "0.5rem" }}>
              <span>{icon}</span><span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
