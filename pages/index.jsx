import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Sans+JP:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #f5f0e8;
    --warm-white: #faf8f4;
    --sand: #e8dfd0;
    --terra: #c4714a;
    --terra-light: #d4886a;
    --terra-pale: #f0ddd5;
    --sage: #7a9e8e;
    --sage-pale: #ddeae4;
    --dusty-blue: #7b9ab5;
    --dusty-blue-pale: #dce8f0;
    --mauve: #a07a8e;
    --mauve-pale: #eadde4;
    --text-primary: #2c2420;
    --text-secondary: #8a7b72;
    --text-muted: #b5a89e;
    --border: #ddd4c8;
    --shadow: rgba(44, 36, 32, 0.08);
  }

  body { background: var(--warm-white); }

  .app {
    min-height: 100vh;
    background: var(--warm-white);
    background-image:
      radial-gradient(ellipse at 20% 0%, rgba(196,113,74,0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, rgba(122,158,142,0.06) 0%, transparent 50%);
    font-family: 'Noto Sans JP', sans-serif;
    color: var(--text-primary);
    padding: 48px 20px 80px;
  }

  .container { max-width: 580px; margin: 0 auto; }

  .header { margin-bottom: 44px; }

  .app-name-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 14px;
  }
  .app-name-ja {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 28px;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: 0.05em;
  }
  .app-name-ja .koko { color: var(--terra); }
  .app-name-en {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    font-style: italic;
    letter-spacing: 2.5px;
    color: var(--text-muted);
    font-weight: 300;
  }
  .app-name-divider {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, var(--border), transparent);
    margin-bottom: 3px;
  }
  .header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 300;
    color: var(--text-secondary);
    letter-spacing: 0px;
    line-height: 1.4;
    margin-bottom: 6px;
  }
  .header-sub {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 300;
    letter-spacing: 0.3px;
    line-height: 1.7;
  }

  .input-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 24px 28px;
    margin-bottom: 28px;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .input-card:focus-within {
    border-color: var(--terra-light);
    box-shadow: 0 0 0 3px rgba(196,113,74,0.08), 0 4px 20px var(--shadow);
  }
  .input-label {
    font-size: 11px;
    letter-spacing: 1.5px;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 12px;
    font-weight: 500;
  }
  textarea {
    width: 100%;
    min-height: 88px;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-size: 15px;
    line-height: 1.85;
    resize: none;
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 300;
    overflow: hidden;
  }
  textarea::placeholder { color: var(--text-muted); font-weight: 300; }

  .sliders { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }

  .slider-row {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px 22px;
  }
  .slider-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
  .slider-name { font-size: 12px; font-weight: 500; letter-spacing: 0.8px; color: var(--text-secondary); }
  .slider-desc { font-size: 11px; color: var(--text-muted); font-weight: 300; }
  .slider-value-label {
    margin-left: auto;
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
  }

  input[type=range] {
    -webkit-appearance: none;
    width: 100%;
    height: 3px;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    margin-bottom: 6px;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2.5px solid white;
    box-shadow: 0 2px 8px rgba(44,36,32,0.2);
    cursor: pointer;
    transition: transform 0.15s;
  }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.15); }
  .slider-ends {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 300;
  }

  .btn-row { display: flex; gap: 10px; margin-bottom: 8px; }

  .btn-analyze {
    flex: 1;
    padding: 15px 20px;
    border-radius: 14px;
    border: none;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.25s;
  }
  .btn-analyze.active {
    background: var(--terra);
    color: white;
    box-shadow: 0 4px 16px rgba(196,113,74,0.3);
  }
  .btn-analyze.active:hover {
    background: var(--terra-light);
    box-shadow: 0 6px 20px rgba(196,113,74,0.35);
    transform: translateY(-1px);
  }
  .btn-analyze.inactive { background: var(--sand); color: var(--text-muted); cursor: default; }

  .btn-reset {
    padding: 15px 18px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-reset:hover { border-color: var(--terra-light); color: var(--terra); background: var(--terra-pale); }
  .btn-reset-below { width: 100%; margin-top: 10px; }

  .error-msg {
    margin-top: 12px;
    color: #c0614a;
    font-size: 12px;
    text-align: center;
    padding: 10px;
    background: rgba(192,97,74,0.06);
    border-radius: 8px;
  }

  .result-block { margin-top: 28px; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .result-section-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 500;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .result-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .trio-grid { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
  .trio-card {
    border-radius: 14px;
    padding: 14px 18px;
    border: 1px solid transparent;
    display: grid;
    grid-template-columns: 36px 1fr;
    align-items: baseline;
    gap: 14px;
  }
  .trio-card-label { font-size: 10px; letter-spacing: 1px; font-weight: 500; white-space: nowrap; padding-top: 2px; }
  .trio-card-text { font-size: 13px; line-height: 1.75; font-weight: 300; color: var(--text-secondary); }

  .tag-section { margin-bottom: 18px; }
  .tag-section-label { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; font-weight: 400; letter-spacing: 0.5px; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    border: 1px solid transparent;
  }

  .ai-note {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px 22px 20px 28px;
    margin-top: 8px;
    margin-bottom: 20px;
    position: relative;
  }
  .ai-note::before {
    content: '"';
    font-family: 'Cormorant Garamond', serif;
    font-size: 56px;
    color: var(--terra-pale);
    position: absolute;
    top: 4px;
    left: 14px;
    line-height: 1;
    pointer-events: none;
  }
  .ai-note-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--terra); font-weight: 500; margin-bottom: 10px; }
  .ai-note-text { font-size: 13px; line-height: 1.9; color: var(--text-secondary); font-weight: 300; }

  .btn-save {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.25s;
  }
  .btn-save.idle {
    background: var(--text-primary);
    color: var(--warm-white);
    box-shadow: 0 4px 16px rgba(44,36,32,0.15);
  }
  .btn-save.idle:hover {
    background: #3d342e;
    box-shadow: 0 6px 20px rgba(44,36,32,0.2);
    transform: translateY(-1px);
  }
  .btn-save.loading { background: var(--sand); color: var(--text-muted); cursor: default; }
  .btn-save.done { background: var(--sage); color: white; cursor: default; }

  .footer { margin-top: 48px; text-align: center; font-size: 11px; color: var(--text-muted); font-weight: 300; letter-spacing: 0.3px; }
  .footer span { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--terra-light); }
  .footer-link {
    display: inline-block;
    margin-top: 10px;
    font-size: 11px;
    color: var(--text-muted);
    text-decoration: none;
    letter-spacing: 0.3px;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--terra); }
`;

function Slider({ value, onChange, min, max, trackColor, thumbColor, endLabels, currentLabel }) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackStyle = {
    background: `linear-gradient(to right, ${trackColor} ${pct}%, #e8dfd0 ${pct}%)`,
  };
  return (
    <div>
      <style>{`
        .thumb-${thumbColor.replace('#','')}{} 
        input[type=range].track-${thumbColor.replace('#','')}::-webkit-slider-thumb { background: ${thumbColor}; }
      `}</style>
      <input
        type="range" min={min} max={max} value={value}
        className={`track-${thumbColor.replace('#','')}`}
        onChange={(e) => onChange(Number(e.target.value))}
        style={trackStyle}
      />
      <div className="slider-ends">
        <span>{endLabels[0]}</span>
        <span>{endLabels[1]}</span>
      </div>
    </div>
  );
}

function Tag({ label, color, bg, border }) {
  return (
    <span className="tag" style={{ color, background: bg, borderColor: border || bg }}>
      {label}
    </span>
  );
}

function ResultBlock({ result, onSave, onReset, saving, saved }) {
  return (
    <div className="result-block">
      <div className="result-section-label">Analysis</div>
      <div className="trio-grid">
        {[
          { label: "事実", value: result.fact, color: "var(--dusty-blue)", bg: "var(--dusty-blue-pale)", border: "rgba(123,154,181,0.25)" },
          { label: "感情", value: result.emotionRaw, color: "var(--terra)", bg: "var(--terra-pale)", border: "rgba(196,113,74,0.25)" },
          { label: "認知", value: result.cognitionRaw, color: "var(--mauve)", bg: "var(--mauve-pale)", border: "rgba(160,122,142,0.25)" },
        ].map(({ label, value, color, bg, border }) => (
          <div className="trio-card" key={label} style={{ background: bg, borderColor: border }}>
            <div className="trio-card-label" style={{ color }}>{label}</div>
            <div className="trio-card-text">{value || "—"}</div>
          </div>
        ))}
      </div>

      <div className="tag-section">
        <div className="tag-section-label">感情語</div>
        <div className="tags">
          {result.emotionTags?.map((t) => <Tag key={t} label={t} color="var(--terra)" bg="var(--terra-pale)" border="rgba(196,113,74,0.3)" />)}
        </div>
      </div>
      <div className="tag-section">
        <div className="tag-section-label">原因タグ</div>
        <div className="tags">
          {result.causeTags?.map((t) => <Tag key={t} label={t} color="var(--sage)" bg="var(--sage-pale)" border="rgba(122,158,142,0.3)" />)}
        </div>
      </div>
      <div className="tag-section">
        <div className="tag-section-label">認知的評価</div>
        <div className="tags">
          {result.cognitiveTags?.map((t) => <Tag key={t} label={t} color="var(--mauve)" bg="var(--mauve-pale)" border="rgba(160,122,142,0.3)" />)}
        </div>
      </div>
      <div className="tag-section">
        <div className="tag-section-label">心理的状態 / 身体的状態</div>
        <div className="tags">
          {result.psychTags?.map((t) => <Tag key={t} label={t} color="var(--dusty-blue)" bg="var(--dusty-blue-pale)" border="rgba(123,154,181,0.3)" />)}
          {result.physicalTags?.map((t) => <Tag key={t} label={t} color="#8a9e7a" bg="#eaf0e4" border="rgba(138,158,122,0.3)" />)}
        </div>
      </div>

      <div className="ai-note">
        <div className="ai-note-label">Insight</div>
        <div className="ai-note-text">{result.aiNote}</div>
      </div>

      <button
        className={`btn-save ${saved ? "done" : saving ? "loading" : "idle"}`}
        onClick={onSave}
        disabled={saving || saved}
      >
        {saved ? "✓ Notionに保存しました" : saving ? "保存中..." : "Notionに保存する"}
      </button>
      <button className="btn-reset btn-reset-below" onClick={onReset}>リセット</button>
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

  const handleReset = () => {
    setText("");
    setArousal(3);
    setValence(0);
    setIntensity(3);
    setResult(null);
    setError(null);
    setSaved(false);
  };

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
- 感情の強さ（心の揺れ）: ${intensity}/5
- 快不快: ${valence}（-2=かなり不快 〜 +2=かなり快）
- 体の活性度（覚醒度）: ${arousal}/5（1=とても穏やか 〜 5=強く興奮）

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

  const sliders = [
    {
      label: "心の揺れ具合", desc: "感情がどれだけ自分を支配しているか",
      value: intensity, onChange: setIntensity, min: 1, max: 5,
      trackColor: "#c4714a", thumbColor: "#c4714a",
      endLabels: ["ほぼ気にならない", "頭から離れない"],
      currentLabel: { 1: "ほぼ気にならない", 2: "やや気になる", 3: "ふつう", 4: "かなり強い", 5: "頭から離れない" }[intensity],
    },
    {
      label: "快・不快", desc: "この感情は心地よいか、不快か",
      value: valence, onChange: setValence, min: -2, max: 2,
      trackColor: "#7b9ab5", thumbColor: "#7b9ab5",
      endLabels: ["かなり不快", "かなり快"],
      currentLabel: VALENCE_LABELS[String(valence)],
    },
    {
      label: "体の活性度", desc: "体が起きているか、落ち着いているか",
      value: arousal, onChange: setArousal, min: 1, max: 5,
      trackColor: "#7a9e8e", thumbColor: "#7a9e8e",
      endLabels: ["ぐったり・眠い", "心拍数が上がっている"],
      currentLabel: AROUSAL_LABELS[arousal],
    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="container">
          <div className="header">
            <div className="app-name-row">
              <div className="app-name-ja"><span className="koko">ここ</span>ログ</div>
              <div className="app-name-en">kokolog</div>
              <div className="app-name-divider" />
            </div>
            <div className="header-title">今、何が起きていますか？</div>
            <div className="header-sub">
              事実でも感情でも、混ざっていてOK。そのまま書いてください。
            </div>
          </div>

          <div className="input-card">
            <div className="input-label">できごと・気持ち</div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="例：会議で発言できなかった。なんか今日ダメだった気がする..."
            />
          </div>

          <div className="sliders">
            {sliders.map((s) => (
              <div className="slider-row" key={s.label}>
                <div className="slider-header">
                  <span className="slider-name">{s.label}</span>
                  <span className="slider-desc">{s.desc}</span>
                  <span className="slider-value-label" style={{ color: s.trackColor }}>{s.currentLabel}</span>
                </div>
                <Slider {...s} />
              </div>
            ))}
          </div>

          <div className="btn-row">
            <button
              className={`btn-analyze ${text.trim() && !loading ? "active" : "inactive"}`}
              onClick={analyze}
              disabled={loading || !text.trim()}
            >
              {loading ? "分析中..." : "AIで分析する"}
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {result && <ResultBlock result={result} onSave={saveToNotion} onReset={handleReset} saving={saving} saved={saved} />}

          <div className="footer">
            <span>ここログ</span> — API Key & DB ID を設定してから使用してください
            <br />
            <Link href="/ip-tier" className="footer-link">IPホルダー ティア表を見る →</Link>
          </div>
        </div>
      </div>
    </>
  );
}