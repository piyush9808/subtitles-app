import React, { useState, useRef } from "react";
import { FaReact } from "react-icons/fa";


const Home = () => {
  const [textBox, setTextBox] = useState({
    id: Date.now(),
    text: "Text Sample",
    width: 150,
    height: 150,
    top: 200,
    left: 500,
    fontSize: 36,
    fontFamily: "Poppins",
    fontWeight: "Regular",
    fillColor: "#FF0000", 
    strokeColor: "#000000", 
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // Detect if the video is playing

  const textBoxRef = useRef(null);
  const videoRef = useRef(null);

  // Handle Mouse Down for dragging
  const handleMouseDown = (e) => {
    const rect = textBoxRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle Mouse Move while dragging or resizing
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setTextBox((prev) => ({
        ...prev,
        left: newX,
        top: newY,
      }));
    }

    if (isResizing && resizeDirection) {
      const rect = textBoxRef.current.getBoundingClientRect();

      if (resizeDirection === "right") {
        setTextBox((prev) => ({
          ...prev,
          width: e.clientX - rect.left,
        }));
      } else if (resizeDirection === "bottom") {
        setTextBox((prev) => ({
          ...prev,
          height: e.clientY - rect.top,
        }));
      } else if (resizeDirection === "corner") {
        setTextBox((prev) => ({
          ...prev,
          width: e.clientX - rect.left,
          height: e.clientY - rect.top,
        }));
      }
    }
  };

  // Handle Mouse Up to stop dragging and resizing
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  // Handle Resize Mouse Down
  const handleResizeMouseDown = (direction, e) => {
    e.stopPropagation(); // Prevent this from triggering dragging
    setIsResizing(true);
    setResizeDirection(direction);
  };

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTextBox((prev) => ({
      ...prev,
      [name]: value, // Dynamically update any property
    }));
  };

  // Handle text box click to enable editing
  const handleTextClick = () => {
    setIsEditing(true);
  };

  // Handle text input blur and save text
  const handleInputBlur = () => {
    setIsEditing(false);
  };

  // Handle Enter key press inside input to save changes
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  // Handle video play and pause events
  const handleVideoPlay = () => {
    setIsVideoPlaying(true); // Hide the configuration panel when video is playing
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false); // Show the configuration panel when video is paused
  };

  return (
    <div
      className=" h-screen"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/*header*/}
      <div className="flex justify-between items-center px-8 py-4 bg-white">
        <div className="flex items-center "><FaReact className="size-10 " />
        <div className="text-xl font-bold">
          Personaliz.ai</div></div>
        <button className="bg-black text-white px-6 py-2 rounded-md">
          Try it For Free
        </button>
      </div>

      {/* Video and Text Box Section */}
      <div className="flex justify-center items-start ">
        <div className="w-2/3 relative bg-gray-200">




          <video
            ref={videoRef}
            id="video"
            className="w-fit p-6 h-3/4 mt-10"
            controls
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          >
            <source src="video-editor.mp4" type="video/mp4" />
          </video>


          <div
            ref={textBoxRef}
            style={{
              width: `${textBox.width}px`,
              height: `${textBox.height}px`,
              top: `${textBox.top}px`,
              left: `${textBox.left}px`,
              fontSize: `${textBox.fontSize}px`,
              color: `${textBox.fillColor}`,
              border: isVideoPlaying ? "none" : `2px solid ${textBox.strokeColor}`,
              fontFamily: textBox.fontFamily,
              pointerEvents: isVideoPlaying ? "none" : "auto",
            }}
            className={`absolute ${isVideoPlaying ? "cursor-default" : "border-dashed cursor-move"
              }`}
            onMouseDown={!isVideoPlaying ? handleMouseDown : undefined}
          >

            {isEditing && !isVideoPlaying ? (
              <input
                type="text"
                value={textBox.text}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
                className="w-full h-full border-none focus:outline-none"
                autoFocus
                name="text"
              />
            ) : (
              <div onClick={!isVideoPlaying ? handleTextClick : undefined}>
                {textBox.text}
              </div>
            )}


            {!isVideoPlaying && (
              <>
                <div
                  className="absolute right-0 bottom-0 cursor-se-resize"
                  onMouseDown={(e) => handleResizeMouseDown("corner", e)}
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "black",
                  }}
                ></div>
                <div
                  className="absolute right-0 top-1/2 cursor-e-resize"
                  onMouseDown={(e) => handleResizeMouseDown("right", e)}
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "black",
                  }}
                ></div>
                <div
                  className="absolute bottom-0 left-1/2 cursor-s-resize"
                  onMouseDown={(e) => handleResizeMouseDown("bottom", e)}
                  style={{
                    width: "10px",
                    height: "10px",
                    backgroundColor: "black",
                  }}
                ></div>
              </>
            )}
          </div>
        </div>

        {/* Configuration Panel (Hidden when the video is playing) */}
        {!isVideoPlaying && (
          <div className="w-1/3 p-6 bg-white shadow-md rounded-md ml-8">
            <h3 className="text-xl font-bold mb-4 bg-white text-white justify-items-center text-center">
              <div className="bg-black rounded-lg">Add Text</div></h3>
            {/* X and Y position */}
            <div className="flex space-x-4 mb-4">
              <div>
                <label>X</label>
                <input
                  type="number"
                  name="left"
                  value={textBox.left}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label>Y</label>
                <input
                  type="number"
                  name="top"
                  value={textBox.top}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>
            {/* Width and Height */}
            <div className="flex space-x-4 mb-4">
              <div>
                <label>W</label>
                <input
                  type="number"
                  name="width"
                  value={textBox.width}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label>H</label>
                <input
                  type="number"
                  name="height"
                  value={textBox.height}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>
            {/* Text Input */}
            <div className="mb-4">
              <label>Text</label>
              <input
                type="text"
                name="text"
                value={textBox.text}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
              />
            </div>
            {/* Font Family, Weight, Size */}
            <div className="mb-4">
              <label>Font Family</label>
              <select
                name="fontFamily"
                value={textBox.fontFamily}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
              >
                <option value="Poppins">Poppins</option>
                <option value="Arial">Arial</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Font Weight</label>
              <select
                name="fontWeight"
                value={textBox.fontWeight}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
              >
                <option value="Regular">Regular</option>
                <option value="Bold">Bold</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Font Size</label>
              <input
                type="number"
                name="fontSize"
                value={textBox.fontSize}
                onChange={handleInputChange}
                className="border rounded w-full p-2"
              />
            </div>
            {/* Fill and Stroke Color */}
            <div className="flex space-x-4 mb-4">
              <div>
                <label>Fill</label>
                <input
                  type="color"
                  name="fillColor"
                  value={textBox.fillColor}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label>Stroke</label>
                <input
                  type="color"
                  name="strokeColor"
                  value={textBox.strokeColor}
                  onChange={handleInputChange}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

