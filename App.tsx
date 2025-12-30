
import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TutorialSegment, VoiceName } from './types';
import { VOICE_OPTIONS, TUTORIAL_TEMPLATES } from './constants';
import { generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [segments, setSegments] = useState<TutorialSegment[]>([]);
  const [inputText, setInputText] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>(VoiceName.Zephyr);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSegment = useCallback(async () => {
    if (!inputText.trim()) return;

    const newId = uuidv4();
    const newSegment: TutorialSegment = {
      id: newId,
      title: inputTitle || `片段 ${segments.length + 1}`,
      text: inputText,
      isGenerating: true,
      voice: selectedVoice
    };

    setSegments(prev => [...prev, newSegment]);
    setInputText('');
    setInputTitle('');
    setIsProcessing(true);

    try {
      const { audioUrl } = await generateSpeech(inputText, selectedVoice);
      setSegments(prev => prev.map(s => s.id === newId ? { ...s, audioUrl, isGenerating: false } : s));
    } catch (error) {
      alert("语音生成失败，请检查您的 API 密钥或网络连接。");
      setSegments(prev => prev.filter(s => s.id !== newId));
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, inputTitle, segments.length, selectedVoice]);

  const removeSegment = (id: string) => {
    setSegments(prev => prev.filter(s => s.id !== id));
  };

  const loadTemplate = (template: { title: string; text: string }) => {
    setInputTitle(template.title);
    setInputText(template.text);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
        setInputTitle(file.name.replace('.txt', ''));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation / Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="cube-grid">
                <div className="cube-face bg-red-500"></div>
                <div className="cube-face bg-blue-500"></div>
                <div className="cube-face bg-green-500"></div>
                <div className="cube-face bg-orange-500"></div>
                <div className="cube-face bg-yellow-400"></div>
                <div className="cube-face bg-white border border-slate-200"></div>
                <div className="cube-face bg-blue-600"></div>
                <div className="cube-face bg-red-600"></div>
                <div className="cube-face bg-green-400"></div>
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                CubeVoice
              </h1>
            </div>
            <div className="text-sm font-medium text-slate-500">
              魔方教程 AI 语音生成器
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-microphone text-blue-500"></i>
                新建配音
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">步骤标题</label>
                  <input 
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    placeholder="例如：还原十字"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-sm font-medium text-slate-700">脚本内容</label>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      <i className="fa-solid fa-upload mr-1"></i> 上传 .txt
                    </button>
                    <input 
                      type="file" 
                      accept=".txt" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                    />
                  </div>
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                    placeholder="在此输入您的教程文本..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">选择音色</label>
                  <div className="grid grid-cols-1 gap-2">
                    {VOICE_OPTIONS.map((voice) => (
                      <button
                        key={voice.name}
                        onClick={() => setSelectedVoice(voice.name)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          selectedVoice === voice.name 
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">{voice.name}</p>
                          <p className="text-xs text-slate-500">{voice.description}</p>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          voice.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {voice.gender === 'Female' ? '女声' : (voice.gender === 'Male' ? '男声' : '中性')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={isProcessing || !inputText.trim()}
                  onClick={addSegment}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <><i className="fa-solid fa-circle-notch animate-spin"></i> 正在生成...</>
                  ) : (
                    <><i className="fa-solid fa-plus"></i> 生成音频</>
                  )}
                </button>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">教程模板</h2>
              <div className="space-y-3">
                {TUTORIAL_TEMPLATES.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadTemplate(template)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition group"
                  >
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">{template.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">"{template.text}"</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Audio Segments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-list-ul text-slate-400"></i>
                  已生成的配音
                </h2>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {segments.length} 个片段
                </span>
              </div>

              <div className="p-6">
                {segments.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <i className="fa-solid fa-wave-square text-3xl"></i>
                    </div>
                    <h3 className="text-slate-500 font-medium">尚未生成任何配音</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
                      请在左侧输入文本或选择一个模板开始。
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {segments.map((segment) => (
                      <div 
                        key={segment.id} 
                        className={`group p-4 rounded-2xl border transition-all ${
                          segment.isGenerating ? 'border-blue-200 bg-blue-50/30 animate-pulse' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-slate-800">{segment.title}</h3>
                            <div className="flex gap-2 items-center mt-1">
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter font-bold">
                                音色: {segment.voice}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {segment.text.length} 个字符
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeSegment(segment.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 italic">
                          "{segment.text}"
                        </p>

                        <div className="flex items-center gap-4">
                          {segment.isGenerating ? (
                            <div className="flex-1 h-10 bg-slate-100 rounded-lg flex items-center px-4">
                              <span className="text-xs text-slate-400 font-medium italic">Gemini 正在合成语音...</span>
                            </div>
                          ) : (
                            <>
                              <audio 
                                controls 
                                src={segment.audioUrl} 
                                className="flex-1 h-10"
                              ></audio>
                              <a 
                                href={segment.audioUrl} 
                                download={`${segment.title.replace(/\s+/g, '_')}.wav`}
                                className="px-4 h-10 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                              >
                                <i className="fa-solid fa-download"></i>
                                保存
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {segments.length > 1 && (
              <div className="mt-6 flex justify-center">
                 <button 
                  onClick={() => alert('即将推出：批量下载或合并音频片段！')}
                  className="px-6 py-2 border-2 border-slate-200 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-600 rounded-full font-bold text-sm transition-all"
                 >
                   <i className="fa-solid fa-layer-group mr-2"></i> 导出所有片段
                 </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            由 Gemini AI 2.5 TTS 技术提供支持。专为魔方爱好者打造。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
