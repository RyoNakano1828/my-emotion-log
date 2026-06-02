// pages/api/save.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { result } = req.body;
  const notionKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_DATABASE_ID;

  const VALENCE_LABELS = {
    "-2": "かなり不快", "-1": "やや不快", "0": "中立", "1": "やや快", "2": "かなり快",
  };
  const AROUSAL_LABELS = {
    1: "とても穏やか", 2: "落ち着いている", 3: "ふつう", 4: "活性化している", 5: "強く興奮",
  };
  const intensityMap = {
    1: "1（非常に弱い）", 2: "2（弱い）", 3: "3（普通）", 4: "4（強い）", 5: "5（非常に強い）",
  };

  const now = new Date();
  const dateISO = now.toISOString().slice(0, 10);
  const datetimeISO = now.toISOString();
  const hour = now.getHours();

  let timeZone = "深夜（0〜6時）";
  if (hour >= 6 && hour < 9) timeZone = "朝（6〜9時）";
  else if (hour >= 9 && hour < 12) timeZone = "午前（9〜12時）";
  else if (hour >= 12 && hour < 14) timeZone = "昼（12〜14時）";
  else if (hour >= 14 && hour < 18) timeZone = "午後（14〜18時）";
  else if (hour >= 18 && hour < 21) timeZone = "夕方（18〜21時）";
  else if (hour >= 21) timeZone = "夜（21〜24時）";

  const aiNoteWithMeta = `[快不快: ${VALENCE_LABELS[String(result.valence)]} / 体の活性度: ${AROUSAL_LABELS[result.arousal]}]\n\n${result.aiNote}`;

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${notionKey}`,
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties: {
          タイトル: { title: [{ text: { content: result.fact || "" } }] },
          メモ: { rich_text: [{ text: { content: aiNoteWithMeta } }] },
          感情語: { multi_select: result.emotionTags.map((n) => ({ name: n })) },
          感情の強度: { select: { name: intensityMap[result.intensity] } },
          快不快: {
            select: {
              name: VALENCE_LABELS[String(result.valence)]
            }
          },
          感情の原因タグ: { multi_select: result.causeTags.map((n) => ({ name: n })) },
          心理的状態: { multi_select: result.psychTags.map((n) => ({ name: n })) },
          認知的評価: { multi_select: result.cognitiveTags.map((n) => ({ name: n })) },
          身体的状態: { multi_select: result.physicalTags.map((n) => ({ name: n })) },
          日付: { date: { start: dateISO } },
          時刻: { date: { start: datetimeISO } },
          時間帯: { select: { name: timeZone } },
        },
      }),
    });

    if (!response.ok) throw new Error("Notion API error");
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Notion save failed" });
  }
}
