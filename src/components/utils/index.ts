export function handleError(error: any) {
  console.error('Error:', error);
  // You can add more sophisticated error handling here
  // such as toast notifications, error reporting, etc.
}

export function formatADA(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateDaysRemaining(deadline: Date): number {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateFundingPercentage(current: number, goal: number): number {
  return Math.min((current / goal) * 100, 100);
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'text-gray-600';
    case 'uncommon':
      return 'text-green-600';
    case 'rare':
      return 'text-blue-600';
    case 'epic':
      return 'text-purple-600';
    case 'legendary':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
}

export function getRarityBadgeColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-800';
    case 'uncommon':
      return 'bg-green-100 text-green-800';
    case 'rare':
      return 'bg-blue-100 text-blue-800';
    case 'epic':
      return 'bg-purple-100 text-purple-800';
    case 'legendary':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}