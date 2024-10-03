'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 更新预设背景和布局模板
const presetTemplates = [
  { name: 'Simple', backgroundColor: '#F0F4F8', textColor: '#2C3E50', font: 'Source Han Sans CN', fontSize: 50 },
  { name: 'Elegant beige', backgroundColor: '#F5E6D3', textColor: '#5D4037', font: 'Source Han Sans CN', fontSize: 50 },
  { name: 'Mint Fresh', backgroundColor: '#E0F2F1', textColor: '#004D40', font: 'Source Han Sans CN', fontSize: 50 },
  { name: 'Deep Black', backgroundColor: '#1E1E1E', textColor: '#FFFFFF', font: 'Source Han Sans CN', fontSize: 50 },
  { name: 'Simple White', backgroundColor: '#FFFFFF', textColor: '#333333', font: 'Source Han Sans CN', fontSize: 50 },
  { name: 'Warm colors', backgroundColor: '#FFF5E6', textColor: '#5D4037', font: 'Source Han Sans CN', fontSize: 50 },
  { name: 'Fresh green', backgroundColor: '#E8F5E9', textColor: '#1B5E20', font: 'Source Han Sans CN', fontSize: 50 },
  { name: 'Elegant Gray', backgroundColor: '#FAFAFA', textColor: '#37474F', font: 'Source Han Sans CN', fontSize: 50 },
];

// 更新字体列表，增加五种新字体，并将字体名称改为中文
const fonts = [
  { value: 'Source Han Sans CN', label: '思源黑体' },
  { value: 'Noto Sans SC', label: '思源宋体' },
  { value: 'PingFang SC', label: '苹方' },
  { value: 'Hiragino Sans GB', label: '冬青黑体' },
  { value: 'Microsoft YaHei', label: '微软雅黑' },
  { value: 'FZLTHJW', label: '方正兰亭黑' },
  { value: 'FZLTXHJW', label: '方正兰亭细黑' },
  { value: 'HYQiHei', label: '汉仪旗黑' },
  { value: 'DouyinMeihaoTi', label: '抖音美好体' },
  { value: 'MaokenZhuyuanTi', label: '猫啃珠圆体' },
  { value: 'YunfengFeiyunTi', label: '云峰飞云体' },
  { value: 'XimaiXihuanTi', label: '喜脉喜欢体' },
  { value: 'Slidexiaxing-Regular', label: 'Slide下行体' },
];

// 扩展渐变底座颜色选项
const gradientBaseColors = [
  { name: 'Aurora', colors: ['#4facfe', '#00f2fe'] },
  { name: 'Sunset', colors: ['#fa709a', '#fee140'] },
  { name: 'Lavender', colors: ['#7f7fd5', '#86a8e7', '#91eae4'] },
  { name: 'Flame', colors: ['#ff9a9e', '#fad0c4'] },
  { name: 'Forest', colors: ['#43e97b', '#38f9d7'] },
  { name: 'Deep blue', colors: ['#0f2027', '#203a43', '#2c5364'] },
  { name: 'Dark Night Purple', colors: ['#231557', '#44107a', '#ff1361'] },
  { name: 'Starry Black', colors: ['#000000', '#130f40'] },
  { name: 'No Base', colors: [] }, // 保留这个选项
];

// 添加比例选项
const aspectRatios = [
  { label: '3:4', value: 3/4 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '1:1', value: 1 },
  { label: '9:16', value: 9/16 },
];

const TextCardGenerator = () => {
  // 添加默认卡片内容
  const defaultCardContent = "Welcome to the Text Card Generator! \n\nThis is a powerful tool that can help you create beautiful text cards. You can customize the font, color, background and other styles. \n\nStart creating!";

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [text, setText] = useState("");
  const [backgroundColor, setBackgroundColor] = useState('#F0F4F8');
  const [textColor, setTextColor] = useState('#2C3E50');
  const [gradientBase, setGradientBase] = useState(gradientBaseColors[0]);
  const [useBase, setUseBase] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [fontSize, setFontSize] = useState(50);
  const [font, setFont] = useState('Source Han Sans CN');
  const [autoSplit, setAutoSplit] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0].value.toString());
  const [generatedCards, setGeneratedCards] = useState<string[]>([]);

  useEffect(() => {

    generatePreview();
  }, [text, backgroundColor, textColor, fontSize, font, selectedTemplate, gradientBase, autoSplit, aspectRatio]);

  const generatePreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseWidth = 1200;
    const baseHeight = baseWidth / aspectRatio;

    canvas.width = baseWidth;
    canvas.height = baseHeight;

    const paddingBottom = 140; // 增加到 140px (原来的 40px + 新增的 100px)
    const paddingTop = 200;
    const paddingSide = 60;
    const lineSpacing = 2.0;
    const gradientPadding = 30;
    // 文本分割和多卡片生成
    const cards: string[] = [];
    let remainingText = text;
    while (remainingText.length > 0) {
      // 重置画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 绘制渐变底座或背景
      if (useBase && gradientBase.colors.length > 0) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradientBase.colors.forEach((color, index) => {
          gradient.addColorStop(index / (gradientBase.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = backgroundColor;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制卡片背景
      const cardMargin = useBase ? 20 + gradientPadding : 0;
      const cardWidth = canvas.width - cardMargin * 2;
      const cardHeight = canvas.height - cardMargin * 2;
      const cornerRadius = 20;

      ctx.beginPath();
      ctx.moveTo(cardMargin + cornerRadius, cardMargin);
      ctx.lineTo(cardMargin + cardWidth - cornerRadius, cardMargin);
      ctx.quadraticCurveTo(cardMargin + cardWidth, cardMargin, cardMargin + cardWidth, cardMargin + cornerRadius);
      ctx.lineTo(cardMargin + cardWidth, cardMargin + cardHeight - cornerRadius);
      ctx.quadraticCurveTo(cardMargin + cardWidth, cardMargin + cardHeight, cardMargin + cardWidth - cornerRadius, cardMargin + cardHeight);
      ctx.lineTo(cardMargin + cornerRadius, cardMargin + cardHeight);
      ctx.quadraticCurveTo(cardMargin, cardMargin + cardHeight, cardMargin, cardMargin + cardHeight - cornerRadius);
      ctx.lineTo(cardMargin, cardMargin + cornerRadius);
      ctx.quadraticCurveTo(cardMargin, cardMargin, cardMargin + cornerRadius, cardMargin);
      ctx.closePath();

      // 添加微妙的阴影效果
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      ctx.fillStyle = backgroundColor;
      ctx.fill();

      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 绘制日期
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.font = `${fontSize * 0.7}px ${font}`; // 修改为主题文字的70%
      ctx.fillStyle = `${textColor}80`;
      ctx.textAlign = 'left';
      ctx.fillText(date, cardMargin + paddingSide, cardMargin + paddingTop * 0.4);

      // 绘制主文本
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // 确保使用选择的字体，添加后备字体
      ctx.font = `${fontSize}px "${font}", "Source Han Sans CN", sans-serif`;

      const maxWidth = cardWidth - paddingSide * 2;
      const maxHeight = cardHeight - paddingTop - paddingBottom;

      const { renderedText, leftoverText } = drawTextWithLimit(
        ctx,
        remainingText,
        cardMargin + paddingSide,
        cardMargin + paddingTop,
        maxWidth,
        fontSize * lineSpacing,
        maxHeight
      );

      remainingText = leftoverText;

      // 绘制字数统计和水印
      const wordCount = renderedText.replace(/\s/g, '').length;
      ctx.font = `${fontSize * 0.7}px ${font}`;
      ctx.fillStyle = `${textColor}80`;
      ctx.textAlign = 'right';
      ctx.fillText(`words：${wordCount}`, cardMargin + cardWidth - paddingSide, cardMargin + cardHeight - paddingBottom + 60); // 调整位置

      ctx.font = `${fontSize * 0.5}px ${font}`;
      ctx.fillStyle = `${textColor}40`;
      ctx.textAlign = 'center';
      ctx.fillText("©️ Generated by xxxxxx", canvas.width / 2, cardMargin + cardHeight - paddingBottom + 80); // 调整位置

      cards.push(canvas.toDataURL('image/png'));

      if (!autoSplit) break;
    }

    setGeneratedCards(cards);
  };

  const drawTextWithLimit = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxHeight: number) => {
    const lines = text.split('\n');
    let renderedText = '';
    let currentY = y;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let lineFont = `${fontSize}px ${font}`;

      // 处理Markdown标题
      if (line.startsWith('# ')) {
        lineFont = `bold ${fontSize * 1.6}px ${font}`;
        line = line.substring(2);
      } else if (line.startsWith('## ')) {
        lineFont = `bold ${fontSize * 1.4}px ${font}`;
        line = line.substring(3);
      } else if (line.startsWith('### ')) {
        lineFont = `bold ${fontSize * 1.2}px ${font}`;
        line = line.substring(4);
      }

      ctx.font = lineFont;

      let chars = line.split('');
      let currentLine = '';

      for (let n = 0; n < chars.length; n++) {
        let testLine = currentLine + chars[n];
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(currentLine, x, currentY);
          renderedText += currentLine + '\n';
          currentLine = chars[n];
          currentY += lineHeight;

          if (currentY > y + maxHeight) {
            return {
              renderedText: renderedText.trim(),
              leftoverText: lines.slice(i).join('\n').substring(n)
            };
          }
        } else {
          currentLine = testLine;
        }
      }

      ctx.fillText(currentLine, x, currentY);
      renderedText += currentLine + '\n';
      currentY += lineHeight;

      if (currentY > y + maxHeight) {
        return {
          renderedText: renderedText.trim(),
          leftoverText: lines.slice(i + 1).join('\n')
        };
      }
    }

    return {
      renderedText: renderedText.trim(),
      leftoverText: ''
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setText(e.target.value);
  }

  const handleTextFocus = () => {
    console.log('Textarea focused');
  }

  const handleTemplateChange = (newValue: number) => {
    setSelectedTemplate(newValue);
    const template = presetTemplates[newValue];
    setBackgroundColor(template.backgroundColor);
    setTextColor(template.textColor);
    setFont(template.font);
    setFontSize(template.fontSize);
  }


  return (
    <>
      <div className='flex flex-col justify-center gap-6 mt-10 p-6'>

        <h1 className='text-4xl font-bold text-left'>Text card generator</h1>
        <div className='flex flex-row justify-center bg-gray-100 border rounded-md'>
          <Image src="/text-card-generator.svg" alt='Text card generator' width={100} height={100} />
          <p className='text-gray-700 p-10 align-middle'>Create beautiful text cards with custom fonts, colors, and backgrounds perfect for social media sharing and marketing.</p>
        </div>

        <div className='flex flex-col justify-center bg-gray-100 p-10 mt-1f border rounded-md'>

          <Textarea placeholder="Enter text (supports Markdown format)" className='h-[100px] bg-white dark:text-gray-800'
            value={text}
            onChange={handleTextChange}
            onFocus={handleTextFocus} />

          {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown> */}
          {/* 模板选择区域 */}
          <p className='p-5 dark:text-black font-bold'>Choose Template</p>
          <div className='grid grid-cols-8 w-full gap-2'>
            {presetTemplates.map((template, index) => (
              <Button key={index} className='text-xs sm:grid-cols-1'
                style={{ backgroundColor: template.backgroundColor, color: template.textColor, border: selectedTemplate === index ? '2px solid #000' : '1px solid #000' }}
                onClick={() => handleTemplateChange(index)}>
                {template.name}
              </Button>
            ))}
          </div>

          <p className='p-5 dark:text-black font-bold'>Choose Base Color</p>
          <div className='grid grid-cols-12 gap-2 w-[80%]'>
            {gradientBaseColors.map((gradientColor , index) => (
              <Button key={index}
                onClick={() => {
                  setGradientBase(gradientColor);
                  setUseBase(gradientColor.colors.length > 0);
                }}
                className='w-[50px] h-[50px] md:w-[40px] md:h-[40px] mx-2'
                style={{
                  background: gradientColor.colors.length > 0
                  ? `linear-gradient(to right, ${gradientColor.colors.join(', ')})`
                  : '#FFFFFF',
                  border: gradientBase === gradientColor ? '2px solid #000' : '1px solid #000'
                }}
              >{gradientColor.name === 'No Base' ? '🚫' : ''}</Button>
            ))}
          </div>

          <div className='grid grid-cols-2 gap-2 w-full mt-5'>
            <Select defaultValue={font} onValueChange={(value) => {setFont(value); generatePreview;}}>
              <SelectTrigger className='bg-white dark:text-black'>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
              {fonts.map((fontOption) => (
                <SelectItem key={fontOption.value} value={fontOption.value}>{fontOption.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Slider
              value={[fontSize]}
              onValueChange={(newValue) => setFontSize(newValue[0])}
              defaultValue={[50]}
              max={72}
              min={18}
              className='mx-4' />
          </div>

          <div className='grid grid-cols-2 gap-2 w-full mt-3'>
            <div className='flex flex-col'>
              <p className='dark:text-black font-bold'>Background Color</p>
              <input className='w-[50px] h-[50px] md:w-[40px] md:h-[40px] mx-2'
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)} />
              <span>{backgroundColor}</span>
            </div>
            <div className='flex flex-col'>
              <p className='dark:text-black font-bold'>Text Color</p>
              <input className='w-[50px] h-[50px] md:w-[40px] md:h-[40px] mx-2'
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}/>
              <span>{textColor}</span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2 w-full mt-3'>
            <Select defaultValue={aspectRatio} onValueChange={(value) => setAspectRatio(value)}>
              <SelectTrigger className='bg-white dark:text-black'>
                <SelectValue placeholder="Select a picture's radio" />
              </SelectTrigger>
              <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio.label} value={ratio.value.toString()}>
                  {ratio.label}
                </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex flex-row items-center'>
              <Switch id="slit-text" className='ml-4' checked={autoSplit} onCheckedChange={() => setAutoSplit(!autoSplit)} />
              <Label htmlFor="slit-text" className='text-gray-800 ml-1'>Split long text automatically</Label>
            </div>
          </div>
        </div>

        <div className='grid gap-2 m-3 justify-center max-h-[600px] w-full'>
          <h3 className='dark:text-black text-xl font-bold'>Card Preview</h3>
          {generatedCards.map((card, index) => (
            <div key={index} className='w-full max-w-[600px] mx-auto my-2 border rounded-lg overflow-hidden'>
              <img src={card} alt={`Generated Card ${index + 1}`} className='h-auto max-h-[100%] w-[100%] max-w-[100%]' />
            </div>
          ))}
          <canvas ref={canvasRef} style={{ display: 'none' }}/>
          <Button
            className='w-[200px] bg-[#0261f9] hover:bg-[#3d83f4] dark:text-gray-100'
            onClick={() => {
              generatedCards.forEach((card, index) => {
                const link = document.createElement('a');
                link.download = `text-card-${index + 1}.png`;
                link.href = card;
                link.click();
              });
            }}>
            Download card
          </Button>
        </div>

      </div>
    </>
  )
}

export default TextCardGenerator