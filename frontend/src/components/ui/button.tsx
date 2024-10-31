import React from 'react';

// Define props interface
interface ButtonProps {
    isLoading: boolean;
    onClick?: () => void; // Optional onClick event handler
    type?: 'button' | 'submit' | 'reset'; // Type of the button
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ isLoading, onClick, type = 'button', children }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={isLoading} // Disable button while loading
        >
            {children}
        </button>
    );
};

export default Button;
