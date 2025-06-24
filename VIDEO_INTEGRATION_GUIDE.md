# Video Integration Guide for Live Games Post

This guide explains how to add video content to your Live Games Post entries in Strapi.

## Overview

I've implemented three different approaches to add video support to your live games post description:

1. **Direct Video Upload** - Upload video files directly to Strapi
2. **Video Embeds** - Embed videos from external platforms (YouTube, Vimeo, etc.)
3. **Rich Text Editor Integration** - Embed videos within the rich text content

## Option 1: Direct Video Upload

### What's Available

- A dedicated `video` field in the Live Games Post content type
- Supports all video formats that Strapi accepts
- Videos are stored in your Strapi media library

### How to Use

1. Go to Content Manager → Live Games Post
2. Create or edit a post
3. Scroll down to the "Video" field
4. Click "Add media" and upload your video file
5. Save the post

### API Response

```json
{
  "id": 1,
  "title": "Live Game Post Title",
  "description": "Post description...",
  "video": {
    "id": 123,
    "name": "gameplay-video.mp4",
    "url": "/uploads/gameplay_video_123.mp4",
    "mime": "video/mp4",
    "size": 1024000
  }
}
```

## Option 2: Video Embeds Component

### What's Available

- A `video_embeds` component that supports multiple video platforms
- Repeatable field - you can add multiple videos per post
- Supports YouTube, Vimeo, Dailymotion, Twitch, and custom URLs

### How to Use

1. Go to Content Manager → Live Games Post
2. Create or edit a post
3. Scroll down to "Video Embeds" section
4. Click "Add an entry"
5. Fill in the details:
   - **Title**: Name for the video
   - **Video URL**: The video link (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
   - **Video Type**: Select the platform (YouTube, Vimeo, etc.)
   - **Thumbnail**: Optional custom thumbnail image
   - **Description**: Optional description
   - **Autoplay**: Whether video should autoplay
   - **Muted**: Whether video should be muted
   - **Controls**: Whether to show video controls

### Supported Video Platforms

- **YouTube**: `https://www.youtube.com/watch?v=VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **Dailymotion**: `https://www.dailymotion.com/video/VIDEO_ID`
- **Twitch**: `https://www.twitch.tv/CHANNEL/clip/CLIP_ID`
- **Custom**: Any other video URL

### API Response

```json
{
  "id": 1,
  "title": "Live Game Post Title",
  "video_embeds": [
    {
      "id": 1,
      "title": "Gameplay Trailer",
      "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "video_type": "youtube",
      "thumbnail": {
        "id": 456,
        "url": "/uploads/thumbnail.jpg"
      },
      "description": "Watch the exciting gameplay",
      "autoplay": false,
      "muted": false,
      "controls": true
    }
  ]
}
```

## Option 3: Rich Text Editor Integration

### What's Available

- Enhanced rich text editor with video embed capabilities
- Support for iframe embeds from major video platforms
- Media library integration for video uploads

### How to Use

1. Go to Content Manager → Live Games Post
2. Create or edit a post
3. In the "Description" rich text field:
   - Click the media button to upload videos
   - Use the iframe button to embed external videos
   - Paste video URLs directly (supported platforms only)

### Supported Domains for Embeds

- youtube.com
- vimeo.com
- dailymotion.com
- twitch.tv

## Frontend Implementation

### For Direct Video Upload

```javascript
// React component example
const VideoPlayer = ({ video }) => {
  if (!video) return null;

  return (
    <video controls width='100%' height='auto' poster={video.previewUrl}>
      <source src={video.url} type={video.mime} />
      Your browser does not support the video tag.
    </video>
  );
};
```

### For Video Embeds

```javascript
// React component example
import { generateEmbedUrl } from '../utils/video-helpers';

const VideoEmbed = ({ videoEmbed }) => {
  const embedUrl = generateEmbedUrl(
    videoEmbed.video_url,
    videoEmbed.video_type
  );

  if (!embedUrl) return <div>Invalid video URL</div>;

  return (
    <div className='video-embed'>
      <h3>{videoEmbed.title}</h3>
      <iframe
        src={embedUrl}
        width='100%'
        height='315'
        frameBorder='0'
        allowFullScreen
        allow='autoplay; encrypted-media'
      />
      {videoEmbed.description && <p>{videoEmbed.description}</p>}
    </div>
  );
};
```

### For Rich Text Content

```javascript
// If using a rich text renderer like react-markdown
import ReactMarkdown from 'react-markdown';

const RichTextContent = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        iframe: (props) => (
          <iframe
            {...props}
            width='100%'
            height='315'
            frameBorder='0'
            allowFullScreen
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
```

## Utility Functions

I've created utility functions in `src/utils/video-helpers.js` to help with video processing:

- `extractYouTubeId(url)` - Extract YouTube video ID
- `extractVimeoId(url)` - Extract Vimeo video ID
- `extractDailymotionId(url)` - Extract Dailymotion video ID
- `generateEmbedUrl(url, platform)` - Generate embed URL for any platform
- `validateVideoUrl(url, platform)` - Validate video URLs
- `getVideoThumbnail(url, platform)` - Get thumbnail URLs

## Best Practices

1. **File Size**: Keep uploaded videos under 100MB for better performance
2. **Format**: Use MP4 format for best compatibility
3. **Thumbnails**: Always provide thumbnails for better user experience
4. **Responsive**: Use responsive video containers in your frontend
5. **Loading**: Implement lazy loading for multiple videos
6. **Fallbacks**: Always provide fallback content for unsupported browsers

## Troubleshooting

### Video Not Playing

- Check if the video format is supported by the browser
- Verify the video URL is accessible
- Ensure CORS is properly configured for external videos

### Embed Not Working

- Verify the domain is in the allowed list
- Check if the video URL is valid
- Ensure the video is publicly accessible

### Upload Issues

- Check file size limits in Strapi configuration
- Verify the video format is allowed
- Check server storage space

## Configuration

### Strapi Media Settings

Make sure your Strapi configuration allows video uploads:

```javascript
// config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100 * 1024 * 1024, // 100MB
      },
    },
  },
});
```

### Allowed Video Types

The system supports these video formats:

- MP4
- WebM
- OGV
- MOV
- AVI

## Next Steps

1. Restart your Strapi server to apply the schema changes
2. Test the video upload and embed functionality
3. Implement the frontend components as needed
4. Configure your media storage settings
5. Set up proper CORS if using external video embeds

For any issues or questions, refer to the Strapi documentation or check the console logs for error messages.
