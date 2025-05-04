'use client';

import Image from "next/image";
import styles from "./page.module.css";
import "./../fonts.scss";
import { useRef, useState, useEffect, StrictMode } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageSrc, setImageSrc] = useState('/pictures/sprite.png');
  const [images, setImages] = useState([
    '/pictures/sprite.png',
    '/pictures/sprite.png',
    '/pictures/sprite.png',
    '/pictures/sprite.png',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [activeRightPanel, setActiveRightPanel] = useState<string | null>(null);
  const [spriteType, setSpriteType] = useState('humanoid');
  const [spriteOrientation, setSpriteOrientation] = useState('normal');
  const [spriteSize, setSpriteSize] = useState('large');
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isModelDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('PixelCore');
  const [queueStatus, setQueueStatus] = useState<number[]>([0, 0, 0, 0, 0]);
  const [generationMode, setGenerationMode] = useState('simple');
  const [guidanceScale, setGuidanceScale] = useState(15);
  const [inferenceSteps, setInferenceSteps] = useState(70);
  const [postProcessing, setPostProcessing] = useState(-32);
  const [showToast, setShowToast] = useState(false);
  const [popularPrompts, setPopularPrompts] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isAuthRequestOpen, setIsAuthRequestOpen] = useState(false);
  const [colorPalette, setColorPalette] = useState<string[]>(Array(18).fill('#21233D'));
  const [queuePosition, setQueuePosition] = useState(null);
  const [queueTotal, setQueueTotal] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const queueMessages = [
    "Already close to a<br />masterpiece...",
    "Wait for your<br />portion of magic...",
    "Your moment is<br />almost here..."
  ];
  const [queueMessage, setQueueMessage] = useState(queueMessages[0]);
  const [isStrictMode, setIsStrictMode] = useState(false);
  const [isSmartMode, setIsSmartMode] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [selectedTool, setSelectedTool] = useState<'brush' | 'eraser' | 'fill' | 'picker'>('brush');
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(1);

  const [editHistory, setEditHistory] = useState<string[]>(['/pictures/sprite.png']);
  const [editHistoryIndex, setEditHistoryIndex] = useState(0);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsAuthorized(false);
          return;
        }

        const response = await fetch('/api/auth/check', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setIsAuthorized(data.isAuthorized || false);
      } catch (error) {
        console.error('Authorization check error:', error);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to logout on server:', await response.json());
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setIsAuthorized(false);
      setIsUserDropdownOpen(false);
      router.push('/sign-in');
    }
  };

  const handleSignIn = async () => {
    router.push('/sign-in');
  }


  const initializeCanvas = (src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 128;
    canvas.height = 128;
    ctx.imageSmoothingEnabled = false;

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 128, 128);
    };
    img.onerror = () => {
      console.error('Ошибка загрузки изображения:', src);
    };
  };

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      initializeCanvas(imageSrc);
    }
  }, [imageSrc]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (isTypingAnimation && currentPrompt) {
      let currentText = '';
      let index = 0;
      const speed = 30;

      const type = () => {
        if (index < currentPrompt.length) {
          currentText += currentPrompt[index];
          if (textareaRef.current) {
            textareaRef.current.value = currentText;
            handleInput();
          }
          index++;
          timeoutId = setTimeout(type, speed);
        } else {
          setIsTypingAnimation(false);
          // handleGenerateImage(currentPrompt);
        }
      };

      type();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isTypingAnimation, currentPrompt]);

  useEffect(() => {
    if (activeRightPanel !== 'paint' && isDrawing) {
      stopDrawing();
    }
  }, [activeRightPanel, isDrawing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editHistory, editHistoryIndex]);

  function* bresenhamLine(x0: number, y0: number, x1: number, y1: number) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      yield { x: x0, y: y0 };
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  const setPixel = (x: number, y: number) => {
    if (!imageDataRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;

    // Определяем половину размера кисти
    const halfSize = Math.floor(Math.sqrt(brushSize) / 2);

    // Определяем границы области рисования
    const minX = Math.max(0, x - halfSize);
    const maxX = Math.min(canvas.width - 1, x + halfSize);
    const minY = Math.max(0, y - halfSize);
    const maxY = Math.min(canvas.height - 1, y + halfSize);

    const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
    const color = hexToRgb(colorInput?.value || '#000000');

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const index = (py * canvas.width + px) * 4;
        if (selectedTool === 'brush') {
          imageDataRef.current.data[index] = color[0];
          imageDataRef.current.data[index + 1] = color[1];
          imageDataRef.current.data[index + 2] = color[2];
          imageDataRef.current.data[index + 3] = 255;
        } else if (selectedTool === 'eraser') {
          imageDataRef.current.data[index + 3] = 0;
        }
      }
    }
  };

  const undo = () => {
    if (editHistoryIndex > 0) {
      const prevIndex = editHistoryIndex - 1;
      const prevImageSrc = editHistory[prevIndex];
      setImageSrc(prevImageSrc);
      setImages(prev => [prevImageSrc, ...prev.slice(1)]);
      setEditHistoryIndex(prevIndex);

      // Обновляем холст
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new window.Image();
          img.src = prevImageSrc;
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
        }
      }
    }
  };

  // Обработчики рисования
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (selectedTool === 'picker') {
      const imageData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      const [r, g, b] = imageData;
      const hexColor = rgbToHex(`rgb(${r},${g},${b})`);
      const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
      if (colorInput) {
        colorInput.value = hexColor;
      }
      setSelectedTool('brush');
      return;
    }

    imageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setIsDrawing(true);
    lastPositionRef.current = { x, y };

    if (selectedTool === 'brush' || selectedTool === 'eraser') {
      setPixel(x, y);
      ctx.putImageData(imageDataRef.current, 0, 0);
    } else if (selectedTool === 'fill') {
      const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
      floodFill(ctx, x, y, hexToRgb(colorInput?.value || '#000000'));
      const newImageSrc = canvas.toDataURL('image/png');
      setImageSrc(newImageSrc);
      setImages(prev => [newImageSrc, ...prev.slice(1)]);
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !imageDataRef.current || !canvasRef.current || selectedTool === 'fill' || selectedTool === 'picker') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (lastPositionRef.current) {
      const { x: lastX, y: lastY } = lastPositionRef.current;

      for (const { x: px, y: py } of bresenhamLine(lastX, lastY, x, y)) {
        setPixel(px, py);
      }
    } else {
      setPixel(x, y);
    }

    lastPositionRef.current = { x, y };
    ctx.putImageData(imageDataRef.current, 0, 0);
  };

  // Обновленный stopDrawing
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    imageDataRef.current = null;
    lastPositionRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
      const newImageSrc = canvas.toDataURL('image/png');
      setImageSrc(newImageSrc);
      setImages(prev => [newImageSrc, ...prev.slice(1)]); // Обновляем текущее изображение

      // Сохраняем только в историю изменений
      setEditHistory(prev => {
        const newHistory = prev.slice(0, editHistoryIndex + 1); // Убираем состояния после текущего
        newHistory.push(newImageSrc);
        if (newHistory.length > 10) newHistory.shift(); // Ограничиваем длину истории
        return newHistory;
      });
      setEditHistoryIndex(prev => prev + 1);
    }
  };

  const floodFill = (ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: number[]) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const targetColor = getPixelColor(imageData, x, y);
    if (colorsMatch(targetColor, fillColor)) return;

    const pixelsToCheck = [{ x, y }];
    while (pixelsToCheck.length > 0) {
      const { x, y } = pixelsToCheck.pop()!;
      const currentColor = getPixelColor(imageData, x, y);

      if (colorsMatch(currentColor, targetColor)) {
        setPixelColor(imageData, x, y, fillColor);

        if (x > 0) pixelsToCheck.push({ x: x - 1, y });
        if (x < ctx.canvas.width - 1) pixelsToCheck.push({ x: x + 1, y });
        if (y > 0) pixelsToCheck.push({ x, y: y - 1 });
        if (y < ctx.canvas.height - 1) pixelsToCheck.push({ x, y: y + 1 });
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4;
    return [
      imageData.data[index],
      imageData.data[index + 1],
      imageData.data[index + 2],
      imageData.data[index + 3]
    ];
  };

  const setPixelColor = (imageData: ImageData, x: number, y: number, color: number[]) => {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color[0];
    imageData.data[index + 1] = color[1];
    imageData.data[index + 2] = color[2];
    imageData.data[index + 3] = 255;
  };

  const colorsMatch = (color1: number[], color2: number[]) => {
    return color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2];
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // Обработчик выбора инструмента
  const handleToolSelect = (tool: 'brush' | 'eraser' | 'fill' | 'picker') => {
    setSelectedTool(tool);
  };

  const fetchPopularPrompts = async () => {
    try {
      const response = await fetch(`https://pixelmate.club/api/generation/popular-prompts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении популярных промптов');
      }

      const data = await response.json();
      const prompts = Array.isArray(data) ? data : data.prompts || [];

      setPopularPrompts(prompts.slice(0, 10));
    } catch (error) {
      console.error('Ошибка при загрузке популярных промптов:', error);

      setPopularPrompts([
        'NPC doctor, woman, blond long hair, black glasses',
        'Farmer with an apple',
        'Desert soldier with a rifle',
        'NPC nurse, young woman, short red hair, white uniform',
        'Gardener with a shovel, old man, gray beard',
        'Jungle explorer with a machete, tall, brown hat',
        'Village blacksmith, muscular, holding a hammer',
        'Forest ranger, female, green cape, binoculars'
      ]);
    }
  };

  useEffect(() => {
    fetchPopularPrompts();
  }, []);

  const fetchRandomPrompt = async (spriteType: string) => {
    console.log('Отправка запроса на случайный промпт...', spriteType);
    try {
      const response = await fetch(`https://pixelmate.club/api/generation/random-prompt?spriteType=${encodeURIComponent(spriteType)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении случайного промпта');
      }

      const data = await response.json();
      return data.prompt;
    } catch (error) {
      console.error('Ошибка при получении случайного промпта:', error);
      return null;
    }
  };

  const animatedPrompts = [
    "NPC nurse, young woman, short red hair, white uniform",
    "Gardener with a shovel, old man, gray beard",
    "Jungle explorer with a machete, tall, brown hat"
  ];
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [currentAnimatedPromptIndex, setCurrentAnimatedPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = animatedPrompts[currentAnimatedPromptIndex];
    let timeout;
    const typingSpeed = 50;
    const deletingSpeed = 20;
    const pauseDuration = 1500;
    if (!isDeleting) {
      if (animatedPlaceholder.length < currentText.length) {
        timeout = setTimeout(() => {
          setAnimatedPlaceholder(currentText.substring(0, animatedPlaceholder.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (animatedPlaceholder.length > 0) {
        timeout = setTimeout(() => {
          setAnimatedPlaceholder(currentText.substring(0, animatedPlaceholder.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentAnimatedPromptIndex((prev) => (prev + 1) % animatedPrompts.length);
      }
    }
    return () => clearTimeout(50);
  }, [animatedPlaceholder, isDeleting, currentAnimatedPromptIndex]);

  const fetchQueueStatus = async () => {
    try {
      const response = await fetch(`https://pixelmate.club/api/generation/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении статуса очереди');
      }

      const data = await response.json();
      const status = data.queue_status;

      let newStatus: number[];
      if (status === 5) {
        newStatus = [1, 1, 1, 1, 1];
      } else if (status === 3) {
        newStatus = [1, 1, 1, 0, 0];
      } else if (status === 1) {
        newStatus = [1, 0, 0, 0, 0];
      } else {
        newStatus = [0, 0, 0, 0, 0];
      }

      setQueueStatus(newStatus);
      setHasError(false);
    } catch (error) {
      console.error('Ошибка при получении статуса:', error);
      setQueueStatus([0, 0, 0, 0, 0]);
      setHasError(true);
      setShowToast(true);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(() => {
      fetchQueueStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(() => {
      fetchQueueStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getApiUrl = () => {
    return selectedModel === 'PixelCore'
      ? `https://pixelmate.club/api/generation/model/pixelcore`
      : `https://pixelmate.club/api/generation/model/pixeldiffusion`;
  };

  const fetchSuggestions = async (prompt: string) => {
    try {
      const response = await fetch(`https://pixelmate.club/api/generation/suggestions?prompt=${encodeURIComponent(prompt)}&spriteType=${encodeURIComponent(spriteType.replace('oid', ''))}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении предложений');
      }

      const data = await response.json();
      const suggestionsArray = Array.isArray(data) ? data : data.suggestions || [];
      setSuggestions(suggestionsArray.slice(0, 2));
    } catch (error) {
      console.error('Ошибка при загрузке предложений:', error);
      setSuggestions([]);
    }
  };

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.rows = 1;

    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const scrollHeight = textarea.scrollHeight;
    const rows = Math.floor(scrollHeight / lineHeight);

    if (rows <= 3) {
      textarea.rows = rows;
    } else {
      textarea.rows = 3;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const prompt = textarea.value.trim();
    if (prompt) {
      typingTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(prompt);
      }, 1000);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleRandomClick = async () => {
    if (isLoading || isTypingAnimation) return;

    // Очищаем textarea
    if (textareaRef.current) {
      textareaRef.current.value = '';
      handleInput();
    }

    const prompt = await fetchRandomPrompt(spriteType);
    if (prompt) {
      setCurrentPrompt(prompt);
      setIsTypingAnimation(true);
    } else {
      setShowToast(true);
      console.log('Не удалось получить случайный промпт.');
    }
  };

  const fetchQueuePosition = async (taskId: string) => {
    try {
      const response = await fetch(`https://pixelmate.club/api/generation/task/${taskId}/position`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении позиции в очереди');
      }

      const data = await response.json();
      if (data.position && data.total) {
        setQueuePosition(data.position);
        setQueueTotal(data.total);
      } else {
        setQueuePosition(null);
        setQueueTotal(null);
      }
    } catch (error) {
      console.error('Ошибка при получении позиции в очереди:', error);
      setQueuePosition(null);
      setQueueTotal(null);
    }
  };

  const handleGenerateImage = async (prompt?: string) => {
    if (isLoading) return;

    const textarea = textareaRef.current;
    let description = prompt || (textarea?.value.trim() ?? '');

    if (!description) {
      return;
    }

    if (textarea && !prompt) {
      textarea.value = description;
    }

    const randomMessage = queueMessages[Math.floor(Math.random() * queueMessages.length)];
    setQueueMessage(randomMessage);

    setIsLoading(true);
    setIsGenerated(false);

    try {
      const translateResponse = await fetch(`https://pixelmate.club/api/generation/translate-prompt?prompt=${encodeURIComponent(description)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!translateResponse.ok) {
        throw new Error(`Ошибка при переводе промпта: ${translateResponse.status}`);
      }

      const translateData = await translateResponse.json();
      let translatedPrompt = translateData.prompt;

      if (!translatedPrompt) {
        throw new Error('Перевод не получен');
      }

      let finalSpriteOrientation = spriteOrientation;
      let finalSpriteType = spriteType;
      let finalSpriteSize = spriteSize;

      if (isSmartMode) {
        try {
          const smartResponse = await fetch(`https://pixelmate.club/api/generation/smart-prompt?prompt=${encodeURIComponent(translatedPrompt)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!smartResponse.ok) {
            throw new Error('Ошибка при получении параметров smart-промпта');
          }

          const smartData = await smartResponse.json();
          if (smartData.orientation && ['normal', 'horizontal', 'vertical'].includes(smartData.orientation)) {
            finalSpriteOrientation = smartData.orientation;
            setSpriteOrientation(smartData.orientation);
          }
          if (smartData.size && ['small', 'medium', 'large'].includes(smartData.size)) {
            finalSpriteSize = smartData.size;
            setSpriteSize(smartData.size);
          }
          if (smartData.type && ['humanoid', 'creature', 'object'].includes(smartData.type)) {
            finalSpriteType = smartData.type;
            setSpriteType(smartData.type);
          }

          console.log(smartData);
        } catch (error) {
          console.error('Ошибка при запросе', error);
        }
      }

      const numImages = generationMode === 'advanced' ? 4 : 1;
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: isStrictMode ? `solo alone solitary single, ${translatedPrompt}` : translatedPrompt,
          type: finalSpriteType.replace('oid', ''),
          orientation: finalSpriteOrientation,
          size: finalSpriteSize,
          guidance_scale: guidanceScale,
          inference_steps: inferenceSteps,
          num_colors: Math.abs(postProcessing),
          num: numImages
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при добавлении задачи: ${response.status}`);
      }

      const data = await response.json();
      const taskId = data.task_id;
      console.log(`Получен taskId: ${taskId}`);

      const positionInterval = setInterval(() => {
        fetchQueuePosition(taskId);
      }, 1000);

      const checkStatus = setInterval(async () => {
        try {
          console.log(`Опрос статуса задачи ${taskId}...`);
          const statusResponse = await fetch(`https://pixelmate.club/api/generation/task/${taskId}`);
          if (!statusResponse.ok) {
            throw new Error(`Ошибка при запросе статуса: ${statusResponse.status}`);
          }

          const statusData = await statusResponse.json();

          if (statusData.images) {
            console.log('Изображения получены:', statusData.images);
            clearInterval(checkStatus);
            clearInterval(positionInterval);
            setQueuePosition(null);
            setQueueTotal(null);
            const newImages = statusData.images.map((base64Image: string) => `data:image/png;base64,${base64Image}`);

            if (generationMode === 'simple') {
              setImageSrc(newImages[0]);
              setImages([newImages[0]]);
              setHistory((prevHistory) => [...prevHistory, newImages[0]]);
            } else {
              setImageSrc(newImages[0]);
              setImages(newImages);
              setHistory((prevHistory) => [...prevHistory, ...newImages]);
            }

            setEditHistory([newImages[0]]);
            setEditHistoryIndex(0);

            setIsBackgroundRemoved(false);
            setOriginalImage(null);
            setIsLoading(false);
            setIsGenerated(true);

            if (activeRightPanel === 'paint') {
              await generateColorPalette(newImages[0]);
            }
          } else if (statusData.error) {
            console.error('Ошибка в ответе:', statusData.error);
            clearInterval(checkStatus);
            clearInterval(positionInterval);
            setQueuePosition(null);
            setQueueTotal(null);
            throw new Error(statusData.error);
          }
        } catch (error) {
          console.error('Ошибка при опросе статуса:', error);
          clearInterval(checkStatus);
          clearInterval(positionInterval);
          setQueuePosition(null);
          setQueueTotal(null);
          alert('An unexpected error occurred');
          setIsLoading(false);
          setIsGenerated(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Ошибка при генерации:', error);
      alert('An error occurred, generation may not be available at the moment');
      setIsLoading(false);
      setIsGenerated(false);
      setQueuePosition(null);
      setQueueTotal(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  const handlePopularPromptClick = (prompt: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = prompt;
      handleInput();
    }
    handleGenerateImage(prompt);
  };

  const swapImages = (index: number) => {
    if (isLoading) return;

    const newImages = [...images];
    [newImages[0], newImages[index]] = [newImages[index], newImages[0]];
    setImages(newImages);
    setImageSrc(newImages[0]);

    setIsBackgroundRemoved(false);
    setOriginalImage(newImages[0]);

    // Устанавливаем начальное состояние в историю изменений
    setEditHistory([newImages[0]]); // Начальное состояние
    setEditHistoryIndex(0); // Указываем на начальное состояние

    if (isGenerated && activeRightPanel === 'paint') {
      generateColorPalette(newImages[0]);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const toggleRightPanel = (panel: string) => {
    const newPanel = activeRightPanel === panel ? null : panel;
    setActiveRightPanel(newPanel);

    if (newPanel === 'paint' && isGenerated && imageSrc) {
      generateColorPalette(imageSrc);
    }
  };

  const handleSpriteTypeChange = (type: string) => {
    setSpriteType(type);
  };

  const handleSpriteSizeChange = (size: string) => {
    setSpriteSize(size);
  };

  const handleSpriteOrientationChange = (size: string) => {
    setSpriteOrientation(size);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isModelDropdownOpen);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setIsDropdownOpen(false);
  };

  const getSizeClass = (size: number) => {
    return brushSize === size ? styles.visible : styles.hidden;
  };

  const handleModeChange = (mode: string) => {
    setGenerationMode(mode);
    if (mode === 'advanced' && images.length < 4) {
      const currentImage = images[0] || imageSrc || '/pictures/sprite.png';
      setImages([
        currentImage,
        currentImage,
        currentImage,
        currentImage
      ]);
    }
  };

  const handleBackgroundToggle = async () => {
    if (!isGenerated) return;

    if (!isBackgroundRemoved) {
      // Удаляем фон
      try {
        // Сохраняем оригинальное изображение перед изменением
        if (!originalImage || originalImage !== imageSrc) {
          setOriginalImage(imageSrc);
        }

        // Преобразуем base64 в blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const img = new window.Image();
        img.src = URL.createObjectURL(blob);

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Создаем canvas для обработки изображения
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Проверяем, что контекст успешно получен
        if (!ctx) {
          throw new Error('Не удалось получить 2D контекст canvas');
        }

        ctx.drawImage(img, 0, 0);

        // Получаем данные изображения
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Определяем цвет фона по верхнему левому пикселю
        const bgColor = {
          r: data[0],
          g: data[1],
          b: data[2]
        };

        // Устанавливаем порог схожести цветов
        const tolerance = 15;

        // Проходим по всем пикселям
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Проверяем, похож ли цвет на фоновый
          if (
            Math.abs(r - bgColor.r) < tolerance &&
            Math.abs(g - bgColor.g) < tolerance &&
            Math.abs(b - bgColor.b) < tolerance
          ) {
            // Устанавливаем прозрачность
            data[i + 3] = 0;
          }
        }

        // Применяем измененные данные
        ctx.putImageData(imageData, 0, 0);
        const newImageSrc = canvas.toDataURL('image/png');

        // Обновляем состояние
        setImageSrc(newImageSrc);
        setImages(prev => [newImageSrc, ...prev.slice(1)]);
        setIsBackgroundRemoved(true);

      } catch (error) {
        console.error('Ошибка при удалении фона:', error);
      }
    } else {
      // Восстанавливаем фон
      if (originalImage) {
        setImageSrc(originalImage);
        setImages(prev => [originalImage, ...prev.slice(1)]);
        setIsBackgroundRemoved(false);
      }
    }
  };

  const generateColorPalette = async (imageUrl: string) => {
    try {
      // Load the image
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw image and get pixel data
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Count colors
      const colorCount: { [key: string]: number } = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip transparent pixels
        if (a === 0) continue;

        const rgb = `rgb(${r},${g},${b})`;
        colorCount[rgb] = (colorCount[rgb] || 0) + 1;
      }

      // Sort colors by frequency and take top 18
      const sortedColors = Object.entries(colorCount)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 18)
        .map(([color]) => color);

      // Fill remaining slots with white if less than 18 colors
      while (sortedColors.length < 18) {
        sortedColors.push('rgb(255,255,255)');
      }

      setColorPalette(sortedColors);
    } catch (error) {
      console.error('Error generating color palette:', error);
      setColorPalette(Array(18).fill('#ffffff'));
    }
  };

  const handleDownload = () => {
    if (!isGenerated || !imageSrc) return;

    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `sprite_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Скелетон для истории
  const renderSkeleton = () => {
    return (
      <div className={styles.items}>
        {Array(12).fill(0).map((_, index) => (
          <div
            key={index}
            className={`${styles.item} ${styles.skeleton}`}>
            <Image
              src="/pictures/sprite.png"
              alt=""
              width={128}
              height={128}
              unoptimized
            />
          </div>
        ))}
      </div>
    );
  };

  const rgbToHex = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <div className={styles.model}>
              <Image
                src="/pictures/logo.svg"
                alt="Logo"
                width={30}
                height={30}
                onClick={() => router.push('/')}
              />
              <div
                className={styles.button}
                onClick={toggleDropdown}
                style={{ zIndex: isModelDropdownOpen ? '3' : '2' }}>
                {selectedModel}
                <div
                  className={styles.dropdown}
                  style={{ display: isModelDropdownOpen ? 'flex' : 'none' }}>
                  <div
                    className={styles.item}
                    onClick={() => handleModelSelect('PixelDiffusion')}>
                    <div className={selectedModel === 'PixelDiffusion' ? styles.checked : styles.unchecked}>
                      <span className="material-symbols-rounded">
                        {selectedModel === 'PixelDiffusion' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <div className={styles.text}>
                      <div className={styles.title}>PixelDiffusion<span className={styles.badge}>STABLE</span></div>
                      <div className={styles.subtitle}>Simple concept, 2-6 seconds</div>
                    </div>
                  </div>
                  <div
                    className={styles.item}
                    onClick={() => handleModelSelect('PixelCore')}>
                    <div className={selectedModel === 'PixelCore' ? styles.checked : styles.unchecked}>
                      <span className="material-symbols-rounded">
                        {selectedModel === 'PixelCore' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <div className={styles.text}>
                      <div className={styles.title}>PixelCore<span className={styles.badge}>BETA</span></div>
                      <div className={styles.subtitle}>High quality, 15-90 seconds</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.icon} onClick={toggleDropdown} style={{ zIndex: isModelDropdownOpen ? '3' : '2' }}>
                <span className="material-symbols-rounded">keyboard_arrow_down</span>
              </div>
            </div>

            <div className={styles.menu}>
              <div className={styles.notification} style={{ zIndex: isNotificationDropdownOpen ? '3' : '2' }}>
                <div
                  className={styles.clickArea}
                  onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}>
                </div>

                <span className="material-symbols-rounded">notifications</span>

                <div className={styles.dropdown} style={{ display: isNotificationDropdownOpen ? 'flex' : 'none' }}>
                  <div className={styles.title}>Notifications</div>
                  <div className={styles.items}>
                    <div className={styles.item}>
                      <div>
                        <Image
                          src="https://cdna.artstation.com/p/assets/images/images/020/042/190/large/joanna-revv-szymanska-1.jpg?1566126853"
                          alt=""
                          width={30}
                          height={30}
                          unoptimized
                        />
                        <div className={styles.icon}>
                          <span className="material-symbols-rounded">
                            info
                          </span>
                        </div>
                      </div>

                      <div className={styles.text}>
                        <div className={styles.description}>We regret to inform you that our generation servers are currently unavailable due to a technical issue. Our team is working diligently to resolve the problem as quickly as possible. We apologize for any inconvenience this may cause and appreciate your patience while we restore full functionality.</div>
                        <div className={styles.date}>3 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.user} style={{ zIndex: isUserDropdownOpen ? '3' : '2' }}>
                <div
                  className={styles.clickArea}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                </div>

                <span className="material-symbols-rounded">person</span>

                <div className={styles.dropdown} style={{ display: isUserDropdownOpen ? 'flex' : 'none' }}>
                  <div className={styles.label}>
                    <span className="material-symbols-rounded">
                      waving_hand
                    </span>
                    Hello
                  </div>
                  <div className={styles.username}>FriendlyPixeloid</div>
                  <div className={styles.button}>
                    <span className="material-symbols-rounded">
                      volunteer_activism
                    </span>
                    <div className={styles.text}>Donate</div>
                  </div>
                  {isAuthorized ? (
                    <div className={styles.button}>
                      <span className="material-symbols-rounded">
                        settings
                      </span>
                      <div className={styles.text}>Settings</div>
                    </div>
                  ) : undefined}
                  <div className={styles.button}>
                    <span className="material-symbols-rounded">
                      forum
                    </span>
                    <div className={styles.text}>Help & FAQ</div>
                  </div>
                  <div className={styles.separator}></div>
                  {isAuthorized ? (
                    <div className={styles.button} onClick={handleLogout}>
                      <span className="material-symbols-rounded">exit_to_app</span>
                      <div className={styles.text}>Log out</div>
                    </div>
                  ) : (
                    <div className={styles.button} onClick={handleSignIn}>
                      <span className="material-symbols-rounded">exit_to_app</span>
                      <div className={styles.text}>Sign in</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <div className={styles.content}>
            <div className={styles.base}>
              <div className={styles.left}>
                <div className={styles.menu}>
                  <div
                    className={`${styles.popular} ${activeTab === 'popular' ? styles.active : ''}`}
                    onClick={() => handleTabClick('popular')}
                  >
                    <span className="material-symbols-rounded">trending_up</span>
                  </div>
                  <div
                    className={`${styles.history} ${activeTab === 'history' ? styles.active : ''}`}
                    onClick={() => handleTabClick('history')}
                  >
                    <span className="material-symbols-rounded">history</span>
                  </div>
                  <div
                    className={`${styles.saved} ${activeTab === 'saved' ? styles.active : ''}`}
                    onClick={() => handleTabClick('saved')}
                  >
                    <span className="material-symbols-rounded">bookmark</span>
                  </div>
                </div>

                <div className={styles.tabs}>
                  <div className={styles.popular} style={{ display: activeTab === 'popular' ? 'block' : 'none' }}>
                    <div className={styles.title}>Popular prompts</div>
                    <div className={styles.items}>
                      {popularPrompts.length === 0 ? (
                        Array(8).fill(0).map((_, index) => (
                          <div
                            key={index}
                            className={`${styles.item} ${styles.pulse}`} style={{ height: '60px' }}>
                          </div>
                        ))
                      ) : (
                        popularPrompts.map((prompt, index) => (
                          <div
                            className={styles.item}
                            key={index}
                            onClick={() => handlePopularPromptClick(prompt)}>
                            {prompt}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className={styles.history} style={{ display: activeTab === 'history' ? 'block' : 'none' }}>
                    <div className={styles.title}>History</div>
                    {history.length === 0 ? (
                      renderSkeleton()
                    ) : (
                      <div className={styles.items}>
                        {[...history].reverse().map((src, index) => (
                          <div
                            className={`${styles.item}`}
                            key={index}>
                            <Image
                              src={src}
                              alt={`History Sprite ${history.length - index}`}
                              width={128}
                              height={128}
                              unoptimized
                              style={{ opacity: isLoading ? '0.1' : '0.7' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.saved} style={{ display: activeTab === 'saved' ? 'block' : 'none' }}>
                    <div className={styles.title}>Saved</div>
                    <div className={styles.items}>
                      <div className={styles.item}>...</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.center}>
                <div className={styles.caution}>Generation technology is still being tested. Use advanced generation settings for greater accuracy.</div>
                <div className={styles.picture}>
                  {isLoading && (
                    <>
                      {queuePosition && queueTotal && queuePosition > 1 && (
                        <div className={styles.queue}>
                          <div className={styles.title}>#{queuePosition}<span>/{queueTotal}</span></div>
                          <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: queueMessage }} />
                        </div>
                      )}
                      {(queuePosition === null || queuePosition === 1) && (
                        <div className={styles.loader}></div>
                      )}
                    </>
                  )}
                  {isLoading && !queuePosition && !queueTotal && <div className={styles.loader}></div>}
                  <canvas
                    ref={canvasRef}
                    style={{
                      opacity: isLoading ? 0.02 : 1,
                      cursor: selectedTool === 'picker' ? 'crosshair' : 'default',
                      pointerEvents: activeRightPanel === 'paint' ? 'auto' : 'none'
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                  />
                </div>
                <div className={styles.prompt}>
                  <textarea
                    ref={textareaRef}
                    placeholder={animatedPlaceholder}
                    rows={1}
                    maxLength={180}
                    spellCheck={false}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    disabled={isTypingAnimation} />

                  <div
                    className={styles.enter}
                    onClick={() => handleGenerateImage()}
                    style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
                    <span className="material-symbols-rounded">arrow_upward</span>
                  </div>

                  <div
                    className={styles.random}
                    onClick={handleRandomClick}
                    style={{ pointerEvents: isLoading || isTypingAnimation ? 'none' : 'auto' }}>
                    <span className="material-symbols-rounded">ifl</span>
                  </div>

                  <div className={styles.suggestions}>
                  <div className={styles.label} style={suggestions.length === 0 ? { display: 'none' } : {}}>BETA</div>
                    <div className={styles.items}>
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={styles.item}
                          onClick={() => {
                            if (textareaRef.current) {
                              textareaRef.current.value = suggestion;
                              handleInput();
                            }
                          }}>
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {isGenerated && (activeRightPanel !== 'paint') && (
                  <div className={styles.buttons}>
                    <div
                      className={`${styles.background} ${isBackgroundRemoved ? styles.active : ''}`}
                      onClick={handleBackgroundToggle}
                    >
                      <span className="material-symbols-rounded">background_replace</span>
                    </div>
                    <div className={styles.bookmark}>
                      <span className="material-symbols-rounded">bookmark</span>
                    </div>
                    <div
                      className={`${styles.download} ${isGenerated ? styles.downloadAnimate : ''}`}
                      onClick={handleDownload}>
                      <span className="material-symbols-rounded">download</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.right}>
                <div className={styles.menu}>
                  <div
                    className={`${styles.additional} ${activeRightPanel === 'additional' ? styles.active : ''}`}
                    onClick={() => toggleRightPanel('additional')}>
                    <span className="material-symbols-rounded">more_horiz</span>
                  </div>
                  <div
                    className={`${styles.edit} ${activeRightPanel === 'paint' ? styles.active : ''}`}
                    onClick={() => toggleRightPanel('paint')}>
                    <span className="material-symbols-rounded">brush</span>
                  </div>
                </div>
                <div className={styles.alternate}
                  style={{ display: generationMode === 'simple' ? 'none' : 'inline-flex' }}>
                  {images.slice(1).map((src, index) => (
                    <div
                      className={styles.picture}
                      key={index}
                      style={{
                        opacity: isLoading ? 0 : 1,
                        transform: isLoading ? 'translateX(-112%)' : 'none',
                        transition: `transform 0.3s ease ${(index + 1) / 5}s, background-color 0.1s, opacity 0.3s ease ${(index + 1) / 5}s`,
                      }}
                    >
                      <Image
                        src={src}
                        alt={`Alternate Sprite ${(index + 1)}`}
                        width={128}
                        height={128}
                        unoptimized
                        onClick={() => swapImages(index + 1)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={styles.additional}
              style={{ display: activeRightPanel === 'additional' ? 'block' : 'none' }}>
              <div className={styles.title}>Additional options</div>
              <div className={styles.options}>
                <div className={styles.label}>Generation mode</div>
                <div className={styles.mode} style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
                  <div
                    className={`${styles.tab} ${generationMode === 'simple' ? styles.active : ''}`}
                    onClick={() => handleModeChange('simple')}>
                    Single
                  </div>
                  <div
                    className={`${styles.tab} ${generationMode === 'advanced' ? styles.active : ''}`}
                    onClick={() => (isAuthorized ? handleModeChange('advanced') : setIsAuthRequestOpen(true))}>
                    Multiple
                    <span className="material-symbols-rounded">
                      {isAuthorized ? '' : 'lock'}
                    </span>
                  </div>
                </div>
                <div className={styles.label}>Guidance scale</div>
                <input
                  type="range"
                  value={guidanceScale}
                  min={5}
                  max={20}
                  step={1}
                  onChange={(e) => setGuidanceScale(parseInt(e.target.value))}
                />

                <div className={styles.label}>Inference steps</div>
                <input
                  type="range"
                  value={inferenceSteps}
                  min={20}
                  max={100}
                  step={10}
                  onChange={(e) => setInferenceSteps(parseInt(e.target.value))}
                />

                <div className={styles.label}>Post-processing</div>
                <input
                  type="range"
                  min="-64"
                  max="-14"
                  step="2"
                  value={postProcessing}
                  onChange={(e) => setPostProcessing(parseInt(e.target.value))}
                />

                <div className={styles.label}>Color unification</div>
                <input type="range" />

                <div className={styles.label}>Sprite type</div>
                <div className={styles.type}>
                  <div className={styles.smartIcon} style={{ display: (isSmartMode && isLoading && queuePosition === null) ? 'block' : 'none' }}>
                    <span className="material-symbols-rounded">
                      network_intelligence
                    </span>
                  </div>
                  <div
                    className={`${styles.tab} ${spriteType === 'humanoid' ? styles.active : ''}`}
                    onClick={() => handleSpriteTypeChange('humanoid')}>
                    Humanoid
                  </div>
                  <div
                    className={`${styles.tab} ${spriteType === 'creature' ? styles.active : ''}`}
                    onClick={() => handleSpriteTypeChange('creature')}>
                    Creature
                  </div>
                  <div
                    className={`${styles.tab} ${spriteType === 'object' ? styles.active : ''}`}
                    onClick={() => handleSpriteTypeChange('object')}>
                    Object
                  </div>
                </div>

                <div className={styles.label}>Sprite orientation</div>
                <div className={styles.orientation}>
                  <div className={styles.smartIcon} style={{ display: (isSmartMode && isLoading && queuePosition === null) ? 'block' : 'none' }}>
                    <span className="material-symbols-rounded">
                      network_intelligence
                    </span>
                  </div>
                  <div
                    className={`${styles.tab} ${spriteOrientation === 'normal' ? styles.active : ''}`}
                    onClick={() => handleSpriteOrientationChange('normal')}>
                    Normal
                  </div>
                  <div
                    className={`${styles.tab} ${spriteOrientation === 'horizontal' ? styles.active : ''}`}
                    onClick={() => handleSpriteOrientationChange('horizontal')}>
                    Horizontal
                  </div>
                  <div
                    className={`${styles.tab} ${spriteOrientation === 'vertical' ? styles.active : ''}`}
                    onClick={() => handleSpriteOrientationChange('vertical')}>
                    Vertical
                  </div>
                </div>


                <div className={styles.label}>Sprite size</div>
                <div className={styles.size}>
                  <div className={styles.smartIcon} style={{ display: (isSmartMode && isLoading && queuePosition === null) ? 'block' : 'none' }}>
                    <span className="material-symbols-rounded">
                      network_intelligence
                    </span>
                  </div>
                  <div
                    className={`${styles.tab} ${spriteSize === 'small' ? styles.active : ''}`}
                    onClick={() => handleSpriteSizeChange('small')}>
                    Small
                  </div>
                  <div
                    className={`${styles.tab} ${spriteSize === 'medium' ? styles.active : ''}`}
                    onClick={() => handleSpriteSizeChange('medium')}>
                    Medium
                  </div>
                  <div
                    className={`${styles.tab} ${spriteSize === 'large' ? styles.active : ''}`}
                    onClick={() => handleSpriteSizeChange('large')}>
                    Large
                  </div>
                </div>

                <div className={styles.mods}>
                  <div className={styles.switch}>
                    <div className={styles.label}>Smart mode</div>
                    <div className={styles.strict}>
                      <input
                        type="checkbox"
                        checked={isSmartMode}
                        onChange={(e) => setIsSmartMode(e.target.checked)}
                      />
                      <span className="material-symbols-rounded">
                        help_center
                      </span>
                    </div>
                  </div>

                  <div className={styles.switch}>
                    <div className={styles.label}>Strict mode</div>
                    <div className={styles.strict}>
                      <input
                        type="checkbox"
                        checked={isStrictMode}
                        onChange={(e) => setIsStrictMode(e.target.checked)}
                      />
                      <span className="material-symbols-rounded">
                        help_center
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.paint} style={{ display: activeRightPanel === 'paint' ? 'block' : 'none' }}>
              <div className={styles.title}>Paint mode</div>
              <div className={styles.options}>
                <div className={styles.label}>Current color</div>
                <div className={styles.colorSelector}>
                  <div className={styles.color}>
                    <input type="color" defaultValue="#000000" />
                  </div>
                  <div
                    className={`${styles.picker} ${selectedTool === 'picker' ? styles.active : ''}`}
                    onClick={() => handleToolSelect('picker')}
                  >
                    <span className="material-symbols-rounded">
                      colorize
                    </span>
                  </div>
                </div>
                <div className={styles.label}>Color palette</div>
                <div className={styles.palette}>
                  {colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className={styles.color}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
                        if (colorInput) {
                          colorInput.value = rgbToHex(color);
                        }
                      }}
                    ></div>
                  ))}
                </div>
                <div className={styles.label}>Tools</div>
                <div className={styles.tools}>
                  <div
                    className={`${styles.tool} ${selectedTool === 'brush' ? styles.active : ''}`}
                    onClick={() => handleToolSelect('brush')}>
                    <span className="material-symbols-rounded">
                      brush
                    </span>
                    <div className={styles.text} style={{ marginRight: '5px' }}>Brush</div>
                  </div>
                  <div
                    className={`${styles.tool} ${selectedTool === 'eraser' ? styles.active : ''}`}
                    onClick={() => handleToolSelect('eraser')}>
                    <span className="material-symbols-rounded" style={{ paddingTop: '1px' }}>
                      ink_eraser
                    </span>
                    <div className={styles.text}>Eraser</div>
                  </div>
                  <div
                    className={`${styles.tool} ${selectedTool === 'fill' ? styles.active : ''}`}
                    onClick={() => handleToolSelect('fill')}>
                    <span className="material-symbols-rounded">
                      colors
                    </span>
                    <div className={styles.text} style={{ marginRight: '5px' }}>Fill</div>
                  </div>
                </div>
                <div className={styles.label}>Brush size</div>
                <div className={styles.brushSize}>
                  <div className={styles.size}>
                    <div className={styles.value1} style={{ display: brushSize === 1 ? 'block' : 'none' }}></div>

                    <div className={styles.value4} style={{ display: brushSize === 4 ? 'grid' : 'none' }}>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                    </div>

                    <div className={styles.value9} style={{ display: brushSize === 9 ? 'grid' : 'none' }}>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                    </div>

                    <div className={styles.value16} style={{ display: brushSize === 16 ? 'grid' : 'none' }}>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                    </div>

                    <div className={styles.value25} style={{ display: brushSize === 25 ? 'grid' : 'none' }}>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                      <div className={styles.pixel}></div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={brushSize === 1 ? 0 : brushSize === 4 ? 1 : brushSize === 9 ? 2 : brushSize === 16 ? 3 : 4}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      const sizes = [1, 4, 9, 16, 25];
                      setBrushSize(sizes[value]);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.toast} ${showToast ? styles.active_toast : ''}`}>
            <Image className={styles.icon}
              src="/pictures/attention.gif"
              alt="ERROR" width={64} height={50}
              unoptimized />
            <div className={styles.text}>
              <div className={styles.title}>Attention</div>
              <div className={styles.subtitle}>Dear user, the generation service is<br></br>temporarily unavailable (Error-503).</div>
            </div>
            <span className="material-symbols-rounded" onClick={() => setShowToast(false)}>close</span>
            <Image className={styles.mark}
              src="/pictures/attention.png"
              alt="Attention" width={24} height={24}
              unoptimized />
          </div>

          <div className={styles.status_bar}>
            <div className={styles.status}>
              <div className={styles.title}>Status</div>
              <div className={styles.list}>
                {!hasError ? (
                  <>
                    <div className={styles.online}></div>
                    <div className={styles.text_online}>ONLINE</div>
                  </>
                ) : (
                  <>
                    <div className={styles.offline}></div>
                    <div className={styles.text_offline}>OFFLINE</div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.avaliability}>
              <div className={styles.title}>Availability</div>
              <div className={styles.list}>
                {queueStatus.map((status, index) => (
                  <div
                    key={index}
                    className={status === 1 ? styles.true : styles.false}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/*
          <div className={styles.decoration}>
            <Image src="/pictures/decoration.svg" alt="Decoration" width={32} height={32} unoptimized />
          </div>
          */}

          <div className={styles.authRequest} style={{ display: isAuthRequestOpen ? 'block' : 'none' }}>
            <span className={`material-symbols-rounded ${styles.close}`} onClick={() => setIsAuthRequestOpen(false)}>close</span>

            <p className={styles.title}>Several sprites at once<span>Log In</span></p>
            <p className={styles.subtitle}>Please sign in to use this feature</p>
            <p className={styles.description}>Discover the full power of our platform! Sign in today to unlock a world of exclusive features, advanced tools, and personalized options designed to enhance your experience. Whether you're looking to customize your journey or access premium functionalities, authorization is your key to everything we offer. Don’t wait—log in now and start exploring the complete range of possibilities!</p>

            <div className={styles.choose}>
              <Image src="/pictures/generation/auth-request.png" alt="Image" width={100} height={60} unoptimized />
              <Image src="/pictures/generation/auth-request2.png" alt="Image" width={100} height={60} style={{ filter: 'saturate(25%) brightness(0.8)' }} unoptimized />
              <div className={styles.activeButton} onClick={handleSignIn}><span>Sign in</span></div>
              <div className={styles.button} onClick={() => setIsAuthRequestOpen(false)}><span>Discover without account</span></div>
            </div>
          </div>

          <div className={styles.fade} style={{ display: isModelDropdownOpen ? 'block' : 'none' }} onClick={() => setIsDropdownOpen(false)}></div>
          <div className={styles.fade} style={{ display: isUserDropdownOpen ? 'block' : 'none' }} onClick={() => setIsUserDropdownOpen(false)}></div>
          <div className={styles.fade} style={{ display: isNotificationDropdownOpen ? 'block' : 'none' }} onClick={() => setIsNotificationDropdownOpen(false)}></div>
          <div className={styles.fade} style={{ display: isAuthRequestOpen ? 'block' : 'none' }} onClick={() => setIsAuthRequestOpen(false)}></div>
        </div>
      </main>
    </div>
  );
}