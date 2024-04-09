// ContentRenderers.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import CodeBlock from './CodeBlock'; // Adjust path as necessary
import config from './config.json';

const deckWidth = config.deckWidth
const deckHeight = config.deckHeight

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
  const autoplayParam = autoplay ? '?autoplay=1&mute=1' : '';
  return `${baseUrl}${autoplayParam}`;
};

// Extracts the YouTube video ID from a given URL
const extractYouTubeVideoID = (videoUrl) => {
  const regex = /(?:youtube.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
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

// Function to dynamically adjust the image size upon loading
const handleImageLoad = (event, contentItem) => {
  const imageSizeRatio = contentItem.properties.size / 100;
  const displayedWidth = deckWidth * (contentItem.properties.width / 100) * imageSizeRatio; // Adjust calculation as needed
  const displayedHeight = deckHeight * (contentItem.properties.height / 100) * imageSizeRatio; // Adjust calculation as needed
  event.target.style.width = `${displayedWidth}px`;
  event.target.style.height = `${displayedHeight}px`;
};

// Function to dynamically adjust the video size upon loading (assuming iframe loading)
const handleVideoLoad = (event, contentItem) => {
  const desiredWidth = deckWidth * contentItem.properties.size / 100;
  const aspectRatio = 16 / 9; // Maintain a 16:9 aspect ratio
  const desiredHeight = desiredWidth / aspectRatio;
  event.target.style.width = `${desiredWidth}px`;
  event.target.style.height = `${desiredHeight}px`;
};

export const renderSlideContentNew = ({
  slides,
  currentSlideIndex,
  selectedContentRef = { current: null }, // Default to an object with null current if not provided
  handleDragMouseDown = null,
  handleDoubleClickOnContent = null,
  handleContextMenu = null,
  handleResizeMouseDown = null,
  preview = false,
}) => {
  if (!slides) {
    return 'loading'
  }
  const sortedContent = (slides[currentSlideIndex]?.content || []).sort((a, b) => a.layer - b.layer);

  return sortedContent.map((contentItem, index) => {
    // Define default box styles for content
    let boxStyles = {
      position: 'absolute',
      top: `${contentItem.properties.position.y}%`,
      left: `${contentItem.properties.position.x}%`,
      cursor: 'pointer',
      zIndex: contentItem.properties.layer,
      backgroundColor: 'rgba(255,255,255,1)',
      boxSizing: 'border-box',
      padding: 0,
      margin: 0,
      display: 'inline-block',
      overflow: 'hidden',
      border: preview ? 'none' : '1px solid grey', // Conditionally set the border property
      width: `${contentItem.properties.width}%`,
      height: `${contentItem.properties.height}%`,
    };

    // Apply padding for non-image content
    if (contentItem.type !== 'IMAGE') {
      boxStyles.padding = 1;
    }

    // Apply border and padding for CODE content
    if (contentItem.type === 'CODE') {
      boxStyles = {
        ...boxStyles,
        background: '#f5f5f5',
      }
    }

    // Style adjustments specifically for image and video content
    let contentStyles = {
      fontSize: `${contentItem.properties.fontSize}em`,
      color: contentItem.properties.color,
    };

    if (contentItem.type === 'IMAGE') {
      const imageSizeRatio = contentItem.properties.size / 100;
      const displayedWidth = deckWidth * (contentItem.properties.width / 100) * imageSizeRatio; // Adjust calculation as needed
      const displayedHeight = deckHeight * (contentItem.properties.height / 100) * imageSizeRatio; // Adjust calculation as needed
      contentStyles = {
        display: 'block',
        width: `${displayedWidth}px` || 'auto',
        height: `${displayedHeight}px` || 'auto'
      };
    } else if (contentItem.type === 'VIDEO') {
      contentStyles = {
        aspectRatio: '16 / 9',
      };
    } else if (contentItem.type === 'CODE') {
      contentStyles = {
        ...contentStyles,
        whiteSpace: 'pre-wrap', // Preserve whitespaces and line breaks
        background: '#f5f5f5', // Example background color
        borderRadius: '5px',
      };
    }

    const isSelected = selectedContentRef.current?.id === contentItem.id;

    // Define the styles for resize handles
    const resizeHandleStyles = {
      position: 'absolute',
      width: '5px',
      height: '5px',
      backgroundColor: 'blue',
      // zIndex: 1000,
    };

    const resizeHandles = isSelected
      ? [
          { id: 'top-left', style: { ...resizeHandleStyles, left: '-2.5px', top: '-2.5px', cursor: 'nwse-resize' } },
          { id: 'top-right', style: { ...resizeHandleStyles, right: '-2.5px', top: '-2.5px', cursor: 'nesw-resize' } },
          { id: 'bottom-left', style: { ...resizeHandleStyles, left: '-2.5px', bottom: '-2.5px', cursor: 'nesw-resize' } },
          { id: 'bottom-right', style: { ...resizeHandleStyles, right: '-2.5px', bottom: '-2.5px', cursor: 'nwse-resize' } },
        ]
      : [];

    return (
      <Box
        key={contentItem.id}
        sx={{
          ...boxStyles,
          ...(isSelected && { boxShadow: '0 0 0 2px blue' }), // Optional: Highlight the selected box
        }}
        onMouseDown={handleDragMouseDown ? e => handleDragMouseDown(e, contentItem.id) : undefined}
        onDoubleClick={handleDoubleClickOnContent ? () => handleDoubleClickOnContent(contentItem.id) : undefined}
        onContextMenu={handleContextMenu ? e => handleContextMenu(e, contentItem.id) : undefined}
      >
        {/* Conditional rendering of content based on type */}
        {contentItem.type === 'TEXT' && renderTextContent(contentItem)}
        {contentItem.type === 'IMAGE' && renderImageContent(contentItem, e => handleImageLoad && handleImageLoad(e, contentItem), contentStyles)}
        {contentItem.type === 'VIDEO' && renderVideoContent(contentItem, e => handleVideoLoad && handleVideoLoad(e, contentItem), contentStyles)}
        {contentItem.type === 'CODE' && renderCodeContent(contentItem, contentStyles)}

        {/* Conditionally render resize handles if isSelected */}
        {resizeHandles.map(handle => (
          <Box
            key={handle.id}
            sx={handle.style}
            onMouseDown={handleResizeMouseDown ? e => handleResizeMouseDown(e, contentItem.id, handle.id) : undefined}
          />
        ))}
      </Box>
    );
  });
};
