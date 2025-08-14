import React from 'react';
import MathText from './MathText'; // Ensure this path is correct

const QuestionContent = ({ text, image }) => {
    return (
        <div className="question-text">
            <MathText text={text} />

            {image && (
                <div className="question-image-container">
                    <img 
                        src={image} 
                        alt="Question visual" 
                        className="question-image" 
                    />
                </div>
            )}
        </div>
    );
};

export default QuestionContent;
