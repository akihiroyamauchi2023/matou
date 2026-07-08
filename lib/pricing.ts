// 料金体系: 生成・プレビューは無料、高解像度ダウンロード時に課金。
// まとめ買いほど1枚あたりが割安になる自動最適価格。

export const CURRENCY = 'jpy';

export type PriceTier = {
  count: number;
  price: number; // JPY(税込)
  label: string;
};

export const PRICE_TIERS: PriceTier[] = [
  { count: 1, price: 330, label: '1枚' },
  { count: 3, price: 880, label: '3枚パック' },
  { count: 5, price: 1320, label: '5枚パック' },
  { count: 10, price: 2200, label: '10枚パック' },
];

// n枚購入時の最安価格を動的計画法で算出
export function priceForCount(n: number): number {
  if (n <= 0) return 0;
  const dp = new Array<number>(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (const t of PRICE_TIERS) {
      const prev = Math.max(0, i - t.count);
      dp[i] = Math.min(dp[i], dp[prev] + t.price);
    }
  }
  return dp[n];
}

export function formatJPY(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`;
}
