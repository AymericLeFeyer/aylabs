// Utilitaire pour générer des avatars avec DiceBear Bottts
export const generateAvatarUrl = (email: string): string => {
  // Utilise l'email pour générer un avatar unique via DiceBear Bottts
  return `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(email)}`;
};

// Fonction de fallback pour les initiales si l'API ne fonctionne pas
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Génère une couleur de fond basée sur le nom/email
export const generateBackgroundColor = (text: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};