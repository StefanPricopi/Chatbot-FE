import React from 'react';

const customEmojis = ['🙍‍♂️🙍‍♀️', '😂', '😊', '👍', '🚚', '🚛', '🚜'];

const CustomEmojiPicker = ({ onSelect }) => {
    const handleEmojiClick = (emoji) => {
        onSelect(emoji);
    };

    return (
        <div className="custom-emoji-picker">
            {customEmojis.map((emoji, index) => (
                <span key={index} onClick={() => handleEmojiClick(emoji)}>{emoji}</span>
            ))}
        </div>
    );
};

export default CustomEmojiPicker;