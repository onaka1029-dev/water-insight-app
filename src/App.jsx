import { useState, useRef } from "react";

const CATEGORIES = [
  {
    id: "methodology",
    label: "算定手法",
    icon: "📐",
    color: "#1B6CA8",
    topics: [
      "WRIアクアダクトとWFNの算定アプローチの違い",
      "ウォーターフットプリントの算定境界の設定方法",
      "水ストレス指標の選び方と使い分け",
      "消費水量と取水量の違いと現場での混乱",
      "間接水使用量（バーチャルウォーター）の算定の落とし穴",
      "サプライチェーン上流の水リスク評価の難しさ",
      "水質リスクと水量リスクの統合評価の現状",
    ],
  },
  {
    id: "factor",
    label: "使用原単位",
    icon: "🔢",
    color: "#2E8B57",
    topics: [
      "水の原単位データベース（WFN・Ecoinvent）の精度と限界",
      "産業別・地域別の水消費原単位の使い分け",
      "農産物の水フットプリント原単位の信頼性",
      "電力の水消費原単位が見落とされがちな理由",
      "原単位のローカライズ（地域適合）の重要性",
      "水の希少性加重係数の意味と注意点",
      "自社実測データと原単位の使い分け基準",
    ],
  },
  {
    id: "cdp",
    label: "CDP・開示",
    icon: "📋",
    color: "#7B5EA7",
    topics: [
      "CDPウォーター質問書の良い点・改善すべき点",
      "CDP回答で企業が陥りがちなミスと対策",
      "CDPスコアと実際の水リスク管理のギャップ",
      "CDP水質問書とTCFD提言の整合性の問題",
      "開示データの比較可能性が低い根本原因",
      "中小企業がCDP対応で感じるハードルの正体",
      "CDP開示が「目的化」してしまう企業の問題",
    ],
  },
  {
    id: "regulation",
    label: "規制・ルール",
    icon: "⚖️",
    color: "#B05A3A",
    topics: [
      "ISO 14046（水フットプリント規格）の実務的な使いにくさ",
      "GHGプロトコルに水版がない理由と代替手段",
      "EU水枠組み指令が日本企業に与える間接影響",
      "SBTi水目標（SBT for Nature）の現状と課題",
      "TNFDと水リスク開示の接続点と問題点",
      "国内水循環基本法の企業への影響と認知度の低さ",
      "規制対応と本質的な水リスク管理が乖離する構造問題",
    ],
  },
  {
    id: "practice",
    label: "実務・現場",
    icon: "🏭",
    color: "#1A7D9A",
    topics: [
      "水リスク評価を「やったつもり」で終わらせない方法",
      "工場単位の水使用データ収集が難しい本当の理由",
      "水リスクマップの使い方と限界を正直に伝える",
      "経営層に水リスクを理解してもらうための説明設計",
      "水リスク評価とLCAを統合する際のポイント",
      "ホットスポット特定後に何をすべきか",
      "サプライヤーに水情報開示を求める際の現実的アプローチ",
    ],
  },
  {
    id: "insight",
    label: "本質論・持論",
    icon: "💡",
    color: "#3A6B8A",
    topics: [
      "「水リスク」という言葉が一人歩きしている問題",
      "水と炭素は同じ方法で管理できない根本的な理由",
      "水のローカル性を無視したグローバル指標の限界",
      "企業の水対策が「報告書のため」になっている構造",
      "水リスク評価にLCA視点が不可欠な理由",
      "日本企業の水リスクへの認識が低い理由を考える",
      "水の問題を解決するために本当に必要なアプローチ",
    ],
  },
];

const STYLE_SHEET = `
■ 基本スタンス
- 現実的・実務優先。理想論より「それで現場は動くか？」を問う視点。
- サステナビリティはあくまで手段であり、目的化することへの違和感を常に持っている。
- 一面的な結論を避け、複眼的・トレードオフの視点を必ず入れる。

■ 書き出し・構成
- 必ずデータ・数字・具体的な事実または鋭い問いかけから入る。
- 抽象的な概念の直後に必ず「例えば〜」で具体例を添える。
- 企業名・機関名・規格名・ツール名など固有名詞を積極的に使う。
- メッセージ性の薄い一般論・当たり前の内容は書かない。

■ 文体（必須）
- 全文をです・ます調で統一する。
- 短文と長文を緩急つけてリズムで読ませる。
- 「私は〜と考えています」「現場では〜と感じています」など一人称の視点を積極的に入れる。
- 意見・考察は「〜と感じています」「〜ではないかと思います」と柔らかく。

■ トーンと締め方
- 悲観・危機感を煽らない。ワクワク感を届ける。
- 読者が「そういう見方があるのか」「やってみたい」と前のめりになるテンションで書く。
- 最後は必ず可能性・機会・希望で締める。
`.trim();

export default function WaterInsightGenerator() {
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState("");
  const [activeMeta, setActiveMeta] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  const cat = CATEGORIES.find((c) => c.id === selectedCat);
  const finalTopic = customTopic.trim() || selectedTopic;

  const generate = async () => {
    if (!finalTopic) return;
    setLoading(true);
    setArticle("");
    setError(null);

    try {
      const res = await fetch("/.netlify/functions/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2500,
          messages: [{
            role: "user",
            content: `あなたは水環境・水リスク評価・LCAの専門コンサルタントであり、ビジネスコラムニストです。
以下の【筆者スタイルシート】を完全に体現した専門解説コラムを執筆してください。

【筆者スタイルシート】
${STYLE_SHEET}

【テーマ】
${finalTopic}

【執筆方針】
- ウェブ検索は使わない。筆者の専門知識・実務経験・見解を中心に書く。
- 水リスク評価・LCA・サステナビリティ実務の深い知見をもとに、読者が「なるほど、そういう見方があるのか」と気づく視点を提供する。
- 良い点・問題点・現場の実態・改善のヒントをバランスよく盛り込む。
- 時事ニュースへの言及は不要。普遍的な洞察・構造的な問題・本質的な視点を書く。

コラム要件：
- 文字数：800〜1200字
- 構成：タイトル → 問いかけまたは持論から入るリード → 本文2〜3段落 → 読者へのメッセージ
- コラム本文のみを出力する（説明文・前置き不要）`,
          }],
        }),
      });

      const data = await res.json();
      const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      setArticle(text);
      setActiveMeta({ topic: finalTopic, cat });
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError("エラーが発生しました：" + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F5FA", fontFamily: "'Georgia', 'Hiragino Mincho ProN', serif", color: "#0D1F2D" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .topic-btn:hover { background: #EBF4FF !important; border-color: #93C5FD !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0B3D6B 0%, #1565A0 100%)", padding: "28px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: "#7EC8E3", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>
            Water Risk Insight Generator
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
            💧 水リスク評価 専門解説ツール
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: 0, fontFamily: "sans-serif" }}>
            算定手法・原単位・CDP・規制など、専門的な見解をコラム記事として生成します
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px" }}>

        {/* Step 1: Category */}
        <section style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5A7A9A", marginBottom: 12, fontFamily: "monospace" }}>
            01 — カテゴリを選択
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => { setSelectedCat(c.id); setSelectedTopic(null); setCustomTopic(""); }} style={{
                padding: "12px 14px", textAlign: "left", cursor: "pointer",
                background: selectedCat === c.id ? c.color : "#fff",
                border: `2px solid ${selectedCat === c.id ? c.color : "#D4DCE4"}`,
                borderRadius: 8, transition: "all 0.15s",
                color: selectedCat === c.id ? "#fff" : "#0D1F2D",
                boxShadow: selectedCat === c.id ? `0 4px 12px ${c.color}40` : "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <span style={{ fontSize: 20, display: "block", marginBottom: 4 }}>{c.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "sans-serif" }}>{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Topic */}
        {cat && (
          <section style={{ marginBottom: 28, animation: "fadeIn 0.25s ease" }}>
            <label style={{ display: "block", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5A7A9A", marginBottom: 12, fontFamily: "monospace" }}>
              02 — トピックを選択
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              {cat.topics.map((topic) => (
                <button key={topic} className="topic-btn" onClick={() => { setSelectedTopic(topic); setCustomTopic(""); }} style={{
                  padding: "11px 16px", textAlign: "left", cursor: "pointer",
                  background: selectedTopic === topic && !customTopic ? cat.color : "#fff",
                  border: `1.5px solid ${selectedTopic === topic && !customTopic ? cat.color : "#D4DCE4"}`,
                  borderRadius: 6, transition: "all 0.15s", fontSize: 13,
                  fontFamily: "sans-serif", lineHeight: 1.5,
                  color: selectedTopic === topic && !customTopic ? "#fff" : "#1A2A3A",
                  fontWeight: selectedTopic === topic && !customTopic ? 700 : 400,
                }}>
                  {topic}
                </button>
              ))}
            </div>

            {/* Custom topic */}
            <div style={{ borderTop: "1px dashed #D4DCE4", paddingTop: 14 }}>
              <label style={{ display: "block", fontSize: 11, color: "#5A7A9A", fontFamily: "sans-serif", marginBottom: 6 }}>
                または、自由にテーマを入力する
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => { setCustomTopic(e.target.value); setSelectedTopic(null); }}
                placeholder="例：水リスク評価とLCAを組み合わせる際のポイント"
                style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${customTopic ? cat.color : "#D4DCE4"}`, borderRadius: 6, fontSize: 13, fontFamily: "sans-serif", color: "#1A2A3A", outline: "none", boxSizing: "border-box", background: "#FAFCFE" }}
              />
            </div>
          </section>
        )}

        {/* Generate button */}
        {cat && (
          <button onClick={generate} disabled={!finalTopic || loading} style={{
            width: "100%", padding: "15px",
            background: !finalTopic || loading ? "#B8C8D4" : cat.color,
            color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
            fontFamily: "sans-serif", cursor: !finalTopic || loading ? "not-allowed" : "pointer",
            letterSpacing: "0.05em", transition: "all 0.2s", marginBottom: 28,
            boxShadow: !finalTopic || loading ? "none" : `0 4px 16px ${cat.color}50`,
          }}>
            {loading ? "💡 専門解説コラムを執筆中..." : "💡 解説コラムを生成する"}
          </button>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ background: "#fff", border: "1px solid #D4DCE4", borderRadius: 10, padding: "28px", textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, border: "3px solid #D4DCE4", borderTop: `3px solid ${cat?.color || "#1565A0"}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 14px" }} />
            <p style={{ color: "#5A7A9A", fontFamily: "sans-serif", fontSize: 13, margin: 0 }}>
              専門知識をもとに解説コラムを執筆しています…<br />
              <span style={{ fontSize: 11, opacity: 0.7 }}>（10〜20秒ほどかかります）</span>
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "14px 16px", color: "#B91C1C", fontFamily: "sans-serif", fontSize: 13, marginBottom: 24 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Article */}
        {article && !loading && (
          <div style={{ animation: "fadeIn 0.4s ease" }} ref={outputRef}>
            <div style={{ background: "#fff", border: "1px solid #D4DCE4", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>

              {/* Article header */}
              <div style={{ background: activeMeta?.cat?.color || "#1565A0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <span style={{ display: "block", fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: 3 }}>
                    {activeMeta?.cat?.icon} {activeMeta?.cat?.label}
                  </span>
                  <span style={{ fontSize: 12, fontFamily: "sans-serif", color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>
                    {activeMeta?.topic}
                  </span>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(article); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{
                  background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: 4, color: "#fff", fontSize: 11, fontFamily: "sans-serif",
                  padding: "4px 14px", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap",
                }}>
                  {copied ? "✓ コピー完了" : "📋 コピー"}
                </button>
              </div>

              {/* Article body */}
              <div style={{ padding: "28px 30px 36px" }}>
                {article.split("\n").map((line, i) => {
                  if (!line.trim()) return <div key={i} style={{ height: 12 }} />;
                  const isTitle = i === 0 || line.startsWith("# ");
                  const isSubhead = line.startsWith("## ") || line.startsWith("【");
                  const clean = line.replace(/^#{1,3}\s/, "");
                  return (
                    <p key={i} style={{
                      margin: "0 0 4px",
                      fontSize: isTitle ? 20 : isSubhead ? 15 : 14,
                      fontWeight: isTitle ? 800 : isSubhead ? 700 : 400,
                      lineHeight: isTitle ? 1.45 : 1.9,
                      color: isTitle ? "#0B3D6B" : "#1A2A3A",
                    }}>
                      {clean}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Regenerate nudge */}
            <p style={{ textAlign: "center", fontSize: 12, fontFamily: "sans-serif", color: "#8A9AA8", marginTop: 16 }}>
              別のトピックを選んで再生成できます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
