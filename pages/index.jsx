import { useState, useRef, useEffect } from "react";


const VALENCE_LABELS = {
  "-2": "かなり不快",
  "-1": "やや不快",
  "0": "中立",
  "1": "やや快",
  "2": "かなり快",
};

const AROUSAL_LABELS = {
  1: "とても穏やか",
  2: "落ち着いている",
  3: "ふつう",
  4: "活性化している",
  5: "強く興奮",
};

function Slider({ value, onChange, min, max, step = 1, labels, color }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ width: "100%" }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: color,
          cursor: "pointer",
          height: "4px",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 11, color: "#888" }}>{labels[min]}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: color }}>
          {labels[value]}
        </span>
        <span style={{ fontSize: 11, color: "#888" }}>{labels[max]}</span>
      </div>
    </div>
  );
}

function Tag({ label, color, bg }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        color,
        background: bg,
        margin: "3px 3px",
        lineHeight: 1.6,
      }}
    >
      {label}
    </span>
  );
}

function ResultBlock({ result, onSave, saving, saved }) {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid #222",
        borderRadius: 16,
        padding: "24px 28px",
        marginTop: 24,
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Analysis</div>

        {/* 事実 / 感情 / 認知 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "事実", value: result.fact, color: "#6ee7f7", bg: "rgba(110,231,247,0.08)" },
            { label: "感情", value: result.emotionRaw, color: "#f7c16e", bg: "rgba(247,193,110,0.08)" },
            { label: "認知", value: result.cognitionRaw, color: "#c16ef7", bg: "rgba(193,110,247,0.08)" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, color, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: "#ddd", lineHeight: 1.6 }}>{value || "—"}</div>
            </div>
          ))}
        </div>

        {/* 感情語ラベル */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>感情語</div>
          <div>{result.emotionTags?.map((t) => <Tag key={t} label={t} color="#f7c16e" bg="rgba(247,193,110,0.1)" />)}</div>
        </div>

        {/* 原因タグ */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>原因タグ</div>
          <div>{result.causeTags?.map((t) => <Tag key={t} label={t} color="#6ef7b0" bg="rgba(110,247,176,0.1)" />)}</div>
        </div>

        {/* 認知的評価 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>認知的評価</div>
          <div>{result.cognitiveTags?.map((t) => <Tag key={t} label={t} color="#c16ef7" bg="rgba(193,110,247,0.1)" />)}</div>
        </div>

        {/* 心理的状態 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>心理的状態</div>
          <div>{result.psychTags?.map((t) => <Tag key={t} label={t} color="#f76e6e" bg="rgba(247,110,110,0.1)" />)}</div>
        </div>

        {/* 身体的状態 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>身体的状態</div>
          <div>{result.physicalTags?.map((t) => <Tag key={t} label={t} color="#6e9af7" bg="rgba(110,154,247,0.1)" />)}</div>
        </div>

        {/* AIメモ */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderLeft: "2px solid #333",
            padding: "12px 16px",
            borderRadius: "0 8px 8px 0",
            marginTop: 8,
          }}
        >
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>AIメモ</div>
          <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.8 }}>{result.aiNote}</div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving || saved}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 10,
          border: "none",
          background: saved ? "#1a3a2a" : saving ? "#1a1a1a" : "#e8f0fe",
          color: saved ? "#6ef7b0" : saving ? "#555" : "#0a0a0a",
          fontSize: 14,
          fontWeight: 700,
          cursor: saved || saving ? "default" : "pointer",
          letterSpacing: 0.5,
          transition: "all 0.3s",
        }}
      >
        {saved ? "✓ Notionに保存しました" : saving ? "保存中..." : "Notionに保存する"}
      </button>
    </div>
  );
}

export default function App() {
  const [text, setText] = useState("");
  const [arousal, setArousal] = useState(3);
  const [valence, setValence] = useState(0);
  const [intensity, setIntensity] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSaved(false);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5);

    const prompt = `あなたは感情分析の専門家です。以下のユーザーの入力を分析してください。

【入力テキスト】
${text}

【ユーザーが入力した数値】
- 感情の強さ: ${intensity}/5
- 快不快: ${valence}（-2=かなり不快 〜 +2=かなり快）
- 覚醒度: ${arousal}/5（1=とても穏やか 〜 5=強く興奮）

以下のJSON形式だけで返答してください。余計な文章は不要です。

{
  "fact": "入力から読み取れる客観的事実（起きたこと）",
  "emotionRaw": "感情の生テキスト要約（1〜2文）",
  "cognitionRaw": "認知・解釈・評価のパターン（1〜2文）",
  "emotionTags": ["感情語1", "感情語2"],
  "causeTags": ["原因タグ1", "原因タグ2"],
  "cognitiveTags": ["認知的評価1", "認知的評価2"],
  "psychTags": ["心理的状態1"],
  "physicalTags": ["身体的状態1"],
  "aiNote": "事実・感情・認知の区別を踏まえた洞察や視点の提案（2〜4文）"
}

感情語の候補: 激怒, 怒り, いらだち, 恐怖, 不安, おびえ, 嫌悪感, 嫌悪, 退屈, 緊張, 焦り, 憤り, 歓喜, 喜び, 安堵, 驚嘆, 驚き, 高揚, 興奮, 意欲, 好奇心, 誇り, 悲嘆, 悲しみ, 哀愁, 落胆, 虚脱, 倦怠, 無気力, 孤独, 後悔, 罪悪感, 信頼, 受容, 充実, 安らぎ, 穏やか, 感謝, 満足, 愛情
原因タグの候補: 自分／思考, 自分／行動, 自分／成長, 自分／身体, 社会／友人, 社会／家族, 社会／職場, 社会／他者, 環境／仕事, 環境／お金, 環境／空間, 環境／情報
認知的評価の候補: 白黒思考, 自己批判, 過度な一般化, 破局化, 他者批判, 読心術, べき思考, フィルタリング, 成長の機会, コントロール可能, 自分の成果, 他者への感謝, 意味を感じた
心理的状態の候補: プレッシャー, 孤立感, 不確実性, 自己効力感が低い, 期待過多, 余裕がない, フロー状態, 心理的安全, 自律感, 有能感, つながり感
身体的状態の候補: 頭痛・体の痛み, 体調不良, 身体が軽い, エネルギー充填, 疲労感, 睡眠不足, 空腹`;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const raw = data.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult({ ...parsed, dateStr, timeStr, intensity, valence, arousal });
    } catch (e) {
      setError("分析に失敗しました。もう一度試してください。");
    } finally {
      setLoading(false);
    }
  };

  const saveToNotion = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const now = new Date();



      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      if (!res.ok) throw new Error("save failed");
      setSaved(true);
    } catch (e) {
      setError("Notion保存に失敗しました。APIキーとDBのIDを確認してください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#e0e0e0",
        fontFamily: "'Noto Sans JP', 'Helvetica Neue', sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* ヘッダー */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#444", marginBottom: 8, textTransform: "uppercase" }}>
            Emotion Log
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
            今、何が起きていますか？
          </div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>
            事実でも感情でも、混ざっていてOK。そのまま書いてください。
          </div>
        </div>

        {/* テキスト入力 */}
        <div
          style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 24,
            transition: "border-color 0.2s",
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例：会議で発言できなかった。なんか今日ダメだった気がする..."
            style={{
              width: "100%",
              minHeight: 80,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ddd",
              fontSize: 15,
              lineHeight: 1.8,
              resize: "none",
              fontFamily: "inherit",
              overflow: "hidden",
            }}
          />
        </div>

        {/* スライダー群 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4, letterSpacing: 1 }}>心の揺れ具合</div>
            <div style={{ fontSize: 11, color: "#333", marginBottom: 8 }}>感情がどれだけ自分を支配しているか</div>
            <Slider
              value={intensity}
              onChange={setIntensity}
              min={1}
              max={5}
              color="#f7c16e"
              labels={{ 1: "ほぼ気にならない", 2: "", 3: "ふつう", 4: "", 5: "頭から離れない" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4, letterSpacing: 1 }}>快・不快</div>
            <div style={{ fontSize: 11, color: "#333", marginBottom: 8 }}>この感情は心地よいか、不快か</div>
            <Slider
              value={valence}
              onChange={setValence}
              min={-2}
              max={2}
              color="#6ee7f7"
              labels={VALENCE_LABELS}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4, letterSpacing: 1 }}>体の活性度</div>
            <div style={{ fontSize: 11, color: "#333", marginBottom: 8 }}>体が起きているか、落ち着いているか</div>
            <Slider
              value={arousal}
              onChange={setArousal}
              min={1}
              max={5}
              color="#c16ef7"
              labels={{ 1: "ぐったり・眠い", 2: "", 3: "ふつう", 4: "", 5: "心拍数が上がっている" }}
            />
          </div>
        </div>

        {/* 分析ボタン */}
        <button
          onClick={analyze}
          disabled={loading || !text.trim()}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 12,
            border: "none",
            background: text.trim() && !loading ? "#fff" : "#1a1a1a",
            color: text.trim() && !loading ? "#000" : "#333",
            fontSize: 15,
            fontWeight: 700,
            cursor: text.trim() && !loading ? "pointer" : "default",
            letterSpacing: 0.5,
            transition: "all 0.2s",
          }}
        >
          {loading ? "分析中..." : "AIで分析する"}
        </button>

        {error && (
          <div style={{ marginTop: 16, color: "#f76e6e", fontSize: 13, textAlign: "center" }}>
            {error}
          </div>
        )}

        {result && (
          <ResultBlock
            result={result}
            onSave={saveToNotion}
            saving={saving}
            saved={saved}
          />
        )}

        {/* フッター */}
        <div style={{ marginTop: 40, textAlign: "center", fontSize: 11, color: "#2a2a2a" }}>
          API Key & DB ID を設定してから使用してください
        </div>
      </div>
    </div>
  );
}
