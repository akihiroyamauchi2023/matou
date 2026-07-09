// シーン定義: プロ写真家の知見をプロンプトとして体系化したカタログ。
// variations は生成枚数に応じて順番に使われ、同一シーン内でも
// ライティング・背景・構図の異なるカットが出力される。

export type SceneVariation = {
  id: string;
  label: string;
  prompt: string;
};

export type Scene = {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
  basePrompt: string;
  variations: SceneVariation[];
  maxCount: number;
};

const COMMON_QUALITY =
  'Preserve the exact facial identity, facial features, skin tone, and expression nuances of the person in the source photo. ' +
  'Output a photorealistic, professional studio-quality photograph. ' +
  'Shot on a full-frame camera with an 85mm f/1.4 portrait lens unless otherwise specified. ' +
  'Natural skin texture retouching (no plastic skin), accurate color science, professional color grading. ' +
  'No text, no watermark, no logo in the image.';

export const SCENES: Scene[] = [
  {
    id: 'profile',
    name: 'プロフィール写真',
    nameEn: 'Business Profile',
    emoji: '💼',
    description:
      'ビジネス・SNS・転職活動に。信頼感と清潔感のあるプロ品質のポートレートに仕上げます。',
    basePrompt:
      'Transform this photo into a professional business profile portrait (headshot). ' +
      'The subject wears a well-fitted business suit or smart business-casual attire. ' +
      'Confident, approachable expression. ' + COMMON_QUALITY,
    variations: [
      { id: 'studio-gray', label: 'スタジオ(グレー背景)', prompt: 'Neutral gray seamless studio background, classic Rembrandt lighting with a large softbox key light and subtle rim light.' },
      { id: 'studio-white', label: 'スタジオ(白背景)', prompt: 'Clean white seamless background, bright high-key butterfly lighting, crisp corporate look.' },
      { id: 'office', label: 'オフィス背景', prompt: 'Blurred modern office interior background with soft window light from the side, shallow depth of field, editorial corporate style.' },
      { id: 'outdoor', label: '屋外ナチュラル', prompt: 'Outdoor urban background softly blurred, golden-hour natural light, warm and friendly atmosphere.' },
      { id: 'dark', label: 'ダーク背景', prompt: 'Dark charcoal background, dramatic low-key lighting with strong key light, premium executive portrait style.' },
      { id: 'navy', label: 'ネイビー背景', prompt: 'Deep navy blue studio background, balanced three-point lighting, trustworthy financial-industry style portrait.' },
      { id: 'smile', label: 'スマイル(白背景)', prompt: 'White background, warm genuine smile, bright even lighting, friendly customer-facing style.' },
      { id: 'mono', label: 'モノクロ', prompt: 'Black and white fine-art corporate portrait, dramatic side lighting, timeless editorial style.' },
      { id: 'teal', label: 'ティールグラデーション', prompt: 'Elegant teal-to-white gradient studio background, soft beauty-dish lighting, modern creative-industry style.' },
      { id: 'bookshelf', label: '書斎背景', prompt: 'Blurred bookshelf background, warm tungsten accent lights, intellectual and authoritative atmosphere.' },
    ],
    maxCount: 10,
  },
  {
    id: 'shichigosan',
    name: '七五三',
    nameEn: 'Shichi-Go-San',
    emoji: '🎎',
    description:
      'お子さまの晴れ姿を、老舗写真館さながらの本格的な七五三記念写真に。和装・神社背景など多彩に。',
    basePrompt:
      'Transform this photo into a professional Shichi-Go-San (Japanese children\'s rite-of-passage) commemorative photograph. ' +
      'The child wears a beautiful traditional Japanese kimono appropriate for Shichi-Go-San: for girls an elegant furisode-style kimono with hair ornaments (kanzashi), for boys a formal haori-hakama. ' +
      'Keep the child\'s face, age and expression exactly as in the source photo. ' + COMMON_QUALITY,
    variations: [
      { id: 'studio-red', label: 'スタジオ(緋毛氈)', prompt: 'Classic Japanese photo-studio set with red felt carpet, gold folding-screen (byobu) background, chitose-ame candy bag prop, soft even studio lighting.' },
      { id: 'shrine-gate', label: '神社(鳥居)', prompt: 'In front of a vermilion torii gate at a Japanese shrine, soft autumn afternoon sunlight, shallow depth of field, maple leaves softly blurred.' },
      { id: 'shrine-steps', label: '神社(参道)', prompt: 'On the stone approach path of a traditional shrine, autumn foliage bokeh, gentle backlight with reflector fill, storytelling documentary style.' },
      { id: 'studio-white', label: 'スタジオ(白鶴)', prompt: 'Modern minimal white studio with subtle crane and cloud Japanese motif backdrop, airy high-key lighting.' },
      { id: 'garden', label: '日本庭園', prompt: 'In a serene Japanese garden with a red bridge and pond softly blurred, dappled natural light through trees.' },
      { id: 'umbrella', label: '和傘', prompt: 'Holding a red traditional Japanese umbrella (wagasa), seasonal flowers background, soft rim light, classic washi-paper texture atmosphere.' },
      { id: 'family-style', label: 'ナチュラル笑顔', prompt: 'Natural candid laughing moment, warm window-light style studio, cream background, modern family-magazine aesthetic.' },
      { id: 'formal', label: '正統派(全身)', prompt: 'Full-body formal standing pose, traditional studio backdrop with subtle gold gradient, perfectly balanced classical lighting.' },
    ],
    maxCount: 8,
  },
  {
    id: 'wedding',
    name: '結婚式前撮り(和装)',
    nameEn: 'Wedding (Japanese Style)',
    emoji: '👘',
    description:
      '白無垢・色打掛での本格和装前撮り。神社・庭園ロケーション風の格調高い一枚に。',
    basePrompt:
      'Transform this photo into a professional Japanese-style pre-wedding (maedori) photograph. ' +
      'Dress the subject(s) in exquisite traditional Japanese wedding attire: for a bride a pure-white shiromuku or a vividly embroidered iro-uchikake kimono with traditional bridal hairstyle, for a groom a formal black montsuki haori-hakama. ' +
      COMMON_QUALITY,
    variations: [
      { id: 'shiromuku', label: '白無垢×神社', prompt: 'Pure white shiromuku kimono with wataboshi hood, standing in a tranquil shrine courtyard, soft overcast light, timeless elegant composition.' },
      { id: 'irouchikake', label: '色打掛×庭園', prompt: 'Crimson and gold iro-uchikake kimono in a Japanese garden with seasonal flowers, late-afternoon warm sunlight, medium-format film look.' },
      { id: 'umbrella-duo', label: '相合傘', prompt: 'Couple sharing a red traditional umbrella on a stone path, gentle rain atmosphere with soft reflections, cinematic romantic mood.' },
      { id: 'studio-gold', label: 'スタジオ(金屏風)', prompt: 'Classical studio with golden folding screen background, formal seated pose, perfectly symmetrical lighting, prestigious portrait style.' },
      { id: 'night', label: '夜景×提灯', prompt: 'Evening scene with warm glowing paper lanterns bokeh, dramatic yet romantic low light, shallow depth of field.' },
      { id: 'sakura', label: '桜ロケーション', prompt: 'Under blooming cherry blossom trees, petals gently falling, dreamy spring backlight, pastel color grading.' },
      { id: 'autumn', label: '紅葉ロケーション', prompt: 'Surrounded by brilliant red and orange autumn maple leaves, soft directional sunlight, rich warm color palette.' },
      { id: 'back-shot', label: '後ろ姿(打掛)', prompt: 'Elegant back view showcasing the embroidered uchikake kimono design, looking slightly over the shoulder, art-piece composition.' },
    ],
    maxCount: 8,
  },
  {
    id: 'wedding-dress',
    name: '結婚式前撮り(洋装)',
    nameEn: 'Wedding (Dress)',
    emoji: '💒',
    description:
      'ウェディングドレス・タキシードでの洋装前撮り。チャペルやビーチなど憧れのロケーションで。',
    basePrompt:
      'Transform this photo into a professional Western-style pre-wedding photograph. ' +
      'Dress the subject(s) in elegant wedding attire: a beautiful white wedding dress with veil for the bride, a classic tuxedo for the groom. ' +
      COMMON_QUALITY,
    variations: [
      { id: 'chapel', label: 'チャペル', prompt: 'Inside a bright white chapel with stained-glass light, ethereal high-key lighting, graceful formal pose.' },
      { id: 'beach', label: 'ビーチサンセット', prompt: 'On a beach at golden sunset, dress and veil flowing in the breeze, warm backlit silhouette-style rim light, destination-wedding look.' },
      { id: 'garden', label: 'ガーデン', prompt: 'In a lush European-style rose garden, soft natural daylight, romantic pastel color grading.' },
      { id: 'stairs', label: '大階段', prompt: 'On a grand marble staircase of a classic hotel, chandelier warm light, luxurious editorial composition.' },
      { id: 'night-city', label: '夜景', prompt: 'Rooftop with city night-lights bokeh background, elegant flash-lit portrait against deep blue dusk sky.' },
      { id: 'studio-fine', label: 'ファインアート', prompt: 'Minimal fine-art studio, sculptural window light, timeless black-and-white or muted color art portrait.' },
    ],
    maxCount: 6,
  },
  {
    id: 'iei',
    name: '遺影写真',
    nameEn: 'Memorial Portrait',
    emoji: '🕊️',
    description:
      '大切な方の温かな表情を、格調と安らぎのある遺影・終活用ポートレートに丁寧に仕上げます。',
    basePrompt:
      'Transform this photo into a dignified Japanese memorial portrait (iei) suitable for a funeral altar or as a pre-planned legacy portrait. ' +
      'Preserve the person\'s face, age, and gentle expression faithfully — this is the most important requirement. ' +
      'Formal framing: chest-up composition, subject facing slightly toward camera with a calm, warm, peaceful expression. ' +
      COMMON_QUALITY,
    variations: [
      { id: 'formal-suit', label: '正装(スーツ)', prompt: 'Dress the subject in a formal dark suit with white shirt (and modest tie for men / elegant blouse for women), soft light-gray gradient background, gentle even lighting.' },
      { id: 'kimono', label: '和装(着物)', prompt: 'Dress the subject in a refined formal kimono in subdued elegant colors, classic light-blue-gray studio gradient background, soft dignified lighting.' },
      { id: 'natural', label: 'ナチュラル(普段着)', prompt: 'Keep natural favorite-clothes look with a tidy appearance, warm cream background with soft vignette, kind smiling atmosphere.' },
      { id: 'flowers', label: '花あしらい', prompt: 'Soft pastel background with delicately blurred seasonal flowers at the corners, serene and warm remembrance style.' },
      { id: 'blue-sky', label: '青空背景', prompt: 'Soft blue sky with gentle white clouds background, bright hopeful lighting, peaceful modern memorial style.' },
      { id: 'mono', label: 'モノクロ(格調)', prompt: 'Classic dignified black-and-white memorial portrait, smooth gray background, timeless formal style.' },
    ],
    maxCount: 6,
  },
  {
    id: 'seijin',
    name: '成人式',
    nameEn: 'Coming of Age',
    emoji: '🌸',
    description:
      '一生に一度の成人式。振袖・袴姿の華やかな記念写真をスタジオ・ロケーション風に。',
    basePrompt:
      'Transform this photo into a professional Japanese Coming-of-Age Day (Seijin-shiki) commemorative portrait. ' +
      'Dress the subject in gorgeous traditional attire: a vibrant furisode kimono with elegant obi and hair styling with ornaments for women, or a sharp hakama ensemble for men. ' +
      COMMON_QUALITY,
    variations: [
      { id: 'studio-classic', label: 'スタジオ(古典)', prompt: 'Classical studio with subtle gold-cloud Japanese backdrop, formal standing pose showing the kimono sleeves beautifully, balanced soft lighting.' },
      { id: 'studio-modern', label: 'スタジオ(モダン)', prompt: 'Modern colorful seamless background matching the kimono palette, fashion-magazine lighting and posing, contemporary stylish mood.' },
      { id: 'shrine', label: '神社ロケ', prompt: 'At a shrine approach with soft winter morning light, graceful natural pose, shallow depth of field.' },
      { id: 'sakura', label: '桜', prompt: 'Under cherry blossoms in soft spring light, petals in the air, dreamy pastel grading.' },
      { id: 'furisode-back', label: '帯・後ろ姿', prompt: 'Elegant back view highlighting the obi knot and furisode design, looking over the shoulder, art composition.' },
      { id: 'casual-smile', label: 'ナチュラル笑顔', prompt: 'Natural joyful laughing moment, bright airy studio, friendly documentary style.' },
    ],
    maxCount: 6,
  },
  {
    id: 'omiyamairi',
    name: 'お宮参り・百日祝い',
    nameEn: 'Baby Milestones',
    emoji: '👶',
    description:
      '赤ちゃんの健やかな成長を願うお宮参り・お食い初め。家族の宝物になる一枚に。',
    basePrompt:
      'Transform this photo into a professional Japanese baby-milestone commemorative photograph (omiyamairi shrine visit / 100-day celebration). ' +
      'The baby wears a beautiful ceremonial kimono cover (kakeginu) or elegant white celebration outfit. Keep the baby\'s face and any family members\' faces exactly as in the source. ' +
      COMMON_QUALITY,
    variations: [
      { id: 'shrine', label: '神社', prompt: 'At a serene shrine with soft natural light, ceremonial kimono draped traditionally, gentle heartwarming documentary style.' },
      { id: 'studio-white', label: 'スタジオ(白)', prompt: 'Bright white minimal studio, baby on a soft white blanket with delicate floral accents, airy high-key newborn-photography lighting.' },
      { id: 'studio-japanese', label: 'スタジオ(和)', prompt: 'Japanese-style studio set with soft tatami tones and seasonal flower arrangement, warm gentle lighting.' },
      { id: 'family', label: '家族と', prompt: 'With family members gathered around the baby, natural relaxed smiles, warm window light, editorial family-portrait style.' },
    ],
    maxCount: 4,
  },
  {
    id: 'family',
    name: '家族写真',
    nameEn: 'Family Portrait',
    emoji: '👨‍👩‍👧‍👦',
    description:
      '年賀状や記念日に。ご家族の自然な笑顔を、雑誌のようなおしゃれなファミリーフォトに。',
    basePrompt:
      'Transform this photo into a professional family portrait. ' +
      'Keep every family member\'s face, age, and expression exactly as in the source photo. Coordinate outfits into tasteful smart-casual tones. ' +
      COMMON_QUALITY,
    variations: [
      { id: 'studio-white', label: 'スタジオ(白)', prompt: 'Clean white studio background, relaxed natural group pose, bright even lighting, modern minimal family-portrait style.' },
      { id: 'studio-beige', label: 'スタジオ(ベージュ)', prompt: 'Warm beige studio backdrop, cozy seated arrangement, soft window-style lighting, lifestyle-magazine aesthetic.' },
      { id: 'park', label: '公園ロケ', prompt: 'In a sunlit park with green bokeh, candid laughing interaction, golden-hour warmth, documentary family style.' },
      { id: 'home', label: 'おうちフォト', prompt: 'Bright stylish living-room setting, natural cozy interaction, airy lifestyle photography look.' },
      { id: 'formal', label: 'フォーマル', prompt: 'Formal attire, classic composed group arrangement, elegant gray backdrop, traditional prestigious portrait style.' },
      { id: 'newyear', label: '年賀状向け(和)', prompt: 'Japanese New Year mood with subtle seasonal decoration accents, cheerful group pose, festive yet tasteful styling.' },
    ],
    maxCount: 6,
  },
  {
    id: 'maternity',
    name: 'マタニティフォト',
    nameEn: 'Maternity',
    emoji: '🤰',
    description:
      'かけがえのないマタニティ期を、柔らかな光に包まれた芸術的なポートレートに。',
    basePrompt:
      'Transform this photo into a professional maternity portrait. ' +
      'Keep the mother\'s face and body exactly as in the source photo, celebrating the pregnancy beautifully and tastefully with elegant maternity styling. ' +
      COMMON_QUALITY,
    variations: [
      { id: 'white-drape', label: '白ドレープ', prompt: 'Flowing white chiffon drape dress, bright airy white studio, ethereal soft backlight, fine-art maternity style.' },
      { id: 'silhouette', label: 'シルエット', prompt: 'Artistic profile silhouette against a softly lit window, gentle rim light tracing the form, timeless monochrome-toned art piece.' },
      { id: 'natural', label: 'ナチュラル', prompt: 'Cozy knit or casual styling, warm natural window light, relaxed intimate lifestyle mood.' },
      { id: 'garden', label: 'ガーデン', prompt: 'In a soft-focus flower garden with pastel tones, dreamy golden-hour glow, romantic art direction.' },
    ],
    maxCount: 4,
  },
];

export function getScene(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}

export function buildPrompt(scene: Scene, variationIndex: number): { prompt: string; variationLabel: string } {
  const v = scene.variations[variationIndex % scene.variations.length];
  return {
    prompt: `${scene.basePrompt}\n\nScene direction: ${v.prompt}`,
    variationLabel: v.label,
  };
}

// 指定したシチュエーション(バリエーションID)からプロンプトを組み立てる。
// ユーザーが選んだシチュエーションごとに1枚生成するために使う。
export function buildPromptForVariation(
  scene: Scene,
  variationId: string
): { prompt: string; variationLabel: string } | null {
  const v = scene.variations.find((x) => x.id === variationId);
  if (!v) return null;
  return {
    prompt: `${scene.basePrompt}\n\nScene direction: ${v.prompt}`,
    variationLabel: v.label,
  };
}
