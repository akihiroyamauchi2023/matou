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
      { id: 'linkedin', label: 'LinkedIn向け(接写)', prompt: 'Tight LinkedIn-style headshot crop, soft neutral background, natural window light, approachable and confident look.' },
      { id: 'turtleneck', label: 'ミニマル(黒)', prompt: 'Minimalist styling with a black turtleneck, deep charcoal gradient background, single soft key light, iconic creative-founder aesthetic.' },
      { id: 'cafe', label: 'カフェ背景', prompt: 'Warm blurred cafe interior background, cozy natural light, relaxed friendly freelancer style.' },
      { id: 'plants', label: 'グリーン背景', prompt: 'Softly blurred green foliage background, bright natural light, fresh approachable startup style.' },
      { id: 'arms-crossed', label: '腕組み(半身)', prompt: 'Half-body pose with arms lightly crossed, blurred modern lobby background, confident leadership posture, editorial lighting.' },
      { id: 'window-3q', label: '斜光(窓際)', prompt: 'Three-quarter face angle by a window, soft directional daylight with gentle shadow, natural authentic mood.' },
    ],
    maxCount: 8,
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
      { id: 'snow', label: '冬・雪化粧', prompt: 'Winter shrine scene with light falling snow, the warm-colored kimono contrasting the cold air, soft diffused light, seasonal storytelling.' },
      { id: 'candy-closeup', label: '千歳飴(寄り)', prompt: 'Close-up joyful portrait holding the chitose-ame candy bag, soft studio light, cheerful modern children-photo style.' },
      { id: 'black-bg', label: 'スタジオ(黒背景)', prompt: 'Dramatic black studio background making the colorful kimono pop, elegant single soft light, high-end atelier style.' },
      { id: 'tatami', label: '和室(畳)', prompt: 'Seated on tatami in a traditional Japanese room with shoji screens, warm ambient light, calm classic composition.' },
      { id: 'sepia', label: 'セピア(レトロ)', prompt: 'Warm sepia-toned retro finish, classic vintage photo-studio look, soft nostalgic lighting.' },
      { id: 'flower-field', label: '花畑', prompt: 'In a seasonal flower field with soft bokeh, bright natural daylight, cheerful storytelling composition.' },
      { id: 'fan', label: '扇子・小物', prompt: 'Posing playfully with a traditional folding fan or temari ball prop, clean studio backdrop, lively children-photo style.' },
      { id: 'sunset-shrine', label: '夕暮れの神社', prompt: 'At a shrine during warm sunset golden hour, soft backlight, dreamy nostalgic atmosphere.' },
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
      { id: 'bamboo', label: '竹林ロケ', prompt: 'In a serene bamboo grove with soft green filtered light, tranquil cinematic mood, the uchikake color contrasting the greens.' },
      { id: 'tsunokakushi', label: '角隠し(白無垢)', prompt: 'Pure white shiromuku with tsunokakushi headpiece, minimal elegant studio, refined symmetrical composition, museum-quality lighting.' },
      { id: 'engawa', label: '縁側', prompt: 'Seated on the engawa veranda of a traditional house overlooking a garden, gentle afternoon light, intimate storytelling frame.' },
      { id: 'snow-jp', label: '雪景色', prompt: 'Snowy landscape backdrop, crisp winter light, striking contrast of the red uchikake against white snow, cinematic.' },
      { id: 'sunset-field', label: '夕暮れロケ', prompt: 'Outdoor location at golden-hour sunset, warm romantic backlight, cinematic couple framing.' },
      { id: 'temple', label: '寺院', prompt: 'In the courtyard of a historic temple with wooden architecture, soft diffused light, dignified elegant mood.' },
      { id: 'candle-night', label: '夜×和ろうそく', prompt: 'Intimate night scene lit by warm Japanese candlelight, soft glowing bokeh, romantic dramatic low light.' },
      { id: 'closeup-hair', label: '花嫁の横顔(寄り)', prompt: 'Close-up of the bride\'s profile showing traditional bridal hair ornaments (kanzashi), soft beauty lighting, fine-art detail.' },
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
      { id: 'forest', label: '森ロケ', prompt: 'In a misty green forest with soft god-rays, dreamy natural light, flowing dress, fine-art bridal style.' },
      { id: 'vineyard', label: 'ヴィンヤード', prompt: 'European vineyard at golden hour, warm romantic light, elegant destination-wedding aesthetic.' },
      { id: 'ballroom', label: 'ボールルーム', prompt: 'Luxurious ballroom with crystal chandeliers, warm ambient glow, glamorous formal portrait.' },
      { id: 'veil-backlight', label: 'ベール逆光', prompt: 'Backlit veil catching the sunlight, ethereal glow around the couple, soft dreamy fine-art look.' },
      { id: 'flower-arch', label: 'フラワーアーチ', prompt: 'Under a lush floral arch, soft romantic daylight, pastel dreamy color grading.' },
      { id: 'lake', label: '湖畔', prompt: 'By a calm lakeside at golden hour, mirror reflections, serene romantic atmosphere.' },
      { id: 'street-europe', label: 'ヨーロッパ街並み', prompt: 'On a charming European cobblestone street, warm afternoon light, editorial destination-wedding style.' },
      { id: 'petals', label: 'フラワーシャワー', prompt: 'Joyful flower-petal shower moment, bright celebratory light, candid emotional movement.' },
      { id: 'bw-fineart', label: 'モノクロ・ファインアート', prompt: 'Timeless black-and-white fine-art portrait, sculptural directional light, emotional elegance.' },
      { id: 'poolside', label: 'リゾート・プールサイド', prompt: 'Luxury resort poolside at dusk, glamorous warm lighting, chic modern destination style.' },
    ],
    maxCount: 8,
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
      { id: 'green-soft', label: '緑・自然光', prompt: 'Soft blurred greenery background with gentle natural light, calm and refreshing peaceful atmosphere.' },
      { id: 'beige', label: 'ベージュ背景', prompt: 'Warm beige studio gradient, soft flattering light, gentle and serene modern memorial style.' },
      { id: 'suit-smile', label: '正装・柔らかな笑み', prompt: 'Formal attire with a soft gentle smile, light gray background, warm even lighting, kind and dignified.' },
      { id: 'kimono-color', label: '和装(彩り)', prompt: 'Refined kimono with tasteful gentle color, soft neutral background, calm respectful lighting.' },
    ],
    maxCount: 5,
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
      { id: 'umbrella-red', label: '和傘', prompt: 'Holding a red wagasa umbrella, seasonal backdrop, soft rim light, striking classic composition.' },
      { id: 'night-city-jp', label: '夜景×振袖', prompt: 'City night-lights bokeh background, flash-lit furisode portrait against deep blue dusk, stylish modern mood.' },
      { id: 'snow-seijin', label: '雪景色', prompt: 'Snowy winter scene matching the January ceremony, crisp light, elegant furisode against white snow.' },
      { id: 'black-studio', label: 'スタジオ(黒背景)', prompt: 'Dramatic black studio background, the furisode colors pop, fashion-editorial lighting and pose.' },
      { id: 'garden-jp', label: '日本庭園', prompt: 'In a refined Japanese garden with a red bridge softly blurred, gentle natural light, graceful pose.' },
      { id: 'retro-modern', label: 'レトロモダン', prompt: 'Taisho-roman retro-modern styling with a bold background, fashionable posing, stylish nostalgic mood.' },
      { id: 'fur-shawl', label: 'ファーショール', prompt: 'With a white fur shawl over the furisode, elegant studio, soft glamorous lighting, classic seijin look.' },
      { id: 'street-snap', label: 'ストリートスナップ', prompt: 'Urban street-snap style with a city background, natural candid posing, contemporary fashion-magazine feel.' },
      { id: 'temple-approach', label: '寺社の石段', prompt: 'On the stone steps of a shrine or temple, soft directional light, dignified composition.' },
      { id: 'bg-red', label: 'スタジオ(朱色)', prompt: 'Vivid vermilion-red studio background complementing the kimono, balanced elegant lighting, bold classic style.' },
    ],
    maxCount: 8,
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
      { id: 'tatami-baby', label: '和室(畳)', prompt: 'Baby on soft bedding in a traditional tatami room, warm gentle light, calm heartwarming composition.' },
      { id: 'closeup', label: '寝顔アップ', prompt: 'Tender close-up of the sleeping baby, soft high-key light, delicate newborn-photography detail.' },
      { id: 'parent-hands', label: '親の手と', prompt: 'Baby cradled in the parents\' hands, soft backlight, emotional intimate documentary style.' },
      { id: 'flowers-baby', label: '花あしらい', prompt: 'Baby surrounded by soft seasonal flowers, pastel airy tones, dreamy fine-art newborn style.' },
      { id: 'shrine-gate-baby', label: '鳥居前', prompt: 'In front of a vermilion torii gate, ceremonial kimono, soft natural light, heartwarming documentary style.' },
      { id: 'basket', label: 'かご・ナチュラル', prompt: 'Baby nestled in a soft natural basket with knit blankets, warm window light, gentle newborn-photo style.' },
      { id: 'black-bg-baby', label: 'スタジオ(黒背景)', prompt: 'Dramatic dark background with a soft spotlight on the baby, elegant fine-art newborn composition.' },
      { id: 'grandparents', label: '祖父母と', prompt: 'With grandparents gently holding the baby, warm relaxed smiles, soft light, emotional family documentary style.' },
      { id: 'okuizome', label: 'お食い初め膳', prompt: 'Traditional okuizome celebration meal setup with the baby, festive tasteful styling, warm even lighting.' },
      { id: 'garden-baby', label: '庭・自然光', prompt: 'Outdoors in a soft green garden, dappled natural light, fresh gentle storytelling composition.' },
      { id: 'feet-hands', label: '手足のアップ', prompt: 'Artistic close-up of tiny hands and feet, soft high-key light, delicate detail-focused newborn art.' },
      { id: 'pastel', label: 'パステル背景', prompt: 'Soft pastel-colored backdrop with gentle props, airy bright lighting, cute modern baby-photo style.' },
    ],
    maxCount: 8,
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
      { id: 'autumn-park', label: '紅葉の公園', prompt: 'In an autumn park with red and gold foliage bokeh, warm afternoon light, joyful candid interaction.' },
      { id: 'beach-family', label: 'ビーチ', prompt: 'On a beach at golden hour, breezy relaxed candid moment, warm backlight, lifestyle vacation feel.' },
      { id: 'monochrome-family', label: 'モノクロ', prompt: 'Timeless black-and-white family portrait, soft studio light, emotional classic composition.' },
      { id: 'jump', label: 'ジャンプ・動き', prompt: 'Playful action shot with everyone laughing or jumping, bright outdoor light, energetic candid style.' },
      { id: 'garden-family', label: 'ガーデン', prompt: 'In a lush green garden with soft daylight, relaxed candid interaction, natural lifestyle style.' },
      { id: 'cherry-family', label: '桜', prompt: 'Under cherry blossoms in soft spring light, cheerful group moment, pastel dreamy grading.' },
      { id: 'cafe-family', label: 'カフェ', prompt: 'In a cozy stylish cafe, warm ambient light, relaxed everyday interaction, lifestyle-magazine mood.' },
      { id: 'denim', label: 'リンクコーデ(デニム)', prompt: 'Coordinated denim outfits, clean bright studio, cheerful modern family-portrait styling.' },
      { id: 'sunset-family', label: '夕日ロケ', prompt: 'Outdoors at golden-hour sunset, warm backlit glow, joyful candid togetherness.' },
      { id: 'pet', label: 'ペットと', prompt: 'Relaxed portrait including the family pet, warm home or park setting, natural candid warmth.' },
    ],
    maxCount: 8,
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
      { id: 'partner', label: 'パートナーと', prompt: 'With partner gently embracing the belly, soft warm window light, tender intimate mood.' },
      { id: 'black-dress', label: '黒ドレス', prompt: 'Elegant fitted black gown against a dark background, sculptural dramatic lighting, chic fine-art maternity.' },
      { id: 'beach-maternity', label: 'ビーチ', prompt: 'On a beach at sunset, flowing dress in the breeze, warm backlit glow, serene destination style.' },
      { id: 'home-maternity', label: 'おうち', prompt: 'Cozy at-home setting by a bright window, soft natural light, relaxed intimate lifestyle mood.' },
      { id: 'studio-white-mat', label: 'スタジオ(白)', prompt: 'Bright airy white studio, flowing gown, soft even high-key light, clean fine-art maternity style.' },
      { id: 'flower-crown', label: 'フラワークラウン', prompt: 'With a delicate flower crown and soft florals, dreamy pastel light, romantic art direction.' },
      { id: 'family-mat', label: '家族と', prompt: 'With partner and older child gently touching the belly, warm natural light, tender family moment.' },
      { id: 'beach-sunset-mat', label: 'ビーチ夕日', prompt: 'On a beach at sunset, silhouette-style backlight tracing the form, serene cinematic mood.' },
      { id: 'nature-green', label: '緑・自然', prompt: 'Outdoors surrounded by soft greenery, gentle dappled light, fresh natural lifestyle feel.' },
      { id: 'lace-dress', label: 'レースドレス', prompt: 'Elegant lace gown, soft window light, delicate romantic fine-art portrait.' },
      { id: 'mono-mat', label: 'モノクロ', prompt: 'Timeless black-and-white maternity art, sculptural directional light, emotional elegance.' },
      { id: 'ribbon', label: 'リボン・シンプル', prompt: 'Simple styling with a soft ribbon accent on the belly, minimal clean background, gentle tender lighting.' },
    ],
    maxCount: 8,
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
