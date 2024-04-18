// ContentRenderers.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import CodeBlock from './CodeBlock';
import config from './config.json';

const debug = config.debug;
const deckWidth = config.deckWidth
const deckHeight = config.deckHeight

// Render Text Content
export const renderTextContent = (contentItem) => {
  if (debug) {
    if (!contentItem || !contentItem.properties ||
      typeof contentItem.properties.fontSize !== 'number') {
      console.error('Invalid contentItem properties during render slide');
      return null;
    }
  }

  return (
    <Typography
    sx={{
      fontSize: `${contentItem.properties.fontSize}em`,
      color: contentItem.properties.color,
      fontFamily: contentItem.properties.fontFamily,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
    >
      {contentItem.properties.text}
    </Typography>
  )
};

// Render Image Content
export const renderImageContent = (contentItem, handleImageLoad, contentStyles) => {
  if (debug) {
    if (!contentItem ||
      !contentItem.properties ||
      typeof contentItem.properties.isBase64 !== 'boolean' ||
      typeof handleImageLoad !== 'function') {
      console.error('Invalid contentItem properties during render picture');
      return (
        <Typography>
          Error in loading Picture, check renderImageContent function in contentRenderers
        </Typography>
      )
    }
  }

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
  if (debug) {
    if (!contentItem ||
      !contentItem.properties ||
      typeof contentItem.properties.autoPlay !== 'boolean' ||
      typeof handleVideoLoad !== 'function') {
      console.error('Invalid contentItem properties during render Video');
      return (
        <Typography>
          Error in loading Video, check renderVideoContent function in contentRenderers
        </Typography>
      )
    }
  }

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

// Function to construct the video source URL, including autoplay parameters
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

// Render the background color, return a CSS background color
export const renderSlideBackground = (slides, currentSlideIndex) => {
  if (debug) {
    if (!Array.isArray(slides) ||
      typeof currentSlideIndex !== 'number') {
      console.error('Invalid input For renderSlideBackground: slides or currentSlideIndex error');
      return {};
    }
  }

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
  if (debug) {
    if (!contentItem ||
      !contentItem.properties ||
      typeof contentItem.properties.width !== 'number' ||
      typeof contentItem.properties.height !== 'number') {
      console.error('Invalid contentItem properties during render image');
      return null;
    }
  }

  const imageSizeRatio = contentItem.properties.size / 100;
  const displayedWidth = deckWidth * (contentItem.properties.width / 100) * imageSizeRatio;
  const displayedHeight = deckHeight * (contentItem.properties.height / 100) * imageSizeRatio;
  event.target.style.width = `${displayedWidth}px`;
  event.target.style.height = `${displayedHeight}px`;
};

// Function to dynamically adjust the video size upon loading (assuming iframe loading)
const handleVideoLoad = (event, contentItem) => {
  if (debug) {
    if (!contentItem ||
      !contentItem.properties ||
      typeof contentItem.properties.width !== 'number' ||
      typeof contentItem.properties.height !== 'number') {
      console.error('Invalid contentItem properties during render video');
      return null;
    }
  }

  const sizeRatio = 0.95;
  const displayedWidth = deckWidth * (contentItem.properties.width / 100) * sizeRatio;
  const displayedHeight = deckHeight * (contentItem.properties.height / 100) * sizeRatio;
  event.target.style.width = `${displayedWidth}px`;
  event.target.style.height = `${displayedHeight}px`;
};

export const renderSlideContentNew = ({
  slides,
  currentSlideIndex,
  selectedContentRef = { current: null }, // Default to an object with null if not provided, used for slide preview
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
      const displayedWidth = deckWidth * (contentItem.properties.width / 100) * imageSizeRatio;
      const displayedHeight = deckHeight * (contentItem.properties.height / 100) * imageSizeRatio;
      contentStyles = {
        display: 'block',
        width: `${displayedWidth}px` || 'auto',
        height: `${displayedHeight}px` || 'auto'
      };
    } else if (contentItem.type === 'VIDEO') {
      const sizeRatio = 0.95;
      const displayedWidth = deckWidth * (contentItem.properties.width / 100) * sizeRatio;
      const displayedHeight = deckHeight * (contentItem.properties.height / 100) * sizeRatio;
      contentStyles = {
        aspectRatio: '16 / 9',
        width: `${displayedWidth}px` || 'auto',
        height: `${displayedHeight}px` || 'auto',
      };
    } else if (contentItem.type === 'CODE') {
      contentStyles = {
        ...contentStyles,
        whiteSpace: 'pre-wrap',
        background: '#f5f5f5',
        borderRadius: '5px',
      };
    }

    const isSelected = selectedContentRef.current?.id === contentItem.id;

    // Define the styles for resize handles
    const resizeHandleStyles = {
      position: 'absolute',
      width: '10px', // width of resize handler
      height: '10px', // height of resize handler
      backgroundColor: 'transparent',
      borderRadius: '0%', // Make the resize handles rantangle
      border: '2px solid #007bff', // Add a blue border
    };

    const resizeHandles = isSelected
      ? [
          {
            id: 'top-left',
            style: {
              ...resizeHandleStyles,
              left: '-5px',
              top: '-5px',
              cursor: 'nwse-resize',
            },
          },
          {
            id: 'top-right',
            style: {
              ...resizeHandleStyles,
              right: '-5px',
              top: '-5px',
              cursor: 'nesw-resize',
            },
          },
          {
            id: 'bottom-left',
            style: {
              ...resizeHandleStyles,
              left: '-5px',
              bottom: '-5px',
              cursor: 'nesw-resize',
            },
          },
          {
            id: 'bottom-right',
            style: {
              ...resizeHandleStyles,
              right: '-5px',
              bottom: '-5px',
              cursor: 'nwse-resize',
            },
          },
        ]
      : [];

    return (
      <Box
        key={contentItem.id}
        sx={{
          ...boxStyles,
          ...(isSelected && {
            boxShadow: '0 0 0 2px rgba(0, 123, 0, 0.6)', // Change the box shadow color and spread
          }),
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
