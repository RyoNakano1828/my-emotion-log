import { useState } from "react";
import Link from "next/link";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

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

    --tier-s-bg: #fff0e6;
    --tier-s-border: #e07a3a;
    --tier-s-label: #c4561a;
    --tier-a-bg: #fffbe6;
    --tier-a-border: #d4b83a;
    --tier-a-label: #a08820;
    --tier-b-bg: #eef8ee;
    --tier-b-border: #5aaa6a;
    --tier-b-label: #2d7a3d;
    --tier-c-bg: #eef4ff;
    --tier-c-border: #6a8ad4;
    --tier-c-label: #2d50a0;
    --tier-d-bg: #f4eeff;
    --tier-d-border: #9a6ad4;
    --tier-d-label: #5a2da0;
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

  .container { max-width: 860px; margin: 0 auto; }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
    text-decoration: none;
    letter-spacing: 0.3px;
    margin-bottom: 32px;
    transition: color 0.2s;
  }
  .back-link:hover { color: var(--terra); }

  .header { margin-bottom: 40px; }

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
  .page-title {
    font-size: 22px;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }
  .page-sub {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 300;
    letter-spacing: 0.3px;
    line-height: 1.7;
  }

  .legend-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-secondary);
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 12px 4px 8px;
  }
  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .tier-table { display: flex; flex-direction: column; gap: 12px; }

  .tier-row {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 0;
    border-radius: 18px;
    overflow: hidden;
    border: 1.5px solid;
    transition: box-shadow 0.2s;
  }
  .tier-row:hover { box-shadow: 0 4px 20px var(--shadow); }

  .tier-label-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 600;
    font-style: italic;
    border-right: 1.5px solid;
    border-right-color: inherit;
  }
  .tier-label-sub {
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 9px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.5px;
    margin-top: 2px;
    opacity: 0.7;
  }

  .tier-cards-cell {
    padding: 14px 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-content: flex-start;
    min-height: 64px;
  }

  .ip-card {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 14px;
    border-radius: 12px;
    background: white;
    border: 1px solid;
    cursor: default;
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
  }
  .ip-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(44,36,32,0.12);
    z-index: 1;
  }
  .ip-card-name {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
  .ip-card-desc {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 300;
    white-space: nowrap;
  }
  .ip-card-tags {
    display: flex;
    gap: 4px;
    margin-top: 3px;
    flex-wrap: wrap;
  }
  .ip-tag {
    font-size: 9px;
    padding: 1px 6px;
    border-radius: 8px;
    font-weight: 400;
    white-space: nowrap;
  }

  .tier-s .tier-row-el { border-color: var(--tier-s-border); background: var(--tier-s-bg); }
  .tier-s .tier-label-cell { color: var(--tier-s-label); }
  .tier-s .ip-card { border-color: rgba(224,122,58,0.25); }
  .tier-s .ip-card-name { color: var(--tier-s-label); }

  .tier-a .tier-row-el { border-color: var(--tier-a-border); background: var(--tier-a-bg); }
  .tier-a .tier-label-cell { color: var(--tier-a-label); }
  .tier-a .ip-card { border-color: rgba(212,184,58,0.25); }
  .tier-a .ip-card-name { color: var(--tier-a-label); }

  .tier-b .tier-row-el { border-color: var(--tier-b-border); background: var(--tier-b-bg); }
  .tier-b .tier-label-cell { color: var(--tier-b-label); }
  .tier-b .ip-card { border-color: rgba(90,170,106,0.25); }
  .tier-b .ip-card-name { color: var(--tier-b-label); }

  .tier-c .tier-row-el { border-color: var(--tier-c-border); background: var(--tier-c-bg); }
  .tier-c .tier-label-cell { color: var(--tier-c-label); }
  .tier-c .ip-card { border-color: rgba(106,138,212,0.25); }
  .tier-c .ip-card-name { color: var(--tier-c-label); }

  .tier-d .tier-row-el { border-color: var(--tier-d-border); background: var(--tier-d-bg); }
  .tier-d .tier-label-cell { color: var(--tier-d-label); }
  .tier-d .ip-card { border-color: rgba(154,106,212,0.25); }
  .tier-d .ip-card-name { color: var(--tier-d-label); }

  .filter-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .filter-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: transparent;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .filter-btn:hover, .filter-btn.active {
    background: var(--terra-pale);
    border-color: var(--terra-light);
    color: var(--terra);
  }

  .note-card {
    margin-top: 32px;
    padding: 16px 20px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 14px;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.9;
    font-weight: 300;
  }

  .footer { margin-top: 48px; text-align: center; font-size: 11px; color: var(--text-muted); font-weight: 300; letter-spacing: 0.3px; }
  .footer span { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--terra-light); }

  @media (max-width: 600px) {
    .tier-row { grid-template-columns: 48px 1fr; }
    .tier-label-cell { font-size: 24px; }
    .ip-card { padding: 6px 10px; }
    .ip-card-name { font-size: 12px; }
  }
`;

const CATEGORIES = ["すべて", "ゲーム", "アニメ・映像", "出版・漫画", "玩具・グッズ", "音楽・芸能"];

const TIERS = [
  {
    id: "s",
    label: "S",
    sub: "超巨大IP",
    holders: [
      {
        name: "任天堂",
        desc: "マリオ・ポケモン・ゼルダ",
        category: "ゲーム",
        tags: ["グローバル", "超長寿"],
      },
      {
        name: "集英社",
        desc: "ジャンプ IP全般",
        category: "出版・漫画",
        tags: ["ONE PIECE", "ドラゴンボール", "鬼滅"],
      },
      {
        name: "バンダイナムコ",
        desc: "ガンダム・テイルズ・アイマス",
        category: "玩具・グッズ",
        tags: ["玩具", "ゲーム", "アニメ"],
      },
      {
        name: "ソニーグループ",
        desc: "PlayStation・ソニーミュージック",
        category: "ゲーム",
        tags: ["ゲーム", "音楽", "映像"],
      },
    ],
  },
  {
    id: "a",
    label: "A",
    sub: "大型IP保有",
    holders: [
      {
        name: "KADOKAWA",
        desc: "Re:ゼロ・転スラ・この素晴らしい",
        category: "出版・漫画",
        tags: ["ラノベ", "アニメ"],
      },
      {
        name: "アニプレックス",
        desc: "鬼滅・進撃・SAO・FGO",
        category: "アニメ・映像",
        tags: ["アニメ", "ゲーム"],
      },
      {
        name: "スクウェア・エニックス",
        desc: "FF・ドラクエ・キングダムハーツ",
        category: "ゲーム",
        tags: ["RPG", "グローバル"],
      },
      {
        name: "カプコン",
        desc: "モンハン・バイオハザード・スト",
        category: "ゲーム",
        tags: ["アクション", "グローバル"],
      },
      {
        name: "東映アニメーション",
        desc: "DB・ワンピ・プリキュア・東映特撮",
        category: "アニメ・映像",
        tags: ["長寿IP", "キッズ"],
      },
      {
        name: "コナミ",
        desc: "遊戯王・パワプロ・ウイイレ",
        category: "ゲーム",
        tags: ["TCG", "スポーツ"],
      },
    ],
  },
  {
    id: "b",
    label: "B",
    sub: "中堅IP保有",
    holders: [
      {
        name: "セガ",
        desc: "ソニック・龍が如く・プロセカ",
        category: "ゲーム",
        tags: ["ゲーム", "音楽"],
      },
      {
        name: "京都アニメーション",
        desc: "ヴァイオレット・けいおん！・響け！",
        category: "アニメ・映像",
        tags: ["高品質", "オリジナル"],
      },
      {
        name: "タカラトミー",
        desc: "トミカ・プラレール・ベイブレード",
        category: "玩具・グッズ",
        tags: ["キッズ玩具"],
      },
      {
        name: "白泉社",
        desc: "フルーツバスケット・花より男子",
        category: "出版・漫画",
        tags: ["少女漫画"],
      },
      {
        name: "コーエーテクモ",
        desc: "信長の野望・無双シリーズ",
        category: "ゲーム",
        tags: ["歴史", "アクション"],
      },
      {
        name: "サイゲームス",
        desc: "グラブル・ウマ娘・シャドバ",
        category: "ゲーム",
        tags: ["スマホ", "IP育成"],
      },
      {
        name: "サンライズ（バンナム傘下）",
        desc: "ガンダム・コードギアス・勇者",
        category: "アニメ・映像",
        tags: ["ロボット", "長寿"],
      },
    ],
  },
  {
    id: "c",
    label: "C",
    sub: "特化型IP",
    holders: [
      {
        name: "小学館",
        desc: "コナン・ドラえもん・名探偵",
        category: "出版・漫画",
        tags: ["長寿", "キッズ"],
      },
      {
        name: "講談社",
        desc: "進撃・フェアリーテイル・はじめの一歩",
        category: "出版・漫画",
        tags: ["少年漫画"],
      },
      {
        name: "Cygames（DeNA）",
        desc: "プリコネ・グランブルー周辺",
        category: "ゲーム",
        tags: ["スマホ"],
      },
      {
        name: "スタジオジブリ",
        desc: "ラピュタ・ナウシカ・千と千尋",
        category: "アニメ・映像",
        tags: ["映画", "世界的認知"],
      },
      {
        name: "エイベックス",
        desc: "浜崎あゆみ・三代目・EXO",
        category: "音楽・芸能",
        tags: ["音楽IP"],
      },
      {
        name: "コロコロ（小学館）",
        desc: "ミニ四駆・ベイ・コロコロ系",
        category: "玩具・グッズ",
        tags: ["キッズ"],
      },
    ],
  },
  {
    id: "d",
    label: "D",
    sub: "新興・ニッチ",
    holders: [
      {
        name: "ブシロード",
        desc: "BanG Dream!・ラブライブ！（連携）",
        category: "音楽・芸能",
        tags: ["メディアミックス"],
      },
      {
        name: "フリュー",
        desc: "デスマーチ・ティアラ系",
        category: "ゲーム",
        tags: ["スマホ"],
      },
      {
        name: "DMM GAMES",
        desc: "艦これ・刀剣乱舞（連携）",
        category: "ゲーム",
        tags: ["ブラウザ"],
      },
      {
        name: "ポニーキャニオン",
        desc: "妖怪ウォッチ音楽・ラブライブ！",
        category: "音楽・芸能",
        tags: ["音楽"],
      },
    ],
  },
];

const TIER_COLORS = {
  s: { bg: "#fff0e6", border: "#e07a3a", label: "#c4561a", tagBg: "#fce0cc", tagColor: "#a03010" },
  a: { bg: "#fffbe6", border: "#d4b83a", label: "#a08820", tagBg: "#f8edb8", tagColor: "#806800" },
  b: { bg: "#eef8ee", border: "#5aaa6a", label: "#2d7a3d", tagBg: "#c8eece", tagColor: "#1a5a28" },
  c: { bg: "#eef4ff", border: "#6a8ad4", label: "#2d50a0", tagBg: "#c4d4f8", tagColor: "#1a3070" },
  d: { bg: "#f4eeff", border: "#9a6ad4", label: "#5a2da0", tagBg: "#d8c4f8", tagColor: "#3a1870" },
};

export default function IpTierPage() {
  const [activeCategory, setActiveCategory] = useState("すべて");

  const filteredTiers = TIERS.map((tier) => ({
    ...tier,
    holders:
      activeCategory === "すべて"
        ? tier.holders
        : tier.holders.filter((h) => h.category === activeCategory),
  })).filter((tier) => tier.holders.length > 0);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="container">
          <Link href="/" className="back-link">
            ← ここログへ戻る
          </Link>

          <div className="header">
            <div className="app-name-row">
              <div className="app-name-ja">
                <span className="koko">ここ</span>ログ
              </div>
              <div className="app-name-en">kokolog</div>
              <div className="app-name-divider" />
            </div>
            <div className="page-title">IPホルダー ティア表</div>
            <div className="page-sub">
              日本の主要IPホルダーをIPの規模・影響力・グローバル展開力で格付けしたティア表です。
            </div>
          </div>

          <div className="filter-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="legend-row">
            {Object.entries(TIER_COLORS).map(([tier, colors]) => (
              <div className="legend-item" key={tier}>
                <div className="legend-dot" style={{ background: colors.border }} />
                <span style={{ fontWeight: 600, color: colors.label }}>{tier.toUpperCase()}</span>
                <span>
                  {tier === "s" && "超巨大IP"}
                  {tier === "a" && "大型IP保有"}
                  {tier === "b" && "中堅IP保有"}
                  {tier === "c" && "特化型IP"}
                  {tier === "d" && "新興・ニッチ"}
                </span>
              </div>
            ))}
          </div>

          <div className="tier-table">
            {filteredTiers.map((tier) => {
              const colors = TIER_COLORS[tier.id];
              return (
                <div
                  key={tier.id}
                  className="tier-row"
                  style={{
                    borderColor: colors.border,
                    background: colors.bg,
                  }}
                >
                  <div
                    className="tier-label-cell"
                    style={{
                      color: colors.label,
                      borderRightColor: colors.border,
                    }}
                  >
                    {tier.label}
                    <span className="tier-label-sub">{tier.sub}</span>
                  </div>
                  <div className="tier-cards-cell">
                    {tier.holders.map((holder) => (
                      <div
                        key={holder.name}
                        className="ip-card"
                        style={{ borderColor: colors.border + "44" }}
                        title={`カテゴリ: ${holder.category}`}
                      >
                        <div className="ip-card-name" style={{ color: colors.label }}>
                          {holder.name}
                        </div>
                        <div className="ip-card-desc">{holder.desc}</div>
                        <div className="ip-card-tags">
                          {holder.tags.map((tag) => (
                            <span
                              key={tag}
                              className="ip-tag"
                              style={{ background: colors.tagBg, color: colors.tagColor }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="note-card">
            ※ このティア表はIPの規模・メディアミックス展開・グローバル認知度・収益規模などを総合的に考慮した独自評価です。<br />
            企業の時価総額や売上高とは必ずしも一致しません。同一ティア内は順不同です。
          </div>

          <div className="footer">
            <span>ここログ</span> — IP Holder Tier Table
          </div>
        </div>
      </div>
    </>
  );
}
