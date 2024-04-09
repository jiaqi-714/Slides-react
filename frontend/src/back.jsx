// for slideEditor renderSlideContentNew's backup
// const renderSlideContent = () => {
//   // Sort content by the 'layer' property for correct z-index handling
//   const sortedContent = (slides[currentSlideIndex]?.content || []).sort((a, b) => a.layer - b.layer);

//   return sortedContent.map((contentItem, index) => {
//     // Function to dynamically adjust the image size upon loading
//     const handleImageLoad = (event) => {
//       const imageSizeRatio = contentItem.properties.size / 100;
//       const displayedWidth = deckWidth * (contentItem.properties.width / 100) * imageSizeRatio; // Adjust calculation as needed
//       const displayedHeight = deckHeight * (contentItem.properties.height / 100) * imageSizeRatio; // Adjust calculation as needed
//       event.target.style.width = `${displayedWidth}px`;
//       event.target.style.height = `${displayedHeight}px`;
//     };

//     // Function to dynamically adjust the video size upon loading (assuming iframe loading)
//     const handleVideoLoad = (event) => {
//       const desiredWidth = deckWidth * contentItem.properties.size / 100;
//       const aspectRatio = 16 / 9; // Maintain a 16:9 aspect ratio
//       const desiredHeight = desiredWidth / aspectRatio;
//       event.target.style.width = `${desiredWidth}px`;
//       event.target.style.height = `${desiredHeight}px`;
//     };

//     // Define default box styles for content
//     let boxStyles = {
//       position: 'absolute',
//       top: `${contentItem.properties.position.y}%`,
//       left: `${contentItem.properties.position.x}%`,
//       cursor: 'pointer',
//       zIndex: contentItem.properties.layer,
//       backgroundColor: 'rgba(255,255,255,1)',
//       boxSizing: 'border-box',
//       padding: 0,
//       margin: 0,
//       display: 'inline-block',
//       overflow: 'hidden',
//       border: '1px solid grey',
//       width: `${contentItem.properties.width}%`,
//       height: `${contentItem.properties.height}%`,
//     };

//     // Apply padding for non-image content
//     if (contentItem.type !== 'IMAGE') {
//       boxStyles.padding = 1;
//     }

//     // Apply border and padding for CODE content
//     if (contentItem.type === 'CODE') {
//       boxStyles = {
//         ...boxStyles,
//         background: '#f5f5f5',
//       }
//     }

//     // Style adjustments specifically for image and video content
//     let contentStyles = {
//       fontSize: `${contentItem.properties.fontSize}em`,
//       color: contentItem.properties.color,
//     };

//     if (contentItem.type === 'IMAGE') {
//       const imageSizeRatio = contentItem.properties.size / 100;
//       const displayedWidth = deckWidth * (contentItem.properties.width / 100) * imageSizeRatio; // Adjust calculation as needed
//       const displayedHeight = deckHeight * (contentItem.properties.height / 100) * imageSizeRatio; // Adjust calculation as needed
//       contentStyles = {
//         display: 'block',
//         width: `${displayedWidth}px` || 'auto',
//         height: `${displayedHeight}px` || 'auto'
//       };
//     } else if (contentItem.type === 'VIDEO') {
//       contentStyles = {
//         aspectRatio: '16 / 9',
//       };
//     } else if (contentItem.type === 'CODE') {
//       contentStyles = {
//         ...contentStyles,
//         whiteSpace: 'pre-wrap', // Preserve whitespaces and line breaks
//         background: '#f5f5f5', // Example background color
//         borderRadius: '5px',
//       };
//     }

//     const isSelected = selectedContentRef.current?.id === contentItem.id;

//     // Define the styles for resize handles
//     const resizeHandleStyles = {
//       position: 'absolute',
//       width: '5px',
//       height: '5px',
//       backgroundColor: 'blue',
//       // zIndex: 1000,
//     };

//     const resizeHandles = isSelected
//       ? [
//           { id: 'top-left', style: { ...resizeHandleStyles, left: '-2.5px', top: '-2.5px', cursor: 'nwse-resize' } },
//           { id: 'top-right', style: { ...resizeHandleStyles, right: '-2.5px', top: '-2.5px', cursor: 'nesw-resize' } },
//           { id: 'bottom-left', style: { ...resizeHandleStyles, left: '-2.5px', bottom: '-2.5px', cursor: 'nesw-resize' } },
//           { id: 'bottom-right', style: { ...resizeHandleStyles, right: '-2.5px', bottom: '-2.5px', cursor: 'nwse-resize' } },
//         ]
//       : [];

//     return (
//       <Box
//         key={contentItem.id}
//         sx={{
//           ...boxStyles,
//           ...(isSelected && { boxShadow: '0 0 0 2px blue' }), // Optional: Highlight the selected box
//         }}
//         onMouseDown={(e) => handleDragMouseDown(e, contentItem.id)}
//         onDoubleClick={() => handleDoubleClickOnContent(contentItem.id)}
//         onContextMenu={(e) => handleContextMenu(e, contentItem.id)}
//       >
//         {contentItem.type === 'TEXT' && renderTextContent(contentItem)}
//         {contentItem.type === 'IMAGE' && renderImageContent(contentItem, handleImageLoad, contentStyles)}
//         {contentItem.type === 'VIDEO' && renderVideoContent(contentItem, handleVideoLoad, contentStyles)}
//         {contentItem.type === 'CODE' && renderCodeContent(contentItem, contentStyles)}

//         {resizeHandles.map(handle => (
//           <Box
//             key={handle.id}
//             sx={handle.style}
//             onMouseDown={(e) => handleResizeMouseDown(e, contentItem.id, handle.id)}
//           />
//         ))}
//       </Box>
//     );
//   });
// };
