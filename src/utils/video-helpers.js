/**
 * Video URL processing utilities for Strapi
 */

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract video ID from Vimeo URL
 * @param {string} url - Vimeo URL
 * @returns {string|null} - Video ID or null if invalid
 */
export function extractVimeoId(url) {
  const patterns = [/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract video ID from Dailymotion URL
 * @param {string} url - Dailymotion URL
 * @returns {string|null} - Video ID or null if invalid
 */
export function extractDailymotionId(url) {
  const patterns = [
    /dailymotion\.com\/video\/([^&\n?#]+)/,
    /dailymotion\.com\/embed\/video\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Generate embed URL for different video platforms
 * @param {string} url - Original video URL
 * @param {string} platform - Video platform
 * @returns {string|null} - Embed URL or null if invalid
 */
export function generateEmbedUrl(url, platform) {
  switch (platform) {
    case 'youtube':
      const youtubeId = extractYouTubeId(url);
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : null;

    case 'vimeo':
      const vimeoId = extractVimeoId(url);
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : null;

    case 'dailymotion':
      const dailymotionId = extractDailymotionId(url);
      return dailymotionId
        ? `https://www.dailymotion.com/embed/video/${dailymotionId}`
        : null;

    case 'twitch':
      // Twitch URLs are more complex, return as-is for now
      return url;

    case 'custom':
      return url;

    default:
      return null;
  }
}

/**
 * Validate video URL format
 * @param {string} url - Video URL to validate
 * @param {string} platform - Expected platform
 * @returns {boolean} - Whether URL is valid for the platform
 */
export function validateVideoUrl(url, platform) {
  const patterns = {
    youtube:
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)[^&\n?#]+/,
    vimeo:
      /^(https?:\/\/)?(www\.)?(vimeo\.com\/|player\.vimeo\.com\/video\/)\d+/,
    dailymotion:
      /^(https?:\/\/)?(www\.)?dailymotion\.com\/(video\/|embed\/video\/)[^&\n?#]+/,
    twitch: /^(https?:\/\/)?(www\.)?twitch\.tv\/[^\/]+\/clip\/[^&\n?#]+/,
  };

  return patterns[platform] ? patterns[platform].test(url) : true;
}

/**
 * Get video thumbnail URL
 * @param {string} url - Video URL
 * @param {string} platform - Video platform
 * @returns {string|null} - Thumbnail URL or null if not available
 */
export function getVideoThumbnail(url, platform) {
  switch (platform) {
    case 'youtube':
      const youtubeId = extractYouTubeId(url);
      return youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        : null;

    case 'vimeo':
      const vimeoId = extractVimeoId(url);
      return vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : null;

    default:
      return null;
  }
}
