import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Text from '../components/RichText';
import TagSelector from '../components/TagSelector';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Question submitted:', { title, description, tags });
    // Navigate back to home or questions page
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Field */}
            <InputField
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="What's your programming question? Be specific."
              required
            />

            {/* Description Field */}
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Description
                <span className="text-red-400 ml-1">*</span>
              </label>
              <Text
                value={description}
                onChange={setDescription}
                placeholder="Provide all the details. What did you try? What were you expecting? What actually happened?"
                
              />
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                Tags
              </label>
              <TagSelector
                value={tags}
                onChange={setTags}
                placeholder="e.g. javascript, react, node.js (press Enter to add)"
              />
              <p className="text-gray-400 text-sm mt-2">
                Add up to 5 tags to describe what your question is about
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                disabled={!title.trim() || !description.trim()}
              >
                Submit Question
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AskQuestion;