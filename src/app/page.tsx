'use client';

import Image from "next/image";
import styles from "./page.module.css";
import "./fonts.scss";
import { useRef, useState, useEffect } from 'react';

export default function Home() {
  const server = '136.38.166.236:34744';

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
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const [spriteType, setSpriteType] = useState('humanoid');
  const [spriteSize, setSpriteSize] = useState('large');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('PixelCore');
  const [queueStatus, setQueueStatus] = useState<number[]>([0, 0, 0, 0, 0]);
  const [generationMode, setGenerationMode] = useState('advanced');
  const [guidanceScale, setGuidanceScale] = useState(15);
  const [inferenceSteps, setInferenceSteps] = useState(100);

  const popularPrompts = [
    'NPC doctor, woman, blond long hair, black glasses',
    'Farmer with an apple',
    'Desert soldier with a rifle',
    'NPC nurse, young woman, short red hair, white uniform',
    'Gardener with a shovel, old man, gray beard',
    'Jungle explorer with a machete, tall, brown hat',
    'Village blacksmith, muscular, holding a hammer',
    'Forest ranger, female, green cape, binoculars'
  ];

  // Функция для получения статуса очереди
  const fetchQueueStatus = async () => {
    try {
      const response = await fetch(`http://${server}/api/status`, {
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
    } catch (error) {
      console.error('Ошибка при получении статуса:', error);
      setQueueStatus([0, 0, 0, 0, 0]);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(() => {
      fetchQueueStatus();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const getApiUrl = () => {
    return selectedModel === 'PixelCore'
      ? `http://${server}/api/generation/pixelcore`
      : `http://${server}/api/generation/pixeldiffusion`;
  };

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
  };

  const handleGenerateImage = async (prompt?: string) => {
    if (isLoading) return;

    const textarea = textareaRef.current;
    const description = prompt || (textarea?.value.trim() ?? '');

    if (!description) {
      alert('Пожалуйста, введите описание в поле Prompt');
      return;
    }

    if (textarea && !prompt) {
      textarea.value = description;
    }

    setIsLoading(true);

    try {
      console.log('Отправка запроса на генерацию...');
      const numImages = generationMode === 'advanced' ? 4 : 1;
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          type: spriteType.replace('oid', ''),
          size: spriteSize,
          guidance_scale: guidanceScale,
          inference_steps: inferenceSteps,
          num: numImages
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при добавлении задачи: ${response.status}`);
      }

      const data = await response.json();
      const taskId = data.task_id;
      console.log(`Получен taskId: ${taskId}`);

      const checkStatus = setInterval(async () => {
        try {
          console.log(`Опрос статуса задачи ${taskId}...`);
          const statusResponse = await fetch(`http://${server}/api/task/${taskId}`);
          if (!statusResponse.ok) {
            throw new Error(`Ошибка при запросе статуса: ${statusResponse.status}`);
          }

          const statusData = await statusResponse.json();
          console.log('Ответ от /api/task:', statusData);

          if (statusData.images) {
            console.log('Изображения получены:', statusData.images);
            clearInterval(checkStatus);
            const newImages = statusData.images.map((base64Image: string) => `data:image/png;base64,${base64Image}`);

            if (generationMode === 'simple') {
              setImageSrc(newImages[0]);
              setImages([newImages[0]]); // Устанавливаем только одно изображение
              setHistory((prevHistory) => [...prevHistory, newImages[0]]);
            } else {
              setImageSrc(newImages[0]);
              setImages(newImages);
              setHistory((prevHistory) => [...prevHistory, ...newImages]);
            }
            setIsLoading(false);
          } else if (statusData.error) {
            console.error('Ошибка в ответе:', statusData.error);
            clearInterval(checkStatus);
            throw new Error(statusData.error);
          }
        } catch (error) {
          console.error('Ошибка при опросе статуса:', error);
          clearInterval(checkStatus);
          alert('Ошибка при получении изображений');
          setIsLoading(false);
        }
      }, 2000);

    } catch (error) {
      console.error('Ошибка при генерации:', error);
      alert('Не удалось начать генерацию изображений');
      setIsLoading(false);
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
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const toggleAdditionalPanel = () => {
    setIsAdditionalOpen(!isAdditionalOpen);
  };

  const handleSpriteTypeChange = (type: string) => {
    setSpriteType(type);
  };

  const handleSpriteSizeChange = (size: string) => {
    setSpriteSize(size);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setIsDropdownOpen(false);
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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <div className={styles.model}>
              <Image
                src="/pictures/logo.png"
                alt="Logo"
                width={30}
                height={30}
              />
              <div
                className={styles.button}
                onClick={toggleDropdown}>
                {selectedModel}
                <div
                  className={styles.dropdown}
                  style={{ display: isDropdownOpen ? 'flex' : 'none' }}>
                  <div
                    className={styles.item}
                    onClick={() => handleModelSelect('PixelDiffusion')}>
                    <div className={selectedModel === 'PixelDiffusion' ? styles.checked : styles.unchecked}>
                      <span className="material-symbols-rounded">
                        {selectedModel === 'PixelDiffusion' ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </div>
                    <div className={styles.text}>
                      <div className={styles.title}>PixelDiffusion</div>
                      <div className={styles.subtitle}>Great variability, 2-6 seconds</div>
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
                      <div className={styles.title}>PixelCore</div>
                      <div className={styles.subtitle}>Great variability, 2-6 seconds</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.icon} onClick={toggleDropdown}>
                <span className="material-symbols-rounded">keyboard_arrow_down</span>
              </div>
            </div>
            <div className={styles.menu}>
              <div className={styles.notification}>
                <span className="material-symbols-rounded">notifications</span>
              </div>
              <div className={styles.user}>
                <span className="material-symbols-rounded">person</span>
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
                      {popularPrompts.map((prompt, index) => (
                        <div
                          className={styles.item}
                          key={index}
                          onClick={() => handlePopularPromptClick(prompt)}
                          style={{ cursor: 'pointer' }}>
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.history} style={{ display: activeTab === 'history' ? 'block' : 'none' }}>
                    <div className={styles.title}>History</div>
                    <div className={styles.items}>
                      {[...history].reverse().map((src, index) => (
                        <div className={styles.item} key={index}>
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
                  </div>

                  <div className={styles.saved} style={{ display: activeTab === 'saved' ? 'block' : 'none' }}>
                    <div className={styles.title}>Saved</div>
                    <div className={styles.items}>
                      <div className={styles.item}>Saved prompt 1</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.center}>
                <div className={styles.picture}>
                  {isLoading && <div className={styles.loader}></div>}
                  <Image
                    src={imageSrc}
                    alt="Sprite"
                    width={128}
                    height={128}
                    unoptimized
                    key={imageSrc}
                    style={{ opacity: isLoading ? 0.1 : 1 }}
                  />
                </div>
                <div className={styles.prompt}>
                  <textarea
                    ref={textareaRef}
                    placeholder="Prompt"
                    rows={1}
                    spellCheck={false}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown} />

                  <div
                    className={styles.enter}
                    onClick={() => handleGenerateImage()}
                    style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
                    <span className="material-symbols-rounded">arrow_upward</span>
                  </div>
                </div>
              </div>

              <div className={styles.right}>
                <div className={styles.menu}>
                  <div
                    className={`${styles.additional} ${isAdditionalOpen ? styles.active : ''}`}
                    onClick={toggleAdditionalPanel}
                  >
                    <span className="material-symbols-rounded">more_horiz</span>
                  </div>
                  <div className={styles.edit}>
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
                        transitionDelay: `${(index + 1) / 5}s`,
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
              style={{ display: isAdditionalOpen ? 'block' : 'none' }}>
              <div className={styles.title}>Additional options</div>
              <div className={styles.options}>
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
                  max={140}
                  step={10}
                  onChange={(e) => setInferenceSteps(parseInt(e.target.value))}
                />
                <div className={styles.label}>Post-processing</div>
                <input type="range" value={-16} min={-64} max={-8} step={4} />
                <div className={styles.label}>Color unification</div>
                <input type="range" />
                <div className={styles.label}>Sprite type</div>
                <div className={styles.type}>
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
                <div className={styles.label}>Sprite size</div>
                <div className={styles.size}>
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
                <div className={styles.label}>Generation mode</div>
                <div className={styles.mode}>
                  <div
                    className={`${styles.tab} ${generationMode === 'simple' ? styles.active : ''}`}
                    onClick={() => handleModeChange('simple')}>
                    Simple
                  </div>
                  <div
                    className={`${styles.tab} ${generationMode === 'advanced' ? styles.active : ''}`}
                    onClick={() => handleModeChange('advanced')} style={{ paddingLeft: '10px' }}>
                    Advanced
                    <span className="material-symbols-rounded">
                      lock
                    </span>
                  </div>
                </div>
              </div>
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
      </main>
    </div>
  );
}