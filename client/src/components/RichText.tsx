import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Editor = ({ value, onChange, placeholder = "Enter your description..." }: EditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Update content when value prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.textContent !== value) {
      editorRef.current.textContent = value;
    }
  }, [value]);

  const toolbarButtons = [
    { icon: 'B', action: 'bold', title: 'Bold' },
    { icon: 'I', action: 'italic', title: 'Italic' },
    { icon: 'U', action: 'underline', title: 'Underline' },
    { icon: '•', action: 'unorderedlist', title: 'Bullet List' },
    { icon: '1.', action: 'orderedlist', title: 'Numbered List' },
    { icon: '¶', action: 'insertparagraph', title: 'Paragraph' },
    { icon: '🔗', action: 'link', title: 'Insert Link' },
    { icon: '📷', action: 'image', title: 'Insert Image' },
  ];

  const handleToolbarAction = (action: string) => {
    document.execCommand(action, false, undefined);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    onChange(content);
  };

  return (
    <motion.div
      className={`border rounded-lg overflow-hidden transition-all duration-300 ${
        isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-1">
        {toolbarButtons.map((button, index) => (
          <motion.button
            key={index}
            onClick={() => handleToolbarAction(button.action)}
            className="p-2 hover:bg-gray-200 rounded text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={button.title}
          >
            {button.icon}
          </motion.button>
        ))}
        
        {/* Alignment buttons */}
        <div className="ml-4 flex gap-1">
          <motion.button
            onClick={() => handleToolbarAction('justifyleft')}
            className="p-2 hover:bg-gray-200 rounded text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Align Left"
          >
            ≡
          </motion.button>
          <motion.button
            onClick={() => handleToolbarAction('justifycenter')}
            className="p-2 hover:bg-gray-200 rounded text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Align Center"
          >
            ≣
          </motion.button>
          <motion.button
            onClick={() => handleToolbarAction('justifyright')}
            className="p-2 hover:bg-gray-200 rounded text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Align Right"
          >
            ≤
          </motion.button>
        </div>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 outline-none text-white leading-relaxed bg-transparent text-left"
        dir="ltr"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </motion.div>
  );
};

export default Editor;