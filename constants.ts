
import { VoiceName, VoiceOption } from './types';

export const VOICE_OPTIONS: VoiceOption[] = [
  { name: VoiceName.Zephyr, description: '清晰现代', gender: 'Neutral' },
  { name: VoiceName.Kore, description: '开朗明亮', gender: 'Female' },
  { name: VoiceName.Puck, description: '快速有力', gender: 'Male' },
  { name: VoiceName.Charon, description: '深沉权威', gender: 'Male' },
  { name: VoiceName.Fenrir, description: '平滑沉稳', gender: 'Male' },
];

export const TUTORIAL_TEMPLATES = [
  {
    title: '底层十字 (White Cross)',
    text: '开始还原魔方时，我们首先需要在底层做出一个白色十字。将白色棱块与侧面中心块的颜色一一对应。'
  },
  {
    title: '前两层 (F2L)',
    text: '十字完成后，我们同时还原底层角块和中间层棱块。找出一组相邻的角块和棱块，组合后一起放入对应的槽位。'
  },
  {
    title: '顶层定向 (OLL)',
    text: '当前两层还原后，观察顶面。我们需要将整个顶面都转成黄色，暂时不需要考虑侧面的位置。'
  },
  {
    title: '顶层排列 (PLL)',
    text: '最后一步，将顶层的黄色块交换到正确的位置。这通常涉及 T 换或 Y 换等公式来最终完成魔方的还原。'
  }
];
