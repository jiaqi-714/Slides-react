// ContentRenderers.js
import React from 'react';
import Typography from '@mui/material/Typography';
import CodeBlock from './CodeBlock'; // Adjust path as necessary

// Render Text Content
export const renderTextContent = (contentItem) => (
  <Typography
    sx={{
      fontSize: `${contentItem.properties.fontSize}em`,
      color: contentItem.properties.color,
      fontFamily: contentItem.properties.fontFamily, // Apply the selected font family
    }}
  >
    {contentItem.properties.text}
  </Typography>
);

// Render Image Content
export const renderImageContent = (contentItem, handleImageLoad, contentStyles) => {

  return (
    <img
      src={contentItem.properties.isBase64 ? `data:image/jpeg;base64,${contentItem.properties.imageUrl}` : contentItem.properties.imageUrl}
      alt={contentItem.properties.imageAlt}
      onLoad={handleImageLoad}
      style={contentStyles}
      draggable="false"
    />
  );
};

// Render Video Content
export const renderVideoContent = (contentItem, handleVideoLoad, contentStyles) => {
  const videoSrc = constructVideoSrc(contentItem.properties.videoUrl, contentItem.properties.autoPlay);
  return (
    <iframe
      src={videoSrc}
      onLoad={handleVideoLoad}
      style={contentStyles}
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  );
};

// Render Code Content
export const renderCodeContent = (contentItem, contentStyles) => {
  return <CodeBlock code={contentItem.properties.code} style={contentStyles} />;
};

// Function to construct the video source URL, including autoplay parameters if necessary
const constructVideoSrc = (videoUrl, autoplay) => {
  const videoId = extractYouTubeVideoID(videoUrl);
  const baseUrl = `https://www.youtube.com/embed/${videoId}`;
  const autoplayParam = autoplay ? "?autoplay=1&mute=1" : "";
  return `${baseUrl}${autoplayParam}`;
};

// Extracts the YouTube video ID from a given URL
const extractYouTubeVideoID = (videoUrl) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matches = videoUrl.match(regex);
  return matches ? matches[1] : null;
};

export const renderSlideBackground = (slides, currentSlideIndex) => {
  const currentSlide = slides[currentSlideIndex];
  if (!currentSlide) return {};

  const backgroundColor = currentSlide.backgroundColor;

  // Check if backgroundColor contains gradient information
  if (backgroundColor.startsWith('linear-gradient')) {
    return { background: backgroundColor };
  }

  // Solid color or default white background
  return { backgroundColor: backgroundColor || '#ffffff' };
};
